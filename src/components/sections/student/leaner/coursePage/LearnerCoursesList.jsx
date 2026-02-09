import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import CourseFilterBar from '../../../../common/student/leaner/courseList/CourseFilterBar';
import LearnerCourseCard from '../../../../common/student/leaner/courseList/LearnerCourseCard';
import Button from '../../../../common/Button';

const LearnerCourseList = ({ courses, tabs }) => {
    // 1. Quản lý State lọc nội bộ
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // 2. Logic Lọc dữ liệu
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTab = activeTab === 'all' || course.status === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [searchQuery, activeTab, courses]);

    // Hàm reset khi không tìm thấy kết quả
    const handleResetFilter = () => {
        setSearchQuery('');
        setActiveTab('all');
    };

    return (
        <div className="space-y-6"> {/* Khoảng cách giữa Filter Bar và Grid */}

            {/* 2. Truyền 'tabs' xuống CourseFilterBar */}
            <CourseFilterBar
                tabs={tabs}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* --- B. COURSE GRID / EMPTY STATE --- */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredCourses.map((course) => (
                            <LearnerCourseCard
                                key={course.id}
                                course={course}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner">🕵️‍♂️</div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy khóa học nào</h3>
                    <p className="text-slate-500 max-w-sm mb-6">Có vẻ như bạn chưa đăng ký khóa học nào phù hợp với bộ lọc hiện tại.</p>
                    <Button onClick={handleResetFilter}>  Xóa bộ lọc </Button>
                </div>
            )}
        </div>
    );
};

export default LearnerCourseList;