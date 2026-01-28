import React from 'react';
import { motion } from "framer-motion";
import { FaLayerGroup, FaTags, FaSearch, FaRedoAlt } from "react-icons/fa";

// Import Components
import InputField from '../../../../common/InputField'; // Nhớ đường dẫn file
import SelectField from '../../../../common/SelectField'; // Component mới tạo ở trên
import { panelVariants } from '../../../../../constants/motionVariants';

const AdvancedFilterPanel = ({ filters, setFilters, onReset }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Định nghĩa Options cho gọn code render
    const levelOptions = [
        { value: 'ALL', label: 'Tất cả trình độ' },
        { value: 'BASIC', label: 'Cơ bản' },
        { value: 'MEDIUM', label: 'Trung cấp' },
        { value: 'ADVANCE', label: 'Nâng cao' }
    ];

    const priceOptions = [
        { value: 'ALL', label: 'Tất cả mức giá' },
        { value: 'LOW', label: 'Dưới 500k' },
        { value: 'MEDIUM', label: '500k - 1 triệu' },
        { value: 'HIGH', label: 'Trên 1 triệu' }
    ];

    return (
        <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
        >
            {/* CONTAINER CHÍNH */}
            <div className="bg-white border-2 border-primary shadow-xl shadow-primary/10 rounded-[24px] p-5 mb-10 mx-auto max-w-5xl">

                <div className="flex flex-col md:flex-row gap-4 items-end">

                    {/* 1. LEVEL SELECT */}
                    <div className="w-full md:w-3/10">
                        <SelectField
                            label="Trình độ"
                            icon={FaLayerGroup}
                            name="level"
                            value={filters.level}
                            onChange={handleChange}
                            options={levelOptions}
                        />
                    </div>

                    {/* 2. PRICE SELECT */}
                    <div className="w-full md:w-3/10">
                        <SelectField
                            label="Mức giá"
                            icon={FaTags}
                            name="price"
                            value={filters.price}
                            onChange={handleChange}
                            options={priceOptions}
                        />
                    </div>

                    {/* 3. TUTOR SEARCH + RESET BUTTON */}
                    {/* Gom 2 cái này vào 1 div flex để nó nằm cạnh nhau */}
                    <div className="w-full md:w-4/10 flex items-end gap-3">
                        <div className="flex-grow">
                            {/* Lưu ý: Bạn cần sửa InputField nhận thêm prop 'name' để handleChange hoạt động đúng */}
                            <InputField
                                label="Giảng viên"
                                icon={FaSearch}
                                name="tutor"
                                type="text"
                                placeholder="Tìm tên GV..."
                                value={filters.tutor}
                                onChange={handleChange} 
                            />
                        </div>

                        {/* NÚT RESET */}
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onReset}
                            className="flex-shrink-0 w-[42px] h-[42px] flex items-center justify-center rounded-lg bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 mb-[1px]" // mb-[1px] để cân với border input
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