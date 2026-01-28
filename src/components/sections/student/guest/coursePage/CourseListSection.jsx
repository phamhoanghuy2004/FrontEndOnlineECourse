import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../../../../../data/mockData';
import FilterBar from '../../../../common/FilterBar';
import SectionHeader from '../../../../common/SectionHeader';
import CommonCarousel from '../../../../common/CommonCarousel';
import CourseCard from '../../../../common/student/guest/course/CourseCard';
import AdvancedFilterPanel from '../../../../common/student/guest/course/AdvancedFilterPanel';
import { fadeInBottom } from '../../../../../constants/motionVariants';

const CourseListSection = () => {
    // --- STATE QUẢN LÝ ---
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [showAdvanced, setShowAdvanced] = useState(false);

    // State lưu giá trị bộ lọc nâng cao
    const [advancedFilters, setAdvancedFilters] = useState({
        level: 'ALL',
        price: 'ALL',
        tutor: ''
    });

    const filterOptions = ["ALL", "TOEIC", "IELTS"];

    // --- HELPER: Parse giá tiền từ chuỗi "500.000đ" sang số 500000 ---
    const parsePrice = (priceString) => {
        return parseInt(priceString.replace(/\./g, '').replace('đ', ''));
    };

    // --- LOGIC LỌC DỮ LIỆU (Core Logic) ---
    const processedData = useMemo(() => {
        // B1: Lọc Category trước (TOEIC/IELTS/All)
        let filteredCats = activeFilter === "ALL"
            ? categories
            : categories.filter(cat => cat.name === activeFilter);

        // B2: Lọc Courses bên trong từng Category dựa theo Advanced Filters
        const finalCats = filteredCats.map(category => {
            const filteredCourses = category.courses.filter(course => {
                // 1. Lọc theo Level
                if (advancedFilters.level !== 'ALL' && course.level !== advancedFilters.level) return false;

                // 2. Lọc theo Tên Giảng Viên (Không phân biệt hoa thường)
                if (advancedFilters.tutor && !course.tutor.toLowerCase().includes(advancedFilters.tutor.toLowerCase())) return false;

                // 3. Lọc theo Giá
                const priceNum = parsePrice(course.price);
                if (advancedFilters.price === 'LOW' && priceNum >= 500000) return false;
                if (advancedFilters.price === 'MEDIUM' && (priceNum < 500000 || priceNum > 1000000)) return false;
                if (advancedFilters.price === 'HIGH' && priceNum <= 1000000) return false;

                return true;
            });

            // Trả về category với danh sách khóa học mới đã lọc
            return { ...category, courses: filteredCourses };
        });

        // B3: Chỉ giữ lại Category nào CÓ khóa học (Loại bỏ category rỗng sau khi lọc)
        return finalCats.filter(cat => cat.courses.length > 0);

    }, [activeFilter, advancedFilters]); // Chỉ chạy lại khi filter thay đổi


    const handleResetFilters = () => {
        setAdvancedFilters({
            level: 'ALL',
            price: 'ALL',
            tutor: ''
        });
        setActiveFilter("ALL");
    };

    return (
        <section id="course-list" className="py-16 bg-white min-h-screen">
            <div className="container mx-auto px-6">

                {/* 1. FILTER BAR */}
                <FilterBar
                    filters={filterOptions}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    isAdvancedOpen={showAdvanced}
                    onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                />

                {/* 2. ADVANCED PANEL (Có hiệu ứng đóng mở) */}
                {/* AnimatePresence là để làm cho có hiệu ứng xuất hiện và biến mất */}
                <AnimatePresence>
                    {showAdvanced && (
                        <AdvancedFilterPanel
                            filters={advancedFilters}
                            setFilters={setAdvancedFilters}
                            onReset={handleResetFilters}
                        />
                    )}
                </AnimatePresence>

                {/* 3. DANH SÁCH HIỂN THỊ */}
                <div className="flex flex-col gap-20">
                    {/* thuộc tính wait giúp chờ cái này biến mất hẵn rồi cái kia nó mới hiện lên */}
                    <AnimatePresence mode='wait'>
                        {processedData.length > 0 ? (
                            processedData.map((category) => (
                                <motion.div
                                    key={category.id}
                                    variants={fadeInBottom}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <SectionHeader
                                        title={category.name}
                                        description={category.description}
                                        titleClassName="text-primary"
                                    />
                                    <CommonCarousel
                                        data={category.courses}
                                        CardComponent={CourseCard}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            /* UI KHI KHÔNG TÌM THẤY KẾT QUẢ */
                            <motion.div
                                key="not-found"
                                variants={fadeInBottom}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="text-center py-20"
                            >
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-800">Không tìm thấy khóa học nào</h3>
                                <p className="text-gray-500">Hãy thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác.</p>
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-4 text-primary font-bold hover:underline"
                                >
                                    Xóa bộ lọc
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default CourseListSection;