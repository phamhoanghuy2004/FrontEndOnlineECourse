import CourseForm from '../../components/common/teacher/CourseForm';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import courseApi from '../../api/courseApi';

const CourseEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [initialData, setInitialData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditing) {
            const fetchCourse = async () => {
                try {
                    const response = await courseApi.getById(id);
                    setInitialData(response.data);
                } catch (error) {
                    console.error('Error fetching course:', error);
                    alert('Không tìm thấy khóa học!');
                    navigate('/teacher/courses');
                }
            };
            fetchCourse();
        }
    }, [id, isEditing, navigate]);

    const handleSubmit = async (formData, imageFile) => {
        setIsSubmitting(true);
        try {
            const data = new FormData();
            
            // Append all fields from formData
            Object.keys(formData).forEach(key => {
                if (key === 'lessons') return; // Lessons are handled separately or later
                
                if (Array.isArray(formData[key])) {
                    // Spring Boot nhận List bằng cách append nhiều lần cùng 1 key
                    formData[key].forEach(val => data.append(key, val));
                } else {
                    data.append(key, formData[key]);
                }
            });

            // Append file if exists
            if (imageFile) {
                data.append('file', imageFile);
            }

            if (isEditing) {
                await courseApi.update(id, data);
                alert('Cập nhật khóa học thành công!');
            } else {
                await courseApi.create(data);
                alert('Tạo khóa học mới thành công!');
            }
            navigate('/teacher/courses');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <CourseForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isEditing={isEditing}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default CourseEditorPage;
