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

    getPaginatedCourseReviews: (courseId, page = 1, size = 5) => {
        return axiosClient.get(`/reviews/course/${courseId}/paginated`, {
            params: {
                page,
                size
            }
        });
    },

    getMyReviewByCourseApi: (courseId) => {
        return axiosClient.get(`/reviews/my-review/${courseId}`);
    }
};

export default reviewApi;
