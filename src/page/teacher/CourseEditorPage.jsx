import { useParams, useNavigate } from 'react-router-dom';
import CourseForm from '../../components/common/teacher/CourseForm';
import { courses as mockCourses } from '../../data/mockData';
import { useEffect, useState } from 'react';

const CourseEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        if (isEditing) {
            // Mock API call to fetch course details
            const course = mockCourses.find(c => c.id === parseInt(id));
            if (course) {
                setInitialData(course);
            } else {
                // Handle not found
                alert('Không tìm thấy khóa học!');
                navigate('/teacher/courses');
            }
        }
    }, [id, isEditing, navigate]);

    const handleSubmit = (data) => {
        // Mock API Submit
        console.log('Submitting Course Data:', data);

        // Simulate API delay
        const loading = true; // In real app use state

        setTimeout(() => {
            alert(isEditing ? 'Cập nhật khóa học thành công!' : 'Tạo khóa học mới thành công!');
            navigate('/teacher/courses');
        }, 500);
    };

    return (
        <div>
            <CourseForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isEditing={isEditing}
            />
        </div>
    );
};

export default CourseEditorPage;
