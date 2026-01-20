"""
CLIP VIDEO VECTORIZATION
========================
Uses CLIP to vectorize video frames and store in Qdrant.

Usage:
    python3 clip_vectorize_videos.py --input test/
    python3 clip_vectorize_videos.py --input video.mp4 --label wave --fps 5
"""

import cv2
import torch
from PIL import Image
import numpy as np
import requests
import json
from pathlib import Path
import argparse
import os
from dotenv import load_dotenv
from transformers import CLIPProcessor, CLIPModel, AutoProcessor, AutoModel
try:
    import mediapipe as mp
    from mediapipe.tasks import python
    from mediapipe.tasks.python import vision
    MEDIAPIPE_AVAILABLE = True
except:
    MEDIAPIPE_AVAILABLE = False

load_dotenv()


class CLIPVideoVectorizer:
    def __init__(self, model_name: str = "google/siglip-large-patch16-384",
                 qdrant_url: str = None, api_key: str = None):
        
        print("Loading vision model...")
        if 'siglip' in model_name.lower():
            self.model = AutoModel.from_pretrained(model_name)
            self.processor = AutoProcessor.from_pretrained(model_name)
        else:
            self.model = CLIPModel.from_pretrained(model_name)
            self.processor = CLIPProcessor.from_pretrained(model_name)
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)
        self.model.eval()
        print(f"✓ Model loaded: {model_name.split('/')[-1]} on {self.device}")
        
        # MediaPipe Tasks API
        if MEDIAPIPE_AVAILABLE:
            try:
                hand_base = python.BaseOptions(model_asset_path='models/hand_landmarker.task')
                hand_opts = vision.HandLandmarkerOptions(base_options=hand_base, num_hands=2)
                self.hands = vision.HandLandmarker.create_from_options(hand_opts)
                
                pose_base = python.BaseOptions(model_asset_path='models/pose_landmarker_lite.task')
                pose_opts = vision.PoseLandmarkerOptions(base_options=pose_base)
                self.pose = vision.PoseLandmarker.create_from_options(pose_opts)
                print("✓ MediaPipe Tasks API initialized")
            except:
                self.hands = None
                self.pose = None
                print("⚠ MediaPipe models not found - using center crop")
        else:
            self.hands = None
            self.pose = None
            print("⚠ MediaPipe not available - using center crop")
        
        raw_url = qdrant_url or os.getenv('q_url', 'http://localhost:6333')
        if 'cloud.qdrant.io' in raw_url:
            if not raw_url.startswith('http'):
                raw_url = f"https://{raw_url}"
            raw_url = raw_url.replace('https://', '').replace('http://', '').rstrip(':6333').rstrip(':443')
            self.qdrant_url = f"https://{raw_url}:6333"
        else:
            self.qdrant_url = raw_url.rstrip('/')
        
        self.api_key = api_key or os.getenv('q_api', '')
        self.headers = {'Content-Type': 'application/json'}
        if self.api_key:
            self.headers['api-key'] = self.api_key
        
        print(f"✓ Qdrant: {self.qdrant_url}\n")
    
    def crop_upper_body(self, frame):
        """Crop with MediaPipe Tasks API"""
        h, w = frame.shape[:2]
        
        if not self.hands or not self.pose:
            crop_h = int(h * 0.6)
            start_y = (h - crop_h) // 2
            return frame[start_y:start_y + crop_h, :]
        
        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        hand_results = self.hands.detect(mp_img)
        pose_results = self.pose.detect(mp_img)
        
        all_x, all_y = [], []
        
        if hand_results.hand_landmarks:
            for hand_landmarks in hand_results.hand_landmarks:
                for lm in hand_landmarks:
                    all_x.append(int(lm.x * w))
                    all_y.append(int(lm.y * h))
        
        if pose_results.pose_landmarks:
            for landmarks in pose_results.pose_landmarks:
                for idx in [11, 12, 13, 14]:
                    lm = landmarks[idx]
                    if lm.visibility > 0.5:
                        all_x.append(int(lm.x * w))
                        all_y.append(int(lm.y * h))
        
        if not all_x:
            return frame
        
        x_min, x_max = min(all_x), max(all_x)
        y_min, y_max = min(all_y), max(all_y)
        pad_x = int((x_max - x_min) * 0.2)
        pad_y = int((y_max - y_min) * 0.2)
        
        x_min = max(0, x_min - pad_x)
        x_max = min(w, x_max + pad_x)
        y_min = max(0, y_min - pad_y)
        y_max = min(h, y_max + pad_y)
        
        return frame[y_min:y_max, x_min:x_max]
    
    def extract_landmarks(self, frame):
        """Extract normalized 138D landmarks"""
        if not self.hands or not self.pose:
            return np.zeros(138)
        
        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        hand_results = self.hands.detect(mp_img)
        pose_results = self.pose.detect(mp_img)
        
        landmarks = np.zeros(138)
        
        # Normalize hand landmarks relative to wrist (landmark 0)
        if hand_results.hand_landmarks:
            for i, hand_landmarks in enumerate(hand_results.hand_landmarks[:2]):
                offset = i * 63
                wrist = hand_landmarks[0]  # Wrist is landmark 0
                for j, lm in enumerate(hand_landmarks):
                    landmarks[offset + j*3] = lm.x - wrist.x
                    landmarks[offset + j*3 + 1] = lm.y - wrist.y
                    landmarks[offset + j*3 + 2] = lm.z - wrist.z
        
        # Normalize pose landmarks (shoulders/elbows) relative to elbow midpoint
        if pose_results.pose_landmarks:
            for landmarks_list in pose_results.pose_landmarks:
                left_elbow = landmarks_list[13]   # Left elbow
                right_elbow = landmarks_list[14]  # Right elbow
                elbow_center_x = (left_elbow.x + right_elbow.x) / 2
                elbow_center_y = (left_elbow.y + right_elbow.y) / 2
                elbow_center_z = (left_elbow.z + right_elbow.z) / 2
                
                for i, idx in enumerate([11, 12, 13, 14]):
                    lm = landmarks_list[idx]
                    landmarks[126 + i*3] = lm.x - elbow_center_x
                    landmarks[126 + i*3 + 1] = lm.y - elbow_center_y
                    landmarks[126 + i*3 + 2] = lm.z - elbow_center_z
        
        return landmarks
    
    def encode_frame(self, frame):
        """Encode frame to CLIP vector"""
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(rgb).resize((384, 384), Image.Resampling.LANCZOS)
        
        inputs = self.processor(images=pil_img, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            image_features = self.model.get_image_features(**inputs)
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        
        return image_features.cpu().numpy().flatten()
    
    def process_video(self, video_path: Path, sample_fps: int = 5):
        cap = cv2.VideoCapture(str(video_path))
        if not cap.isOpened():
            raise Exception(f"Cannot open: {video_path}")
        
        video_fps = cap.get(cv2.CAP_PROP_FPS)
        frame_interval = max(1, int(video_fps / sample_fps))
        
        img_vectors = []
        landmark_vectors = []
        frame_idx = 0
        
        print(f"  Processing {video_path.name} (FPS: {video_fps:.1f})...")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_idx % frame_interval == 0:
                cropped = self.crop_upper_body(frame)
                img_vec = self.encode_frame(cropped)
                landmark_vec = self.extract_landmarks(frame)
                img_vectors.append(img_vec)
                landmark_vectors.append(landmark_vec)
            
            frame_idx += 1
        
        cap.release()
        print(f"  ✓ Extracted {len(img_vectors)} vectors")
        return img_vectors, landmark_vectors
    
    def upload_to_qdrant(self, img_vectors, landmark_vectors, label: str, source: str):
        avg_img = np.mean(img_vectors, axis=0)
        avg_landmark = np.mean(landmark_vectors, axis=0)
        point_id = abs(hash(f"{source}_{label}")) % (10**8)
        
        try:
            # Upload image vector
            r1 = requests.put(
                f"{self.qdrant_url}/collections/clip_videos/points",
                json={"points": [{"id": point_id, "vector": avg_img.tolist(), 
                                  "payload": {"label": label, "source": source, "frames": len(img_vectors)}}]},
                headers=self.headers, timeout=10
            )
            
            # Upload landmark vector
            r2 = requests.put(
                f"{self.qdrant_url}/collections/hand_landmarks/points",
                json={"points": [{"id": point_id, "vector": avg_landmark.tolist(),
                                  "payload": {"label": label, "source": source, "frames": len(landmark_vectors)}}]},
                headers=self.headers, timeout=10
            )
            
            if r1.status_code in [200, 201] and r2.status_code in [200, 201]:
                print(f"  ✓ Uploaded to Qdrant: {label}")
            else:
                print(f"  ⚠ Partial upload failure")
        except Exception as e:
            print(f"  ⚠ Upload failed: {e}")
    
    def init_collection(self):
        """Initialize Qdrant collections"""
        try:
            # Check/create image collection (1024D)
            r = requests.get(f"{self.qdrant_url}/collections/clip_videos", headers=self.headers, timeout=10)
            if r.status_code != 200:
                requests.put(f"{self.qdrant_url}/collections/clip_videos",
                           json={"vectors": {"size": 1024, "distance": "Cosine"}},
                           headers=self.headers, timeout=10)
                print("✓ Created collection: clip_videos")
            
            # Check/create landmark collection (138D)
            r = requests.get(f"{self.qdrant_url}/collections/hand_landmarks", headers=self.headers, timeout=10)
            if r.status_code != 200:
                requests.put(f"{self.qdrant_url}/collections/hand_landmarks",
                           json={"vectors": {"size": 138, "distance": "Cosine"}},
                           headers=self.headers, timeout=10)
                print("✓ Created collection: hand_landmarks")
            print()
        except Exception as e:
            print(f"⚠ Warning: Cannot connect to Qdrant: {e}\n")
    
    def process_directory(self, directory: Path, label: str = None, sample_fps: int = 5):
        video_files = list(directory.glob("*.mov")) + list(directory.glob("*.mp4"))
        
        if not video_files:
            print(f"No videos in {directory}")
            return
        
        print(f"Found {len(video_files)} video(s)\n")
        
        for video_file in video_files:
            try:
                vid_label = label or video_file.stem.lower()
                img_vecs, landmark_vecs = self.process_video(video_file, sample_fps)
                if img_vecs:
                    self.upload_to_qdrant(img_vecs, landmark_vecs, vid_label, str(video_file))
            except Exception as e:
                print(f"  ✗ Error: {e}")
        
        print("\n✓ Complete")
    
    def process_single(self, video_path: Path, label: str, sample_fps: int = 5):
        print(f"\nProcessing: {video_path.name}")
        img_vecs, landmark_vecs = self.process_video(video_path, sample_fps)
        if img_vecs:
            self.upload_to_qdrant(img_vecs, landmark_vecs, label, str(video_path))


def main():
    parser = argparse.ArgumentParser(description='CLIP Video Vectorization')
    parser.add_argument('--input', required=True)
    parser.add_argument('--label', help='Label (auto from filename if not provided)')
    parser.add_argument('--fps', type=int, default=5)
    parser.add_argument('--model', default='google/siglip-large-patch16-384',
                       help='Models: google/siglip-large-patch16-384 (1024D), google/siglip-base-patch16-224 (768D)')
    
    args = parser.parse_args()
    
    vectorizer = CLIPVideoVectorizer(model_name=args.model)
    vectorizer.init_collection()
    
    input_path = Path(args.input)
    
    if input_path.is_dir():
        vectorizer.process_directory(input_path, args.label, args.fps)
    elif input_path.is_file():
        if not args.label:
            print("Error: --label required for single file")
            return
        vectorizer.process_single(input_path, args.label, args.fps)
    else:
        print(f"Error: {input_path} not found")


if __name__ == "__main__":
    main()
