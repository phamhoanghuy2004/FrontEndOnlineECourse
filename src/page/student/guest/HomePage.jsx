import Intro from "../../../components/sections/student/guest/homePage/Intro";
import Steps from "../../../components/sections/student/guest/homePage/Steps";
import Courses from "../../../components/sections/student/guest/homePage/Courses";
import Instructors from "../../../components/sections/student/guest/homePage/Instructors";
import Testimonials from "../../../components/sections/student/guest/homePage/Testimonials";
import Blog from "../../../components/sections/student/guest/homePage/Blog";

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