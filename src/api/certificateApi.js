import axiosClient from "./axiosClient";

const certificateApi = {
    getMyCertificates: () => {
        return axiosClient.get("/certificates/my");
    },
    
    createCertificate: (formData) => {
        return axiosClient.post("/certificates", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    
    updateCertificate: (id, formData) => {
        return axiosClient.put(`/certificates/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    
    deleteCertificate: (id) => {
        return axiosClient.delete(`/certificates/${id}`);
    },

    getTopToeicCertificates: () => {
        return axiosClient.get("/certificates/top-toeic");
    },
};

export default certificateApi;
