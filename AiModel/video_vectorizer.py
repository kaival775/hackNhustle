import cv2
import json
import numpy as np
import mediapipe as mp
from pathlib import Path

class VideoVectorizer:
    def __init__(self):
        BaseOptions = mp.tasks.BaseOptions
        HandLandmarker = mp.tasks.vision.HandLandmarker
        HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions
        PoseLandmarker = mp.tasks.vision.PoseLandmarker
        PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
        FaceLandmarker = mp.tasks.vision.FaceLandmarker
        FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
        VisionRunningMode = mp.tasks.vision.RunningMode
        
        self.hands = HandLandmarker.create_from_options(
            HandLandmarkerOptions(
                base_options=BaseOptions(model_asset_path="models/hand_landmarker.task"),
                running_mode=VisionRunningMode.IMAGE,
                num_hands=2,
                min_hand_detection_confidence=0.5
            )
        )
        self.pose = PoseLandmarker.create_from_options(
            PoseLandmarkerOptions(
                base_options=BaseOptions(model_asset_path="models/pose_landmarker_lite.task"),
                running_mode=VisionRunningMode.IMAGE,
                min_pose_detection_confidence=0.5
            )
        )
        self.face = FaceLandmarker.create_from_options(
            FaceLandmarkerOptions(
                base_options=BaseOptions(model_asset_path="models/face_landmarker.task"),
                running_mode=VisionRunningMode.IMAGE,
                num_faces=1,
                min_face_detection_confidence=0.5
            )
        )
    
    def extract_features(self, frame, mirror=False):
        if mirror:
            frame = cv2.flip(frame, 1)
        
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
        
        hands_result = self.hands.detect(mp_image)
        pose_result = self.pose.detect(mp_image)
        face_result = self.face.detect(mp_image)
        
        face_center = None
        if face_result.face_landmarks:
            nose = face_result.face_landmarks[0][1]
            face_center = np.array([nose.x, nose.y, nose.z])
        
        if face_center is None:
            return None
        
        features = []
        
        # Hands (210D)
        if hands_result.hand_landmarks:
            for hand_landmarks in hands_result.hand_landmarks:
                wrist = np.array([hand_landmarks[0].x, hand_landmarks[0].y, hand_landmarks[0].z])
                for i in range(21):
                    lm = hand_landmarks[i]
                    point = np.array([lm.x, lm.y, lm.z])
                    features.extend([
                        point[0] - wrist[0],
                        point[1] - wrist[1],
                        point[2] - wrist[2],
                        np.linalg.norm(point - wrist),
                        np.linalg.norm(point - face_center)
                    ])
        else:
            features.extend([0.0] * (21 * 5 * 2))
        
        if hands_result.hand_landmarks and len(hands_result.hand_landmarks) == 1:
            features.extend([0.0] * (21 * 5))
        
        # Pose (30D)
        if pose_result.pose_landmarks:
            ls = np.array([pose_result.pose_landmarks[0][11].x, pose_result.pose_landmarks[0][11].y, pose_result.pose_landmarks[0][11].z])
            rs = np.array([pose_result.pose_landmarks[0][12].x, pose_result.pose_landmarks[0][12].y, pose_result.pose_landmarks[0][12].z])
            
            for idx in [11, 12, 13, 14, 15, 16]:
                lm = pose_result.pose_landmarks[0][idx]
                point = np.array([lm.x, lm.y, lm.z])
                features.extend([
                    point[0] - face_center[0],
                    point[1] - face_center[1],
                    point[2] - face_center[2],
                    np.linalg.norm(point - face_center),
                    min(np.linalg.norm(point - ls), np.linalg.norm(point - rs))
                ])
        else:
            features.extend([0.0] * 30)
        
        # Face (20D)
        if face_result.face_landmarks:
            for idx in [33, 263, 1, 61, 291]:
                lm = face_result.face_landmarks[0][idx]
                point = np.array([lm.x, lm.y, lm.z])
                features.extend([
                    point[0] - face_center[0],
                    point[1] - face_center[1],
                    point[2] - face_center[2],
                    np.linalg.norm(point - face_center)
                ])
        else:
            features.extend([0.0] * 20)
        
        return features
    
    def process_video(self, video_path, output_dir="vectors"):
        video_path = Path(video_path)
        output_path = Path(output_dir) / video_path.stem
        output_path.mkdir(parents=True, exist_ok=True)
        
        cap = cv2.VideoCapture(str(video_path))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        print(f"Processing: {video_path.name}")
        
        frame_idx = 0
        processed = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            features = self.extract_features(frame, mirror=False)
            
            if features:
                with open(output_path / f"frame_{frame_idx:04d}.json", 'w') as f:
                    json.dump({
                        "file": str(video_path),
                        "frame": frame_idx,
                        "timestamp": frame_idx / fps if fps > 0 else 0,
                        "label": video_path.stem,
                        "vector": features,
                        "dimension": len(features),
                        "augmentation": "original"
                    }, f)
                
                features_mirror = self.extract_features(frame, mirror=True)
                if features_mirror:
                    with open(output_path / f"frame_{frame_idx:04d}_mirror.json", 'w') as f:
                        json.dump({
                            "file": str(video_path),
                            "frame": frame_idx,
                            "timestamp": frame_idx / fps if fps > 0 else 0,
                            "label": video_path.stem,
                            "vector": features_mirror,
                            "dimension": len(features_mirror),
                            "augmentation": "mirror"
                        }, f)
                
                processed += 1
            
            frame_idx += 1
            if frame_idx % 30 == 0:
                print(f"Processed: {processed}/{frame_idx}")
        
        cap.release()
        print(f"Complete! {processed}/{frame_idx} frames saved to {output_path}")
    
    def process_folder(self, video_dir, output_dir="vectors"):
        video_files = []
        for ext in ['*.mp4', '*.mov', '*.avi', '*.MP4', '*.MOV', '*.AVI']:
            video_files.extend(Path(video_dir).glob(ext))
            video_files.extend(Path(video_dir).glob(f'*/{ext}'))
        
        print(f"Found {len(video_files)} videos")
        
        for video_file in video_files:
            try:
                self.process_video(video_file, output_dir)
            except Exception as e:
                print(f"Error: {video_file.name} - {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python video_vectorizer.py <video.mov|videos/> [output_dir]")
        exit(1)
    
    vectorizer = VideoVectorizer()
    input_path = Path(sys.argv[1])
    output_path = sys.argv[2] if len(sys.argv) > 2 else "vectors"
    
    if input_path.is_file():
        vectorizer.process_video(input_path, output_path)
    else:
        vectorizer.process_folder(input_path, output_path)
