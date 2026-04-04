import React from 'react';
import { Link } from "react-router-dom";
import { FaChalkboardTeacher, FaCommentDots } from "react-icons/fa";

const InstructorInfo = ({ course, user, isRegistered }) => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FaChalkboardTeacher className="text-primary" /> Giảng viên hướng dẫn
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm flex-shrink-0">
                    <img src={course.teacherAvatarUrl || "https://via.placeholder.com/150"} alt={course.teacherName} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left flex-grow">
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{course.teacherName}</h4>
                    <p className="text-slate-500 text-sm mb-4">Giảng viên xuất sắc tại Echill</p>
                    
                    {isRegistered && user && (
                        <Link 
                            to={`/learner/${user.id}/chat`} 
                            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2 rounded-full font-semibold hover:bg-blue-100 transition-colors"
                        >
                            <FaCommentDots size={16} /> Liên hệ giảng viên
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorInfo;