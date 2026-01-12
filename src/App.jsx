import Navbar from "./components/layout/Navbar";
import Intro from "./components/sections/homePage/Intro";
import Courses from "./components/sections/homePage/Courses";
import Testimonials from "./components/sections/homePage/Testimonials";
import Footer from "./components/layout/Footer";
import Steps from "./components/sections/homePage/Steps";
import Instructors from "./components/sections/homePage/Instructors";
import Blog from "./components/sections/homePage/Blog";

function App() {
  return (
    <div className="font-sans">
      <Navbar />
      <Intro />
      <Steps />
      <Courses />
      <Instructors />
      <Testimonials />
      <Blog />
      <Footer />
    </div>
  );
}

export default App;
