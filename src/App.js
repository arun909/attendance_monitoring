import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Login />} />
            {/* You can add more routes here, e.g., for dashboard */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
