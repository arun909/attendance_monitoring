import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import StudentDash from './components/Student_dash';
import TeacherDash from './components/Teacher_dash';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/student-dashboard" element={<StudentDash />} />
            <Route path="/teacher-dashboard" element={<TeacherDash />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
