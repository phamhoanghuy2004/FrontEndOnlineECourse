import React from 'react';
import ChatManager from '../../components/common/chat/ChatManager';

const TeacherChatPage = () => {
    return (
        <ChatManager 
            sidebarTitle="Hội thoại"
            searchPlaceholder="Tìm học viên..."
            emptyStateMessage="Chọn một học viên để bắt đầu hỗ trợ"
            otherRoleBadge="STUDENT"
            heightClass="h-[calc(100vh-180px)]"
        />
    );
};

export default TeacherChatPage;
