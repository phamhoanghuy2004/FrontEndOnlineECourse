import axiosClient from "./axiosClient";

const studyAnalyticsApi = {
    /**
     * Lấy tổng số giây học trong tuần hiện tại (Từ 0h Thứ 2 -> 23h59 Chủ Nhật)
     */
    getWeeklyStudySeconds: () => {
        return axiosClient.get(`/students/weekly-seconds`);
    },

    /**
     * Lấy số lượng bài học (video/quiz) đã hoàn thành trong tuần hiện tại
     */
    getWeeklyCompletedLessons: () => {
        return axiosClient.get(`/lessons/weekly-completed-lessons`);
    },

    /**
     * Lấy số lượng bài test đã hoàn thành trong tuần hiện tại
     */
    getWeeklyCompletedTests: () => {
        return axiosClient.get(`/lessons/weekly-completed-tests`);
    },

    getRecentCourse: () => {
        return axiosClient.get(`/enrollments/recent-course`);
    },

    claimWeeklyReward: () => {
        return axiosClient.post(`/payments/weekly/claim`);
    },

    getMonthlyActivity: (year, month) => {
        return axiosClient.get(`/students/monthly-activity`, { params: { year, month } });
    },

};

export default studyAnalyticsApi;