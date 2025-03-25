import time
import cv2
from deepface import DeepFace
from retinaface import RetinaFace
import os
import datetime
import json
import sys

# Configuration
output_video_path_first = "temp_capture_first.mp4"
output_video_path_last = "temp_capture_last.mp4"
db_path = r"C:\Users\basil\OneDrive\Desktop\basil\deepface\database"
output_folder = "annotated_frames"
capture_duration = 10  # Seconds per capture

os.makedirs(output_folder, exist_ok=True)

def capture_video(output_path):
    """Capture video from webcam for specified duration"""
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise Exception("Could not open video device")
    
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))
    
    start_time = datetime.datetime.now()
    
    while (datetime.datetime.now() - start_time).seconds < capture_duration:
        ret, frame = cap.read()
        if not ret:
            break
        out.write(frame)
        cv2.imshow("Recording (Press Q to stop early)", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    out.release()
    cv2.destroyAllWindows()

def process_video(video_path):
    """Process video and return list of detected names"""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise Exception(f"Could not open video file: {video_path}")
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_skip = int(fps) if fps > 0 else 1
    frame_count = 0
    
    face_name_map = {}
    used_names = set()
    
    while cap.isOpened():
        for _ in range(frame_skip - 1):
            cap.grab()
        
        ret, img = cap.read()
        if not ret:
            break
        
        frame_count += 1
        detections = RetinaFace.detect_faces(img) or {}
        current_frame_names = set()
        
        for face_id, face in detections.items():
            x1, y1, x2, y2 = face['facial_area']
            face_img = img[y1:y2, x1:x2]
            temp_path = f"temp_face_{frame_count}_{face_id}.jpg"
            cv2.imwrite(temp_path, face_img)

            if face_id in face_name_map:
                name = face_name_map[face_id]
                if name not in current_frame_names:
                    current_frame_names.add(name)
                continue
            
            try:
                dfs = DeepFace.find(
                    img_path=temp_path,
                    db_path=db_path,
                    model_name="Facenet512",
                    distance_metric="cosine",
                    enforce_detection=False
                )
                
                best_match = None
                best_distance = float('inf')
                
                for df in dfs:
                    if not df.empty:
                        row = df.iloc[0]
                        candidate = os.path.basename(os.path.dirname(row['identity']))
                        distance = row['distance']
                        
                        if (distance <= row['threshold'] and 
                            distance < best_distance and 
                            candidate not in current_frame_names and
                            candidate not in used_names):
                            
                            best_match = candidate
                            best_distance = distance
                
                if best_match:
                    face_name_map[face_id] = best_match
                    current_frame_names.add(best_match)
                    used_names.add(best_match)
            
            except Exception as e:
                print(f"Error processing face {face_id}: {e}", file=sys.stderr)
            
            os.remove(temp_path)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    return list(used_names)

def main():
    if len(sys.argv) != 4:
        error_msg = json.dumps({
            "status": "error",
            "message": "Usage: python attendance_script.py <date> <period> <subject>"
        })
        print(error_msg, file=sys.stderr)
        sys.exit(1)
    
    try:
        date = sys.argv[1]
        period = sys.argv[2]
        subject = sys.argv[3]
        
        # First capture
        print("Starting first capture...", file=sys.stderr)
        capture_video(output_video_path_first)
        first10_names = process_video(output_video_path_first)
        
        # Wait 10 seconds
        print("Waiting 10 seconds...", file=sys.stderr)
        time.sleep(10)
        
        # Second capture
        print("Starting second capture...", file=sys.stderr)
        capture_video(output_video_path_last)
        last10_names = process_video(output_video_path_last)
        
        # Calculate intersection
        real_names = list(set(first10_names) & set(last10_names))
        
        # Cleanup
        for path in [output_video_path_first, output_video_path_last]:
            if os.path.exists(path):
                os.remove(path)
        
        # Prepare final output
        result = {
            "date": date,
            "period": period,
            "Subject": subject,
            "First10": ", ".join(first10_names) if first10_names else "None",
            "last10": ", ".join(last10_names) if last10_names else "None",
            "real": ", ".join(real_names) if real_names else "None"
        }
        
        # Ensure only one JSON object is printed
        print(json.dumps(result))
        
    except Exception as e:
        error_msg = json.dumps({
            "status": "error",
            "message": str(e)
        })
        print(error_msg, file=sys.stderr)
        sys.exit(1)
        
if __name__ == "__main__":
    main()