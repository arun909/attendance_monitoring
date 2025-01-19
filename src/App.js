import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Student_dash from './components/Student_dash';
import Teacher_dash from './components/Teacher_dash';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Student_dash />} /> {/* Change path to /dashboard */}
            <Route path="/teacher-dashboard" element={<Teacher_dash />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
