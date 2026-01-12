// 1. Import Swiper & Icons
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { FaTwitter, FaLinkedinIn } from "react-icons/fa"; // Icon mạng xã hội
import { instructors } from "../../../data/mockData";

// Import Animation Library
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';

// --- CONFIG ANIMATION ---
const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
        },
    },
};

const descVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 1.0, // Hiện sau tiêu đề 1s
            duration: 0.8,
            ease: "easeOut"
        },
    },
};

const Instructors = () => {
    // Tách tiêu đề thành mảng
    const titleWords = "Gặp gỡ những chuyên gia hàng đầu".split(" ");

    return (
        <section className="py-24 bg-gray-50/50">
            <div className="container mx-auto px-6">

                {/* --- HEADER SECTION VỚI ANIMATION --- */}
                <div className="text-center mb-16 max-w-4xl mx-auto">

                    {/* 1. Badge Animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-block"
                    >
                        <span className="text-primary font-bold uppercase text-sm tracking-wider bg-green-50 px-3 py-1 rounded-full">
                            Đội ngũ giảng viên
                        </span>
                    </motion.div>

                    {/* 2. Title Animation (Chạy từng từ) */}
                    <motion.h2
                        variants={titleContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        className="text-3xl md:text-4xl font-bold mt-3 text-gray-900 leading-snug"
                    >
                        {titleWords.map((word, index) => (
                            <motion.span
                                key={index}
                                variants={wordVariants}
                                className="inline-block mr-2"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h2>

                    {/* 3. Description Animation */}
                    <motion.p
                        variants={descVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-gray-500 mt-4 text-base md:text-lg leading-relaxed"
                    >
                        Quy tụ những giáo viên sở hữu chứng chỉ quốc tế (TESOL, IELTS 8.0+) với nhiều năm kinh nghiệm thực chiến, sẵn sàng đồng hành cùng bạn chinh phục mọi mục tiêu.
                    </motion.p>
                </div>

                {/* Swiper Slider (Giữ nguyên) */}
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={32}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 }, // PC hiện 4 giảng viên
                    }}
                    className="pb-16"
                >
                    {instructors.map((item) => (
                        <SwiperSlide key={item.id} className="pt-4 px-1 pb-4">
                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group text-center border border-gray-100 h-full flex flex-col items-center">

                                {/* Avatar Image */}
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-full p-1 border-2 border-dashed border-primary/30 group-hover:border-primary transition-colors duration-300">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-6 h-6 bg-primary text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                        ✓
                                    </span>
                                </div>

                                {/* Info */}
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                    {item.name}
                                </h3>
                                <span className="text-primary font-bold text-sm mt-1 block">
                                    {item.qualification}
                                </span>

                                <p className="text-gray-500 text-sm mt-4 mb-6 leading-relaxed">
                                    {item.bio}
                                </p>

                                {/* Social Icons */}
                                <div className="mt-auto flex gap-4 justify-center">
                                    <a href={item.social.twitter} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
                                        <FaTwitter />
                                    </a>
                                    <a href={item.social.linkedin} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-blue-700 hover:text-white transition-all duration-300">
                                        <FaLinkedinIn />
                                    </a>
                                </div>

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>
        </section>
    );
};

export default Instructors;