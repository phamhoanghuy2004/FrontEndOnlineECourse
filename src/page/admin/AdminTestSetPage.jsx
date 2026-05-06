import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { FaPlus, FaSearch, FaRegClipboard, FaChevronRight, FaGlobe, FaLock, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTestSetPage = () => {
    const [testSets, setTestSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newTestSet, setNewTestSet] = useState({ title: '', description: '', isPublic: true, year: new Date().getFullYear() });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTestSets();
    }, []);

    const fetchTestSets = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllTestSets();
            setTestSets(response.data);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách bộ đề");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTestSet = async (e) => {
        e.preventDefault();
        try {
            await adminApi.createTestSet(newTestSet);
            toast.success("Tạo bộ đề thành công!");
            setShowModal(false);
            setNewTestSet({ title: '', description: '', isPublic: true, year: new Date().getFullYear() });
            fetchTestSets();
        } catch (error) {
            toast.error("Lỗi khi tạo bộ đề");
        }
    };

    const filteredTestSets = testSets.filter(ts => 
        ts.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ts.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-1"
                >
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý kho bộ đề</h2>
                    <p className="text-slate-500 font-medium">Xây dựng và quản lý các bộ đề thi TOEIC chất lượng cao</p>
                </motion.div>
                
                <motion.button 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-3 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-xl shadow-emerald-200"
                >
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <FaPlus size={14} />
                    </div>
                    Tạo bộ đề mới
                </motion.button>
            </div>

            {/* Search and Filters */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
            >
                <div className="relative flex-grow">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên hoặc mô tả bộ đề..." 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl outline-none transition-all text-slate-700 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Content Section */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold">Đang tải dữ liệu bộ đề...</p>
                </div>
            ) : filteredTestSets.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-32 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-200"
                >
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <FaRegClipboard size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Chưa có bộ đề nào</h3>
                    <p className="text-slate-400 mt-2 max-w-sm mx-auto">Bắt đầu bằng cách tạo bộ đề mới để bắt đầu quản lý các bài thi TOEIC.</p>
                </motion.div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredTestSets.map((ts) => (
                        <motion.div 
                            key={ts.id} 
                            variants={itemVariants}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            onClick={() => navigate(`/admin/test-sets/${ts.id}`)}
                            className="group bg-white rounded-[28px] p-6 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                {ts.isPublic ? (
                                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl" title="Công khai">
                                        <FaGlobe size={14} />
                                    </div>
                                ) : (
                                    <div className="bg-orange-50 text-orange-600 p-2 rounded-xl" title="Riêng tư">
                                        <FaLock size={14} />
                                    </div>
                                )}
                            </div>

                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                <FaRegClipboard size={28} />
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">{ts.title}</h3>
                            <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">{ts.description || "Không có mô tả cho bộ đề này."}</p>
                            
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                                        <FaCalendarAlt /> {ts.year}
                                    </div>
                                    <div className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1.5 rounded-lg ${ts.isPublic ? 'text-emerald-600 bg-emerald-50' : 'text-orange-600 bg-orange-50'}`}>
                                        {ts.isPublic ? 'Public' : 'Private'}
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                    <FaChevronRight size={12} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" />
                            
                            <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Tạo bộ đề thi mới</h3>
                            
                            <form onSubmit={handleCreateTestSet} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề bộ đề</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                                        placeholder="VD: TOEIC ETS 2024"
                                        value={newTestSet.title}
                                        onChange={(e) => setNewTestSet({...newTestSet, title: e.target.value})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả</label>
                                    <textarea 
                                        required
                                        rows="3"
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium resize-none"
                                        placeholder="Mô tả ngắn gọn về bộ đề..."
                                        value={newTestSet.description}
                                        onChange={(e) => setNewTestSet({...newTestSet, description: e.target.value})}
                                    ></textarea>
                                </div>
                                
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Năm phát hành</label>
                                        <input 
                                            type="number" 
                                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                                            value={newTestSet.year}
                                            onChange={(e) => setNewTestSet({...newTestSet, year: parseInt(e.target.value)})}
                                        />
                                    </div>
                                    <div className="flex-1 flex items-end">
                                        <label className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                                            <span className="text-sm font-bold text-slate-700">Công khai</span>
                                            <input 
                                                type="checkbox" 
                                                checked={newTestSet.isPublic}
                                                onChange={(e) => setNewTestSet({...newTestSet, isPublic: e.target.checked})}
                                                className="w-5 h-5 text-emerald-600 rounded-lg focus:ring-emerald-500"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 px-4 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                    >
                                        Tạo bộ đề
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

export default AdminTestSetPage;
