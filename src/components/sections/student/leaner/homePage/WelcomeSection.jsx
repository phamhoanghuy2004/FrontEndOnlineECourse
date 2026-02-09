import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../../hooks/useAuth';
import SectionHeader from '../../../../common/SectionHeader';


const WelcomeSection = () => {
    // Lấy thông tin user từ Context
    const { user } = useAuth();

    // Tạo nội dung Title tùy chỉnh 
    const titleContent = `Xin chào ${user?.fullName || "bạn"} 👋`;

    return (
        <div className="pl-4 md:pl-8 border-l-4 border-emerald-500">
            <SectionHeader
                title={titleContent}
                description='Hôm nay là một ngày tuyệt vời để chinh phục tiếng Anh!'
                align='left'
                titleClassName="!text-emerald-600"
            />
        </div>
    );
};

export default WelcomeSection;