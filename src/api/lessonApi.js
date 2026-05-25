import axiosClient from "./axiosClient";

const lessonApi = {
    create: (data) => {
        return axiosClient.post('/lessons', data);
    },

    update: (id, payload) => {
        return axiosClient.put(`/lessons/${id}`, payload);
    },

    getVideoUploadSignature: (lessonId) => {
        return axiosClient.get(`/lessons/generateVideoUploadSignature?lessonId=${lessonId}`);
    },
    
    saveVideoDraft: (lessonId, data) => {
        return axiosClient.put(`/lessons/${lessonId}/video-draft`, data);
    },

    uploadDocument: (lessonId, formData) => {
        return axiosClient.post(`/lessons/${lessonId}/documents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteDocument: (documentId) => {
        return axiosClient.delete(`/lessons/documents/${documentId}`);
    },

    getDocuments: (lessonId) => {
        return axiosClient.get(`/lessons/${lessonId}/documents`);
    },

    delete: (id) => {
        return axiosClient.delete(`/lessons/${id}`);
    },

    getDocumentDetail: (documentId) => {
        return axiosClient.get(`/lessons/documents/${documentId}`);
    },

    chatWithDocument: (documentId, question) => {
        return axiosClient.post(`/lessons/documents/${documentId}/chat`, { question });
    },

    chatWithLesson: (lessonId, question) => {
        return axiosClient.post(`/lessons/${lessonId}/chat`, { question });
    },
};

export default lessonApi;
