import axiosClient from "./axiosClient";

const courseApi = {
    getAllByTeacher: () => {
        return axiosClient.get('/courses/teacher');
    },

    getById: (id) => {
        return axiosClient.get(`/courses/teacher/${id}`);
    },

    // 💥 HÀM MỚI THÊM VÀO DÀNH CHO PUBLIC (HỌC VIÊN)
    getCourseDetail: (id) => {
        return axiosClient.get(`/courses/${id}`);
    },

    getMyLearningCourses: (params) => {
        return axiosClient.get('/enrollments/my-course', {
            params
        });
    },

    getCourseCurriculum: (courseId) => {
        return axiosClient.get(`/enrollments/${courseId}/curriculum`);
    },

    startLesson: (lessonId) => {
        return axiosClient.post(`/lessons/${lessonId}/start`);
    },

    getLessonDetailForStudy: (lessonId) => {
        return axiosClient.get(`/lessons/${lessonId}`);
    },

    syncVideoProgress: (lessonId, data) => {
        return axiosClient.put(`/lessons/${lessonId}/progress`, data);
    },

    completeVideoProgress: (lessonId) => {
        return axiosClient.post(`/lessons/${lessonId}/complete`);
    },

    getCurrentProgress: (lessonId) => {
        return axiosClient.get(`/lessons/${lessonId}/progress`);
    },

    create: (formData) => {
        return axiosClient.post('/courses', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    update: (id, formData) => {
        return axiosClient.put(`/courses/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    delete: (id) => {
        return axiosClient.delete(`/courses/${id}`);
    },

    searchCourses: (params) => {
        return axiosClient.get('/courses/search', {
            params
        });
    },

    pingStudyTime: (data) => {
        return axiosClient.post(`/students/ping`, data);
    },


    getAllCourses: () => {
        return axiosClient.get('/courses/all');
    }
};

export default courseApi;