import React, { useState } from 'react';

const StudentDash = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date

  // Dummy data for attendance by subject
  const subjectAttendanceData = {
    Math: { totalClasses: 30, present: 25, absent: 5, attendancePercentage: 83.33 },
    Science: { totalClasses: 28, present: 24, absent: 4, attendancePercentage: 85.71 },
    History: { totalClasses: 25, present: 20, absent: 5, attendancePercentage: 80.0 },
    English: { totalClasses: 30, present: 28, absent: 2, attendancePercentage: 93.33 },
    Physics: { totalClasses: 26, present: 22, absent: 4, attendancePercentage: 84.62 },
    Chemistry: { totalClasses: 28, present: 25, absent: 3, attendancePercentage: 89.29 },
    Biology: { totalClasses: 24, present: 20, absent: 4, attendancePercentage: 83.33 },
    Geography: { totalClasses: 22, present: 18, absent: 4, attendancePercentage: 81.82 },
  };

  // Dummy timetable data
  const timetableData = [
    { day: 'Monday', subjects: ['Math', 'Science', 'History'] },
    { day: 'Tuesday', subjects: ['English', 'Physics', 'Chemistry'] },
    { day: 'Wednesday', subjects: ['Biology', 'Geography', 'Math'] },
    { day: 'Thursday', subjects: ['Science', 'History', 'English'] },
    { day: 'Friday', subjects: ['Physics', 'Chemistry', 'Biology'] },
  ];

  // Dummy attendance records for each date
  const attendanceRecords = {
    '2023-10-01': { Math: 'Present', Science: 'Absent', History: 'Present' },
    '2023-10-02': { English: 'Present', Physics: 'Present', Chemistry: 'Absent' },
    '2023-10-03': { Biology: 'Present', Geography: 'Absent', Math: 'Present' },
    '2023-10-04': { Science: 'Present', History: 'Present', English: 'Absent' },
    '2023-10-05': { Physics: 'Absent', Chemistry: 'Present', Biology: 'Present' },
  };

  // Get the day of the week for the selected date
  const getDayOfWeek = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };

  // Get subjects for the selected date based on the timetable
  const getSubjectsForDate = (date) => {
    const dayOfWeek = getDayOfWeek(date);
    const dayData = timetableData.find((day) => day.day === dayOfWeek);
    return dayData ? dayData.subjects : [];
  };

  // Get attendance status for each subject on the selected date
  const getAttendanceForDate = (date) => {
    const subjects = getSubjectsForDate(date);
    const attendanceForDate = attendanceRecords[date] || {};
    return subjects.map((subject) => ({
      subject,
      status: attendanceForDate[subject] || 'Absent', // Default to 'Absent' if no record exists
    }));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle date change for recent attendance
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Get attendance data for the selected date
  const attendanceForSelectedDate = getAttendanceForDate(selectedDate);

  // Calculate overall semester attendance
  const overallAttendance = {
    totalClasses: Object.values(subjectAttendanceData).reduce((sum, data) => sum + data.totalClasses, 0),
    present: Object.values(subjectAttendanceData).reduce((sum, data) => sum + data.present, 0),
    absent: Object.values(subjectAttendanceData).reduce((sum, data) => sum + data.absent, 0),
    attendancePercentage: (
      (Object.values(subjectAttendanceData).reduce((sum, data) => sum + data.present, 0) /
        Object.values(subjectAttendanceData).reduce((sum, data) => sum + data.totalClasses, 0)) *
      100
    ).toFixed(2),
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Custom Navbar */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white p-4 shadow-lg`}>
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Attendance Monitoring System</h2>
          <div className="flex space-x-4">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition duration-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Profile
            </button>
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition duration-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Attendance Summary */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-6">Attendance Summary</h3>
              <div className="space-y-6 h-[400px] overflow-y-auto pr-4">
                {Object.entries(subjectAttendanceData).map(([subject, data]) => (
                  <div key={subject} className="space-y-2">
                    <h4 className="font-semibold text-lg">{subject}</h4>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Total Classes: {data.totalClasses}</span>
                      <span>Present: {data.present}</span>
                      <span>Absent: {data.absent}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5`}>
                      <div
                        className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2.5 rounded-full"
                        style={{ width: `${data.attendancePercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      {data.attendancePercentage}% Attendance
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Semester Attendance */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold mb-6">Overall Semester Attendance</h3>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:shadow-md transition duration-300`}>
                <div className="text-center">
                  <h4 className="text-4xl font-bold mb-4">{overallAttendance.attendancePercentage}%</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Total Classes</span>
                      <span>{overallAttendance.totalClasses}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Present</span>
                      <span className="text-green-600">{overallAttendance.present}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Absent</span>
                      <span className="text-red-600">{overallAttendance.absent}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timetable Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-6">Timetable</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {timetableData.map((day, index) => (
                <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:shadow-md transition duration-300`}>
                  <h4 className="font-semibold mb-3">{day.day}</h4>
                  <ul className="space-y-2">
                    {day.subjects.map((subject, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{subject}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDash;