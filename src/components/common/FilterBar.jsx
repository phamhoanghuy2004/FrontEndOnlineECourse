import React from 'react';
import { motion } from 'framer-motion';
import { FaFilter } from "react-icons/fa";

const FilterBar = ({ filters, activeFilter, onFilterChange }) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            
            {/* 1. LABEL: Chữ màu xanh đậm cho đồng bộ */}
            <div className="hidden md:flex items-center gap-3">
                <div className="h-8 w-1.5 bg-primary rounded-full"></div> {/* Vạch trang trí */}
                <span className="text-primary font-extrabold text-xl tracking-tight uppercase">
                    Bộ Lọc
                </span>
            </div>

            {/* 2. THANH FILTER: Viền Xanh, Nền trắng mờ */}
            <div className="flex p-2 bg-white/80 backdrop-blur-xl border-2 border-primary rounded-full shadow-xl shadow-primary/10">
                {filters.map((label) => {
                    const isActive = activeFilter === label;
                    return (
                        <button
                            key={label}
                            onClick={() => onFilterChange && onFilterChange(label)}
                            className="relative px-6 py-2 rounded-full text-sm md:text-base font-bold transition-all duration-300 outline-none z-10"
                        >
                            {/* BACKGROUND TRƯỢT (Màu Xanh) */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeFilterBubble"
                                    className="absolute inset-0 bg-primary shadow-md rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* TEXT LABEL (Đổi màu: Active là trắng, Inactive là xám) */}
                            <span className={`relative z-10 transition-colors duration-200 ${isActive ? "text-white" : "text-gray-500 hover:text-primary"}`}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* 3. NÚT ICON FILTER: Viền Xanh */}
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-primary shadow-lg shadow-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
                <FaFilter size={18} />
            </motion.button>

        </div>
    );
};

export default FilterBar;