import React from 'react';
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const CourseHeader = ({ course, isRegistered }) => {
    return (
        <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10 hidden md:block">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/courses" className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                        <FiArrowLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 truncate max-w-lg">{course.title}</h1>
                </div>
                {/* 2. Chỉ hiển thị khu vực này khi CHƯA đăng nhập (!user) */}
                {!isRegistered && (
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-primary">{course.price}</span>
                        <button className="bg-primary text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-green-600 transition-all transform hover:-translate-y-1">
                            Đăng ký ngay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseHeader;
