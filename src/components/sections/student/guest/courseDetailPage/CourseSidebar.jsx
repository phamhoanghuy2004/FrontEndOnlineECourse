import React from 'react';
import { FaCheckCircle } from "react-icons/fa";

const CourseSidebar = ({ course, isRegistered }) => {
    // Format tiền VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="sticky top-28 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

                <div className="mb-6 rounded-2xl overflow-hidden shadow-sm border border-slate-100 aspect-video">
                    <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="text-center mb-6 border-b border-slate-100 pb-6">
                    {course.originalPrice > course.price && (
                        <p className="text-slate-400 text-sm line-through mb-1 font-medium">
                            {formatPrice(course.originalPrice)}
                        </p>
                    )}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-4xl font-extrabold text-primary">
                            {course.price === 0 ? "MIỄN PHÍ" : formatPrice(course.price)}
                        </span>
                    </div>

                    {!isRegistered ? (
                        <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg hover:bg-green-600 transition-all transform hover:-translate-y-1 block">
                            Đăng ký học ngay
                        </button>
                    ) : (
                        <button className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-slate-900 transition-all block">
                            Tiếp tục học thuật
                        </button>
                    )}
                    
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" size={18} />
                        <span>Sở hữu khóa học trọn đời</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" size={18} />
                        <span>Học mọi lúc, mọi nơi</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" size={18} />
                        <span>Cấp chứng chỉ hoàn thành</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSidebar;