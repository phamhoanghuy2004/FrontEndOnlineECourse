import axiosClient from "./axiosClient";

const courseApi = {
    getAllByTeacher: () => {
        return axiosClient.get('/courses/teacher');
    },

    getById: (id) => {
        return axiosClient.get(`/courses/${id}`);
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
        return axiosClient.get('/courses/search', { params });
    },
};

export default courseApi;
