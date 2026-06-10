import React, { useState, useEffect } from "react";
import Title from "../../../../common/Title";
import { fadeInUp } from "../../../../../constants/motionVariants";
import Button from "../../../../common/Button";
import testApi from "../../../../../api/testApi"; // 🔴 Nhớ check lại đường dẫn import cho đúng dự án của bạn nhé
import { FaBookOpen } from "react-icons/fa"; // Thêm icon cho đẹp
import { useNavigate } from "react-router-dom";

const Recommended = () => {
    // 1. Khởi tạo State lưu danh sách bộ đề
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 2. Gọi API khi Component vừa mount
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await testApi.getRecommendations();
                // Tùy cấu trúc axios của bạn, thường ApiResponse của Spring Boot sẽ nằm trong response.data.data
                const data = response.data || [];
                setRecommendations(data);
            } catch (error) {
                console.error("Lỗi khi lấy đề xuất:", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <section className="mt-8">
            <Title
                text="Đề xuất cho bạn"
                className="!text-xl font-bold !text-slate-800 mb-4 px-1"
                variants={fadeInUp}
            />

            {/* Trạng thái Loading */}
            {isLoading && (
                <div className="animate-pulse bg-slate-200 rounded-[2rem] h-32 w-full"></div>
            )}

            {/* Trạng thái không có đề xuất nào */}
            {!isLoading && recommendations.length === 0 && (
                <div className="text-center text-slate-500 py-6 bg-slate-50 rounded-2xl border border-slate-100">
                    Hiện chưa có bộ đề xuất nào cho năm nay.
                </div>
            )}

            {/* 🔴 Render List Đề Xuất (Dùng CSS Grid) */}
            {!isLoading && recommendations.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((item, index) => {
                        // Phối màu xen kẽ cho đẹp: Card đầu tiên màu tím Gradient nổi bật, các card sau màu xanh nhạt
                        const isFirst = index === 0;

                        return (
                            <div 
                                key={item.id} 
                                onClick={() => navigate(`/tests/${item.id}`)}
                                className={`cursor-pointer rounded-[2rem] p-6 relative overflow-hidden shadow-lg transition-transform hover:-translate-y-1 ${
                                    isFirst 
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" 
                                        : "bg-white border border-slate-100 text-slate-800"
                                }`}
                            >
                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Header: Title + Badge */}
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <h4 className={`text-lg md:text-xl font-bold line-clamp-2 ${!isFirst && 'text-slate-800'}`}>
                                            {item.title}
                                        </h4>
                                        <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                                            isFirst ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                                        }`}>
                                            <FaBookOpen /> {item.totalTests} Tests
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className={`text-sm mb-4 line-clamp-2 ${isFirst ? 'opacity-90' : 'text-slate-500'}`}>
                                        {item.description}
                                    </p>

                                    {/* Footer: Button (Đẩy button xuống đáy card bằng mt-auto) */}
                                    <div className="mt-auto pt-2">
                                        <Button variant={isFirst ? "secondary" : "primary"} className="!py-2 !text-sm"> 
                                            Thử ngay 
                                        </Button>
                                    </div>
                                </div>

                                {/* Decor circle (Chỉ giữ cho card đầu tiên cho đỡ rối mắt) */}
                                {isFirst && (
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default Recommended;