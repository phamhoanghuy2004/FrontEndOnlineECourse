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
  
};

export default lessonApi;
