import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBullseye, FaEdit, FaPlus, FaTrophy, FaTimes, FaFire,
    FaHeadphones, FaBookOpen, FaMicrophone, FaPen, FaRocket, FaFlagCheckered
} from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import userApi from '../../../api/userApi';
import testResultService from '../../../api/testResultService';

const formatCertName = (certType) => {
    if (certType === 'TOEIC_LR') return 'TOEIC (Listening & Reading)';
    if (certType === 'TOEIC_SW') return 'TOEIC (Speaking & Writing)';
    return certType || 'Mục tiêu';
};

// ==========================================
// COMPONENT: CARD HIỂN THỊ MỤC TIÊU ACTIVE (ĐÃ ÉP CÂN)
// ==========================================
const GoalCard = ({ goal, onEdit, estimatedScore, loadingScore }) => {
    const calcProgress = (current, target) => {
        if (!target || target === 0) return 0;
        const percent = (current / target) * 100;
        return percent > 100 ? 100 : percent;
    };

    const currentScoreValue = estimatedScore || 0;
    const isAchieved = estimatedScore !== null && estimatedScore >= goal.targetTotal && goal.targetTotal > 0;
    const overallProgress = calcProgress(currentScoreValue, goal.targetTotal);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            // 💥 Thu nhỏ padding (p-6) và bo góc (rounded-3xl)
            className="bg-white rounded-3xl p-6 shadow-2xl shadow-emerald-900/5 border border-slate-100 flex flex-col relative overflow-hidden max-w-4xl mx-auto w-full"
        >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-bl-full -z-10 opacity-70"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-50 rounded-tr-full -z-10 opacity-50"></div>

            {/* HEADER CARD */}
            {/* 💥 Giảm mb-6 -> mb-4 */}
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.05 }}
                        // 💥 Thu nhỏ icon Cúp
                        className={`w-12 h-12 text-white rounded-xl flex items-center justify-center text-2xl shadow-lg ${isAchieved ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30' : 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-teal-500/30'}`}
                    >
                        <FaTrophy />
                    </motion.div>
                    <div>
                        {/* 💥 Thu nhỏ Font Title */}
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">{formatCertName(goal.certType)}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            {isAchieved ? (
                                <>
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                                    </span>
                                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Đã đạt mục tiêu 🎉</span>
                                </>
                            ) : (
                                <>
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Đang chinh phục</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onEdit(goal)}
                    // 💥 Nút cập nhật nhỏ gọn hơn
                    className="group px-3 py-1.5 text-sm bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all flex items-center gap-2 font-bold border border-slate-200 hover:border-emerald-200"
                >
                    <FaEdit className="group-hover:rotate-12 transition-transform" /> <span className="hidden sm:inline">Cập nhật</span>
                </button>
            </div>

            {/* SPLIT VIEW: HIỆN TẠI VS MỤC TIÊU */}
            {/* 💥 Giảm khoảng cách gap-4, p-5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <motion.div
                    whileHover={{ y: -3 }}
                    className={`border rounded-2xl p-4 relative overflow-hidden ${isAchieved ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <FaRocket className={`${isAchieved ? 'text-amber-400' : 'text-slate-400'} text-lg`} />
                        <h4 className={`${isAchieved ? 'text-amber-600' : 'text-slate-500'} font-bold uppercase tracking-wider text-xs`}>Điểm Hiện Tại</h4>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        {loadingScore ? (
                            <span className="text-xl font-bold text-slate-400">Đang tải...</span>
                        ) : estimatedScore !== null ? (
                            <>
                                <span className={`text-4xl font-black ${isAchieved ? 'text-amber-600' : 'text-slate-800'}`}>{estimatedScore}</span>
                                <span className={`${isAchieved ? 'text-amber-500' : 'text-slate-400'} font-medium text-sm`}>điểm</span>
                            </>
                        ) : (
                            <span className="text-sm font-bold text-slate-500">Chưa xác định được</span>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -3 }}
                    className={`rounded-2xl p-4 relative overflow-hidden shadow-sm text-white ${isAchieved ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-bl-full"></div>
                    <div className="flex items-center gap-2 mb-1">
                        <FaFlagCheckered className="text-white/80 text-lg" />
                        <h4 className="text-white/90 font-bold uppercase tracking-wider text-xs">Đích Đến</h4>
                    </div>
                    <div className="flex items-baseline gap-1.5 relative z-10">
                        <span className="text-4xl font-black">{goal.targetTotal}</span>
                        <span className="text-white/80 font-medium text-sm">điểm</span>
                    </div>
                </motion.div>
            </div>

            {/* TỔNG QUAN PROGRESS BAR LỚN */}
            {/* 💥 Giảm chiều cao thanh progress h-3 */}
            <div className="mb-2">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-500">Tiến độ tổng thể</span>
                    <span className={isAchieved ? 'text-amber-600' : 'text-emerald-600'}>{overallProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 shadow-inner overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                        className={`h-full rounded-full relative ${isAchieved ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
                    >
                        {!isAchieved && (
                            <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-[pulse_2s_ease-in-out_infinite]"></div>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const StudyGoalPage = () => {
    const { user, setUser } = useAuth();
    const activeGoal = user?.activeGoal;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        certType: 'TOEIC_LR',
        targetListening: '',
        targetReading: '',
        targetSpeaking: '',
        targetWriting: '',
        targetTotal: 0
    });

    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

    const [estimationTests, setEstimationTests] = useState([]);
    const [loadingEstimation, setLoadingEstimation] = useState(true);
    const [estimationError, setEstimationError] = useState(false);

    useEffect(() => {
        const fetchEstimation = async () => {
            try {
                setLoadingEstimation(true);
                setEstimationError(false);
                const response = await testResultService.getRecentFullTestsForEstimation();
                setEstimationTests(response.data || []);
            } catch (err) {
                console.error("Error loading estimations:", err);
                setEstimationError(true);
            } finally {
                setLoadingEstimation(false);
            }
        };

        if (activeGoal) {
            fetchEstimation();
        } else {
            setLoadingEstimation(false);
        }
    }, [activeGoal]);

    const estimatedScore = useMemo(() => {
        if (estimationError || !estimationTests || estimationTests.length < 5) return null;
        const totalSum = estimationTests.reduce((acc, curr) => acc + (curr.totalScore || 0), 0);
        return Math.round(totalSum / 5);
    }, [estimationTests, estimationError]);

    const openModal = (goalToEdit = null) => {
        setErrors({});
        if (goalToEdit) {
            setEditingGoal(goalToEdit);
            setFormData({
                certType: goalToEdit.certType || 'TOEIC_LR',
                targetListening: goalToEdit.targetListening || '',
                targetReading: goalToEdit.targetReading || '',
                targetSpeaking: goalToEdit.targetSpeaking || '',
                targetWriting: goalToEdit.targetWriting || '',
                targetTotal: goalToEdit.targetTotal || 0
            });
        } else {
            setEditingGoal(null);
            setFormData({ certType: 'TOEIC_LR', targetListening: '', targetReading: '', targetSpeaking: '', targetWriting: '', targetTotal: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCertChange = (e) => {
        setErrors({});
        const newCert = e.target.value;
        setFormData({
            certType: newCert,
            targetListening: '',
            targetReading: '',
            targetSpeaking: '',
            targetWriting: '',
            targetTotal: 0
        });
    };

    const handleScoreChange = (field, value) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }

        const sanitizedValue = String(value).replace(/\D/g, '');

        if (sanitizedValue === '') {
            setFormData(prev => {
                const newData = { ...prev, [field]: '' };
                if (newData.certType === 'TOEIC_LR') {
                    newData.targetTotal = (Number(newData.targetListening) || 0) + (Number(newData.targetReading) || 0);
                } else {
                    newData.targetTotal = (Number(newData.targetSpeaking) || 0) + (Number(newData.targetWriting) || 0);
                }
                return newData;
            });
            return;
        }

        let numValue = parseInt(sanitizedValue, 10);

        let maxVal = 0;
        if (field === 'targetListening' || field === 'targetReading') maxVal = 495;
        if (field === 'targetSpeaking' || field === 'targetWriting') maxVal = 200;

        if (numValue > maxVal) numValue = maxVal;
        if (numValue < 0) numValue = 0;

        setFormData(prev => {
            const newData = { ...prev, [field]: numValue };

            if (newData.certType === 'TOEIC_LR') {
                newData.targetTotal = (Number(newData.targetListening) || 0) + (Number(newData.targetReading) || 0);
            } else {
                newData.targetTotal = (Number(newData.targetSpeaking) || 0) + (Number(newData.targetWriting) || 0);
            }
            return newData;
        });
    };

    const blockInvalidChars = (e) => {
        if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
            e.preventDefault();
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const tl = Number(formData.targetListening) || 0;
        const tr = Number(formData.targetReading) || 0;
        const ts = Number(formData.targetSpeaking) || 0;
        const tw = Number(formData.targetWriting) || 0;

        if (formData.certType === 'TOEIC_LR') {
            if (tl % 5 !== 0) newErrors.targetListening = "Điểm phải chia hết cho 5 (VD: 190, 195)";
            if (tr % 5 !== 0) newErrors.targetReading = "Điểm phải chia hết cho 5 (VD: 190, 195)";
        } else if (formData.certType === 'TOEIC_SW') {
            if (ts % 10 !== 0) newErrors.targetSpeaking = "Điểm phải chia hết cho 10 (VD: 150, 160)";
            if (tw % 10 !== 0) newErrors.targetWriting = "Điểm phải chia hết cho 10 (VD: 150, 160)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const submitPayload = {
            certType: formData.certType,
            targetListening: Number(formData.targetListening) || 0,
            targetReading: Number(formData.targetReading) || 0,
            targetSpeaking: Number(formData.targetSpeaking) || 0,
            targetWriting: Number(formData.targetWriting) || 0,
            targetTotal: Number(formData.targetTotal) || 0
        };

        try {
            setSubmitStatus({ type: 'loading', message: 'Đang xử lý dữ liệu...' });

            let response = null;

            if (editingGoal) {
                response = await userApi.updateStudyGoal(submitPayload, activeGoal.id);
            } else {
                response = await userApi.createStudyGoal(submitPayload);
            }

            const newlyGoal = response.data;

            const successMsg = editingGoal ? '🎉 Cập nhật mục tiêu thành công!' : '🎉 Thiết lập mục tiêu thành công!';
            setSubmitStatus({ type: 'success', message: successMsg });

            // 💥 CẬP NHẬT LOCAL STATE TRỰC TIẾP (Không cần tốn thêm 1 request GET nữa)
            if (user && setUser) {
                // 1. Tạo ra một object user mới đã được đính kèm mục tiêu
                const updatedUser = {
                    ...user,
                    activeGoal: newlyGoal
                };

                // 2. Cập nhật State cho giao diện React đổi ngay lập tức
                setUser(updatedUser);

                // 3. Lưu đè xuống Local Storage để F5 trang vẫn còn nhớ
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            }

            setTimeout(() => {
                setIsModalOpen(false);
                setSubmitStatus({ type: '', message: '' });
            }, 1500);

        } catch (error) {
            console.error("Lỗi khi lưu mục tiêu:", error.message);
            const errorMsg = error.message || "Có lỗi kết nối xảy ra, vui lòng thử lại!";
            setSubmitStatus({ type: 'error', message: errorMsg });
        }
    };

    return (
        // 💥 Giảm padding dưới cùng (pb-4)
        <div className="px-6 md:px-8 pt-2 pb-4 w-full max-w-7xl mx-auto min-h-full flex flex-col">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 border-b border-slate-100 pb-3">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        Mục tiêu hiện tại <FaFire className="text-orange-500" />
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm">Theo dõi sát sao tiến độ để chinh phục đỉnh cao.</p>
                </div>
                {activeGoal && (
                    <button
                        onClick={() => openModal(null)}
                        className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 text-sm"
                    >
                        <FaPlus /> Đặt mục tiêu mới
                    </button>
                )}
            </div>

            {/* BODY */}
            <div className="flex-1 flex flex-col">
                {!activeGoal ? (
                    <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[350px] max-w-3xl mx-auto mt-4 w-full">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5 text-emerald-400">
                            <FaBullseye size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-700 mb-2">Bạn chưa có mục tiêu nào!</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-6 text-base">Thiết lập mục tiêu ngay để Echill bắt đầu vẽ ra lộ trình học tập dành riêng cho bạn.</p>
                        <button
                            onClick={() => openModal(null)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all"
                        >
                            Tạo mục tiêu đầu tiên
                        </button>
                    </div>
                                ) : (
                    <div className="mt-2 w-full">
                        <GoalCard 
                            goal={activeGoal} 
                            onEdit={openModal} 
                            estimatedScore={estimatedScore} 
                            loadingScore={loadingEstimation} 
                        />
                    </div>
                )}
            </div>

            {/* MODAL THÊM / SỬA */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative"
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <FaTimes size={16} />
                                </button>
                            </div>

                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 pr-14">
                                <h2 className="text-lg font-bold text-slate-800">
                                    {editingGoal ? 'Chỉnh sửa điểm mục tiêu' : 'Bắt đầu mục tiêu mới'}
                                </h2>
                            </div>

                            <form onSubmit={handleSave} className="p-5" noValidate>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Loại chứng chỉ</label>
                                    <select
                                        value={formData.certType}
                                        onChange={handleCertChange}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 text-slate-700 font-medium text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                                    >
                                        <option value="TOEIC_LR">TOEIC (Listening & Reading)</option>
                                        <option value="TOEIC_SW">TOEIC (Speaking & Writing)</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
                                    {formData.certType === 'TOEIC_LR' && (
                                        <>
                                            <div className="relative pb-5">
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mục tiêu Listening</label>
                                                <input type="number" min="0" max="495" step="5" placeholder="0"
                                                    onKeyDown={blockInvalidChars}
                                                    className={`w-full border rounded-xl px-3 py-2 text-sm transition-all outline-none ${errors.targetListening ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'}`}
                                                    value={formData.targetListening} onChange={(e) => handleScoreChange('targetListening', e.target.value)} />
                                                {errors.targetListening && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-tight">{errors.targetListening}</p>}
                                            </div>
                                            <div className="relative pb-5">
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mục tiêu Reading</label>
                                                <input type="number" min="0" max="495" step="5" placeholder="0"
                                                    onKeyDown={blockInvalidChars}
                                                    className={`w-full border rounded-xl px-3 py-2 text-sm transition-all outline-none ${errors.targetReading ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'}`}
                                                    value={formData.targetReading} onChange={(e) => handleScoreChange('targetReading', e.target.value)} />
                                                {errors.targetReading && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-tight">{errors.targetReading}</p>}
                                            </div>
                                        </>
                                    )}

                                    {formData.certType === 'TOEIC_SW' && (
                                        <>
                                            <div className="relative pb-5">
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mục tiêu Speaking</label>
                                                <input type="number" min="0" max="200" step="10" placeholder="0"
                                                    onKeyDown={blockInvalidChars}
                                                    className={`w-full border rounded-xl px-3 py-2 text-sm transition-all outline-none ${errors.targetSpeaking ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'}`}
                                                    value={formData.targetSpeaking} onChange={(e) => handleScoreChange('targetSpeaking', e.target.value)} />
                                                {errors.targetSpeaking && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-tight">{errors.targetSpeaking}</p>}
                                            </div>
                                            <div className="relative pb-5">
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mục tiêu Writing</label>
                                                <input type="number" min="0" max="200" step="10" placeholder="0"
                                                    onKeyDown={blockInvalidChars}
                                                    className={`w-full border rounded-xl px-3 py-2 text-sm transition-all outline-none ${errors.targetWriting ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'}`}
                                                    value={formData.targetWriting} onChange={(e) => handleScoreChange('targetWriting', e.target.value)} />
                                                {errors.targetWriting && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-tight">{errors.targetWriting}</p>}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="mb-5 pt-2 border-t border-slate-100">
                                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Tổng điểm mục tiêu</label>
                                    <input type="number" readOnly className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-3 py-2 text-emerald-700 font-bold outline-none cursor-not-allowed text-base"
                                        value={formData.targetTotal} />
                                </div>

                                {/* 💥 KHỐI HIỂN THỊ THÔNG BÁO API */}
                                {submitStatus.message && (
                                    <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center ${submitStatus.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' :
                                        submitStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            'bg-blue-50 text-blue-600 border border-blue-100 animate-pulse'
                                        }`}>
                                        {submitStatus.message}
                                    </div>
                                )}

                                <div className="flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={submitStatus.type === 'loading' || submitStatus.type === 'success'} // Đang lưu hoặc thành công thì khóa nút Hủy
                                        className="px-5 py-2 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitStatus.type === 'loading' || submitStatus.type === 'success'} // Đang lưu hoặc thành công thì khóa nút Lưu
                                        className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                                    >
                                        {submitStatus.type === 'loading' ? 'Đang lưu...' : (editingGoal ? 'Lưu thay đổi' : 'Xác nhận tạo')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudyGoalPage;