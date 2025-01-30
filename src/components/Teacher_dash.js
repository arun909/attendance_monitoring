import React, { useState } from 'react';

const TeacherDash = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Dummy data for students
  const students = [
    { id: 1, name: 'John Doe', attendancePercentage: 92.5 },
    { id: 2, name: 'Jane Smith', attendancePercentage: 85.0 },
    { id: 3, name: 'Alice Johnson', attendancePercentage: 78.3 },
    { id: 4, name: 'Bob Brown', attendancePercentage: 95.7 },
    { id: 5, name: 'Charlie Davis', attendancePercentage: 88.9 },
    { id: 6, name: 'Diana Evans', attendancePercentage: 91.2 },
    { id: 7, name: 'Ethan Green', attendancePercentage: 83.4 },
    { id: 8, name: 'Fiona Harris', attendancePercentage: 76.8 },
  ];

  // Dummy timetable data
  const timetableData = [
    { day: 'Monday', subjects: ['Math', 'Science', 'History'] },
    { day: 'Tuesday', subjects: ['English', 'Physics', 'Chemistry'] },
    { day: 'Wednesday', subjects: ['Biology', 'Geography', 'Math'] },
    { day: 'Thursday', subjects: ['Science', 'History', 'English'] },
    { day: 'Friday', subjects: ['Physics', 'Chemistry', 'Biology'] },
  ];

  // Calculate class attendance statistics
  const totalStudents = students.length;
  const averageAttendance =
    students.reduce((sum, student) => sum + student.attendancePercentage, 0) / totalStudents;
  const topPerformers = students
    .sort((a, b) => b.attendancePercentage - a.attendancePercentage)
    .slice(0, 3); // Top 3 students
  const studentsNeedingAttention = students.filter(
    (student) => student.attendancePercentage < 80
  ); // Students with < 80% attendance

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Custom Navbar */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-700 to-indigo-700'} text-white p-4 shadow-lg`}>
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Teacher Dashboard</h2>
          <div className="flex space-x-4">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
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
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition duration-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Profile
            </button>
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition duration-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto p-4 flex space-x-8">
          <a href="#" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-semibold text-lg`}>Dashboard</a>
          <a href="#" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-semibold text-lg`}>Attendance</a>
          <a href="#" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-semibold text-lg`}>Timetable</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Students List */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
            <h3 className="text-xl font-semibold mb-4">Students List</h3>
            <div className="space-y-4 h-[400px] overflow-y-auto pr-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  } transition duration-300`}
                >
                  <span className="font-medium">{student.name}</span>
                  <span className="font-semibold">{student.attendancePercentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Class Section */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
            <h3 className="text-xl font-semibold mb-4">Add Class</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Class Name</label>
                <input
                  type="text"
                  className={`w-full p-2 rounded-md ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                  placeholder="Enter class name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className={`w-full p-2 rounded-md ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300"
              >
                Add Class
              </button>
            </form>
          </div>

          {/* Class Attendance Overview */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
            <h3 className="text-xl font-semibold mb-4">Class Attendance Overview</h3>
            <div className="space-y-6">
              {/* Total Students */}
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                } transition duration-300`}
              >
                <h4 className="font-semibold">Total Students</h4>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>

              {/* Average Attendance Percentage */}
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                } transition duration-300`}
              >
                <h4 className="font-semibold">Average Attendance</h4>
                <p className="text-2xl font-bold">{averageAttendance.toFixed(2)}%</p>
              </div>

              {/* Top Performers */}
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                } transition duration-300`}
              >
                <h4 className="font-semibold mb-2">Top Performers</h4>
                <ul className="space-y-2">
                  {topPerformers.map((student, index) => (
                    <li key={student.id} className="flex justify-between">
                      <span>{student.name}</span>
                      <span className="font-semibold">{student.attendancePercentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Students Needing Attention */}
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                } transition duration-300`}
              >
                <h4 className="font-semibold mb-2">Students Needing Attention</h4>
                <ul className="space-y-2">
                  {studentsNeedingAttention.map((student) => (
                    <li key={student.id} className="flex justify-between">
                      <span>{student.name}</span>
                      <span className="font-semibold text-red-600">{student.attendancePercentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Timetable Section */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md col-span-2`}>
            <h3 className="text-xl font-semibold mb-4">Timetable</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {timetableData.map((day, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  } transition duration-300`}
                >
                  <h4 className="font-semibold mb-2">{day.day}</h4>
                  <ul className="space-y-1">
                    {day.subjects.map((subject, idx) => (
                      <li key={idx} className="text-sm">{subject}</li>
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

export default TeacherDash;