import React from 'react';

const TeacherDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teacher Portal</h1>
          <div className="space-x-6">
            <a href="#teacher-profile" className="hover:underline">Profile</a>
            <a href="#class-list" className="hover:underline">Class List</a>
            <a href="#manage-attendance" className="hover:underline">Manage Attendance</a>
            <a href="#timetable" className="hover:underline">Timetable</a>
            <a href="#reports" className="hover:underline">Reports</a>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto p-6">
        {/* Teacher Profile Section */}
        <section id="teacher-profile" className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Teacher Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> Mr. John Smith</p>
              <p><strong>Subject:</strong> Computer Science</p>
              <p><strong>Email:</strong> john.smith@college.edu</p>
              <p><strong>Phone:</strong> 987-654-3210</p>
            </div>
            <div>
              <p><strong>Room:</strong> CS101</p>
              <p><strong>Office Hours:</strong> Mon - Fri: 10 AM - 2 PM</p>
            </div>
          </div>
        </section>

        {/* Class List Section */}
        <section id="class-list" className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Class List</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-4 py-2">Student Name</th>
                <th className="px-4 py-2">Student ID</th>
                <th className="px-4 py-2">Attendance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">John Doe</td>
                <td className="border px-4 py-2">12345</td>
                <td className="border px-4 py-2">Present</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Jane Doe</td>
                <td className="border px-4 py-2">12346</td>
                <td className="border px-4 py-2">Absent</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Alice Johnson</td>
                <td className="border px-4 py-2">12347</td>
                <td className="border px-4 py-2">Present</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Manage Attendance Section */}
        <section id="manage-attendance" className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Manage Attendance</h2>
          <form>
            <div className="space-y-4">
              <div>
                <label htmlFor="student" className="block text-sm font-medium text-gray-700">Select Student</label>
                <select
                  id="student"
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                >
                  <option>John Doe</option>
                  <option>Jane Doe</option>
                  <option>Alice Johnson</option>
                </select>
              </div>

              <div>
                <label htmlFor="attendance-status" className="block text-sm font-medium text-gray-700">Attendance Status</label>
                <select
                  id="attendance-status"
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                >
                  <option>Present</option>
                  <option>Absent</option>
                  <option>Late</option>
                </select>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Mark Attendance
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Timetable Section */}
        <section id="timetable" className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Timetable</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Room</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Monday</td>
                <td className="border px-4 py-2">Computer Science 101</td>
                <td className="border px-4 py-2">CS101</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Tuesday</td>
                <td className="border px-4 py-2">Data Structures</td>
                <td className="border px-4 py-2">CS102</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Wednesday</td>
                <td className="border px-4 py-2">Algorithms</td>
                <td className="border px-4 py-2">CS103</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Thursday</td>
                <td className="border px-4 py-2">Database Systems</td>
                <td className="border px-4 py-2">CS104</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Friday</td>
                <td className="border px-4 py-2">Computer Networks</td>
                <td className="border px-4 py-2">CS105</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Reports Section */}
        <section id="reports" className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Reports</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-300 rounded-md">
              <h3 className="font-semibold">Student Attendance Report</h3>
              <p className="text-gray-600">View attendance percentages and details for each student.</p>
              <button className="text-blue-600 hover:text-blue-800">View Report</button>
            </div>
            <div className="p-4 border border-gray-300 rounded-md">
              <h3 className="font-semibold">Performance Report</h3>
              <p className="text-gray-600">View student performance metrics and grade summaries.</p>
              <button className="text-blue-600 hover:text-blue-800">View Report</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherDashboard;
