import Home from './pages/Home';
import Professors from './pages/Professors';
import Courses from './pages/Courses';
import ProfessorDetail from './pages/ProfessorDetail';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';


import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("gmu_user");
    if (saved) setUser(saved);
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/professors" element={<Professors />} />
        <Route path="/professor/:id" element={<ProfessorDetail user={user} />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:code" element={<CourseDetail user={user} />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
