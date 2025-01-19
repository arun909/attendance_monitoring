import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Portal</h1>
          <div className="space-x-6">
            <a href="#student-details" className="hover:underline">Student Details</a>
            <a href="#timetable" className="hover:underline">Timetable</a>
            <a href="#attendance" className="hover:underline">Attendance</a>
            <a href="#calendar" className="hover:underline">Calendar</a>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto p-6">
        {/* Student Details Section */}
        <section id="student-details" className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Student Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> John Doe</p>
              <p><strong>Student ID:</strong> 12345</p>
              <p><strong>Course:</strong> Computer Science</p>
            </div>
            <div>
              <p><strong>Email:</strong> john.doe@college.edu</p>
              <p><strong>Phone:</strong> 123-456-7890</p>
            </div>
          </div>
        </section>

        {/* Timetable Section */}
        <section id="timetable" className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Timetable</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Subject</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Monday</td>
                <td className="border px-4 py-2">Math 101</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Tuesday</td>
                <td className="border px-4 py-2">Physics 101</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Wednesday</td>
                <td className="border px-4 py-2">Chemistry 101</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Thursday</td>
                <td className="border px-4 py-2">Biology 101</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Friday</td>
                <td className="border px-4 py-2">Computer Science 101</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Attendance Section */}
        <section id="attendance" className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">01/01/2025</td>
                <td className="border px-4 py-2">Present</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">02/01/2025</td>
                <td className="border px-4 py-2">Absent</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">03/01/2025</td>
                <td className="border px-4 py-2">Present</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">04/01/2025</td>
                <td className="border px-4 py-2">Present</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">05/01/2025</td>
                <td className="border px-4 py-2">Absent</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Calendar Section */}
        <section id="calendar" className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Calendar</h2>
          <div className="grid grid-cols-7 gap-4 text-center">
            <div className="font-semibold">Sun</div>
            <div className="font-semibold">Mon</div>
            <div className="font-semibold">Tue</div>
            <div className="font-semibold">Wed</div>
            <div className="font-semibold">Thu</div>
            <div className="font-semibold">Fri</div>
            <div className="font-semibold">Sat</div>
            <div className="bg-gray-200 p-2">1</div>
            <div className="bg-gray-200 p-2">2</div>
            <div className="bg-gray-200 p-2">3</div>
            <div className="bg-gray-200 p-2">4</div>
            <div className="bg-gray-200 p-2">5</div>
            <div className="bg-gray-200 p-2">6</div>
            <div className="bg-gray-200 p-2">7</div>
            <div className="bg-gray-200 p-2">8</div>
            <div className="bg-gray-200 p-2">9</div>
            <div className="bg-gray-200 p-2">10</div>
            <div className="bg-gray-200 p-2">11</div>
            <div className="bg-gray-200 p-2">12</div>
            <div className="bg-gray-200 p-2">13</div>
            <div className="bg-gray-200 p-2">14</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
