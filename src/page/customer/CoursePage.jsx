import CourseHero from "../../components/sections/coursePage/CourseHero";
import CourseListSection from "../../components/sections/coursePage/CourseListSection";
import TopStudentsSection from "../../components/sections/coursePage/TopStudentsSection";
import FAQSection from "../../components/sections/coursePage/FAQSection";

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