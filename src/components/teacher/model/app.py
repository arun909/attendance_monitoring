from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
import subprocess
import json
import threading
import os
import sys
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Supabase Configuration
SUPABASE_URL = "https://tgikvbcjmipmjhkuyhro.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaWt2YmNqbWlwbWpoa3V5aHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczOTM3OTcsImV4cCI6MjA1Mjk2OTc5N30.G47NMiR6QsQHfIJjajCPkPjrr4Omg14hoS78OkhbPIs"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Global variables to track attendance processing
processing_data = {
    'status': 'idle',
    'message': '',
    'attendance': None,
    'start_time': None
}

def run_attendance_script(date, period, subject):
    global processing_data
    
    processing_data['status'] = 'processing'
    processing_data['message'] = 'Starting face detection...'
    processing_data['start_time'] = datetime.now()
    processing_data['attendance'] = None
    
    script_path = os.path.join(os.path.dirname(__file__), 'attendance_script.py')
    
    try:
        # Run the script
        process = subprocess.Popen(
            ['python', script_path, date, period, subject],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=os.path.dirname(__file__))
        
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            raise Exception(f"Script failed: {stderr}")
        
        # Clean output by taking only the last line
        stdout_clean = stdout.strip().split('\n')[-1]
        
        try:
            result = json.loads(stdout_clean)
            
            if result.get("status") == "error":
                raise Exception(result.get("message", "Script error"))
            
            # Upload to Supabase - updated error handling
            response = supabase.table("attendance1").insert({
                "date": result["date"],
                "period": result["period"],
                "Subject": result["Subject"],
                "First10": result["First10"],
                "last10": result["last10"],
                "real": result["real"]
            }).execute()
            
            # Check for errors in the new response format
            if hasattr(response, 'error') and response.error:
                raise Exception(response.error.message)
            
            processing_data['attendance'] = result
            processing_data['status'] = 'complete'
            processing_data['message'] = 'Attendance processed and saved successfully'
            
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse script output: {str(e)}")
            
    except Exception as e:
        processing_data['status'] = 'error'
        processing_data['message'] = str(e)
        raise
    finally:
        if processing_data['status'] == 'processing':
            processing_data['status'] = 'error'
            processing_data['message'] = 'Processing interrupted'

@app.route('/capture_attendance', methods=['POST'])
def capture_attendance():
    if processing_data['status'] == 'processing':
        return jsonify({
            'status': 'error',
            'message': 'Another capture is already in progress'
        }), 400
    
    data = request.json
    date = data.get('date')
    period = data.get('period')
    subject = data.get('subject')
    
    if not all([date, period, subject]):
        return jsonify({
            'status': 'error',
            'message': 'Missing required parameters'
        }), 400
    
    # Start in a separate thread
    thread = threading.Thread(
        target=run_attendance_script,
        args=(date, period, subject)
    )
    thread.start()
    
    return jsonify({
        'status': 'started',
        'message': 'Attendance capture started'
    })

@app.route('/get_status', methods=['GET'])
def get_status():
    duration = (datetime.now() - processing_data['start_time']).seconds if processing_data['start_time'] else 0
    return jsonify({
        'status': processing_data['status'],
        'message': processing_data['message'],
        'duration': duration
    })

@app.route('/get_attendance', methods=['GET'])
def get_attendance():
    if processing_data['status'] != 'complete' or not processing_data['attendance']:
        return jsonify({
            'status': 'error',
            'message': 'No attendance data available'
        })
    
    attendance = processing_data['attendance']
    return jsonify({
        'status': 'complete',
        'data': {
            'date': attendance.get('date'),
            'period': attendance.get('period'),
            'subject': attendance.get('Subject'),
            'First10': attendance.get('First10', 'None').split(', '),
            'last10': attendance.get('last10', 'None').split(', '),
            'real': attendance.get('real', 'None').split(', ')
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)