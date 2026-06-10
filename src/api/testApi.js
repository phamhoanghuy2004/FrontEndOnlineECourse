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

    uploadQuestionAudio: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post(`/quizzes/questions/${id}/audio`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    uploadQuestionImage: (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post(`/quizzes/questions/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    getRandomTest: (testSetId, testId = null, selectedParts = null) => {
        return axiosClient.get(`/quizzes/test-set/practice/${testSetId}`, {
            params: {
                testId: testId,
                selectedParts: selectedParts 
            }
        });
    },

    submitTest: (sessionId, userAnswers) => {
        return axiosClient.post(`/quizzes/submit`, {
            sessionId: sessionId,
            answers: userAnswers // Đổi key thành 'answers' cho khớp DTO
        });
    },

    getTestReviewDetails: (id) => {
        return axiosClient.get(`/quizzes/results/${id}/review`);
    },

    getRecommendations: () => {
        return axiosClient.get(`/test-sets/recommendations`);
    },

    getAllTestSets: (params) => {
        return axiosClient.get(`/test-sets`, {
            params: params
        });
    },

    getAllowedTestTypes: () => {
        return axiosClient.get(`/test-sets/types`);
    },

    getTestSetDetail: (testSetId) => {
        return axiosClient.get(`/test-sets/${testSetId}`);
    },

    getTestSections: (testId) => {
        return axiosClient.get(`/quizzes/${testId}/sections`);
    },

    chatWithQuestion: (questionId, questionText) => {
        return axiosClient.post(`/quizzes/questions/${questionId}/chat`, {
            question: questionText
        });
    }
};

export default testApi;