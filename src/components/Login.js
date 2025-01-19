import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('student'); // Default role is 'student'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy authentication for both Student and Teacher
    if ((role === 'student' && username === 's' && password === 'p') || 
        (role === 'teacher' && username === 's' && password === 'p')) {
      // Redirect to the correct dashboard based on role
      if (role === 'student') {
        navigate('/student-dashboard');  // Replace with your student dashboard route
      } else if (role === 'teacher') {
        navigate('/teacher-dashboard');  // Replace with your teacher dashboard route
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Login as</label>
            <div className="flex items-center space-x-4 mt-2">
              <label>
                <input 
                  type="radio" 
                  name="role" 
                  value="student" 
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  className="mr-2"
                />
                Student
              </label>
              <label>
                <input 
                  type="radio" 
                  name="role" 
                  value="teacher" 
                  checked={role === 'teacher'}
                  onChange={() => setRole('teacher')}
                  className="mr-2"
                />
                Teacher
              </label>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              placeholder="Enter your username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button 
              type="submit" 
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
