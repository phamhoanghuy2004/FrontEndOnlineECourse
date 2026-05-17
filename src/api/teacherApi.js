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
    getTopCoursesDetail: (fromDate, toDate) => {
        return axiosClient.get('/teachers/analytics/top-courses/detail', {
            params: { fromDate, toDate }
        });
    },
    getMyCoursesBasic: () => {
        return axiosClient.get('/teachers/analytics/my-courses-basic');
    },
    getAllTeachers: () => {
        return axiosClient.get('/teachers/all');
    },
    getRandomTeachers: () => {
        return axiosClient.get('/teachers/random');
    }
};

export default teacherApi;
