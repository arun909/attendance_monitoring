import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherDash from './TeacherDash';
import Attendance from './Attendance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TeacherDash />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </Router>
  );
}

export default App;