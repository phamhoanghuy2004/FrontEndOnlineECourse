import React from 'react';
import ChatManager from '../../../components/common/chat/ChatManager';

const LearnerChatPage = () => {
    return (
        <ChatManager 
            sidebarTitle="Tin nhắn"
            searchPlaceholder="Tìm kiếm..."
            emptyStateMessage="Chọn một cuộc trò chuyện để bắt đầu"
            otherRoleBadge="TEACHER"
            heightClass="h-[calc(100vh-140px)]"
        />
    );
};

export default LearnerChatPage;