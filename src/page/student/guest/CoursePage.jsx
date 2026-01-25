import CourseHero from "../../../components/sections/student/guest/coursePage/CourseHero";
import CourseListSection from "../../../components/sections/student/guest/coursePage/CourseListSection";
import TopStudentsSection from "../../../components/sections/student/guest/coursePage/TopStudentsSection";
import FAQSection from "../../../components/sections/student/guest/coursePage/FAQSection";

const CoursePage = () => {
    return (
        <>
            <CourseHero />
            <CourseListSection />
            <TopStudentsSection />
            <FAQSection />
        </>
    );
};

export default CoursePage;