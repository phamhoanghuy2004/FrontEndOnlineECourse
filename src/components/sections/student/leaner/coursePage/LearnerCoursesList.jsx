import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import CourseFilterBar from '../../../../common/student/leaner/courseList/CourseFilterBar';
import LearnerCourseCard from '../../../../common/student/leaner/courseList/LearnerCourseCard';
import Button from '../../../../common/Button';

const LearnerCourseList = ({ courses, tabs }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // 💥 Tính toán lại status cho từng course để filter
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            // Check Search
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = 
                (course.courseName && course.courseName.toLowerCase().includes(searchLower)) ||
                (course.teacherName && course.teacherName.toLowerCase().includes(searchLower));
            
            // Tính status on the fly
            let status = 'not-started';
            if (course.progressPercent === 100) status = 'completed';
            else if (course.progressPercent > 0) status = 'in-progress';

            // Check Tab
            const matchesTab = activeTab === 'all' || status === activeTab;
            
            return matchesSearch && matchesTab;
        });
    }, [searchQuery, activeTab, courses]);

    const handleResetFilter = () => {
        setSearchQuery('');
        setActiveTab('all');
    };

    return (
        <div className="space-y-6">
            <CourseFilterBar
                tabs={tabs}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredCourses.map((course) => (
                            <LearnerCourseCard key={course.enrollmentId} course={course} />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner">🕵️‍♂️</div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy khóa học nào</h3>
                    <p className="text-slate-500 max-w-sm mb-6">Có vẻ như bạn chưa đăng ký khóa học nào phù hợp với bộ lọc hiện tại.</p>
                    <Button onClick={handleResetFilter}>Xóa bộ lọc</Button>
                </div>
            )}
        </div>
    );
};

export default LearnerCourseList;