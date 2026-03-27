import axiosClient from "./axiosClient";

const lessonApi = {
    create: (data) => {
        return axiosClient.post('/lessons', data);
    },

    update: (lessonId, data) => {
        return axiosClient.put(`/lessons/${lessonId}`, data);
    },

    getVideoUploadSignature: () => {
        return axiosClient.get('/lessons/generateVideoUploadSignature');
    },
    
    saveVideoDraft: (lessonId, data) => {
        return axiosClient.put(`/lessons/${lessonId}/video-draft`, data);
    },

    uploadDocument: (lessonId, data) => {
        return axiosClient.post(`/lessons/${lessonId}/documents`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    deleteDocument: (documentId) => {
        return axiosClient.delete(`/lessons/documents/${documentId}`);
    }
  
};

export default lessonApi;
