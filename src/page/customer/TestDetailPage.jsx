import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import TestDetailHero from "../../components/sections/TestSetDetail/TestSetHero";
import TestListSection from "../../components/sections/TestSetDetail/TestList";

const TestDetailPage = () => {
    const location = useLocation();
    const data = location.state;

    // Xử lý khi không có data (F5 trang)
    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p>Dữ liệu không tồn tại. Vui lòng quay lại trang danh sách.</p>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden">

            {/* --- 1. GLOBAL BACKGROUND (Dùng chung cho cả trang) --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Nền Gradient Xanh Ngọc/Xanh Dương nhạt */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50"></div>

                {/* Blobs trang trí (Hiệu ứng trôi) */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-teal-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000"></div>

                {/* Họa tiết chấm bi mờ */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </div>

            {/* --- 2. NỘI DUNG CHÍNH (Nằm đè lên nền) --- */}
            <div className="relative z-10 pb-20"> {/* pb-20 để cách footer */}
                
                {/* Hero Section */}
                <TestDetailHero data={data} />
                
                {/* List Section */}
                <TestListSection tests={data.tests} coins={data.price} />
                
            </div>

        </div>
    );
};

export default TestDetailPage;