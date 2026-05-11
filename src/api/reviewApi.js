import axiosClient from "./axiosClient";

const reviewApi = {
    submitReview: (data) => {
        return axiosClient.post('/reviews', data);
    },

    getMyReview: (courseId) => {
        return axiosClient.get(`/reviews/my-review/${courseId}`);
    },

    getCourseReviews: (courseId) => {
        return axiosClient.get(`/reviews/course/${courseId}`);
    },

    getPaginatedCourseReviews: (courseId, page = 1, size = 5) => {
        return axiosClient.get(`/reviews/course/${courseId}/paginated`, {
            params: { page, size }
        });
    }
};

export default reviewApi;
