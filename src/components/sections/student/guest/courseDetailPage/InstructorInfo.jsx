import React from 'react';
import { FaChalkboardTeacher } from "react-icons/fa";

const InstructorInfo = ({ teacher }) => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaChalkboardTeacher className="text-primary" /> Thông tin giảng viên
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-md flex-shrink-0">
                    <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left flex-grow">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{teacher.name}</h4>
                    <p className="text-primary font-bold text-sm mb-3 uppercase tracking-wide">{teacher.qualification}</p>
                    <p className="text-gray-600 italic mb-4">"{teacher.bio}"</p>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        {/* Social icons if needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorInfo;
