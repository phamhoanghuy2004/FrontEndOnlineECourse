import axiosClient from "./axiosClient";

const lessonApi = {
    create: (data) => {
        return axiosClient.post('/lessons', data);
    },

    getVideoUploadSignature: (lessonId) => {
        return axiosClient.get(`/lessons/generateVideoUploadSignature?lessonId=${lessonId}`);
    },
    
    saveVideoDraft: (lessonId, data) => {
        return axiosClient.put(`/lessons/${lessonId}/video-draft`, data);
    }
  
};

export default lessonApi;
