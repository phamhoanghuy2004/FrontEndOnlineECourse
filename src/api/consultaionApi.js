import axiosClient from "./axiosClient";

const consultaionApi = {
    submitRequest: (data) => {
        return axiosClient.post(`/consultations/submit`, data);
    },
    claim: (id) => {
        return axiosClient.patch(`/consultations/${id}/claim`);
    },
    complete: (id) => {
        return axiosClient.patch(`/consultations/${id}/complete`);
    },
    getAll: (data) => {
        return axiosClient.get(`/consultations`, {
            params: data
        });
    }
};

export default consultaionApi;