import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaStar, FaShieldAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import defaultCoverImg from '../../../../../assets/ToeicTestSet.jpg';

// --- ANIMATION VARIANTS ---
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } }
};

const floatingIcon = {
    animate: {
        y: [0, -15, 0],
        rotate: [0, 10, -10, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
};

const TestDetailHero = ({ data }) => {
    if (!data) return null;
    
    // Tự động chia tiêu đề ra làm 2 phần để render màu khác nhau (VD: "ETS" và "2024")
    const title = data.title || "ETS 2024";
    const titleList = title.split(" ");
    const firstPart = titleList[0];
    const secondPart = titleList.slice(1).join(" ");

    // 🟢 Ảnh mặc định hiển thị nếu Backend chưa có trường image cho TestSet
    const DEFAULT_COVER = defaultCoverImg; // Bạn có thể đổi URL ảnh khác hoặc đường dẫn local '/images/default-ets.png'

    // Hàm cuộn xuống danh sách
    const scrollToTestList = () => {
        const element = document.getElementById('test-list-section');
        if (element) {
            const headerOffset = 80; 
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="relative w-full h-screen flex items-center justify-center bg-transparent overflow-hidden">
            <div className="container mx-auto px-6 pt-20 relative z-10">
                <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-12 lg:gap-24">
                    
                    {/* --- CỘT TRÁI: TEXT --- */}
                    <motion.div 
                        className="flex-1 text-center md:text-left space-y-8 max-w-xl md:pl-10 lg:pl-20"
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                    >
                        {/* Tiêu đề */}
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight leading-[1.1]">
                            {firstPart} <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                                {secondPart}
                            </span>
                        </motion.h1>

                        {/* Mô tả từ DB */}
                        <motion.p variants={fadeInUp} className="text-slate-600 text-base md:text-lg leading-relaxed text-justify md:pr-10">
                            {data.description || "Bộ đề thi được cập nhật mới nhất, bám sát cấu trúc thực tế. Giúp bạn rèn luyện kỹ năng làm bài, tối ưu hóa thời gian và bứt phá điểm số."}
                        </motion.p>

                        {/* Button CTA */}
                        <motion.div variants={fadeInUp} className="flex justify-center md:justify-start pt-4">
                            <button onClick={scrollToTestList} className="group relative bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-emerald-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3">
                                <span className="text-lg">Làm đề ngay</span>
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* --- CỘT PHẢI: HÌNH ẢNH --- */}
                    <motion.div 
                        className="flex-1 w-full relative flex justify-center items-center"
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp}
                    >
                        {/* Icons Trang trí */}
                        <motion.div variants={floatingIcon} animate="animate" className="absolute -top-12 -left-8 md:top-0 md:-left-12 z-20 text-yellow-400 bg-white p-4 rounded-2xl shadow-xl"><FaStar size={32} /></motion.div>
                        <motion.div variants={floatingIcon} animate="animate" transition={{ delay: 1 }} className="absolute -bottom-8 right-0 md:bottom-10 md:-right-8 z-20 text-emerald-500 bg-white p-4 rounded-2xl shadow-xl"><FaShieldAlt size={28} /></motion.div>
                        <motion.div variants={floatingIcon} animate="animate" transition={{ delay: 0.5 }} className="absolute top-10 right-10 md:-top-10 md:right-20 z-0 text-blue-400 opacity-80"><HiSparkles size={48} /></motion.div>

                        {/* Khung Ảnh */}
                        <div className="relative w-[80vw] max-w-[400px] md:max-w-[500px] aspect-square">
                            <div className="absolute inset-0 bg-emerald-400 rounded-[3rem] rotate-6 opacity-20 blur-sm scale-105"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[3rem] shadow-2xl rotate-3 group-hover:rotate-2 transition-all duration-500"></div>
                            
                            {/* Glass Effect Container */}
                            <div className="absolute inset-2 bg-white/20 backdrop-blur-md border border-white/40 rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                                <img 
                                    src={data.image || DEFAULT_COVER} 
                                    alt={title} 
                                    className="h-full w-auto object-cover drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-700 rounded-2xl" 
                                />
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent opacity-50 pointer-events-none"></div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default TestDetailHero;