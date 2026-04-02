import React from 'react';
import { motion } from "framer-motion";
import { FaLayerGroup, FaTags, FaSearch, FaRedoAlt, FaSortAmountDown } from "react-icons/fa";
import InputField from '../../../../common/InputField'; 
import SelectField from '../../../../common/SelectField'; 
import { panelVariants } from '../../../../../constants/motionVariants';

const AdvancedFilterPanel = ({ filters, setFilters, onReset }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const levelOptions = [
        { value: 'ALL', label: 'Tất cả trình độ' },
        { value: 'BEGINNER', label: 'Cơ bản (Beginner)' },
        { value: 'INTERMEDIATE', label: 'Trung cấp (Intermediate)' },
        { value: 'ADVANCED', label: 'Nâng cao (Advanced)' }
    ];

    const sortOptions = [
        { value: '', label: 'Mặc định (Thông minh)' },
        { value: 'NEWEST', label: 'Mới nhất' },
        { value: 'PRICE_ASC', label: 'Giá tăng dần' },
        { value: 'PRICE_DESC', label: 'Giá giảm dần' },
        { value: 'RELEVANCE', label: 'Khớp từ khóa nhất' }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    };

    return (
        <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
        >
            <div className="bg-white border-2 border-primary shadow-xl shadow-primary/10 rounded-[24px] p-5 mb-10 mx-auto max-w-6xl">
                
                {/* CSS Grid chia 4 cột, items-end để các element nằm sát đáy bằng nhau */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

                    {/* Cột 1: TRÌNH ĐỘ (LEVEL) */}
                    <div className="w-full">
                        <SelectField
                            label="Trình độ"
                            icon={FaLayerGroup}
                            name="level"
                            value={filters.level}
                            onChange={handleChange}
                            options={levelOptions}
                        />
                    </div>

                    {/* Cột 2: KEYWORD (Đã dời sang đây, đứng độc lập) */}
                    <div className="w-full">
                        <InputField
                            label="Tìm khóa học, giảng viên..."
                            icon={FaSearch}
                            name="keyword"
                            type="text"
                            placeholder="VD: TOEIC, Huy Ca..."
                            value={filters.keyword}
                            onChange={handleChange} 
                        />
                    </div>

                    {/* Cột 3: MỨC GIÁ (PRICE RANGE) */}
                    <div className="w-full flex flex-col justify-end h-[68px] pb-1"> 
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                                <FaTags className="text-primary" /> Mức giá tối đa:
                            </label>
                            <span className="text-sm font-extrabold text-primary">
                                {filters.maxPrice >= 5000000 ? 'Mọi mức giá' : formatCurrency(filters.maxPrice)}
                            </span>
                        </div>
                        <input
                            type="range"
                            name="maxPrice"
                            min="0"
                            max="5000000"
                            step="100000"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-emerald-600 transition-all"
                        />
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1.5">
                            <span>Miễn phí</span>
                            <span>5Tr+</span>
                        </div>
                    </div>

                    {/* Cột 4: BỘ SẮP XẾP (SORT BY) + NÚT RESET */}
                    <div className="w-full flex items-end gap-2">
                        <div className="flex-grow">
                            <SelectField
                                label="Sắp xếp theo"
                                icon={FaSortAmountDown}
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleChange}
                                options={sortOptions}
                            />
                        </div>

                        {/* NÚT RESET - Đứng cạnh ô Sắp xếp */}
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onReset}
                            className="flex-shrink-0 w-[42px] h-[42px] flex items-center justify-center rounded-lg bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 mb-[1px]"
                            title="Đặt lại bộ lọc"
                        >
                            <motion.div 
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.4 }}
                            >
                                <FaRedoAlt size={14} />
                            </motion.div>
                        </motion.button>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default AdvancedFilterPanel;