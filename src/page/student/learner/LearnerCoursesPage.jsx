import React, { useState, useEffect, useMemo } from 'react';
import LearnerCoursesHeader from '../../../components/sections/student/leaner/coursePage/LearnerCoursesHeader';
import LearnerCourseList from '../../../components/sections/student/leaner/coursePage/LearnerCoursesList';
import courseApi from '../../../api/courseApi';

const FILTER_TABS = [
    { id: 'all', label: 'Tất cả' },
    { id: 'in-progress', label: 'Đang học' },
    { id: 'not-started', label: 'Chưa học' },
    { id: 'completed', label: 'Đã xong' }
];

const LearnerCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                setLoading(true);

                const result = await courseApi.getMyLearningCourses({ 
                    page: 1, 
                    size: 10
                });
                
                if (result && result.data && result.data.content) {
                    setCourses(result.data.content);
                }
            } catch (error) {
                console.error("Lỗi khi tải khóa học:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);


    const stats = useMemo(() => {
        let inProgress = 0;
        let completed = 0;
        
        courses.forEach(c => {
            if (c.progressPercent === 100) completed++;
            else if (c.progressPercent > 0) inProgress++;
        });

        return {
            total: courses.length,
            inProgress,
            completed
        };
    }, [courses]);

    if (loading) {
        return (
             <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">
                 Đang tải danh sách khóa học...
             </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <div className="mb-2"> 
                <LearnerCoursesHeader stats={stats} />
            </div>

            <LearnerCourseList courses={courses} tabs={FILTER_TABS} />
        </div>
    );
};

export default LearnerCoursesPage;