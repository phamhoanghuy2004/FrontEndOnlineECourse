import axiosClient from "./axiosClient";

const testResultService = {
    getMyTestHistory: (params) => {
        return axiosClient.get('/test-results/my-history', {
            params
        });
    },
    getRecentFullTestsForEstimation: () => {
        return axiosClient.get('/test-results/estimations/recent-full');
    }
};

export default testResultService;