import React from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaTimes } from "react-icons/fa";

const FilterBar = ({ filters, activeFilter, onFilterChange, onToggleAdvanced, isAdvancedOpen, showLabels = true, compact = false }) => {
    return (
        <div className={`relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 ${compact ? 'mb-4 min-h-[50px]' : 'mb-8 min-h-[60px]'}`}>
        
            {showLabels && (
                <div className="flex items-center gap-3 z-10">
                    <div className="h-8 w-1.5 bg-primary rounded-full"></div> 
                    <span className="text-primary font-extrabold text-xl tracking-tight uppercase">
                        BỘ LỌC
                    </span>
                </div>
            )}


            <div className={`z-0 ${showLabels ? 'md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2' : 'mx-auto'}`}>
                <div className={`flex p-1 bg-white/90 backdrop-blur-xl border-2 border-primary rounded-full shadow-xl shadow-primary/10`}>
                    {filters.map((label) => {
                        const isActive = activeFilter === label;
                        return (
                            <button
                                key={label}
                                onClick={() => onFilterChange && onFilterChange(label)}
                                className={`relative ${compact ? 'px-4 py-1.5 min-w-[80px]' : 'px-6 py-2 min-w-[100px]'} rounded-full text-xs md:text-sm font-bold transition-all duration-300 outline-none`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeFilterBubble"
                                        className="absolute inset-0 bg-primary shadow-md rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className={`relative z-10 transition-colors duration-200 ${isActive ? "text-white" : "text-gray-500 hover:text-primary"}`}>
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {showLabels && onToggleAdvanced && (
                <div 
                    className="flex items-center gap-3 z-10 cursor-pointer group" 
                    onClick={onToggleAdvanced} 
                >
                    <span className="font-extrabold tracking-tight uppercase transition-colors duration-300 hidden md:block text-lg text-primary">
                        Lọc thêm tiêu chí
                    </span>

                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300
                            ${isAdvancedOpen 
                                ? "bg-primary border-primary text-white" 
                                : "bg-white border-primary text-primary hover:bg-green-50" 
                            }`}
                    >
                        {isAdvancedOpen ? <FaTimes size={14} /> : <FaFilter size={14} />}
                    </motion.button>
                </div>
            )}

        </div>
    );
};

export default FilterBar;