import axiosClient from "./axiosClient";

const adminApi = {
    // TestSet Management
    getAllTestSets: () => {
        return axiosClient.get('/test-sets/all');
    },
    createTestSet: (data) => {
        return axiosClient.post('/test-sets', data);
    },
    updateTestSet: (id, data) => {
        return axiosClient.put(`/test-sets/${id}`, data);
    },

    // TOEIC Import
    importToeicExcel: (testSetId, title, file) => {
        const formData = new FormData();
        formData.append('testSetId', testSetId);
        formData.append('title', title);
        formData.append('file', file);
        return axiosClient.post('/api/admin/tests/import-excel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Test Management
    getAdminTest: (testId) => {
        return axiosClient.get(`/api/admin/tests/${testId}`);
    },

    // Media Uploads
    uploadQuestionAudio: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post(`/api/admin/questions/${id}/audio`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    uploadQuestionImage: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post(`/api/admin/questions/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    uploadGroupAudio: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post(`/api/admin/groups/${id}/audio`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    uploadGroupImage: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post(`/api/admin/groups/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Analytics
    getAdminSummary: () => {
        return axiosClient.get('/admins/analytics/summary');
    },
    getAdminRevenueChart: (params) => {
        return axiosClient.get('/admins/analytics/revenue-chart', { params });
    },
    getTeacherRankings: () => {
        return axiosClient.get('/admins/analytics/teacher-rankings');
    },
    getCourseRankings: () => {
        return axiosClient.get('/admins/analytics/course-rankings');
    },
    getAdminFiltersData: () => {
        return axiosClient.get('/admins/analytics/filters');
    },

    // User Management
    getUsers: (params) => {
        return axiosClient.get('/admins/users', { params });
    },
    getUserDetail: (id) => {
        return axiosClient.get(`/admins/users/${id}`);
    },
    blockUser: (id) => {
        return axiosClient.patch(`/admins/users/${id}/block`);
    },
    unblockUser: (id) => {
        return axiosClient.patch(`/admins/users/${id}/unblock`);
    },
};

export default adminApi;
