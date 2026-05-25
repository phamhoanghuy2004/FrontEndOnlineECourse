import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import testApi from '../../api/testApi';
import { FaFileExcel, FaArrowLeft, FaClock, FaCheckCircle, FaTrashAlt, FaEye, FaRegClipboard, FaInfoCircle, FaEdit, FaGlobe, FaLock, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTestSetDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [testSet, setTestSet] = useState(null);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Import modal
    const [showImportModal, setShowImportModal] = useState(false);
    const [importData, setImportData] = useState({ title: '', file: null });
    const [importing, setImporting] = useState(false);

    // Edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ title: '', description: '', isPublic: true, year: new Date().getFullYear() });
    const [saving, setSaving] = useState(false);

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

    const openEditModal = () => {
        setEditData({
            title: testSet.title || '',
            description: testSet.description || '',
            isPublic: testSet.isPublic ?? true,
            year: testSet.year || new Date().getFullYear(),
        });
        setShowEditModal(true);
    };

    const handleUpdateTestSet = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await adminApi.updateTestSet(id, editData);
            toast.success("Cập nhật bộ đề thành công!");
            setShowEditModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.message || "Lỗi khi cập nhật bộ đề");
        } finally {
            setSaving(false);
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
        <div className="max-w-7xl mx-auto space-y-8 pb-20">

            {/* Back Button */}
            <motion.button
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={() => navigate('/admin/test-sets')}
                className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-semibold transition-colors group text-sm"
            >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Quay lại danh sách bộ đề
            </motion.button>

            {/* Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
            >
                {/* Top accent bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />

                <div className="p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Info */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{testSet.title}</h2>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                ${testSet.isPublic
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'}`}>
                                {testSet.isPublic ? <FaGlobe size={10} /> : <FaLock size={10} />}
                                {testSet.isPublic ? 'Public' : 'Private'}
                            </span>
                        </div>

                        <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
                            {testSet.description || "Bộ đề này chưa có mô tả chi tiết."}
                        </p>

                        <div className="flex items-center gap-3 pt-1 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg">
                                <FaClock size={11} /> Năm {testSet.year}
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                                <FaCheckCircle size={11} /> {tests.length} bài thi
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={openEditModal}
                            className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl hover:border-emerald-400 hover:text-emerald-600 transition-all font-bold text-sm shadow-sm"
                        >
                            <FaEdit size={14} />
                            Chỉnh sửa
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowImportModal(true)}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all font-bold text-sm shadow-lg shadow-emerald-200"
                        >
                            <FaFileExcel size={14} />
                            Thêm bài test
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Tests Grid */}
            <div className="space-y-5">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-1.5 h-7 bg-emerald-600 rounded-full" />
                    Danh sách bài thi
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {tests.map((test, index) => (
                            <motion.div
                                key={test.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all relative overflow-hidden"
                            >
                                <div className="p-5 space-y-5">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                            <FaRegClipboard size={20} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/tests/${test.id}`)}
                                                className="w-9 h-9 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all"
                                                title="Xem chi tiết"
                                            >
                                                <FaEye size={13} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTest(test.id)}
                                                className="w-9 h-9 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                title="Xóa"
                                            >
                                                <FaTrashAlt size={13} />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-base font-bold text-slate-800 mb-3 line-clamp-1 group-hover:text-emerald-600 transition-colors">{test.title}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                <FaClock size={10} /> {test.durationMinutes} PHÚT
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                                <FaCheckCircle size={10} /> PASS: {test.passScore}%
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/admin/tests/${test.id}`)}
                                        className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all"
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {tests.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200"
                        >
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaFileExcel size={28} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-700">Bộ đề này còn trống</h4>
                            <p className="text-slate-400 text-sm mt-2 mb-6 max-w-xs mx-auto">Tải lên file Excel để tạo bài thi {testSet.type === 'PLACEMENT_TEST' ? 'Placement Test' : 'TOEIC'} đầu tiên.</p>
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all"
                            >
                                Import ngay
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* ===== EDIT MODAL ===== */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !saving && setShowEditModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />

                            <div className="p-7">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <FaEdit size={16} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800">Chỉnh sửa bộ đề</h3>
                                            <p className="text-xs text-slate-400 font-medium">Cập nhật thông tin bộ đề thi</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        disabled={saving}
                                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-all"
                                    >
                                        <FaTimes size={13} />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateTestSet} className="space-y-5">
                                    {/* Title */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-bold text-slate-700">Tiêu đề bộ đề</label>
                                        <input
                                            required
                                            disabled={saving}
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm bg-slate-50/50"
                                            placeholder="VD: ETS TOEIC 2026"
                                            value={editData.title}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-bold text-slate-700">Mô tả</label>
                                        <textarea
                                            disabled={saving}
                                            rows="3"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm resize-none bg-slate-50/50"
                                            placeholder="Mô tả ngắn gọn về bộ đề..."
                                            value={editData.description}
                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                        />
                                    </div>

                                    {/* Year + Public toggle */}
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-1.5">
                                            <label className="block text-sm font-bold text-slate-700">Năm xuất bản</label>
                                            <input
                                                type="number"
                                                disabled={saving}
                                                min="2000"
                                                max="2100"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm"
                                                value={editData.year}
                                                onChange={(e) => setEditData({ ...editData, year: parseInt(e.target.value) })}
                                            />
                                        </div>

                                        <div className="flex-1 space-y-1.5">
                                            <label className="block text-sm font-bold text-slate-700">Trạng thái</label>
                                            <button
                                                type="button"
                                                disabled={saving}
                                                onClick={() => setEditData({ ...editData, isPublic: !editData.isPublic })}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-bold text-sm cursor-pointer
                                                    ${editData.isPublic
                                                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                                        : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {editData.isPublic ? <FaGlobe size={13} /> : <FaLock size={13} />}
                                                    {editData.isPublic ? 'Public' : 'Private'}
                                                </span>
                                                <div className={`w-9 h-5 rounded-full transition-all relative ${editData.isPublic ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-all ${editData.isPublic ? 'left-4.5 translate-x-0.5' : 'left-0.5'}`} style={{ left: editData.isPublic ? '18px' : '2px' }} />
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={() => setShowEditModal(false)}
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-[2] px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave size={13} />
                                                    Lưu thay đổi
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ===== IMPORT MODAL ===== */}
            <AnimatePresence>
                {showImportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !importing && setShowImportModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
                        >
                            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />

                            <div className="p-7">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <FaFileExcel size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800">Import bài thi {testSet.type === 'PLACEMENT_TEST' ? 'Placement Test' : 'TOEIC'}</h3>
                                            <p className="text-xs text-slate-400 font-medium">Hệ thống tự động phân loại 7 phần</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowImportModal(false)}
                                        disabled={importing}
                                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-all"
                                    >
                                        <FaTimes size={13} />
                                    </button>
                                </div>

                                <form onSubmit={handleImport} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-bold text-slate-700">Tên hiển thị bài thi</label>
                                        <input
                                            required
                                            disabled={importing}
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-sm bg-slate-50/50"
                                            placeholder="VD: Practice Test 01"
                                            value={importData.title}
                                            onChange={(e) => setImportData({ ...importData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-bold text-slate-700">File dữ liệu (.xlsx)</label>
                                        <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/20 transition-all group cursor-pointer">
                                            <input
                                                required
                                                disabled={importing}
                                                type="file"
                                                accept=".xlsx"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={(e) => setImportData({ ...importData, file: e.target.files[0] })}
                                            />
                                            <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                <FaFileExcel className="text-3xl text-emerald-500" />
                                            </div>
                                            <p className="text-slate-700 font-bold text-sm">
                                                {importData.file ? importData.file.name : "Kéo thả hoặc click để chọn file"}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">Đảm bảo đúng cấu trúc 13 cột chuẩn (kèm cột độ khó difficulty từ 1-5)</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-1">
                                        <button
                                            type="button"
                                            disabled={importing}
                                            onClick={() => setShowImportModal(false)}
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                                        >
                                            Đóng
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={importing}
                                            className="flex-[2] px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {importing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <FaFileExcel size={13} />
                                                    Bắt đầu Import
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminTestSetDetailPage;
