import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCheck, FaArrowRight, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; 
import { createPortal } from 'react-dom';
import testApi from '../../../../../api/testApi';

const PartSelectionModal = ({ test, onClose, testSetId }) => {
    const navigate = useNavigate(); 
    
    // --- STATES QUẢN LÝ DỮ LIỆU ---
    const [parts, setParts] = useState([]);
    const [selectedParts, setSelectedParts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- EFFECT 1: KHÓA CUỘN BODY ---
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []); 

    // --- EFFECT 2: GỌI API LẤY DANH SÁCH SECTION ---
    useEffect(() => {
        let isMounted = true;

        const fetchSections = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Gọi API lấy danh sách sections
                const res = await testApi.getTestSections(test.id);
                
                // Trích xuất data (handle an toàn lỡ Backend bọc trong ApiResponse)
                const fetchedParts = res.data?.data || res.data || [];
                
                if (isMounted) {
                    setParts(fetchedParts);
                    // Tự động chọn tất cả (Làm Full Test) khi vừa load xong
                    setSelectedParts(fetchedParts.map(p => p.id));
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Lỗi fetch sections:", err.message);
                    setError(err.message || "Không thể tải cấu trúc bài thi lúc này.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (test?.id) {
            fetchSections();
        }

        return () => {
            isMounted = false; // Cleanup chống memory leak
        };
    }, [test?.id]);

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
    const togglePart = (partId) => {
        if (selectedParts.includes(partId)) {
            setSelectedParts(selectedParts.filter(id => id !== partId));
        } else {
            setSelectedParts([...selectedParts, partId]);
        }
    };

    const toggleAll = () => {
        if (selectedParts.length === parts.length) {
            setSelectedParts([]); 
        } else {
            setSelectedParts(parts.map(p => p.id)); 
        }
    };

    const handleStartTest = () => {
        if (selectedParts.length === 0) return;
        navigate(`/test-practice/${testSetId}?testId=${test.id}`, { 
            state: { 
                selectedParts: selectedParts,
                mode: selectedParts.length === parts.length ? 'full' : 'practice'
            } 
        });
    };

    // Kiểm tra SSR
    if (typeof document === 'undefined') return null;

    return createPortal(
        <motion.div 
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Backdrop làm mờ nền */}
            <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>

            <motion.div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
            >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-800">Cấu trúc bài thi</h3>
                        <p className="text-gray-500 text-sm mt-0.5 font-medium">{test.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Modal Body: Danh sách Parts (Có Scroll) */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    
                    {/* --- TRẠNG THÁI LOADING --- */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-10">
                            <FaSpinner className="animate-spin text-4xl text-emerald-500 mb-3" />
                            <p className="text-emerald-600 font-medium animate-pulse text-sm">Đang tải cấu trúc bài thi...</p>
                        </div>
                    )}

                    {/* --- TRẠNG THÁI LỖI --- */}
                    {!isLoading && error && (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <FaExclamationTriangle className="text-4xl text-red-400 mb-3" />
                            <p className="text-red-600 font-medium">{error}</p>
                            <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200 text-sm">
                                Đóng
                            </button>
                        </div>
                    )}

                    {/* --- TRẠNG THÁI CÓ DỮ LIỆU --- */}
                    {!isLoading && !error && parts.length > 0 && (
                        <>
                            {/* Nút chọn tất cả */}
                            <div 
                                onClick={toggleAll}
                                className="flex items-center justify-between p-3.5 mb-4 rounded-xl border-2 border-emerald-100 bg-emerald-50/40 cursor-pointer hover:bg-emerald-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedParts.length === parts.length ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300 bg-white'}`}>
                                        {selectedParts.length === parts.length && <FaCheck size={10} className="text-white" />}
                                    </div>
                                    <span className="font-bold text-emerald-800 text-sm md:text-base">Làm Full Test (Tất cả các phần)</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-1 rounded border border-emerald-200 shadow-sm">Khuyên dùng</span>
                            </div>

                            <div className="space-y-2.5">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Hoặc chọn từng phần:</p>
                                {parts.map((part) => (
                                    <div 
                                        key={part.id}
                                        onClick={() => togglePart(part.id)}
                                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${selectedParts.includes(part.id) ? 'border-emerald-500 bg-emerald-50/10' : 'border-gray-100 hover:border-emerald-300 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selectedParts.includes(part.id) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'}`}>
                                                {selectedParts.includes(part.id) && <FaCheck size={10} className="text-white" />}
                                            </div>
                                            {/* 🟢 Render logic map DTO ở đây: Dùng orderIndex cho Part và title cho tên */}
                                            <h4 className="font-bold text-gray-700 text-sm md:text-base">
                                                Part {part.orderIndex}: <span className="font-normal text-gray-600">{part.title}</span>
                                            </h4>
                                        </div>
                                        <div className="text-right">
                                            {/* 🟢 Map totalQuestions từ DTO */}
                                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                                                {part.totalQuestions} câu
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center flex-shrink-0">
                    <div className="text-sm font-medium text-gray-500">
                        Đã chọn: <span className="font-bold text-emerald-600 text-lg ml-1">{selectedParts.length}</span> phần
                    </div>
                    <button 
                        onClick={handleStartTest}
                        disabled={selectedParts.length === 0 || isLoading || error}
                        className={`px-6 py-2.5 rounded-full font-bold text-white shadow-lg transition-all transform flex items-center gap-2 text-sm
                            ${(selectedParts.length > 0 && !isLoading && !error)
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 hover:shadow-emerald-500/30 cursor-pointer' 
                                : 'bg-gray-300 cursor-not-allowed'
                            }
                        `}
                    >
                        <span>Bắt đầu làm bài</span>
                        <FaArrowRight size={12} />
                    </button>
                </div>
            </motion.div>
        </motion.div>,
        document.body 
    );
};

export default PartSelectionModal;