import axiosClient from './axiosClient';

const chatApi = {
    /**
     * Lấy danh sách conversations của user.
     * Student: xem danh sách giáo viên đã từng chat.
     * Teacher: xem danh sách học viên đang chat.
     */
    getConversations: (userId) =>
        axiosClient.get(`/conversations/${userId}`),

    /**
     * Lấy tin nhắn của conversation (pagination, mới nhất trước).
     */
    getMessages: (conversationId, page = 0, size = 20) =>
        axiosClient.get(`/messages/${conversationId}`, { params: { page, size } }),

    /**
     * Teacher click icon chat → tạo hoặc lấy conversation 1-1.
     */
    createOrGetConversation: (teacherId, studentId) =>
        axiosClient.post('/conversations/create-or-get', { teacherId, studentId }),

    /**
     * Đánh dấu đã xem toàn bộ tin nhắn.
     */
    markSeen: (conversationId) =>
        axiosClient.post(`/conversations/${conversationId}/seen`),
};

export default chatApi;
