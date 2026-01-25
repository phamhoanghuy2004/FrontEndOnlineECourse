import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {  FaTimes, FaCheck, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; 
import { createPortal } from 'react-dom';


const PartSelectionModal = ({ test, onClose }) => {
    const navigate = useNavigate(); 
    const [selectedParts, setSelectedParts] = useState([]);
    const parts = test.parts || [];

    // --- 1. EFFECT MỚI: KHÓA CUỘN BODY KHI MODAL MỞ ---
    useEffect(() => {
        // Khi modal mở -> Thêm class hoặc style để khóa cuộn
        document.body.style.overflow = 'hidden';

        // Cleanup function: Chạy khi modal đóng -> Mở lại cuộn
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []); 
    // --------------------------------------------------

    // Mặc định chọn tất cả khi mở modal
    useEffect(() => {
        if (parts.length > 0) {
            setSelectedParts(parts.map(p => p.id));
        }
    }, [parts]);

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
        navigate(`/test-practice/${test.id}`, { 
            state: { 
                testId: test.id,
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
                className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative z-10 overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
            >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-800">Cấu trúc bài thi</h3>
                        <p className="text-gray-500 text-sm mt-0.5 font-medium">{test.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Modal Body: Danh sách Parts */}
                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    
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
                                    <h4 className="font-bold text-gray-700 text-sm md:text-base">
                                        {part.name}: <span className="font-normal text-gray-600">{part.title}</span>
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                                        {part.questionCount} câu
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-500">
                        Đã chọn: <span className="font-bold text-emerald-600 text-lg ml-1">{selectedParts.length}</span> phần
                    </div>
                    <button 
                        onClick={handleStartTest}
                        disabled={selectedParts.length === 0}
                        className={`px-6 py-2.5 rounded-full font-bold text-white shadow-lg transition-all transform flex items-center gap-2 text-sm
                            ${selectedParts.length > 0 
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

export default PartSelectionModal