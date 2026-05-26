import axiosClient from "./axiosClient";

const personalizedTestApi = {
    generate: () => {
        return axiosClient.post('/quizzes/personalized/generate');
    },
};

export default personalizedTestApi;
