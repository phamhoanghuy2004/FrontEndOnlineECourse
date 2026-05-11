import React, { useState, useEffect } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import reviewApi from '../../../../../api/reviewApi';
import moment from 'moment';

const ReviewSection = ({ courseId }) => {
    const [reviews, setReviews] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalElements: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchReviews = async (page) => {
        try {
            setLoading(true);
            const response = await reviewApi.getPaginatedCourseReviews(courseId, page, 5);
            if (response && response.data) {
                setReviews(response.data.content);
                setPagination({
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements
                });
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(1);
    }, [courseId]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchReviews(newPage);
            // Scroll to top of review section
            document.getElementById('review-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading && reviews.length === 0) {
        return (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-slate-500">Đang tải đánh giá...</p>
            </div>
        );
    }

    if (!loading && reviews.length === 0) {
        return (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm mt-8 text-center">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaStar className="text-slate-200 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có đánh giá nào</h3>
                <p className="text-slate-500">Hãy là người đầu tiên trải nghiệm và chia sẻ cảm nhận về khóa học này!</p>
            </div>
        );
    }

    return (
        <div id="review-section" className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm mt-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-1">Cảm nhận từ học viên</h2>
                    <p className="text-slate-500 text-sm">Tổng số {pagination.totalElements} đánh giá</p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                    <FaStar className="text-amber-500" />
                    <span className="text-amber-700 font-black text-lg">
                        {reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "0.0"}
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pagination.currentPage}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {reviews.map((review) => (
                            <div key={review.id} className="group bg-slate-50/50 p-6 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    <img 
                                        src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=random&color=fff`} 
                                        alt={review.userName} 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <h4 className="font-bold text-slate-800">{review.userName}</h4>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {moment(review.createdAt).format('DD/MM/YYYY')}
                                            </span>
                                        </div>
                                        <div className="flex text-amber-400 text-xs mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < review.rating ? "text-amber-400" : "text-slate-200"} />
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <FaQuoteLeft className="absolute -left-2 -top-2 text-primary/10 text-xl" />
                                            <p className="text-slate-600 text-sm leading-relaxed relative z-10 pl-4 italic">
                                                {review.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 hover:border-primary hover:text-primary disabled:opacity-50 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                    >
                        <FaChevronLeft size={14} />
                    </button>
                    
                    {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                                pagination.currentPage === i + 1
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 hover:border-primary hover:text-primary disabled:opacity-50 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                    >
                        <FaChevronRight size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
