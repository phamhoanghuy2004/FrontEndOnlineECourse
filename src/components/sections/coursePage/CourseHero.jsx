import React from 'react';
import { motion } from 'framer-motion';

// --- CONFIG ANIMATION ---
const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
    visible: {
        opacity: 1, y: 0, filter: 'blur(0px)',
        transition: { type: "spring", stiffness: 100, damping: 10 },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1, y: 0,
        transition: { delay: 1.0, duration: 0.8, ease: "easeOut" }
    },
};

const rightColumnEntryVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1, x: 0,
        transition: { delay: 0.5, duration: 1, ease: "easeOut" }
    },
};

const floatingAnimation = {
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

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
    return (
        <section className="pt-32 pb-20 bg-white overflow-hidden">
            <div className="container mx-auto px-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 items-center">

                    {/* --- LEFT COLUMN --- */}
                    {/* Giữ nguyên shadow-xl cho bên trái */}
                    <div className="bg-[#EAF8F6] rounded-[40px] shadow-[0_0_40px_-10px_rgba(0,0,0,0.4)] p-10 md:p-14 lg:pr-20 flex flex-col justify-center items-center text-center relative overflow-hidden z-0 h-full w-full">

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={textContainerVariants}
                            className="relative z-10"
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                <span className="block mb-2">
                                    <motion.span variants={wordVariants} className="inline-block mr-3">CÁC</motion.span>
                                    <span className="text-primary inline-flex gap-3 flex-wrap justify-center">
                                        {"KHÓA HỌC".split(" ").map((word, i) => (
                                            <motion.span key={i} variants={wordVariants} className="inline-block">{word}</motion.span>
                                        ))}
                                    </span>
                                </span>
                                <span className="block">
                                    <motion.span variants={wordVariants} className="inline-block mr-3">TẠI</motion.span>
                                    <motion.span variants={wordVariants} className="text-primary inline-block">ECHILL</motion.span>
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="w-full"
                        >
                            <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-lg mx-auto relative z-10">
                                Khám phá hệ thống học tập thông minh, nơi lộ trình của bạn được cá nhân hóa hoàn toàn dựa trên kết quả bài test đầu vào.
                                Chúng tôi mang đến trải nghiệm đột phá với công nghệ luyện nói cùng AI.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center relative z-10">
                                <button className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/30 hover:bg-green-600 transition-all transform hover:-translate-y-1">
                                    Nhận gợi ý khóa học
                                </button>
                                <button onClick={scrollToCourses} className="bg-white text-primary px-8 py-4 rounded-full font-bold shadow-sm hover:shadow-md hover:bg-gray-50 transition-all transform hover:-translate-y-1">
                                    Xem các khóa học ngay
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <motion.div
                        className="relative h-full w-full z-10 mt-8 lg:mt-0 lg:-ml-12"
                        variants={rightColumnEntryVariants}
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
                                    animate={floatingAnimation}
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