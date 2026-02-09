import React from 'react';
import LearnerCoursesHeader from '../../../components/sections/student/leaner/coursePage/LearnerCoursesHeader';
import LearnerCourseList from '../../../components/sections/student/leaner/coursePage/LearnerCoursesList';


// 1. MOCK DATA (Dữ liệu giả lập chi tiết)
const MY_COURSES = [
    {
        id: 1,
        title: "TOEIC Basic 450+ cho người mất gốc",
        thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        instructor: {
            name: "Ms. Hoa",
            avatar: "https://i.pravatar.cc/150?img=1"
        },
        category: "TOEIC",
        totalLessons: 25,
        completedLessons: 12, // Đã học 12 bài
        progress: 48, // 48%
        lastAccessed: "2 giờ trước",
        status: "in-progress", // 'in-progress' | 'completed' | 'not-started'
        certificate: false
    },
    {
        id: 2,
        title: "IELTS Speaking Masterclass: Band 7.0+",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        instructor: {
            name: "Mr. David",
            avatar: "https://i.pravatar.cc/150?img=11"
        },
        category: "IELTS",
        totalLessons: 40,
        completedLessons: 40,
        progress: 100,
        lastAccessed: "1 ngày trước",
        status: "completed",
        certificate: true // Đã có chứng chỉ
    },
    {
        id: 3,
        title: "Tiếng Anh Giao Tiếp Công Sở (Business English)",
        thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        instructor: {
            name: "Team EduSkill",
            avatar: "https://i.pravatar.cc/150?img=5"
        },
        category: "Communication",
        totalLessons: 15,
        completedLessons: 0,
        progress: 0,
        lastAccessed: "Chưa học",
        status: "not-started",
        certificate: false
    },
    {
        id: 4,
        title: "Luyện đề TOEIC Full Test 2026 (New Format)",
        thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        instructor: {
            name: "Ms. Jenny",
            avatar: "https://i.pravatar.cc/150?img=9"
        },
        category: "Test Prep",
        totalLessons: 10,
        completedLessons: 2,
        progress: 20,
        lastAccessed: "3 ngày trước",
        status: "in-progress",
        certificate: false
    },
    {
        id: 5,
        title: "Ngữ pháp tiếng Anh toàn diện (A1 - C1)",
        thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        instructor: {
            name: "Dr. Adam Smith",
            avatar: "https://i.pravatar.cc/150?img=60"
        },
        category: "Grammar",
        totalLessons: 50,
        completedLessons: 45,
        progress: 90,
        lastAccessed: "5 phút trước",
        status: "in-progress",
        certificate: false
    }
];

// 1. Định nghĩa Tabs ở đây (Config)
const FILTER_TABS = [
    { id: 'all', label: 'Tất cả' },
    { id: 'in-progress', label: 'Đang học' },
    { id: 'not-started', label: 'Chưa học' },
    { id: 'completed', label: 'Đã xong' }
];

const LearnerCoursesPage = () => {
    // Tính toán Stats dựa trên dữ liệu gốc (để truyền vào Header)
    const stats = {
        total: MY_COURSES.length,
        inProgress: MY_COURSES.filter(c => c.status === 'in-progress').length,
        completed: MY_COURSES.filter(c => c.status === 'completed').length
    };

    return (
        <div className="min-h-screen bg-transparent pb-20">
            {/* Header nhận Stats */}
            <div className="mb-2"> {/* Khoảng cách nhỏ giữa Header và List */}
                <LearnerCoursesHeader stats={stats} />
            </div>

            {/* List đảm nhiệm việc hiển thị Filter và Grid */}
            <LearnerCourseList courses={MY_COURSES} tabs={FILTER_TABS} />
        </div>
    );
};

export default LearnerCoursesPage;