import React, { useState } from "react";

const Attendance = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [attendanceData, setAttendanceData] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [captureStatus, setCaptureStatus] = useState("");

    const subjects = [
        "Operating System",
        "Data Analytics",
        "Data Communication",
        "Mobile Communication",
        "Database Systems",
        "Computer Networks"
    ];

    const captureAttendance = async () => {
        if (!selectedDate || !selectedPeriod || !selectedSubject) {
            alert("Please select date, class hour, and subject.");
            return;
        }
    
        setIsUploading(true);
        setCaptureStatus("Starting face detection...");
        setAttendanceData(null);
        
        try {
            // Start the capture process
            const response = await fetch('http://localhost:5000/capture_attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: selectedDate,
                    period: selectedPeriod,
                    subject: selectedSubject
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to start attendance capture');
            }

            // Poll for status updates
            let isComplete = false;
            let attempts = 0;
            const maxAttempts = 300;
            
            while (attempts < maxAttempts && !isComplete) {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const statusResponse = await fetch('http://localhost:5000/get_status');
                const statusData = await statusResponse.json();
                
                setCaptureStatus(`${statusData.message || 'Processing...'} (${attempts * 2}s)`);
                
                if (statusData.status !== 'processing') {
                    isComplete = true;
                    
                    // Get the final attendance data
                    const resultResponse = await fetch('http://localhost:5000/get_attendance');
                    const resultData = await resultResponse.json();
                    
                    if (resultData.status === 'complete') {
                        setAttendanceData(resultData.data);
                    } else {
                        throw new Error(resultData.message || 'Failed to get attendance results');
                    }
                }
            }

            if (!isComplete) {
                throw new Error('Capture timed out');
            }
            
            alert("Attendance successfully processed!");
        } catch (error) {
            console.error("Error processing attendance:", error);
            setCaptureStatus(`Error: ${error.message}`);
            alert(`Failed to process attendance: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <h1 className="text-4xl font-semibold text-blue-600 mb-6">Attendance Management</h1>

            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
                <label className="block text-gray-700 font-medium mb-2">Select Date:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                />

                <label className="block text-gray-700 font-medium mb-2">Select Class Hour:</label>
                <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                >
                    <option value="">-- Select Period --</option>
                    <option value="1">1st Hour</option>
                    <option value="2">2nd Hour</option>
                    <option value="3">3rd Hour</option>
                    <option value="4">4th Hour</option>
                    <option value="5">5th Hour</option>
                    <option value="6">6th Hour</option>
                </select>

                <label className="block text-gray-700 font-medium mb-2">Select Subject:</label>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2 border rounded-md mb-6"
                >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((subject, index) => (
                        <option key={index} value={subject}>{subject}</option>
                    ))}
                </select>

                <button
                    onClick={captureAttendance}
                    disabled={isUploading}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300"
                >
                    {isUploading ? "Capturing Attendance..." : "Capture Attendance"}
                </button>

                {captureStatus && (
                    <div className="mt-4 p-2 bg-blue-100 text-blue-800 rounded">
                        {captureStatus}
                    </div>
                )}
            </div>

            {attendanceData && (
                <div className="w-full max-w-4xl mt-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {attendanceData.subject} - Period {attendanceData.period} ({attendanceData.date})
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded">
                                <h3 className="font-medium text-blue-800 mb-2">First 10 Seconds</h3>
                                <ul className="space-y-1">
                                    {attendanceData.First10
                                        .filter(name => name && name !== 'None')
                                        .map((name, i) => (
                                            <li key={i} className="text-blue-700">{name}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                            
                            <div className="bg-purple-50 p-4 rounded">
                                <h3 className="font-medium text-purple-800 mb-2">Last 10 Seconds</h3>
                                <ul className="space-y-1">
                                    {attendanceData.last10
                                        .filter(name => name && name !== 'None')
                                        .map((name, i) => (
                                            <li key={i} className="text-purple-700">{name}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded">
                                <h3 className="font-medium text-green-800 mb-2">Confirmed Present</h3>
                                <ul className="space-y-1">
                                    {attendanceData.real
                                        .filter(name => name && name !== 'None')
                                        .map((name, i) => (
                                            <li key={i} className="text-green-700">{name}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;