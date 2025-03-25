import React, { useState, useEffect } from 'react';
import { supabase } from './Auth/supabaseClient';
import { useNavigate } from 'react-router-dom';

const TeacherDash = () => {
  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentMail] = useState('');
  const [mailPassword, setMailPassword] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from('users')
          .select('id, name, email')
          .eq('role', 'student');
        
        if (studentsError) throw studentsError;

        // Update state
        if (studentsData) {
          setStudents(studentsData.map(student => ({
            id: student.id,
            name: student.name,
            email: student.email,
            attendancePercentage: student.attendancePercentage || 75 + Math.floor(Math.random() * 20)
          })));
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalStudents = students.length;
  const averageAttendance = students.reduce((sum, student) => sum + student.attendancePercentage, 0) / totalStudents || 0;
  const topPerformers = [...students].sort((a, b) => b.attendancePercentage - a.attendancePercentage).slice(0, 3);

  // Handle student addition
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      // Create auth user
      const { data: user, error: authError } = await supabase.auth.signUp({
        email: studentEmail,
        password: mailPassword,
      });

      if (authError) throw authError;

      // Add to users table
      const { error: dbError } = await supabase
        .from('users')
        .insert([{
          email: studentEmail,
          name: studentName,
          role: 'student',
          attendancePercentage: 100
        }]);
      if (dbError) throw dbError;

      // Update local state
      setStudents([...students, {
        id: students.length + 1,
        name: studentName,
        email: studentEmail,
        attendancePercentage: 100
      }]);

      // Reset form
      setShowAddStudentForm(false);
      setStudentName('');
      setStudentMail('');
      setMailPassword('');
    } catch (error) {
      console.error('Failed to add student:', error);
      alert(error.message);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-700 to-indigo-700'} text-white p-4 shadow-lg`}>
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Teacher Dashboard</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md flex items-center">
              👤 Profile
            </button>
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md flex items-center">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto p-4 flex space-x-8">
          <button className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>Dashboard</button>
          <button onClick={() => navigate('/attendance')} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>Attendance</button>
          <button onClick={() => setShowAddStudentForm(true)} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>Add Student</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Students List */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
            <h3 className="text-xl font-semibold mb-4">Students List</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {loading ? (
                <p className="text-center py-4">Loading...</p>
              ) : students.length === 0 ? (
                <p className="text-center py-4">No students found</p>
              ) : (
                students.map(student => (
                  <div key={student.id} className={`p-3 rounded-lg flex justify-between items-center ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div>
                      <div className="font-medium">ID: {student.id}</div>
                      <div className="font-bold">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                    <span className="font-bold">{student.attendancePercentage}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

         
          {/* Attendance Overview */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
            <h3 className="text-xl font-semibold mb-4">Attendance Overview</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4>Total Students</h4>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4>Average Attendance</h4>
                <p className="text-2xl font-bold">{averageAttendance.toFixed(1)}%</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4>Top Performers</h4>
                <ul className="space-y-2">
                  {topPerformers.map(student => (
                    <li key={student.id} className="flex justify-between">
                      <span>{student.name}</span>
                      <span className="font-bold">{student.attendancePercentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg w-full max-w-md`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Add Student</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentMail(e.target.value)}
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  value={mailPassword}
                  onChange={(e) => setMailPassword(e.target.value)}
                  className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentForm(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDash;