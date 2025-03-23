import React, { useState } from "react";
import { supabase } from "../Auth/supabaseClient";

const Attendance = () => {
    const [firstFile, setFirstFile] = useState(null);
    const [lastFile, setLastFile] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Handle file selection
    const handleFileChange = (event, setFile) => {
        const file = event.target.files[0];
        setFile(file);
    };

    // Read file contents
    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const lines = e.target.result
                    .split("\n")
                    .map(line => line.trim())
                    .filter(line => line);
                resolve(lines);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    };

    // Evaluate attendance
    const evaluateAttendance = async () => {
        if (!firstFile || !lastFile) {
            alert("Please upload both attendance files.");
            return;
        }

        setIsLoading(true);
        try {
            const firstFileData = await readFile(firstFile);
            const lastFileData = await readFile(lastFile);

            const firstSet = new Set(firstFileData);
            const lastSet = new Set(lastFileData);

            const students = new Set([...firstFileData, ...lastFileData]);
            const finalAttendance = Array.from(students).map((name, index) => ({
                id: index + 1,
                name,
                present: firstSet.has(name) && lastSet.has(name),
            }));

            setAttendanceData(finalAttendance);
            alert("Attendance evaluated successfully.");
        } catch (error) {
            console.error("Error reading files:", error);
            alert("Failed to process attendance files.");
        } finally {
            setIsLoading(false);
        }
    };

    // Save attendance to Supabase
    const markAttendance = async () => {
        if (attendanceData.length === 0) {
            alert("No attendance data to save.");
            return;
        }

        setIsUploading(true);
        try {
            const currentDate = new Date();
            const dateString = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
            const timeString = currentDate.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
            const columnName = `${dateString}_${timeString}`;

            // Ensure column exists
            await supabase.rpc("add_column_if_not_exists", { column_name: columnName });

            // Fetch all students
            const { data: students, error: fetchError } = await supabase
                .from("attendance")
                .select("*");

            if (fetchError) throw fetchError;

            for (const student of attendanceData) {
                const studentRecord = students.find((s) => s.student_name === student.name);

                if (studentRecord) {
                    // Update existing record
                    const { error: updateError } = await supabase
                        .from("attendance")
                        .update({ [columnName]: student.present ? "Present" : "Absent" })
                        .eq("student_name", student.name);

                    if (updateError) throw updateError;
                } else {
                    // Insert new record
                    const { error: insertError } = await supabase
                        .from("attendance")
                        .insert({
                            student_name: student.name,
                            [columnName]: student.present ? "Present" : "Absent",
                        });

                    if (insertError) throw insertError;
                }
            }

            alert(`Attendance saved in column: ${columnName}`);
        } catch (error) {
            console.error("Error saving attendance:", error);
            alert("Failed to save attendance.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-semibold mb-6 text-center text-blue-600">
                Attendance Management
            </h1>

            {/* File Upload Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Upload First 10-Minute File
                    </label>
                    <input
                        type="file"
                        accept=".txt"
                        onChange={(e) => handleFileChange(e, setFirstFile)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Upload Last 10-Minute File
                    </label>
                    <input
                        type="file"
                        accept=".txt"
                        onChange={(e) => handleFileChange(e, setLastFile)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    onClick={evaluateAttendance}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300"
                >
                    {isLoading ? "Evaluating..." : "Evaluate Attendance"}
                </button>

                {attendanceData.length > 0 && (
                    <button
                        onClick={markAttendance}
                        disabled={isUploading}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                    >
                        {isUploading ? "Saving..." : "Save to Database"}
                    </button>
                )}
            </div>

            {/* Display Attendance Data */}
            {attendanceData.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Attendance Data</h2>
                    <table className="w-full border-collapse border border-gray-300 shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">ID</th>
                                <th className="border border-gray-300 p-2">Name</th>
                                <th className="border border-gray-300 p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((student) => (
                                <tr key={student.id} className="bg-white">
                                    <td className="border border-gray-300 p-2">{student.id}</td>
                                    <td className="border border-gray-300 p-2">{student.name}</td>
                                    <td className="border border-gray-300 p-2">
                                        {student.present ? "Present" : "Absent"}
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
