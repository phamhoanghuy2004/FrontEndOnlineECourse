import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { fadeInLeft, fadeInUp, fadeInRight, floatY } from '../../../../../constants/motionVariants';
import Button from '../../../../common/Button';
import Title from '../../../../common/Title';
import axiosClient from '../../../../../api/axiosClient';
import { toast } from 'react-toastify';

// 1. Thêm hàm xử lý scroll mượt
const scrollToCourses = () => {
    const element = document.getElementById('course-list');
    if (element) {
        // 1. Xác định khoảng cách muốn "lùi lại" (Chiều cao Navbar + khoảng thở)
        // Ví dụ: Navbar cao 80px, muốn hở thêm 20px thì để offset = 100
        const headerOffset = 60;

        // 2. Tính vị trí tuyệt đối của phần tử trong trang
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        // 3. Cuộn tới vị trí đã tính toán
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
};

const CourseHero = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const PLACEMENT_TEST_ID = '833713117646593268';

    // 💥 Hàm xử lý click Nhận gợi ý khóa học
    const handleGetInsights = async () => {
        setIsLoading(true);
        try {
            // 🟢 Thay URL gọi sang API kiểm tra trạng thái cực nhẹ này
            const response = await axiosClient.get('/students/placement-test-status');
            const { hasCompleted } = response.data; // Bốc cái cờ boolean ra

            if (hasCompleted) {
                // 1. NẾU ĐÃ CHỐT SỔ PLACEMENT TEST: Chuyển qua trang đề xuất
                console.log("User đã hoàn thành Placement Test. Chuyển hướng...");
                navigate(`/course-recommendations`); 
                toast.success("Đang tải lộ trình của bạn!");
            } else {
                // 2. NẾU CHƯA LÀM HOẶC LÀM DỞ DANG: Chuyển thẳng về lò luyện thi
                console.log("User chưa hoàn thành Placement Test. Chuyển hướng...");
                toast.info("Bạn cần hoàn thành bài test đầu vào để chúng tôi hiểu rõ năng lực nhé!");
                navigate(`/level-test`); 
            }

        } catch (error) {
            // Chỉ bắt lỗi Server hoặc Mạng ở đây
            console.error("Lỗi hệ thống khi kiểm tra trạng thái:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="pt-32 pb-20 bg-white overflow-hidden">
            <div className="container mx-auto px-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 items-center">

                    {/* --- LEFT COLUMN --- */}
                    {/* Giữ nguyên shadow-xl cho bên trái */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInLeft}
                        className="bg-[#EAF8F6] rounded-[40px] shadow-[0_0_40px_-10px_rgba(0,0,0,0.4)] p-10 md:p-14 lg:pr-20 flex flex-col justify-center items-center text-center relative overflow-hidden z-0 h-full w-full"
                    >

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10">
                            <Title
                                text="CÁC KHÓA HỌC TẠI ECHILL"
                                as="h1"
                                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
                                variants={fadeInUp} // Truyền hiệu ứng Fade In Up vào
                            />
                        </div>

                        <motion.div
                            variants={fadeInUp} 
                            initial="hidden"
                            animate="visible"
                            custom={0.4}
                            className="w-full"
                        >
                            <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-lg mx-auto relative z-10">
                                Khám phá hệ thống học tập thông minh, nơi lộ trình của bạn được cá nhân hóa hoàn toàn dựa trên kết quả bài test đầu vào.
                                Chúng tôi mang đến trải nghiệm đột phá với công nghệ luyện nói cùng AI.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center relative z-10">
                               {/* 💥 Gắn sự kiện onClick và trạng thái loading */}
                                <Button 
                                    onClick={handleGetInsights} 
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang phân tích...' : 'Nhận gợi ý khóa học'}
                                </Button>

                                <Button onClick={scrollToCourses} variant="outline" >
                                    Xem các khóa học ngay
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* --- RIGHT COLUMN --- */}
                    <motion.div
                        className="relative h-full w-full z-10 mt-8 lg:mt-0 lg:-ml-12"
                        variants={fadeInRight}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* WRAPPER TRẮNG VIỀN XANH: ĐÃ BỎ SHADOW */}
                        <div className="p-4 bg-white rounded-[50px] border border-primary h-full flex items-center justify-center">

                            {/* KHUNG NỀN ĐẶC MÀU XANH BÊN TRONG */}
                            <div className="w-full bg-[#4ADE80] rounded-[40px] relative overflow-hidden flex items-center justify-center p-8 min-h-[400px] lg:min-h-[500px]">

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/20 rounded-full blur-3xl"></div>

                                {/* HÌNH ẢNH */}
                                <motion.img
                                    animate={floatY.animate}
                                    transition={floatY.transition}
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Hero Student"
                                    className="w-[85%] object-cover rounded-[30px] relative z-10 shadow-lg"
                                />
                            </div>
                        </div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default CourseHero;