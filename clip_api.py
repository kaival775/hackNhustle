"""
CLIP IMAGE SEARCH API
=====================
FastAPI backend for image search using CLIP/SigLIP + Qdrant

Usage:
    uvicorn clip_api:app --reload --host 0.0.0.0 --port 8000

Endpoints:
    POST /search - Upload image, get top matches
    GET /health - Health check
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from PIL import Image
import numpy as np
import requests
import os
from dotenv import load_dotenv
from transformers import AutoProcessor, AutoModel
import io
from typing import List
import cv2
import mediapipe as mp

load_dotenv()

app = FastAPI(title="CLIP Image Search API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
class ModelState:
    def __init__(self):
        self.model = None
        self.processor = None
        self.device = None
        self.qdrant_url = None
        self.headers = None
        self.collection = "clip_videos"
        self.hands = None
        self.pose = None
        
model_state = ModelState()

class SearchResult(BaseModel):
    label: str
    score: float

class SearchResponse(BaseModel):
    results: List[SearchResult]
    processing_time_ms: float

@app.on_event("startup")
async def load_model():
    """Load model on startup"""
    print("Loading SigLIP model...")
    model_name = "google/siglip-large-patch16-384"  # 1024D - between base (768D) and SO400M (1152D)
    
    model_state.model = AutoModel.from_pretrained(model_name)
    model_state.processor = AutoProcessor.from_pretrained(model_name)
    model_state.device = "cuda" if torch.cuda.is_available() else "cpu"
    model_state.model.to(model_state.device)
    model_state.model.eval()
    
    # MediaPipe Hands
    model_state.hands = mp.solutions.hands.Hands(
        static_image_mode=True,
        max_num_hands=2,
        min_detection_confidence=0.5
    )
    
    # MediaPipe Pose
    model_state.pose = mp.solutions.pose.Pose(
        static_image_mode=True,
        min_detection_confidence=0.5
    )
    
    # Qdrant setup
    raw_url = os.getenv('q_url', 'http://localhost:6333')
    if 'cloud.qdrant.io' in raw_url:
        if not raw_url.startswith('http'):
            raw_url = f"https://{raw_url}"
        raw_url = raw_url.replace('https://', '').replace('http://', '').rstrip(':6333').rstrip(':443')
        model_state.qdrant_url = f"https://{raw_url}:6333"
    else:
        model_state.qdrant_url = raw_url.rstrip('/')
    
    api_key = os.getenv('q_api', '')
    model_state.headers = {'Content-Type': 'application/json'}
    if api_key:
        model_state.headers['api-key'] = api_key
    
    print(f"✓ Model loaded on {model_state.device}")
    print(f"✓ MediaPipe Hands + Pose initialized")
    print(f"✓ Qdrant: {model_state.qdrant_url}")

def crop_upper_body(image: Image.Image, padding: float = 0.2) -> Image.Image:
    """Crop to hands, elbows, and shoulders with padding"""
    img_array = np.array(image)
    rgb = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    
    hand_results = model_state.hands.process(cv2.cvtColor(rgb, cv2.COLOR_BGR2RGB))
    pose_results = model_state.pose.process(cv2.cvtColor(rgb, cv2.COLOR_BGR2RGB))
    
    h, w = img_array.shape[:2]
    all_x, all_y = [], []
    
    # Collect hand landmarks
    if hand_results.multi_hand_landmarks:
        for hand_landmarks in hand_results.multi_hand_landmarks:
            for lm in hand_landmarks.landmark:
                all_x.append(int(lm.x * w))
                all_y.append(int(lm.y * h))
    
    # Collect pose landmarks (shoulders: 11,12; elbows: 13,14)
    if pose_results.pose_landmarks:
        for idx in [11, 12, 13, 14]:  # Left/right shoulder and elbow
            lm = pose_results.pose_landmarks.landmark[idx]
            if lm.visibility > 0.5:
                all_x.append(int(lm.x * w))
                all_y.append(int(lm.y * h))
    
    if not all_x:
        return image  # No landmarks detected
    
    # Get bounding box with padding
    x_min, x_max = min(all_x), max(all_x)
    y_min, y_max = min(all_y), max(all_y)
    
    pad_x = int((x_max - x_min) * padding)
    pad_y = int((y_max - y_min) * padding)
    
    x_min = max(0, x_min - pad_x)
    x_max = min(w, x_max + pad_x)
    y_min = max(0, y_min - pad_y)
    y_max = min(h, y_max + pad_y)
    
    cropped = img_array[y_min:y_max, x_min:x_max]
    return Image.fromarray(cropped)

def extract_landmarks(image: Image.Image) -> np.ndarray:
    """Extract hand + upper body landmarks"""
    img_array = np.array(image)
    rgb = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
    
    hand_results = model_state.hands.process(cv2.cvtColor(rgb, cv2.COLOR_BGR2RGB))
    pose_results = model_state.pose.process(cv2.cvtColor(rgb, cv2.COLOR_BGR2RGB))
    
    # Hands: 21 landmarks × 3 coords × 2 hands = 126D
    # Pose: 4 landmarks (shoulders + elbows) × 3 coords = 12D
    # Total: 138D
    landmarks = np.zeros(138)
    
    # Extract hand landmarks
    if hand_results.multi_hand_landmarks:
        for i, hand_landmarks in enumerate(hand_results.multi_hand_landmarks[:2]):
            offset = i * 63
            for j, lm in enumerate(hand_landmarks.landmark):
                landmarks[offset + j*3] = lm.x
                landmarks[offset + j*3 + 1] = lm.y
                landmarks[offset + j*3 + 2] = lm.z
    
    # Extract pose landmarks (shoulders: 11,12; elbows: 13,14)
    if pose_results.pose_landmarks:
        for i, idx in enumerate([11, 12, 13, 14]):
            lm = pose_results.pose_landmarks.landmark[idx]
            landmarks[126 + i*3] = lm.x
            landmarks[126 + i*3 + 1] = lm.y
            landmarks[126 + i*3 + 2] = lm.z
    
    return landmarks

def encode_image(image: Image.Image) -> np.ndarray:
    """Encode image to vector"""
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    image = image.resize((384, 384), Image.Resampling.LANCZOS)
    inputs = model_state.processor(images=image, return_tensors="pt").to(model_state.device)
    
    with torch.no_grad():
        features = model_state.model.get_image_features(**inputs)
        features = features / features.norm(dim=-1, keepdim=True)
    
    return features.cpu().numpy().flatten()

def search_qdrant(img_vector: np.ndarray, landmark_vector: np.ndarray, top_k: int = 10) -> List[dict]:
    """Search Qdrant with combined image + landmark vectors"""
    try:
        # Search image collection
        r1 = requests.post(
            f"{model_state.qdrant_url}/collections/{model_state.collection}/points/search",
            json={"vector": img_vector.tolist(), "limit": top_k, "with_payload": True},
            headers=model_state.headers,
            timeout=5
        )
        
        # Search landmark collection
        r2 = requests.post(
            f"{model_state.qdrant_url}/collections/hand_landmarks/points/search",
            json={"vector": landmark_vector.tolist(), "limit": top_k, "with_payload": True},
            headers=model_state.headers,
            timeout=5
        )
        
        # Combine scores (60% image, 40% landmarks)
        combined = {}
        
        if r1.status_code == 200:
            for hit in r1.json().get('result', []):
                label = hit["payload"]["label"]
                combined[label] = hit["score"] * 0.6
        
        if r2.status_code == 200:
            for hit in r2.json().get('result', []):
                label = hit["payload"]["label"]
                combined[label] = combined.get(label, 0) + hit["score"] * 0.4
        
        # Sort by combined score
        sorted_results = sorted(combined.items(), key=lambda x: x[1], reverse=True)[:top_k]
        return [{"label": label, "score": score} for label, score in sorted_results]
        
    except Exception as e:
        print(f"Search error: {e}")
        return []

@app.get("/health")
async def health():
    """Health check"""
    return {
        "status": "ok",
        "model_loaded": model_state.model is not None,
        "device": model_state.device,
        "collection": model_state.collection
    }

@app.post("/search", response_model=SearchResponse)
async def search_image(file: UploadFile = File(...), top_k: int = 5):
    """
    Upload an image and get top matching labels
    
    Args:
        file: Image file (JPEG, PNG, etc.)
        top_k: Number of results to return (default: 5)
    
    Returns:
        SearchResponse with results and processing time
    """
    import time
    start = time.time()
    
    if not model_state.model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Crop to upper body
        cropped = crop_upper_body(image, padding=0.2)
        
        # Encode image and landmarks
        img_vector = encode_image(cropped)
        landmark_vector = extract_landmarks(image)
        
        # Search
        results = search_qdrant(img_vector, landmark_vector, top_k)
        
        processing_time = (time.time() - start) * 1000
        
        return SearchResponse(
            results=[SearchResult(**r) for r in results],
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/search/batch", response_model=List[SearchResponse])
async def search_batch(files: List[UploadFile] = File(...), top_k: int = 5):
    """
    Upload multiple images and get results for each
    
    Args:
        files: List of image files
        top_k: Number of results per image
    
    Returns:
        List of SearchResponse objects
    """
    import time
    
    if not model_state.model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    responses = []
    
    for file in files:
        start = time.time()
        try:
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))
            cropped = crop_upper_body(image, padding=0.2)
            img_vector = encode_image(cropped)
            landmark_vector = extract_landmarks(image)
            results = search_qdrant(img_vector, landmark_vector, top_k)
            processing_time = (time.time() - start) * 1000
            
            responses.append(SearchResponse(
                results=[SearchResult(**r) for r in results],
                processing_time_ms=round(processing_time, 2)
            ))
        except Exception as e:
            responses.append(SearchResponse(
                results=[],
                processing_time_ms=0
            ))
    
    return responses

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
