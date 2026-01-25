import React from 'react';
import { motion } from "framer-motion";
import { FaStar, FaUserGraduate } from "react-icons/fa";

const CourseHero = ({ course }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
        >
            <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{course.tag}</span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{course.level}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{course.title}</h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">{course.description}</p>

            <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400 text-lg" />
                    <span className="font-bold text-gray-900 text-base">{course.rating}</span>
                    <span>({course.reviewCount} đánh giá)</span>
                </div>
                <div className="flex items-center gap-2">
                    <FaUserGraduate className="text-lg text-gray-400" />
                    <span>{course.students} học viên</span>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseHero;
