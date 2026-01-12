import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Intro from "./components/sections/homePage/Intro";
import Courses from "./components/sections/homePage/Courses";
import Testimonials from "./components/sections/homePage/Testimonials";
import Footer from "./components/layout/Footer";
import Steps from "./components/sections/homePage/Steps";
import Instructors from "./components/sections/homePage/Instructors";
import Blog from "./components/sections/homePage/Blog";
import Login from "./components/sections/authPage/Login";
import Register from "./components/sections/authPage/Register";

// Tạo component HomePage để gom tất cả sections
const HomePage = () => {
  return (
    <>
      <Intro />
      <Steps />
      <Courses />
      <Instructors />
      <Testimonials />
      <Blog />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;