import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes, FaRegStar } from 'react-icons/fa';
import Button from './Button';
import reviewApi from '../../api/reviewApi';
import { toast } from 'react-toastify';

const ReviewModal = ({ isOpen, onClose, courseId, courseName, onReviewSuccess }) => {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (isOpen && courseId) {
            fetchMyReview();
        } else {
            // Reset form when modal closes
            setRating(5);
            setContent('');
        }
    }, [isOpen, courseId]);

    const fetchMyReview = async () => {
        try {
            setFetching(true);
            const response = await reviewApi.getMyReviewByCourseApi(courseId);
            if (response && response.data) {
                setRating(response.data.rating);
                setContent(response.data.content);
            }
        } catch (error) {
            // If 404, it means no review yet, which is fine
            console.log("No previous review found or error:", error.message);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            toast.warning("Vui lòng nhập nội dung đánh giá");
            return;
        }

        try {
            setLoading(true);
            await reviewApi.createOrUpdateReviewApi({
                courseId,
                rating,
                content: content.trim()
            });
            toast.success("Cảm ơn bạn đã đánh giá khóa học!");
            if (onReviewSuccess) onReviewSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 pb-4 flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 mb-1">Đánh giá khóa học</h3>
                            <p className="text-slate-500 font-medium line-clamp-1">{courseName}</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="px-8 py-4 space-y-8 flex-1">
                        {/* Star Rating Section */}
                        <div className="flex flex-col items-center justify-center py-4 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50">
                            <p className="text-sm font-bold text-emerald-700 mb-4 uppercase tracking-wider">Mức độ hài lòng của bạn?</p>
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="text-4xl transition-all duration-200 transform hover:scale-125 focus:outline-none"
                                    >
                                        {(hoverRating || rating) >= star ? (
                                            <FaStar className="text-yellow-400 drop-shadow-sm" />
                                        ) : (
                                            <FaRegStar className="text-slate-300" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-4 text-xs font-bold text-slate-400">
                                {rating === 5 ? 'Tuyệt vời!' : rating === 4 ? 'Rất tốt' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Kém' : 'Rất tệ'}
                            </p>
                        </div>

                        {/* Textarea Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">Cảm nhận của bạn về khóa học</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Hãy chia sẻ trải nghiệm học tập của bạn tại đây..."
                                className="w-full h-32 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-emerald-400 focus:bg-white focus:outline-none transition-all resize-none text-slate-600 font-medium"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 pt-4 flex gap-4 bg-slate-50/50 border-t border-slate-100/50">
                        <Button 
                            variant="secondary" 
                            className="flex-1 !rounded-2xl" 
                            onClick={onClose}
                        >
                            Hủy bỏ
                        </Button>
                        <Button 
                            className="flex-[2] !rounded-2xl" 
                            onClick={handleSubmit}
                            disabled={loading || fetching}
                        >
                            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReviewModal;
