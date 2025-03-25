import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherDash from './TeacherDash';
import Attendance from './Attendance';
import AddStudent from './Add Student';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TeacherDash />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/AddStudent" element={<Add Student/>} />
      </Routes>
    </Router>
  );
}

export default App;