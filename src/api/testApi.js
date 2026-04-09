import axiosClient from "./axiosClient";

const testApi = {
    createTestSet: (data) => {
        return axiosClient.post('/test-sets', data);
    },

    getTestSetByLessonId: (lessonId) => {
        return axiosClient.get(`/test-sets/lesson/${lessonId}`);
    },

    getTestSetWithHistory: (id) => {
        return axiosClient.get(`/test-sets/${id}/history`);
    },

    createTest: (formData) => {
        const url = '/quizzes';
        return axiosClient.post(url, formData, {
            headers: {
                'Content-Type': undefined,
            },
        });
    },

    getTestsByTestSetId: (testSetId) => {
        return axiosClient.get(`/quizzes/test-set/${testSetId}`);
    },

    deleteTest: (id) => {
        return axiosClient.delete(`/quizzes/${id}`);
    },
};

export default testApi;
