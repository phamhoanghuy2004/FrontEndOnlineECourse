import { useParams, Link } from "react-router-dom";
import { courses, instructors } from "../../data/mockData";
import { FiArrowLeft } from "react-icons/fi";
import CourseHeader from "../../components/sections/courseDetailPage/CourseHeader";
import CourseHero from "../../components/sections/courseDetailPage/CourseHero";
import TrialLesson from "../../components/sections/courseDetailPage/TrialLesson";
import InstructorInfo from "../../components/sections/courseDetailPage/InstructorInfo";
import CourseSidebar from "../../components/sections/courseDetailPage/CourseSidebar";

const CourseDetail = () => {
    const { id } = useParams();
    const courseId = parseInt(id);
    const course = courses.find((c) => c.id === courseId);

    // Xử lý khi không tìm thấy khóa học
    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Khoá học không tồn tại</h2>
                <Link to="/courses" className="text-primary hover:underline flex items-center gap-2">
                    <FiArrowLeft /> Quay lại danh sách khóa học
                </Link>
            </div>
        );
    }

    // Tìm thông tin giáo viên
    const teacher = instructors.find(i => i.name === course.tutor) || instructors[0];

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-24 font-sans text-gray-800">
            {/* --- HERO HEADER --- */}
            <CourseHeader course={course} />

            <div className="container mx-auto px-6 mt-8">
                {/* BREADCRUMB - Mobile Only or simple nav */}
                <div className="md:hidden mb-6">
                    <Link to="/courses" className="text-gray-500 hover:text-primary flex items-center gap-2 mb-4">
                        <FiArrowLeft /> Quay lại
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* --- LEFT COLUMN: MAIN CONTENT --- */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* 1. HEADER INFO */}
                        <CourseHero course={course} />

                        {/* 2. TRIAL LESSON SECTION */}
                        <TrialLesson course={course} />

                        {/* 3. INSTRUCTOR INFO */}
                        <InstructorInfo teacher={teacher} />

                    </div>

                    {/* --- RIGHT COLUMN: SIDEBAR --- */}
                    <div className="lg:col-span-1">
                        <CourseSidebar course={course} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
