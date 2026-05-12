import axiosClient from "./axiosClient";

const reviewApi = {
    getFeaturedReviewsApi: () => {
        return axiosClient.get('/reviews/featured');
    },

    getCourseReviewsApi: (courseId) => {
        return axiosClient.get(`/reviews/course/${courseId}`);
    },

    createOrUpdateReviewApi: (data) => {
        return axiosClient.post('/reviews', data);
    },

    getMyReviewByCourseApi: (courseId) => {
        return axiosClient.get(`/reviews/my-review/${courseId}`);
    }
};

export default reviewApi;
