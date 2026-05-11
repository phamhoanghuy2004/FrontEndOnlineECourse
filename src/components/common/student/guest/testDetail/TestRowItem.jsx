import React from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaListOl, FaPlay, FaCheckCircle, FaRedoAlt, FaHistory } from "react-icons/fa";
import { RiCoinFill } from "react-icons/ri"; 

const TestRowItem = ({ test, index, onStartClick, onHistoryClick }) => {
    const number = (index + 1).toString().padStart(2, '0');
    
    const isCompleted = test.hasAttempted; 
    const price = test.price;

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.1 } }
    };

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ 
                borderColor: "#10b981", 
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.15)",
                backgroundColor: "#fafffd"
            }}
            className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-3xl border-2 transition-all duration-300 bg-white border-transparent shadow-sm hover:z-10"
            style={{ border: '1px solid #f3f4f6' }} 
        >
            {/* Left Side */}
            <div className="flex items-center gap-6 md:gap-8 flex-1">
                
                {/* Số thứ tự */}
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl font-black text-xl md:text-2xl transition-all bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white">
                    {number}
                </div>
                
                {/* Thông tin */}
                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg md:text-xl font-bold transition-colors text-gray-900 group-hover:text-emerald-600">
                            {test.title}
                        </h3>
                    </div>
                    
                    {/* Meta Info (Thời gian, Số câu, Số xu) */}
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        
                        {/* Thời gian */}
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors bg-emerald-50 text-emerald-700">
                            <FaClock className="text-emerald-500" />
                            <span>{test.durationMinutes} phút</span>
                        </div>

                        {/* Số câu */}
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors bg-blue-50 text-blue-700">
                            <FaListOl className="text-blue-500" />
                            <span>{test.totalQuestions} câu</span>
                        </div>

                        {/* Số xu / Miễn phí */}
                        {price === 0 ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs md:text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100">
                                <FaCheckCircle className="text-emerald-500 text-sm" />
                                <span>Miễn phí</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs md:text-sm font-bold text-yellow-600 bg-yellow-50 border border-yellow-100">
                                <RiCoinFill className="text-yellow-400 text-base" />
                                <span>{price} xu</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="mt-5 md:mt-0 md:ml-6 flex items-center justify-end md:justify-center">
                {isCompleted ? (
                    <div className="flex flex-col items-end md:items-center gap-2.5">
                        <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold uppercase tracking-widest mb-0.5">
                            <FaCheckCircle size={12} /> Đã hoàn thành
                        </div>

                        <div className="flex items-center gap-2">
                            {/* 🟢 Gọi thẳng tên prop, không truyền tham số */}
                            <button 
                                onClick={onHistoryClick} 
                                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-full font-bold text-sm shadow-sm hover:bg-slate-200 transition-all"
                            >
                                <FaHistory size={12} />
                                <span>Lịch sử</span>
                            </button>

                            <button 
                                onClick={onStartClick} 
                                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-emerald-200 text-emerald-600 rounded-full font-bold text-sm shadow-sm hover:bg-emerald-50 transition-all"
                            >
                                <FaRedoAlt size={12} />
                                <span>Làm lại</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={onStartClick}
                        className="relative overflow-hidden group/btn px-6 py-2.5 rounded-full font-bold text-white text-sm shadow-lg shadow-emerald-500/30 transition-all transform active:scale-95 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500"
                    >
                        <div className="flex items-center gap-2 relative z-10">
                            <span>Làm bài ngay</span>
                            <FaPlay size={10} />
                        </div>
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-full group-hover/btn:scale-150 group-hover/btn:bg-white/20 transition-all duration-500 origin-center"></div>
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default TestRowItem;