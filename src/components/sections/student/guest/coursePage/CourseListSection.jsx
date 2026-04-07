import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterBar from '../../../../common/FilterBar';
import SectionHeader from '../../../../common/SectionHeader';
import CommonCarousel from '../../../../common/CommonCarousel';
import CourseCard from '../../../../common/student/guest/course/CourseCard';
import AdvancedFilterPanel from '../../../../common/student/guest/course/AdvancedFilterPanel';
import { fadeInBottom } from '../../../../../constants/motionVariants';
import courseApi from '../../../../../api/courseApi';
import categoryApi from '../../../../../api/categoryApi';
import { FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // 💥 Thêm Icon cho Phân trang
import { useSearchParams } from 'react-router-dom';

const CourseListSection = () => {
    // Dùng hook để lấy query param từ URL
    const [searchParams] = useSearchParams();
    const sectionRef = useRef(null);

    // --- STATE QUẢN LÝ UI & DATA GỐC ---
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);

    const [rawCourses, setRawCourses] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [filterOptions, setFilterOptions] = useState(["ALL"]); 

    // STATE PHÂN TRANG
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // --- STATE BỘ LỌC NÂNG CAO ---
    const [advancedFilters, setAdvancedFilters] = useState({
        level: 'ALL',
        maxPrice: 5000000,
        keyword: '',
        sortBy: '' 
    });

    // 1. GỌI API LẤY DANH SÁCH CATEGORY KHI VỪA VÀO TRANG
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryApi.getAll();
                const catData = res.data?.data || res.data || [];
                if (catData.length > 0) {
                    setCategories(catData);
                    setFilterOptions(["ALL", ...catData.map(c => c.name)]);

                    const categoryParamId = searchParams.get('category');
                    if (categoryParamId) {
                        const matchingCat = catData.find(c => c.id.toString() === categoryParamId);
                        if (matchingCat) {
                            setActiveFilter(matchingCat.name); 
                            setTimeout(() => {
                                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 300); 
                        }
                    }
                }
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, [searchParams]);

    // 2. GỌI API SEARCH KHÓA HỌC (Lắng nghe Filter + Pagination)
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage - 1, // 💥 Gửi xuống Backend (BE đếm từ 0)
                    size: 6 // 💥 Đặt size nhỏ (VD: 12) để dễ thấy tính năng phân trang
                };

                if (activeFilter !== "ALL") {
                    const selectedCat = categories.find(c => c.name === activeFilter);
                    if (selectedCat) params.categoryId = selectedCat.id;
                }

                if (advancedFilters.level !== 'ALL') params.level = advancedFilters.level;
                if (advancedFilters.maxPrice < 5000000) params.maxPrice = advancedFilters.maxPrice;
                if (advancedFilters.keyword.trim()) params.keyword = advancedFilters.keyword.trim();
                if (advancedFilters.sortBy !== '') params.sortBy = advancedFilters.sortBy;

                const response = await courseApi.searchCourses(params);

                // BÓC TÁCH DỮ LIỆU PAGE RESPONSE
                let pageData = {};
                if (response?.data?.data) {
                    pageData = response.data.data;
                } else if (response?.data) {
                    pageData = response.data;
                } else {
                    pageData = response;
                }

                setRawCourses(pageData.content || []);
                // 💥 Cập nhật tổng số trang từ Backend trả về
                setTotalPages(pageData.totalPages || 1); 

            } catch (error) {
                console.error("Lỗi lấy danh sách khóa học:", error);
                setRawCourses([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchCourses();
        }, 500);

        return () => clearTimeout(timer);
    }, [advancedFilters, activeFilter, categories, currentPage]); // 💥 Lắng nghe thêm currentPage

    // --- LOGIC GOM NHÓM (GROUPING) ---
    const processedData = useMemo(() => {
        if (!rawCourses || rawCourses.length === 0) return [];

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
    }, [rawCourses]);

    // --- HANDLERS ---
    const handleFilterChange = (filterName) => {
        setActiveFilter(filterName);
        setCurrentPage(1); // 💥 Nhớ reset page về 1 khi đổi Tab
    };

    const handleAdvancedFilterChange = (newFilters) => {
        setAdvancedFilters(newFilters);
        setCurrentPage(1); // 💥 Nhớ reset page về 1 khi tìm kiếm
    };

    const handleResetFilters = () => {
        setAdvancedFilters({
            level: 'ALL',
            maxPrice: 5000000,
            keyword: '',
            sortBy: ''
        });
        setActiveFilter("ALL");
        setCurrentPage(1);
    };

    // --- RENDER HỆ THỐNG NÚT PHÂN TRANG ---
    const renderPagination = () => {
        if (totalPages <= 1) return null; // Nếu chỉ có 1 trang thì ẩn luôn thanh phân trang

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300 ${
                        currentPage === i
                            ? "bg-primary text-white shadow-lg shadow-primary/40 transform scale-105"
                            : "bg-white text-gray-500 hover:bg-green-50 hover:text-primary border border-gray-200"
                    }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center items-center gap-3 mt-16 pb-8">
                {/* Nút Prev */}
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300 border ${
                        currentPage === 1 
                            ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-primary hover:text-white hover:border-primary shadow-sm"
                    }`}
                >
                    <FaChevronLeft size={14} />
                </button>

                {/* Các số trang */}
                <div className="flex gap-2">
                    {pages}
                </div>

                {/* Nút Next */}
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300 border ${
                        currentPage === totalPages 
                            ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-primary hover:text-white hover:border-primary shadow-sm"
                    }`}
                >
                    <FaChevronRight size={14} />
                </button>
            </div>
        );
    };

    return (
        <section ref={sectionRef} id="course-list" className="py-16 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-6">

                {/* 1. FILTER BAR */}
                <FilterBar
                    filters={filterOptions} 
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange} // 💥 Trỏ về Handler mới để reset Page
                    isAdvancedOpen={showAdvanced}
                    onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                />

                {/* 2. ADVANCED PANEL */}
                <AnimatePresence>
                    {showAdvanced && (
                        <AdvancedFilterPanel
                            filters={advancedFilters}
                            setFilters={handleAdvancedFilterChange} // 💥 Trỏ về Handler mới để reset Page
                            onReset={handleResetFilters}
                        />
                    )}
                </AnimatePresence>

                {/* 3. DANH SÁCH HIỂN THỊ */}
                <div className="flex flex-col gap-16 relative min-h-[400px]">

                    {loading && (
                        <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-sm z-20 flex justify-center items-start pt-32 rounded-3xl">
                            <FaSpinner className="animate-spin text-primary text-5xl drop-shadow-md" />
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

                {/* 💥 4. HIỂN THỊ THANH PHÂN TRANG XỊN XÒ */}
                {renderPagination()}

            </div>
        </section>
    );
};

export default CourseListSection;