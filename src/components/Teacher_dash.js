import React, { useState } from 'react';

const StudentDash = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Dummy data for attendance
  const attendanceData = {
    totalClasses: 30,
    present: 25,
    absent: 5,
    attendancePercentage: 83.33,
  };

  // Dummy timetable data
  const timetableData = [
    { day: 'Monday', subjects: ['Math', 'Science', 'History'] },
    { day: 'Tuesday', subjects: ['English', 'Physics', 'Chemistry'] },
    { day: 'Wednesday', subjects: ['Biology', 'Geography', 'Math'] },
    { day: 'Thursday', subjects: ['Science', 'History', 'English'] },
    { day: 'Friday', subjects: ['Physics', 'Chemistry', 'Biology'] },
  ];

  // Dummy upcoming events
  const upcomingEvents = [
    { title: 'Science Fair', date: '2023-10-15' },
    { title: 'Parent-Teacher Meeting', date: '2023-10-20' },
    { title: 'Final Exams Begin', date: '2023-11-01' },
  ];

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Custom Navbar */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-700 to-indigo-700'} text-white p-4 shadow-lg`}>
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Attendance Monitoring System</h2>
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
          <a href="#" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-semibold text-lg`}>Notifications</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Attendance Summary */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
            <h3 className="text-xl font-semibold mb-4">Attendance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Classes</span>
                <span className="font-semibold">{attendanceData.totalClasses}</span>
              </div>
              <div className="flex justify-between">
                <span>Present</span>
                <span className="font-semibold text-green-600">{attendanceData.present}</span>
              </div>
              <div className="flex justify-between">
                <span>Absent</span>
                <span className="font-semibold text-red-600">{attendanceData.absent}</span>
              </div>
              <div className="flex justify-between">
                <span>Attendance Percentage</span>
                <span className="font-semibold">{attendanceData.attendancePercentage}%</span>
              </div>
              {/* Progress Bar */}
              <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5 mt-4`}>
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${attendanceData.attendancePercentage}%` }}
                ></div>
              </div>
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
                  className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                  placeholder="Enter class name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
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

          {/* Timetable Section */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md col-span-2`}>
            <h3 className="text-xl font-semibold mb-4">Timetable</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {timetableData.map((day, index) => (
                <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
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

        {/* Upcoming Events */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md mt-6`}>
          <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-gray-500">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDash;