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
  const [teacher, setTeacher] = useState({ name: '', subject: '' });
  const [timetableImage, setTimetableImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  // Get teacher info from localStorage on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
      setTeacher({
        name: userData.name,
        subject: userData.subject || 'Teacher'
      });
      fetchTimetableImage();
    }
  }, []);

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

  // Fetch timetable image
  const fetchTimetableImage = async () => {
    try {
      const { data, error } = await supabase
        .from('timetable_images')
        .select('image_url')
        .eq('teacher_id', JSON.parse(localStorage.getItem('currentUser')).id)
        .single();

      if (!error && data) {
        setImagePreview(data.image_url);
      }
    } catch (error) {
      console.error('Error fetching timetable image:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setTimetableImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Submit timetable image
  const submitTimetableImage = async () => {
    if (!timetableImage) return;

    setUploading(true);
    try {
      // Upload image to storage
      const fileExt = timetableImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `timetables/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('timetable-images')
        .upload(filePath, timetableImage);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('timetable-images')
        .getPublicUrl(filePath);

      // Store reference in database
      const { error: dbError } = await supabase
        .from('timetable_images')
        .upsert({
          teacher_id: JSON.parse(localStorage.getItem('currentUser')).id,
          image_url: publicUrl
        });

      if (dbError) throw dbError;

      alert('Timetable uploaded successfully!');
    } catch (error) {
      console.error('Error uploading timetable:', error);
      alert('Failed to upload timetable');
    } finally {
      setUploading(false);
    }
  };

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
          <div>
            <h2 className="text-2xl font-semibold">Teacher Dashboard</h2>
            <p className="text-sm opacity-90">Welcome, {teacher.name} ({teacher.subject})</p>
          </div>
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
            <button 
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md flex items-center"
              onClick={() => {
                localStorage.removeItem('currentUser');
                navigate('/login');
              }}
            >
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
          <button onClick={() => navigate('/AddStudent')} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>Add Student</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Students List */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md lg:col-span-1`}>
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

          {/* Middle Column - Attendance Overview */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md lg:col-span-1`}>
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

          {/* Right Column - Timetable Upload */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md lg:col-span-1`}>
            <h3 className="text-xl font-semibold mb-4">Upload Timetable</h3>
            <div className="space-y-4">
              {imagePreview && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium mb-2">Current Timetable:</h4>
                  <img 
                    src={imagePreview} 
                    alt="Timetable" 
                    className="w-full h-auto rounded-lg border border-gray-300"
                  />
                </div>
              )}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <label className="block mb-2">
                  <span className="text-sm font-medium">Upload new timetable image:</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </label>
                {timetableImage && (
                  <button
                    onClick={submitTimetableImage}
                    disabled={uploading}
                    className={`mt-4 w-full py-2 px-4 rounded-md ${uploading ? 
                      'bg-gray-400 cursor-not-allowed' : 
                      'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    {uploading ? 'Uploading...' : 'Upload Timetable'}
                  </button>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Upload a clear image of your timetable (JPG, PNG)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default TeacherDash;