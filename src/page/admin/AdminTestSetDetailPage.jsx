import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import testApi from '../../api/testApi';
import { FaPlus, FaFileExcel, FaArrowLeft, FaClock, FaCheckCircle, FaTrashAlt, FaEye, FaRegClipboard, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTestSetDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [testSet, setTestSet] = useState(null);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importData, setImportData] = useState({ title: '', file: null });
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const tsResponse = await testApi.getTestSetWithHistory(id);
            setTestSet(tsResponse.data);
            
            const testsResponse = await testApi.getTestsByTestSetId(id);
            setTests(testsResponse.data);
        } catch (error) {
            toast.error("Lỗi khi tải thông tin bộ đề");
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (e) => {
        e.preventDefault();
        if (!importData.file) {
            toast.warning("Vui lòng chọn file Excel");
            return;
        }

        try {
            setImporting(true);
            await adminApi.importToeicExcel(id, importData.title, importData.file);
            toast.success("Import thành công!");
            setShowImportModal(false);
            setImportData({ title: '', file: null });
            fetchData();
        } catch (error) {
            toast.error(error.message || "Lỗi khi import Excel");
        } finally {
            setImporting(false);
        }
    };

    const handleDeleteTest = async (testId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài test này?")) return;
        try {
            await testApi.deleteTest(testId);
            toast.success("Đã xóa bài test");
            fetchData();
        } catch (error) {
            toast.error("Lỗi khi xóa bài test");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold tracking-wide">Đang chuẩn bị dữ liệu...</p>
        </div>
    );

    if (!testSet) return (
        <div className="p-12 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaInfoCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Không tìm thấy bộ đề</h3>
            <button onClick={() => navigate('/admin/test-sets')} className="mt-4 text-emerald-600 font-bold hover:underline">Quay lại danh sách</button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Breadcrumb & Header */}
            <div className="space-y-6">
                <motion.button 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    onClick={() => navigate('/admin/test-sets')}
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Quay lại danh sách bộ đề
                </motion.button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 space-y-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{testSet.title}</h2>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${testSet.isPublic ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                                {testSet.isPublic ? 'Public' : 'Private'}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium max-w-2xl">{testSet.description || "Bộ đề này chưa có mô tả chi tiết."}</p>
                        <div className="flex items-center gap-4 pt-2 text-xs font-bold text-slate-400">
                            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <FaClock /> Năm {testSet.year}
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <FaCheckCircle className="text-emerald-500" /> {tests.length} bài thi
                            </span>
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowImportModal(true)}
                        className="relative z-10 flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-xl shadow-emerald-200"
                    >
                        <FaFileExcel size={18} />
                        Import Test mới
                    </motion.button>
                </div>
            </div>

            {/* Tests Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                        <div className="w-2 h-8 bg-emerald-600 rounded-full" />
                        Danh sách bài thi
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {tests.map((test, index) => (
                            <motion.div 
                                key={test.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-[28px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all relative overflow-hidden"
                            >
                                <div className="p-6 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-inner">
                                            <FaRegClipboard size={24} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => navigate(`/admin/tests/${test.id}`)}
                                                className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                title="Chi tiết"
                                            >
                                                <FaEye />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTest(test.id)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="Xóa"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">{test.title}</h4>
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                                <FaClock /> {test.durationMinutes} PHÚT
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                                                <FaCheckCircle /> PASS: {test.passScore}%
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => navigate(`/admin/tests/${test.id}`)}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 hover:shadow-emerald-200"
                                    >
                                        Quản lý Media & Câu hỏi
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {tests.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200"
                        >
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaFileExcel size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800">Bộ đề này còn trống</h4>
                            <p className="text-slate-400 mt-2 mb-8 max-w-xs mx-auto">Tải lên file Excel để tạo các bài thi TOEIC đầu tiên cho bộ đề này.</p>
                            <button 
                                onClick={() => setShowImportModal(true)}
                                className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
                            >
                                Import ngay bài thi
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Import Modal */}
            <AnimatePresence>
                {showImportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !importing && setShowImportModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-[32px] w-full max-w-xl p-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" />
                            
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                                    <FaFileExcel size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Import bài thi TOEIC</h3>
                                    <p className="text-slate-500 font-medium">Hệ thống sẽ tự động phân loại 7 phần</p>
                                </div>
                            </div>

                            <form onSubmit={handleImport} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Tên hiển thị bài thi</label>
                                    <input 
                                        required
                                        disabled={importing}
                                        type="text" 
                                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium bg-slate-50/50"
                                        placeholder="VD: Practice Test 01"
                                        value={importData.title}
                                        onChange={(e) => setImportData({...importData, title: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">File dữ liệu (.xlsx)</label>
                                    <div className="relative border-2 border-dashed border-slate-200 rounded-[28px] p-10 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group cursor-pointer">
                                        <input 
                                            required
                                            disabled={importing}
                                            type="file" 
                                            accept=".xlsx"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e) => setImportData({...importData, file: e.target.files[0]})}
                                        />
                                        <div className="w-20 h-20 bg-white shadow-sm rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <FaFileExcel className="text-4xl text-emerald-500" />
                                        </div>
                                        <p className="text-slate-700 font-bold">
                                            {importData.file ? importData.file.name : "Kéo thả file Excel vào đây"}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-2 font-medium">Đảm bảo đúng cấu trúc 11 cột chuẩn TOEIC</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button" 
                                        disabled={importing}
                                        onClick={() => setShowImportModal(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Đóng
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={importing}
                                        className="flex-[2] px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70"
                                    >
                                        {importing ? (
                                            <>
                                                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                Đang xử lý dữ liệu...
                                            </>
                                        ) : (
                                            <>
                                                <FaFileExcel />
                                                Bắt đầu Import
                                            </>
                                        )}
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

export default AdminTestSetDetailPage;
