import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterBar from '../../../../common/FilterBar';
import SectionHeader from '../../../../common/SectionHeader';
import CommonCarousel from '../../../../common/CommonCarousel';
import CourseCard from '../../../../common/student/guest/course/CourseCard';
import AdvancedFilterPanel from '../../../../common/student/guest/course/AdvancedFilterPanel';
import { fadeInBottom } from '../../../../../constants/motionVariants';
import courseApi from '../../../../../api/courseApi';
import categoryApi from '../../../../../api/categoryApi'; // 💥 Import thêm API lấy danh mục
import { FaSpinner } from 'react-icons/fa';

const CourseListSection = () => {
    // --- STATE QUẢN LÝ UI & DATA GỐC ---
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);

    const [rawCourses, setRawCourses] = useState([]);
    const [categories, setCategories] = useState([]); // 💥 Lưu mảng object category từ BE
    const [filterOptions, setFilterOptions] = useState(["ALL"]); // 💥 Tự động build tab

    // --- STATE BỘ LỌC NÂNG CAO ---
    const [advancedFilters, setAdvancedFilters] = useState({
        level: 'ALL',
        maxPrice: 5000000,
        keyword: '',
        sortBy: '' // Mặc định rỗng để BE tự quyết
    });

    // 💥 1. GỌI API LẤY DANH SÁCH CATEGORY KHI VỪA VÀO TRANG
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryApi.getAll();

                // 💥 In thẳng cái 'res' gốc ra xem hình thù nó thế nào
                console.log("1. Toàn bộ API Response trả về:", res);

                // 💥 Bọc lót mọi trường hợp bóc vỏ của Axios:
                // - Trường hợp 1: Axios chưa bóc -> res.data.data (Của Spring Boot)
                // - Trường hợp 2: Axios ĐÃ bóc -> res.data (Của Spring Boot)
                const catData = res.data?.data || res.data || [];

                console.log("2. Danh sách Category sau khi móc ra:", catData);

                if (catData.length > 0) {
                    setCategories(catData);
                    setFilterOptions(["ALL", ...catData.map(c => c.name)]);
                } else {
                    console.warn("LẠ NHỈ? Móc data ra vẫn rỗng. Hãy kiểm tra lại Backend!");
                }

            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    // 💥 2. GỌI API SEARCH KHÓA HỌC (Lắng nghe cả advancedFilters và activeFilter)
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const params = {
                    page: 0,
                    size: 50
                };

                // Lọc theo danh mục Tab
                if (activeFilter !== "ALL") {
                    const selectedCat = categories.find(c => c.name === activeFilter);
                    if (selectedCat) {
                        params.categoryId = selectedCat.id;
                    }
                }

                // 💥 Bắn các Params từ Panel xuống Backend
                if (advancedFilters.level !== 'ALL') params.level = advancedFilters.level;
                if (advancedFilters.maxPrice < 5000000) params.maxPrice = advancedFilters.maxPrice;
                if (advancedFilters.keyword.trim()) params.keyword = advancedFilters.keyword.trim();

                // 💥 Nếu user chọn explicit Sort thì gửi đi, không thì thôi
                if (advancedFilters.sortBy !== '') params.sortBy = advancedFilters.sortBy;

                const response = await courseApi.searchCourses(params);

                // BỌC LÓT AN TOÀN CHO MỌI TRƯỜNG HỢP CỦA AXIOS
                let courses = [];
                if (response?.data?.data?.content) {
                    courses = response.data.data.content;
                } else if (response?.data?.content) {
                    courses = response.data.content;
                } else if (response?.content) {
                    courses = response.content;
                }

                setRawCourses(courses);

            } catch (error) {
                console.error("Lỗi lấy danh sách khóa học:", error);
                setRawCourses([]);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchCourses();
        }, 500);

        return () => clearTimeout(timer);
    }, [advancedFilters, activeFilter, categories]);

    // --- LOGIC GOM NHÓM (GROUPING) CHO UI CAROUSEL CŨ ---
    const processedData = useMemo(() => {
        if (!rawCourses || rawCourses.length === 0) return [];

        // 💥 Backend ĐÃ LỌC SẴN rồi, Frontend bây giờ chỉ việc Gom nhóm theo tên
        const grouped = rawCourses.reduce((acc, course) => {
            let cat = acc.find(c => c.name === course.categoryName);
            if (!cat) {
                cat = {
                    id: course.categoryId,
                    name: course.categoryName,
                    description: course.categoryDescription || `Khám phá các khóa học ${course.categoryName} nổi bật`,
                    courses: []
                };
                acc.push(cat);
            }
            cat.courses.push(course);
            return acc;
        }, []);

        return grouped;

    }, [rawCourses]); // 💥 Đã xóa điều kiện activeFilter ở đây vì BE lo việc lọc rồi


    const handleResetFilters = () => {
        setAdvancedFilters({
            level: 'ALL',
            maxPrice: 5000000,
            keyword: '',
            sortBy: ''
        });
        setActiveFilter("ALL");
    };

    return (
        <section id="course-list" className="py-16 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-6">

                {/* 1. FILTER BAR */}
                <FilterBar
                    filters={filterOptions} // 💥 Truyền mảng đã load từ API
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    isAdvancedOpen={showAdvanced}
                    onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                />

                {/* 2. ADVANCED PANEL */}
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
                <div className="flex flex-col gap-20 relative min-h-[400px]">

                    {loading && (
                        <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-sm z-10 flex justify-center items-start pt-20">
                            <FaSpinner className="animate-spin text-primary text-4xl" />
                        </div>
                    )}

                    <AnimatePresence mode='wait'>
                        {processedData.length > 0 ? (
                            processedData.map((category) => (
                                <motion.div
                                    key={category.id || category.name}
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
                            !loading && (
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
                                    <p className="text-gray-500">Hãy thử nới lỏng mức giá hoặc tìm từ khóa khác.</p>
                                    <button
                                        onClick={handleResetFilters}
                                        className="mt-4 text-primary font-bold hover:underline"
                                    >
                                        Xóa toàn bộ bộ lọc
                                    </button>
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default CourseListSection;