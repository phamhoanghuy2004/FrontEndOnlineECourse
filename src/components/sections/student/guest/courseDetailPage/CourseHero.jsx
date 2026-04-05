import React from 'react';
import { motion } from "framer-motion";

const CourseHero = ({ course }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
        >
            <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {course.categoryName}
                </span>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {course.level}
                </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{course.name}</h1>
            <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
        </motion.div>
    );
};

export default CourseHero;