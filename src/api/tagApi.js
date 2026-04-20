import axiosClient from "./axiosClient";

const tagApi = {
    getAll: () => {
        return axiosClient.get(`/tags`);
    }
};

export default tagApi;