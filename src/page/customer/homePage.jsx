import Intro from "../../components/sections/homePage/Intro";
import Steps from "../../components/sections/homePage/Steps";
import Courses from "../../components/sections/homePage/Courses";
import Instructors from "../../components/sections/homePage/Instructors";
import Testimonials from "../../components/sections/homePage/Testimonials";
import Blog from "../../components/sections/homePage/Blog";

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

export default HomePage;