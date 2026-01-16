import { BookOpen, CheckCircle, Clock, Trophy, TrendingUp, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

// 1. Thêm hàm xử lý scroll mượt
const scrollToTests = () => {
    const element = document.getElementById('test-list');
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
const HeroSection = () => {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
           
            {/* --- FLOATING ELEMENTS (Giữ nguyên vị trí tuyệt đối) --- */}
            {/* 1. Góc Trên Trái */}
            <div className="hidden lg:flex absolute top-32 left-[10%] p-4 bg-white rounded-2xl shadow-xl shadow-green-100/50 animate-float-slow z-20">
                <div className="bg-green-100 p-3 rounded-xl">
                    <BookOpen size={32} className="text-green-600" />
                </div>
                <div className="ml-3">
                    <p className="font-bold text-slate-700">Kho đề chuẩn</p>
                    <p className="text-xs text-slate-500">Cập nhật liên tục</p>
                </div>
                <div className="absolute -top-3 -right-3 bg-green-500 text-white p-1 rounded-full shadow-sm">
                    <CheckCircle size={16} />
                </div>
            </div>

            {/* 2. Góc Trên Phải */}
            <div className="hidden lg:flex flex-col items-center absolute top-36 right-[12%] animate-float-delayed z-20">
                <div className="relative">
                    <Trophy size={64} className="text-yellow-400 drop-shadow-lg" />
                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
                        <TrendingUp size={24} className="text-green-500" />
                    </div>
                </div>
                <p className="mt-2 font-bold text-slate-700 bg-white/80 px-3 py-1 rounded-full shadow-sm">Bứt phá điểm số</p>
            </div>

            {/* 3. Góc Dưới Trái */}
            <div className="hidden md:flex absolute bottom-32 left-[15%] items-center gap-3 opacity-70 animate-float-slow z-20">
                <div className="bg-blue-100 p-3 rounded-full rotate-12">
                    <Clock size={28} className="text-blue-600" />
                </div>
                <div className="bg-orange-100 p-2 rounded-lg -rotate-6">
                    <Target size={24} className="text-orange-500" />
                </div>
            </div>

            {/* 4. Góc Dưới Phải */}
            <div className="hidden md:flex absolute bottom-40 right-[18%] bg-white p-3 rounded-2xl shadow-lg shadow-blue-100/50 items-center gap-2 animate-float-delayed z-20">
                <Award size={28} className="text-purple-500" />
                <span className="font-bold text-lg text-slate-700">TOEIC 800+</span>
            </div>

            {/* --- NỘI DUNG CHÍNH --- */}
            <motion.div
                className="relative z-30 max-w-4xl mx-auto px-4 text-center" // Tăng z-index để nổi lên trên các element bay
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {/* Tag nhỏ */}
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm text-green-700 text-sm font-semibold mb-6 border border-green-200 shadow-sm">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    Hệ thống chấm điểm tự động 24/7
                </motion.div>

                {/* Tiêu đề chính */}
                <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 drop-shadow-sm">
                    Luyện Đề Thực Chiến <br /> &
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-green-600 ml-2">
                        Bứt Phá Điểm Số
                    </span>
                </motion.h1>

                {/* Mô tả */}
                <motion.p variants={itemVariants} className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Bứt phá điểm số <strong>TOEIC & IELTS</strong> với kho đề thi khổng lồ, được cập nhật sát với cấu trúc đề thi thật qua các năm.
                    Trải nghiệm thi như thật và nhận kết quả chấm điểm tức thì.
                </motion.p>

                {/* Nút bấm */}
                <motion.div variants={itemVariants}>
                    <button onClick={scrollToTests} className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full font-bold text-lg shadow-xl shadow-green-500/30 transition-all hover:scale-105 hover:shadow-green-600/40 overflow-hidden cursor-pointer">
                        <span className="relative z-10 flex items-center gap-2">
                            Bắt đầu thi thử ngay
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 transition-all duration-300 group-hover:scale-150 group-hover:opacity-0"></div>
                    </button>
                </motion.div>

            </motion.div>
        </section>
    );
};

export default HeroSection;