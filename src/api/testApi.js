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

    updateTestSet: (id, data) => {
        return axiosClient.put(`/test-sets/${id}`, data);
    },

    getTestById: (id) => {
        return axiosClient.get(`/quizzes/${id}`);
    },

    updateTestInfo: (id, data) => {
        return axiosClient.put(`/quizzes/${id}`, data);
    },

    updateQuestion: (questionId, data) => {
        return axiosClient.put(`/quizzes/questions/${questionId}`, data);
    },

    getRandomTest: (testSetId) => {
        return axiosClient.get(`/quizzes/test-set/practice/${testSetId}`);
    },

    submitTest: (sessionId, userAnswers) => {
        return axiosClient.post(`/quizzes/submit`, {sessionId, userAnswers});
    },
    
    submitTest: (sessionId, userAnswers) => {
        return axiosClient.post(`/quizzes/submit`, {
            sessionId: sessionId, 
            answers: userAnswers // Đổi key thành 'answers' cho khớp DTO
        });
    }
    
};

export default testApi;
