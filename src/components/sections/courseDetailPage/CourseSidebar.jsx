import React from 'react';
import { FaCheckCircle } from "react-icons/fa";

const CourseSidebar = ({ course }) => {
    return (
        <div className="sticky top-24 space-y-6">

            {/* Course Enrollment Card */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

                <div className="mb-6 rounded-2xl overflow-hidden shadow-md">
                    <img src={course.image} alt={course.title} className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="text-center mb-6">
                    <p className="text-gray-500 text-sm line-through mb-1">1.500.000đ</p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-4xl font-extrabold text-primary">{course.price}</span>
                    </div>
                    <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-green-600 transition-all transform hover:-translate-y-1 block mb-3">
                        Đăng ký ngay
                    </button>
                    <p className="text-xs text-gray-500">Hoàn tiền trong 7 ngày nếu không hài lòng</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Truy cập trọn đời</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Hỗ trợ 24/7 từ giảng viên</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Chứng chỉ sau khi hoàn thành</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CourseSidebar;
