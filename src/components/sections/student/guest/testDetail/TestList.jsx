import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaListOl } from "react-icons/fa";
import TestRowItem from '../../../../common/student/guest/testDetail/TestRowItem';
import PartSelectionModal from '../../../../common/student/guest/testDetail/PartSelectionModal';

const TestListSection = ({ tests, testSetId }) => {
    const [selectedTest, setSelectedTest] = useState(null); // Lưu bài test đang chọn để hiện modal
    const hasData = tests && tests.length > 0;

    // Hàm mở modal khi bấm nút "Làm bài ngay"
    const handleOpenModal = (test) => {
        setSelectedTest(test);
    };

    // Hàm đóng modal
    const handleCloseModal = () => {
        setSelectedTest(null);
    };

    // Hàm xử lý khi bấm nút "Xem lịch sử" (Bổ sung thêm)
    const handleViewHistory = (test) => {
        console.log("Mở trang xem lịch sử của bài test ID:", test.id);
    };

    return (
        <section id="test-list-section" className="w-full bg-transparent py-12 relative z-10">
            
            {/* 1. MỞ RỘNG CONTAINER: max-w-7xl */}
            <div className="container mx-auto px-4 max-w-7xl">
                
                {!hasData ? (
                     <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-16 text-center shadow-xl border border-white">
                        <div className="text-gray-300 text-7xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-gray-700">Chưa có dữ liệu</h3>
                        <p className="text-gray-500 mt-2">Hiện tại chưa có bài thi nào được cập nhật.</p>
                    </div>
                ) : (
                    /* CARD CHÍNH */
                    <div className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/60 relative overflow-hidden">
                        
                        {/* Decor nền nhẹ */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                        {/* --- HEADER --- */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
                                    <FaListOl size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Danh sách bài thi</h2>
                                    <p className="text-slate-500 mt-2 text-lg">Hoàn thành các bài test để mở khóa kỹ năng</p>
                                </div>
                            </div>
                            
                            <div className="px-5 py-2.5 bg-slate-50 rounded-full border border-slate-200 flex items-center gap-3 self-start md:self-auto">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <span className="font-bold text-gray-700">
                                    {tests.length} Đề thi
                                </span>
                            </div>
                        </div>

                        {/* --- LIST CONTAINER --- */}
                        <div className="flex flex-col gap-4 relative z-10">
                            {tests.map((test, index) => (
                                <TestRowItem 
                                    key={test.id} 
                                    test={test} 
                                    index={index} 
                                    onStartClick={() => handleOpenModal(test)} // Truyền hàm mở modal xuống
                                    onHistoryClick={() => handleViewHistory(test)}
                                />
                            ))}
                        </div>

                    </div>
                )}
            </div>

            {/* --- MODAL CHỌN PART --- */}
            <AnimatePresence>
                {selectedTest && (
                    <PartSelectionModal test={selectedTest} onClose={handleCloseModal} testSetId={testSetId} />
                )}
            </AnimatePresence>

        </section>
    );
};


export default TestListSection;