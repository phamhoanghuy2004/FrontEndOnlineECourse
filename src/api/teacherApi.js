import axiosClient from "./axiosClient";

const teacherApi = {
    getSummary: (courseId) => {
        return axiosClient.get('/teachers/analytics/summary', {
            params: { courseId }
        });
    },
    getRevenueChart: (courseId, period) => {
        return axiosClient.get('/teachers/analytics/revenue-chart', {
            params: { courseId, period }
        });
    },
    getTopCourses: () => {
        return axiosClient.get('/teachers/analytics/top-courses');
    },
    getMyCoursesBasic: () => {
        return axiosClient.get('/teachers/analytics/my-courses-basic');
    }
};

export default teacherApi;
