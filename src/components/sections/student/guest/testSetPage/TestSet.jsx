import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import CourseLevelHeader from '../../../../common/student/guest/course/CourseLevelHeader';
import FilterBar from "../../../../common/FilterBar";
import TestSetCard from "../../../../common/student/guest/testSet/TestSetCard";
import CommonCarousel from "../../../../common/CommonCarousel";
import testApi from "../../../../../api/testApi";
import { FaChevronLeft, FaChevronRight, FaSearch, FaCalendarAlt, FaRedo } from "react-icons/fa";

const SECTION_INFO = {
    TOEIC: { title: "TOEIC", description: "Tổng hợp các bộ đề TOEIC chất lượng..." },
    IELTS: { title: "IELTS", description: "Hệ thống bài test IELTS chất lượng..." }
};

// 🟢 COMPONENT TẠO PANEL LỌC NÂNG CAO (Giao diện giống hình bạn gửi)
const AdvancedFilterPanel = ({ filters, onChange, onReset }) => {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mb-8"
        >
            {/* 🔴 BÍ QUYẾT TẠI ĐÂY: Thêm mx-auto và w-fit để form ôm sát nội dung và tự động căn giữa */}
            <div className="mx-auto w-full md:w-fit bg-white border-2 border-primary rounded-2xl p-4 shadow-lg shadow-primary/5 flex flex-col md:flex-row items-end gap-4">

                {/* Input Keyword */}
                {/* 🔴 Xóa flex-1, thay bằng md:w-80 lg:w-96 để giới hạn độ dài trên desktop */}
                <div className="w-full md:w-80 lg:w-96">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Tìm từ khóa bộ đề
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="VD: ETS 2024, Hacker..."
                            value={filters.keyword}
                            onChange={(e) => onChange('keyword', e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                        />
                    </div>
                </div>

                {/* Select Year */}
                {/* 🔴 Đặt độ dài md:w-48 là vừa đẹp cho chọn năm */}
                <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Năm xuất bản
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className="text-gray-400" />
                        </div>
                        <select
                            value={filters.year}
                            // 🟢 Ép kiểu parseInt ngay tại đây để truyền Data chuẩn Số nguyên xuống params
                            onChange={(e) => onChange('year', e.target.value ? parseInt(e.target.value, 10) : '')}
                            className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm appearance-none bg-white"
                        >
                            <option value="">Tất cả năm</option>
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                        </select>
                    </div>
                </div>

                {/* Nút Reset */}
                <button
                    onClick={onReset}
                    title="Xóa bộ lọc"
                    className="w-full md:w-11 h-[42px] flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 border border-red-100 flex-shrink-0"
                >
                    <FaRedo size={14} />
                    <span className="md:hidden ml-2 font-bold text-sm">Xóa lọc</span>
                </button>
            </div>
        </motion.div>
    );
};

const TestSet = () => {
    // 🟢 1. LẤY PARAMS TỪ URL
    const [searchParams, setSearchParams] = useSearchParams();
    const typeFromUrl = searchParams.get("type"); // Lấy chữ "TOEIC", "IELTS"...

    // --- STATES ---
    const [activeFilter, setActiveFilter] = useState(typeFromUrl || "All");
    const [filterOptions, setFilterOptions] = useState(["All"]);
    const [blocksData, setBlocksData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 🟢 THÊM MỚI: States cho Advanced Filter
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({ keyword: '', year: '' });
    const [debouncedKeyword, setDebouncedKeyword] = useState(''); // Chống spam API

    // 🟢 3. ĐỒNG BỘ URL VÀ AUTO SCROLL
    useEffect(() => {
        if (typeFromUrl) {
            // Cập nhật lại thanh Filter nếu có param
            setActiveFilter(typeFromUrl);
            setCurrentPage(1); // Reset luôn trang về 1 cho chắc ăn

            // Logic Auto Scroll mượt mà
            const element = document.getElementById("test-list");
            if (element) {
                // Đợi React render xong UI một chút (300ms) rồi mới cuộn để tính toán độ cao chính xác
                setTimeout(() => {
                    const yOffset = -100; // 🔴 Trừ hao 100px để không bị cái Navbar dính chặt ở trên đè lên
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                    window.scrollTo({
                        top: y,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        }
    }, [typeFromUrl]); // Hiệu ứng này sẽ chạy mỗi khi URL thay đổi

    const testSetBreakpoints = {
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
    };

    // --- HANDLERS ---
    const handleFilterChange = (newFilter) => {
        setActiveFilter(newFilter);
        setCurrentPage(1);

        // 🟢 Cập nhật lại URL trên trình duyệt mà không làm load lại trang
        if (newFilter === "All") {
            setSearchParams({}); // Xóa param nếu chọn All
        } else {
            setSearchParams({ type: newFilter }); // Đổi thành ?type=IELTS
        }
    };

    const handleAdvancedFilterChange = (key, value) => {
        setAdvancedFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Gõ phím hoặc chọn năm là reset về trang 1
    };

    const handleResetFilters = () => {
        setAdvancedFilters({ keyword: '', year: '' });
        setCurrentPage(1);
    };

    // 🟢 DEBOUNCE EFFECT: Chỉ cập nhật debouncedKeyword sau khi user DỪNG gõ 500ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(advancedFilters.keyword);
        }, 500);
        return () => clearTimeout(handler);
    }, [advancedFilters.keyword]);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchTestSets = async () => {
            setIsLoading(true);
            try {
                // 1. Load danh sách Type cho FilterBar
                const typesRes = await testApi.getAllowedTestTypes();
                const fetchedTypes = typesRes.data || [];
                setFilterOptions(["All", ...fetchedTypes]);

                // 2. Setup Params gởi xuống Backend
                const params = { page: currentPage, size: 6 };
                if (activeFilter !== "All") params.type = activeFilter;

                // 🔴 Thêm Keyword và Year vào params (nếu có dữ liệu)
                if (debouncedKeyword.trim() !== '') params.keyword = debouncedKeyword.trim();
                if (advancedFilters.year !== '') params.year = advancedFilters.year;

                // 3. Gọi API
                const res = await testApi.getAllTestSets(params);
                const allTestSets = res.data.content || [];
                setTotalPages(res.data.totalPages || 1);

                // 4. Group data lại thành các Block
                const typesToRender = activeFilter === "All" ? fetchedTypes : [activeFilter];
                const groupedBlocks = typesToRender.map(typeKey => ({
                    id: typeKey.toLowerCase(),
                    title: SECTION_INFO[typeKey]?.title || typeKey,
                    description: SECTION_INFO[typeKey]?.description || "",
                    data: allTestSets.filter(test => test.type === typeKey)
                }));

                setBlocksData(groupedBlocks);

            } catch (error) {
                console.error("Lỗi fetch data:", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestSets();
        // 🔴 Gọi lại API khi: Đổi Tab, Chuyển trang, Sửa năm, hoặc (Dừng gõ Keyword sau 500ms)
    }, [activeFilter, currentPage, advancedFilters.year, debouncedKeyword]);

    // --- RENDER PAGINATION (Giữ nguyên) ---
    const renderPagination = () => {
        if (totalPages <= 1) return null; // Nếu chỉ có 1 trang thì ẩn luôn thanh phân trang

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300 ${currentPage === i
                        ? "bg-primary text-white shadow-lg shadow-primary/40 transform scale-105"
                        : "bg-white text-gray-500 hover:bg-green-50 hover:text-primary border border-gray-200"
                        }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center items-center gap-3 mt-1 pb-8">
                {/* Nút Prev */}
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300 border ${currentPage === 1
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
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300 border ${currentPage === totalPages
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
        <section id="test-list" className="relative py-16 bg-transparent">
            <div className="container mx-auto px-6 relative z-10">

                {/* 1. FILTER BAR */}
                <FilterBar
                    filters={filterOptions}
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                    isAdvancedOpen={showAdvanced}
                    onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                />

                {/* 2. ADVANCED PANEL (Có hiệu ứng trượt) */}
                <AnimatePresence>
                    {showAdvanced && (
                        <AdvancedFilterPanel
                            filters={advancedFilters}
                            onChange={handleAdvancedFilterChange}
                            onReset={handleResetFilters}
                        />
                    )}
                </AnimatePresence>

                {/* 3. TRẠNG THÁI LOADING */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
                        {/* Vòng xoay Spinner */}
                        <div className="w-14 h-14 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin shadow-sm"></div>
                        
                        {/* Dòng chữ nhấp nháy nhẹ */}
                        <p className="mt-4 text-emerald-600 font-medium animate-pulse tracking-wide">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                )}

                {/* 4. RENDER DATA THẬT */}
                {!isLoading && (
                    <div className="flex flex-col gap-20 mt-10">
                        {blocksData.map((typeBlock) => (
                            <div key={typeBlock.id}>
                                <CourseLevelHeader
                                    title={typeBlock.title}
                                    description={typeBlock.description}
                                />
                                {typeBlock.data.length === 0 ? (
                                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500">
                                        Không tìm thấy bộ đề {typeBlock.title} nào phù hợp với bộ lọc!
                                    </div>
                                ) : (
                                    <CommonCarousel
                                        data={typeBlock.data}
                                        CardComponent={TestSetCard}
                                        breakpoints={testSetBreakpoints}
                                    />
                                )}
                            </div>
                        ))}

                        {/* PHÂN TRANG */}
                        {renderPagination()}
                    </div>
                )}
            </div>
        </section>
    );
}

export default TestSet;

