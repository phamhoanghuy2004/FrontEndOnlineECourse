import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import CourseHero from "../../../components/sections/student/guest/courseDetailPage/CourseHero";
import CourseSidebar from "../../../components/sections/student/guest/courseDetailPage/CourseSidebar";
import CourseContent from "../../../components/sections/student/guest/courseDetailPage/CourseContent";
import CourseTOC from "../../../components/sections/student/guest/courseDetailPage/CourseTOC";
import { useAuth } from "../../../hooks/useAuth"; 
import courseApi from "../../../api/courseApi"; 
import CourseDescription from "../../../components/sections/student/guest/courseDetailPage/CourseDescription";
import ReviewSection from "../../../components/sections/student/guest/courseDetailPage/ReviewSection";

const CourseDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth(); 

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                setLoading(true);
                const response = await courseApi.getCourseDetail(id);
                if (response && response.data) {
                    setCourse(response.data);
                } else {
                    setError("Không tìm thấy khóa học");
                }
            } catch (err) {
                setError(err.message || "Lỗi kết nối đến máy chủ");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetail();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-bold text-xl">Đang tải dữ liệu...</div>;
    if (error || !course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{error || "Khoá học không tồn tại"}</h2>
                <Link to="/courses" className="text-primary hover:underline flex items-center gap-2">
                    <FiArrowLeft /> Quay lại danh sách
                </Link>
            </div>
        );
    }

    const isRegistered = user && course.id === 1; // Logic fake tạm thời
    
    // 💥 KIỂM TRA XEM KHÓA HỌC CÓ BÀI HỌC HAY KHÔNG
    const hasLessons = course.lessons && course.lessons.length > 0;

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-24 font-sans text-gray-800">

            <div className="container mx-auto px-4 lg:px-8 max-w-[1536px] mt-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    
                    {/* 💥 CỘT TRÁI: Chỉ render khi CÓ BÀI HỌC */}
                    {hasLessons && (
                        <div className="hidden lg:block lg:col-span-2">
                            <CourseTOC lessons={course.lessons} />
                        </div>
                    )}

                    {/* 💥 CỘT GIỮA: Co giãn thông minh
                        - Nếu CÓ bài học: Chiếm 7 cột (để chừa 2 cột cho Mục lục)
                        - Nếu KHÔNG CÓ bài học: Phình to ra chiếm 9 cột
                    */}
                    <div className={`${hasLessons ? 'lg:col-span-7' : 'lg:col-span-9'} space-y-8 transition-all duration-300`}>
                        <CourseHero course={course} />
                        <CourseDescription description={course.description} />
                        <CourseContent lessons={course.lessons} isRegistered={isRegistered} />
                        <ReviewSection courseId={id} />
                    </div>

                    {/* CỘT PHẢI: MUA KHÓA HỌC (Luôn giữ nguyên 3 cột) */}
                    <div className="lg:col-span-3">
                        <CourseSidebar course={course} isRegistered={isRegistered} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;