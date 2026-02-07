import { useParams, Link } from "react-router-dom";
import { courses, instructors } from "../../../data/mockData";
import { FiArrowLeft } from "react-icons/fi";
import CourseHeader from "../../../components/sections/student/guest/courseDetailPage/CourseHeader";
import CourseHero from "../../../components/sections/student/guest/courseDetailPage/CourseHero";
import TrialLesson from "../../../components/sections/student/guest/courseDetailPage/TrialLesson";
import InstructorInfo from "../../../components/sections/student/guest/courseDetailPage/InstructorInfo";
import CourseSidebar from "../../../components/sections/student/guest/courseDetailPage/CourseSidebar";
import CourseContent from "../../../components/sections/student/guest/courseDetailPage/CourseContent";
import { useAuth } from "../../../hooks/useAuth"; 

const CourseDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth(); 

    const courseId = parseInt(id);
    const course = courses.find((c) => c.id === courseId);

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

    const teacher = instructors.find(i => i.name === course.tutor) || instructors[0];

    // --- LOGIC MỚI Ở ĐÂY ---
    // User đã đăng nhập VÀ Id khóa học là 1 thì mới tính là đã đăng ký
    const isRegistered = user && course.id === 1; 

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-24 font-sans text-gray-800">
            {/* Truyền isRegistered xuống Header */}
            <CourseHeader course={course} isRegistered={isRegistered} />

            <div className="container mx-auto px-6 mt-8">
                {/* Mobile Breadcrumb */}
                <div className="md:hidden mb-6">
                    <Link to="/courses" className="text-gray-500 hover:text-primary flex items-center gap-2 mb-4">
                        <FiArrowLeft /> Quay lại
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Logic layout: Dựa vào isRegistered thay vì chỉ user */}
                    <div className={`${isRegistered ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-10`}>

                        <CourseHero course={course} />

                        {/* Truyền cả user (để lấy id chat) và isRegistered (để hiện nút) */}
                        <InstructorInfo teacher={teacher} user={user} isRegistered={isRegistered} />

                        {/* Chỉ hiện Trial Lesson nếu CHƯA đăng ký */}
                        {!isRegistered && (
                            <TrialLesson course={course} />
                        )}

                        {/* Truyền isRegistered xuống Content */}
                        <CourseContent course={course} isRegistered={isRegistered} />

                    </div>

                    {/* Sidebar: Chỉ hiện khi CHƯA đăng ký */}
                    {!isRegistered && (
                        <div className="lg:col-span-1">
                            <CourseSidebar course={course} />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;