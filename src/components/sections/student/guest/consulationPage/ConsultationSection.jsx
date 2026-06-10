import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhoneAlt, FaBookOpen, FaCalendarAlt, FaPaperPlane, FaCommentDots } from "react-icons/fa";
import { useChat } from '../../../../../hooks/useChat';
import TuVanVien from '../../../../../assets/TuVanVien.png';
import consultaionApi from '../../../../../api/consultaionApi';

import { toast } from 'react-toastify';
const ConsultationSection = () => {
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

    // 🔴 [THÊM MỚI]: Quản lý State cho Form
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        birthYear: '',
        topic: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // 🔴 [THÊM MỚI]: Xử lý khi user gõ vào input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 🔴 [THÊM MỚI]: Xử lý Submit gọi API
    const handleSubmit = async (e) => {
        e.preventDefault(); // Chặn hành vi load lại trang mặc định của form
        setIsLoading(true);

        try {
            // Chuyển birthYear sang Integer cho khớp với DTO
            const payload = {
                ...formData,
                birthYear: formData.birthYear ? parseInt(formData.birthYear, 10) : null
            };

            await consultaionApi.submitRequest(payload);

            toast.success("Yêu cầu tư vấn của bạn đã được gửi thành công!");

            // Reset form sau khi gửi
            setFormData({
                fullName: '',
                email: '',
                phoneNumber: '',
                birthYear: '',
                topic: ''
            });
        } catch (error) {
            // Lấy thông báo lỗi từ backend (nếu có)
            const errorMessage = error.message || "Có lỗi xảy ra, vui lòng kiểm tra lại thông tin!";
            toast.info(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

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

                <div className="relative bg-[#EAF8F6]/80 backdrop-blur-sm rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-emerald-200/50 overflow-hidden group/card">

                    <div className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent bg-gradient-to-br from-emerald-200 to-blue-200 opacity-50 pointer-events-none" style={{ maskImage: 'linear-gradient(white, white)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}></div>

                    <div className="absolute -inset-[1px] rounded-[2.5rem] bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover/card:opacity-20 transition-opacity duration-500 blur-sm -z-10"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">

                        {/* --- CỘT TRÁI: TEXT & ẢNH --- */}
                        <motion.div variants={fadeInUp} className="space-y-6 text-center md:text-left">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight">
                                    Tư Vấn <span className="text-emerald-600">Lộ Trình</span> <br /> Cá Nhân Hóa
                                </h2>
                                <p className="text-slate-600 text-sm md:text-base mt-3 max-w-md mx-auto md:mx-0">
                                    Điền thông tin để AI & Chuyên gia của chúng tôi thiết kế lộ trình học tối ưu nhất cho riêng bạn.
                                </p>
                            </div>

                            <div className="relative mx-auto md:mx-0 w-full max-w-[320px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-500">
                                <img
                                    src={TuVanVien}
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


                        {/* --- CỘT PHẢI: FORM --- */}
                        <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_-12px_rgba(16,185,129,0.2)] border border-gray-100 relative">
                            <div className="mb-5">
                                <h3 className="text-xl font-bold text-gray-800">Thông tin liên hệ</h3>
                                <div className="h-1 w-10 bg-emerald-500 rounded-full mt-1"></div>
                            </div>

                            {/* 🔴 [THÊM MỚI]: Thêm sự kiện onSubmit vào form */}
                            <form className="space-y-3" onSubmit={handleSubmit}>
                                <div className="relative group">
                                    <FaUser className="absolute top-3.5 left-4 text-gray-400 text-sm group-focus-within:text-emerald-500 transition-colors" />
                                    {/* 🔴 Thêm name, value, onChange */}
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Họ và tên" className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                                </div>
                                <div className="relative group">
                                    <FaEnvelope className="absolute top-3.5 left-4 text-gray-400 text-sm group-focus-within:text-emerald-500 transition-colors" />
                                    {/* 🔴 Thêm name, value, onChange */}
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email của bạn" className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative group">
                                        <FaPhoneAlt className="absolute top-3.5 left-4 text-gray-400 text-sm group-focus-within:text-emerald-500 transition-colors" />
                                        {/* 🔴 Thêm name, value, onChange */}
                                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="SĐT" className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-2 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                                    </div>
                                    <div className="relative group">
                                        <FaCalendarAlt className="absolute top-3.5 left-4 text-gray-400 text-sm group-focus-within:text-emerald-500 transition-colors" />
                                        {/* 🔴 Thêm name, value, onChange, đổi type sang number */}
                                        <input type="number" name="birthYear" value={formData.birthYear} onChange={handleChange} required placeholder="Năm sinh" className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-2 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <FaBookOpen className="absolute top-3.5 left-4 text-gray-400 text-sm group-focus-within:text-emerald-500 transition-colors" />

                                    {/* 🔴 [THAY ĐỔI]: Chuyển <select> thành <input type="text"> theo yêu cầu */}
                                    <input
                                        type="text"
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleChange}
                                        required
                                        placeholder="Bạn cần tư vấn về chủ đề gì?"
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl py-3 pl-10 pr-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                    />
                                </div>

                                {/* 🔴 Thêm type="submit" và disabled nếu đang gọi API */}
                                <button type="submit" disabled={isLoading} className="w-full group mt-2 relative bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 overflow-hidden">
                                    <span className="relative z-10">{isLoading ? "Đang gửi..." : "Đăng ký tư vấn"}</span>
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