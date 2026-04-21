import axiosClient from './axiosClient'; // Import instance axios của bạn vào đây

const courseRecommendApi = {
    /**
     * 1. Lấy Phân tích kỹ năng từ bài test gần nhất
     * Trả về DTO: SkillInsightResponse
     */
    getSkillInsights: () => {
        const url = '/users/skills/insights'; // Thay đổi URL này cho khớp với Backend của bạn

        return axiosClient.get(url, {
            params: {
                group: "ENGLISH_TOEIC"
            }
        });
    },

    /**
     * 2. Lấy Danh sách Lộ trình Khóa học đề xuất (Từ Elasticsearch)
     * Trả về List: CourseCardResponse
     */
    getRecommendedCourses: () => {
        const url = '/courses/recommendations/combo-path'; // Thay đổi URL này cho khớp với Backend của bạn
        return axiosClient.get(url);
    }
};

export default courseRecommendApi;