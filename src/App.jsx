import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./page/customer/homePage";
import Login from "./page/authPage/Login";
import Register from "./page/authPage/Register";
import CoursePage from "./page/customer/CoursePage";
import LevelTest from "./page/customer/LevelTestPage";
import CourseDetail from "./page/customer/CourseDetail";
import TestPracticePage from './page/customer/TestPracticePage';

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/level-test" element={<LevelTest />} />
          <Route path="/testPractice" element={<TestPracticePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;