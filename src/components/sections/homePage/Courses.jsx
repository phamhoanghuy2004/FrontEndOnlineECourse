import { courses } from "../../../data/mockData";
import { FaStar } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
// Import Animation Library
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// --- CONFIG ANIMATION ---
const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Thời gian trễ giữa các từ
            delayChildren: 0.2,
        },
    },
};

const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' }, // Trạng thái ẩn: Mờ + nằm thấp
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)', // Trạng thái hiện: Rõ nét + về vị trí cũ
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
            delay: 1.2, // Đợi 1.2s (cho tiêu đề chạy xong) mới hiện mô tả
            duration: 0.8,
            ease: "easeOut"
        },
    },
};

const Courses = () => {
    // Nhân đôi data để demo slide
    const sliderData = [...courses, ...courses];

    // Tách tiêu đề thành mảng các từ
    const titleWords = "Chinh phục tiếng Anh với các khóa học chuyên sâu".split(" ");

    return (
        <section id="courses" className="py-20 bg-white">
            <div className="container mx-auto px-6">

                {/* --- HEADER SECTION VỚI ANIMATION --- */}
                <div className="text-center mb-12 px-4">

                    {/* 1. Badge Animation (Fade in + Scale) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-block"
                    >
                        <span className="text-primary font-bold uppercase text-sm tracking-wider bg-green-50 px-3 py-1 rounded-full">
                            Khóa học nổi bật
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
                                className="inline-block mr-2" // inline-block để transform hoạt động tốt
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h2>

                    {/* 3. Description Animation (Hiện sau cùng) */}
                    <motion.p
                        variants={descVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-gray-500 mt-4 max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                    >
                        Được biên soạn bởi đội ngũ giảng viên giàu kinh nghiệm, lộ trình học tập tinh gọn giúp bạn đạt mục tiêu điểm số và kỹ năng trong thời gian ngắn nhất.
                    </motion.p>
                </div>

                {/* --- SWIPER CAROUSEL (Giữ nguyên) --- */}
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={32}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="pb-12"
                >
                    {sliderData.map((course, index) => (
                        <SwiperSlide key={`${course.id}-${index}`} className="py-4 pl-1">

                            {/* Course Card Design */}
                            <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">

                                {/* IMAGE AREA */}
                                <div className="relative overflow-hidden h-56 flex-shrink-0">
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded text-xs font-bold text-gray-700 shadow-sm uppercase tracking-wide">
                                        {course.level}
                                    </span>
                                </div>

                                {/* CONTENT AREA */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <span className="text-primary font-bold text-xs uppercase mb-2 block tracking-wide">{course.tag}</span>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 pr-4">{course.title}</h3>
                                        <FiArrowUpRight className="text-2xl text-gray-900 group-hover:text-primary transition-colors flex-shrink-0" />
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{course.description}</p>

                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="text-primary font-bold text-sm">{course.rating}</span>
                                        <div className="flex text-yellow-400 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-300"} />
                                            ))}
                                        </div>
                                        <span className="text-gray-400 text-xs">({course.reviewCount})</span>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <img src={course.avatarGV} alt={course.tutor} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                                <div>
                                                    <h4 className="font-bold text-sm text-gray-900">{course.tutor}</h4>
                                                    <p className="text-xs text-gray-500">{course.students} người học</p>
                                                </div>
                                            </div>
                                            <span className="text-xl font-bold text-primary">{course.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Button Khám phá tất cả */}
                <div className="mt-8 text-center">
                    <button className="px-8 py-3 rounded-full border border-gray-300 font-bold text-gray-700 hover:border-primary hover:text-primary hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1">
                        Khám phá tất cả
                    </button>
                </div>

            </div>
        </section>
    );
};

export default Courses;