import React from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaListOl, FaPlay, FaCheckCircle, FaLock, FaRedoAlt } from "react-icons/fa"; // Thêm FaRedoAlt
import { RiCoinFill } from "react-icons/ri"; // Icon đồng xu

const TestRowItem = ({ test, index, coins, onStartClick }) => {
    const number = (index + 1).toString().padStart(2, '0');
    const isLocked = test.status === 'locked';
    const isCompleted = test.status === 'completed';

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
            whileHover={!isLocked ? { 
                borderColor: "#10b981", 
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.15)",
                backgroundColor: "#fafffd"
            } : {}}
            className={`group relative flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-3xl border-2 transition-all duration-300
                ${isLocked 
                    ? 'bg-gray-50 border-gray-100 opacity-60 grayscale cursor-not-allowed' 
                    : 'bg-white border-transparent shadow-sm hover:z-10' 
                }
            `}
            style={{ border: isLocked ? '1px solid #f3f4f6' : '1px solid #f3f4f6' }} 
        >
            {/* Left Side */}
            <div className="flex items-center gap-6 md:gap-8 flex-1">
                
                {/* Số thứ tự */}
                <div className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl font-black text-xl md:text-2xl transition-all ${isLocked ? 'bg-gray-200 text-gray-400' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'}`}>{number}</div>
                
                {/* Thông tin */}
                <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className={`text-lg md:text-xl font-bold transition-colors ${isLocked ? 'text-gray-500' : 'text-gray-900 group-hover:text-emerald-600'}`}>{test.title}</h3>
                        {test.status === 'new' && <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded border border-red-100">New</span>}
                    </div>
                    
                    {/* Meta Info (Thời gian, Số câu, Số xu) */}
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        {/* Thời gian */}
                        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors ${isLocked ? 'bg-transparent text-gray-400' : 'bg-emerald-50 text-emerald-700'}`}>
                            <FaClock className={!isLocked && "text-emerald-500"} />
                            <span>{test.time} phút</span>
                        </div>

                        {/* Số câu */}
                        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors ${isLocked ? 'bg-transparent text-gray-400' : 'bg-blue-50 text-blue-700'}`}>
                            <FaListOl className={!isLocked && "text-blue-500"} />
                            <span>{test.totalQuestions || test.questions} câu</span>
                        </div>

                        {/* --- THÊM: SỐ XU --- */}
                        {!isLocked && (
                             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs md:text-sm font-bold text-yellow-600 bg-yellow-50 border border-yellow-100">
                                <RiCoinFill className="text-yellow-400 text-base" />
                                <span>{coins} xu</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side: Action Button */}
            <div className="mt-4 md:mt-0 md:ml-6 flex items-center justify-end md:justify-center">
                {isCompleted ? (
                    // --- TRƯỜNG HỢP ĐÃ LÀM: Hiện nút "Làm lại" ---
                    <div className="flex flex-col items-end md:items-center gap-2">
                        
                        {/* Badge Đã hoàn thành */}
                        <div className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase tracking-wider mb-1">
                            <FaCheckCircle /> 已 hoàn thành
                        </div>

                        {/* Nút Làm lại */}
                        <button 
                            onClick={onStartClick} // Gọi hàm mở modal để làm lại
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 text-emerald-600 rounded-full font-bold text-sm shadow-sm hover:bg-emerald-50 transition-all"
                        >
                            <FaRedoAlt size={12} />
                            <span>Làm lại</span>
                        </button>
                    </div>
                ) : isLocked ? (
                    // Trường hợp Khóa
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <FaLock size={16} />
                    </div>
                ) : (
                    // Trường hợp Chưa làm -> Nút Làm bài
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