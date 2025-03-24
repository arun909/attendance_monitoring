import React, { useState } from "react";
import { supabase } from "../Auth/supabaseClient";

const Attendance = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [attendanceFile, setAttendanceFile] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // List of subjects
    const subjects = [
        "Operating System",
        "Data Analytics",
        "Data Communication",
        "Mobile Communication",
        "Database Systems",
        "Computer Networks"
    ];

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setAttendanceFile(file);
    };

    const readCSVFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const lines = e.target.result
                    .split("\n")
                    .map(line => line.trim())
                    .filter(line => line);

                const data = lines.map(line => {
                    const [name, status] = line.split(",");
                    return { 
                        name: name.trim(), 
                        present: status.trim().toLowerCase() === "present" 
                    };
                });

                resolve(data);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    };

    const uploadAttendance = async () => {
        if (!selectedDate || !selectedPeriod || !selectedSubject || !attendanceFile) {
            alert("Please select date, class hour, subject, and upload a file.");
            return;
        }
    
        setIsUploading(true);
        try {
            const students = await readCSVFile(attendanceFile);
            setAttendanceData(students);
            
            const attendanceRecord = {
                date: selectedDate,
                period: selectedPeriod,
                subject: selectedSubject,
                students: students,
                created_at: new Date().toISOString()
            };
    
            const { data, error } = await supabase
                .from("attendance")
                .insert([attendanceRecord])
                .select();
    
            if (error) throw error;
            
            alert("Attendance successfully saved!");
        } catch (error) {
            console.error("Error saving attendance:", error);
            alert(`Failed to save attendance: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <h1 className="text-4xl font-semibold text-blue-600 mb-6">Attendance Management</h1>

            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
                {/* Date Picker */}
                <label className="block text-gray-700 font-medium mb-2">Select Date:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                />

                {/* Class Hour Selection */}
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

                {/* Subject Selection */}
                <label className="block text-gray-700 font-medium mb-2">Select Subject:</label>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((subject, index) => (
                        <option key={index} value={subject}>{subject}</option>
                    ))}
                </select>

                {/* File Upload */}
                <label className="block text-gray-700 font-medium mb-2">Upload Attendance File (CSV):</label>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded-md mb-6"
                />

                {/* Upload Button */}
                <button
                    onClick={uploadAttendance}
                    disabled={isUploading}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300"
                >
                    {isUploading ? "Uploading..." : "Upload Attendance"}
                </button>
            </div>

            {/* Display Attendance Data */}
            {attendanceData.length > 0 && (
                <div className="w-full max-w-2xl mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Uploaded Attendance</h2>
                    <div className="mb-4">
                        <p><strong>Date:</strong> {selectedDate}</p>
                        <p><strong>Period:</strong> {selectedPeriod}</p>
                        <p><strong>Subject:</strong> {selectedSubject}</p>
                    </div>
                    <table className="w-full border-collapse border border-gray-300 shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">Name</th>
                                <th className="border border-gray-300 p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((student, index) => (
                                <tr key={index} className="bg-white">
                                    <td className="border border-gray-300 p-2">{student.name}</td>
                                    <td className="border border-gray-300 p-2">
                                        {student.present ? (
                                            <span className="text-green-600">Present</span>
                                        ) : (
                                            <span className="text-red-600">Absent</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Attendance;