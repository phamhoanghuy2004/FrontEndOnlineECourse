import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhoneAlt, FaBookOpen, FaCalendarAlt, FaPaperPlane, FaCommentDots } from "react-icons/fa";
import { useChat } from '../../../context/ChatContext';

const ConsultationSection = () => {
    // ... (Giữ nguyên các biến animation)
    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const { openChat } = useChat();

    return (
        <section className="min-h-screen flex items-center justify-center bg-white pt-24 pb-10 relative overflow-hidden font-sans">
            
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
                 <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-10 left-[-50px] w-80 h-80 bg-emerald-100 rounded-full blur-3xl"
                 />
                 <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-10 right-[-50px] w-80 h-80 bg-blue-100 rounded-full blur-3xl"
                 />
            </div>

            <motion.div 
                className="container mx-auto px-4 relative z-10 max-w-6xl"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                
                {/* --- CARD LỚN BAO QUANH (CẬP NHẬT TẠI ĐÂY) --- */}
                {/* 1. Thay border đơn sắc bằng ring/shadow gradient */}
                {/* 2. Tăng shadow-2xl và shadow màu emerald */}
                <div className="relative bg-[#EAF8F6]/80 backdrop-blur-sm rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-emerald-200/50 overflow-hidden group/card">
                    
                    {/* Viền Gradient giả lập bằng thẻ div tuyệt đối */}
                    <div className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent bg-gradient-to-br from-emerald-200 to-blue-200 opacity-50 pointer-events-none" style={{ maskImage: 'linear-gradient(white, white)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}></div>
                    
                    {/* Hiệu ứng viền sáng khi hover */}
                    <div className="absolute -inset-[1px] rounded-[2.5rem] bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover/card:opacity-20 transition-opacity duration-500 blur-sm -z-10"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
                        
                        {/* --- CỘT TRÁI: TEXT & ẢNH --- */}
                        <motion.div variants={fadeInUp} className="space-y-6 text-center md:text-left">
                            {/* ... (Nội dung cột trái giữ nguyên) ... */}
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight">
                                    Tư Vấn <span className="text-emerald-600">Lộ Trình</span> <br/> Cá Nhân Hóa
                                </h2>
                                <p className="text-slate-600 text-sm md:text-base mt-3 max-w-md mx-auto md:mx-0">
                                    Điền thông tin để AI & Chuyên gia của chúng tôi thiết kế lộ trình học tối ưu nhất cho riêng bạn.
                                </p>
                            </div>

                            <div className="relative mx-auto md:mx-0 w-full max-w-[320px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-500">
                                <img 
                                    src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/621803710_2644725762569066_2621574424509650799_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=6YR1qBFzAHcQ7kNvwHTok1V&_nc_oc=AdlOCPHpPRQjhjr1ZDWY_1hRcax2oUfum1ant7U6IrEh1CJzthDJsQw72Va7cfTZsrw&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=ja9G-N7UzZcKUQyE0f2qvA&oh=00_AfoZAEQEXXmCPIJLoAtPSBx8mLN1WQKBED8mQqL9Kp7aKg&oe=697A58A5" 
                                    alt="Consultation" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>

                            <div className="flex justify-center md:justify-start pt-2">
                                <button onClick={openChat} className="group flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-emerald-100 hover:border-emerald-400 hover:shadow-emerald-200 transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-emerald-600 transition-colors">
                                        Chat ngay với tư vấn viên
                                    </span>
                                    <FaCommentDots className="text-emerald-500 text-lg group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </motion.div>


                        {/* --- CỘT PHẢI: FORM (Nổi bật hơn nữa) --- */}
                        <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_-12px_rgba(16,185,129,0.2)] border border-gray-100 relative">
                            {/* ... (Nội dung Form giữ nguyên) ... */}
                            <div className="mb-5">
                                <h3 className="text-xl font-bold text-gray-800">Thông tin liên hệ</h3>
                                <div className="h-1 w-10 bg-emerald-500 rounded-full mt-1"></div>
                            </div>

                            <form className="space-y-3">
                                <div className="relative group">
                                    <FaUser className="absolute top-3.5 left-4 text-gray-400 text-sm group-focus-within:text-emerald-500 transition-colors" />
                                    <input type="text" placeholder="Họ và tên" className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                                </div>
                                <div className="relative group">
                                    <FaEnvelope className="absolute top-3.5 left-4 text-gray-400 text-sm group-focus-within:text-emerald-500 transition-colors" />
                                    <input type="email" placeholder="Email của bạn" className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative group">
                                        <FaPhoneAlt className="absolute top-3.5 left-4 text-gray-400 text-sm group-focus-within:text-emerald-500 transition-colors" />
                                        <input type="tel" placeholder="SĐT" className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-2 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                                    </div>
                                    <div className="relative group">
                                        <FaCalendarAlt className="absolute top-3.5 left-4 text-gray-400 text-sm group-focus-within:text-emerald-500 transition-colors" />
                                        <input type="text" placeholder="Năm sinh" className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-2 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <FaBookOpen className="absolute top-3.5 left-4 text-gray-400 text-sm group-focus-within:text-emerald-500 transition-colors" />
                                    <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-8 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer">
                                        <option value="" disabled selected>Bạn quan tâm khóa nào?</option>
                                        <option value="toeic">Luyện thi TOEIC</option>
                                        <option value="ielts">Luyện thi IELTS</option>
                                        <option value="comm">Giao tiếp phản xạ</option>
                                    </select>
                                    <div className="absolute top-4 right-4 pointer-events-none text-gray-400 text-[10px]">▼</div>
                                </div>
                                <button className="w-full group mt-2 relative bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 overflow-hidden">
                                    <span className="relative z-10">Đăng ký tư vấn</span>
                                    <FaPaperPlane className="relative z-10 text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700"></div>
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Bằng cách đăng ký, bạn đồng ý với <a href="#" className="underline hover:text-emerald-500">Điều khoản</a> của chúng tôi.
                                </p>
                            </form>
                        </motion.div>

                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default ConsultationSection;