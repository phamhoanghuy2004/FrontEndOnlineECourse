import axiosClient from "./axiosClient";

const testResultService = {
    getMyTestHistory: (params) => {
        return axiosClient.get('/test-results/my-history', {
            params
        });
    }
};

export default testResultService;