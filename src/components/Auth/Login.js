import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Auth/supabaseClient'; // Import Supabase client

const Login = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Step 1: Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log("Auth Response:", authData);
      console.log("Auth Error:", authError);
      if (authError || !authData.user) {
        setError("Invalid email or password.");
        return;
      }

          const { data, error } = await supabase.from('users').select('*').limit(5); // Fetch first 5 users

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        console.log("Users table data:", data);
  }

      // Step 2: Fetch User Role from Supabase Database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .maybeSingle(); // Prevents crash if no user is found
         console.log(email);
         console.log(userData);

      if (userError || !userData) {
        setError("User role not found. Please contact admin.");
        return;
      }

      // Step 3: Validate Role
      if (userData.role !== role) {
        setError(`Incorrect role. You are registered as a ${userData.role}.`);
        return;
      }

      // Step 4: Redirect User Based on Role
      navigate(role === 'student' ? '/student-dashboard' : '/teacher-dashboard');

    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all hover:scale-105 backdrop-blur-sm bg-opacity-90">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome Back!</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Login as</label>
            <div className="flex items-center space-x-6 mt-2">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="role" 
                  value="student" 
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">Student</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="role" 
                  value="teacher" 
                  checked={role === 'teacher'}
                  onChange={() => setRole('teacher')}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-gray-700">Teacher</span>
              </label>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button 
              type="submit" 
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
