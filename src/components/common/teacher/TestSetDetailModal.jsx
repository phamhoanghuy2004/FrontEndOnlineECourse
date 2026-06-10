import { useState, useEffect } from 'react';
import { 
    FaTimes, FaPlus, FaCheckCircle, FaArrowLeft, FaClock, FaListOl, 
    FaSpinner, FaBookOpen, FaTrash, FaEdit, FaSave,
    FaGlobe, FaLock, FaCalendarAlt
} from 'react-icons/fa';
import Button from '../Button';
import testApi from '../../../api/testApi';
import AddTestModal from './AddTestModal';
import TestQuestionManager from './TestQuestionManager';

import { toast } from 'react-toastify';
const TestSetDetailModal = ({ isOpen, onClose, testSet: initialTestSet }) => {
    const [testSet, setTestSet] = useState(null);
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddTestOpen, setIsAddTestOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    
    // Edit TestSet State
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [editInfo, setEditInfo] = useState({
        title: '',
        description: '',
        isPublic: true,
        year: new Date().getFullYear()
    });
    const [isSavingInfo, setIsSavingInfo] = useState(false);

    // Question Management State
    const [selectedTestId, setSelectedTestId] = useState(null);

    useEffect(() => {
        if (isOpen && initialTestSet?.id) {
            setTestSet(initialTestSet);
            setEditInfo({
                title: initialTestSet.title || '',
                description: initialTestSet.description || '',
                isPublic: initialTestSet.isPublic !== false,
                year: initialTestSet.year || new Date().getFullYear()
            });
            fetchTests();
        } else {
            // Reset state when closed
            setSelectedTestId(null);
            setIsEditingInfo(false);
        }
    }, [isOpen, initialTestSet]);

    const fetchTests = async () => {
        if (!initialTestSet?.id) return;
        setIsLoading(true);
        try {
            const response = await testApi.getTestsByTestSetId(initialTestSet.id);
            setTests(response.data?.data || response.data || []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách test:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveInfo = async () => {
        setIsSavingInfo(true);
        try {
            const response = await testApi.updateTestSet(testSet.id, editInfo);
            setTestSet(response.data?.data || response.data);
            setIsEditingInfo(false);
            toast.success("Đã cập nhật thông tin bộ test!");
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
            toast.error("Lỗi khi lưu: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSavingInfo(false);
        }
    };

    const handleAddTestSuccess = (newTest) => {
        setTests([...tests, newTest]);
        setIsAddTestOpen(false);
    };

    const handleDeleteTest = async (testId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài Test này không? Toàn bộ câu hỏi và câu trả lời liên quan sẽ bị xóa vĩnh viễn.")) {
            return;
        }

        setIsDeleting(testId);
        try {
            await testApi.deleteTest(testId);
            setTests(tests.filter(t => t.id !== testId));
            toast.success("Đã xóa bài Test thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa bài test:", error);
            toast.error(error.response?.data?.message || "Lỗi khi xóa bài test!");
        } finally {
            setIsDeleting(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white rounded-3xl shadow-2xl w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 transition-all ${selectedTestId ? 'max-w-5xl h-[90vh]' : 'max-w-2xl h-[80vh]'}`}>
                
                {selectedTestId ? (
                    <TestQuestionManager 
                        testId={selectedTestId} 
                        onBack={() => setSelectedTestId(null)}
                        onUpdateSuccess={fetchTests}
                    />
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-4 flex-1">
                                <span className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                                    <FaBookOpen size={20} />
                                </span>
                                {isEditingInfo ? (
                                    <div className="flex-1 space-y-2">
                                        <input 
                                            className="w-full text-lg font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-1 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            value={editInfo.title}
                                            onChange={(e) => setEditInfo({...editInfo, title: e.target.value})}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                            placeholder="Tên bộ test"
                                        />
                                        <input 
                                            className="w-full text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            value={editInfo.description}
                                            onChange={(e) => setEditInfo({...editInfo, description: e.target.value})}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                            placeholder="Mô tả bộ test"
                                        />
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
                                                <FaCalendarAlt className="text-slate-400" size={12} />
                                                <input 
                                                    type="number"
                                                    className="w-16 text-xs font-bold text-slate-600 outline-none"
                                                    value={editInfo.year}
                                                    onChange={(e) => setEditInfo({...editInfo, year: parseInt(e.target.value)})}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                                />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setEditInfo({...editInfo, isPublic: !editInfo.isPublic})}
                                                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                    editInfo.isPublic ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                {editInfo.isPublic ? <FaGlobe size={10} /> : <FaLock size={10} />}
                                                {editInfo.isPublic ? 'Công khai' : 'Riêng tư'}
                                            </button>
                                            <div className="flex gap-2 ml-auto">
                                                <button type="button" onClick={() => setIsEditingInfo(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Hủy</button>
                                                <Button onClick={handleSaveInfo} disabled={isSavingInfo} className="!py-1 !px-4 !text-xs flex items-center gap-2">
                                                    {isSavingInfo ? <FaSpinner className="animate-spin" /> : <FaSave size={10} />} Lưu
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-slate-800 text-xl leading-none">
                                                {testSet?.title}
                                            </h3>
                                            <button 
                                                type="button"
                                                onClick={() => setIsEditingInfo(true)}
                                                className="p-1.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                                title="Sửa thông tin"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                        </div>
                                        <p className="text-sm text-slate-400 font-medium mt-1">{testSet?.description}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                                                <FaCalendarAlt size={10} /> Năm {testSet?.year}
                                            </span>
                                            <span className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full ${
                                                testSet?.isPublic ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {testSet?.isPublic ? <FaGlobe size={10} /> : <FaLock size={10} />}
                                                {testSet?.isPublic ? 'Công khai' : 'Riêng tư'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button type="button" onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-white space-y-8">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-3">
                                    <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                                    Danh sách bài Test ({tests.length})
                                </h4>
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsAddTestOpen(true)}
                                    className="!py-2 !px-4 !text-[11px] font-black flex items-center gap-2 border-indigo-500 text-indigo-600 hover:!bg-indigo-600 hover:!text-white shadow-lg shadow-indigo-100/50 uppercase transition-all"
                                >
                                    <FaPlus size={10} /> Thêm Test mới
                                </Button>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center py-24 text-indigo-500 font-bold bg-slate-50/50 rounded-3xl">
                                    <FaSpinner className="animate-spin mr-3 text-3xl" /> Đang tải dữ liệu...
                                </div>
                            ) : tests.length > 0 ? (
                                <div className="grid gap-4">
                                    {tests.map(test => {
                                        // 👉 THAY ĐỔI CHÍNH Ở ĐÂY: Đếm số câu hỏi xuyên qua các sections
                                        const totalQuestionsCount = (test.sections || []).reduce((total, section) => {
                                            return total + (section.questions?.length || 0);
                                        }, 0);

                                        return (
                                            <div 
                                                key={test.id} 
                                                className="group p-5 border border-slate-100 bg-white rounded-3xl hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer relative overflow-hidden"
                                                onClick={() => setSelectedTestId(test.id)}
                                            >
                                                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-indigo-500 transition-colors"></div>
                                                <div className="flex items-center justify-between ml-2">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center text-indigo-500 transition-colors">
                                                            <FaListOl size={18} />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors">{test.title}</h5>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                                                                    <FaClock className="text-indigo-400/50" /> {test.durationMinutes} Phút
                                                                </span>
                                                                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                                                                    {/* 👉 HIỂN THỊ SỐ CÂU HỎI ĐÃ ĐƯỢC TÍNH TOÁN */}
                                                                    <FaListOl className="text-indigo-400/50" /> {totalQuestionsCount} Câu hỏi
                                                                </span>
                                                                <span className="text-[10px] text-emerald-600 font-black uppercase flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                                                    Target: {test.passScore}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteTest(test.id);
                                                            }}
                                                            disabled={isDeleting === test.id}
                                                            className="!p-3 !bg-slate-50 !text-slate-300 hover:!bg-red-50 hover:!text-red-500 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                                            title="Xóa bài Test"
                                                        >
                                                            {isDeleting === test.id ? <FaSpinner className="animate-spin" /> : <FaTrash size={14} />}
                                                        </Button>
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-indigo-500 transition-all group-hover:translate-x-1">
                                                            <FaArrowLeft className="rotate-180" size={14} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-24 px-10 border-2 border-dashed border-slate-100 rounded-[40px] space-y-6 bg-slate-50/50">
                                    <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-200 mx-auto">
                                        <FaListOl size={36} />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-slate-400">Chưa có bài test nào</p>
                                        <p className="text-xs text-slate-300 mt-1 max-w-[240px] mx-auto">Hãy bắt đầu bằng việc import danh sách câu hỏi từ file Excel mẫu.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <Button variant="secondary" onClick={onClose} className="!py-2.5 !px-8 !text-sm !bg-white border-slate-100 text-slate-500 hover:bg-slate-50">
                                Đóng
                            </Button>
                        </div>
                    </>
                )}

                <AddTestModal
                    isOpen={isAddTestOpen}
                    onClose={() => setIsAddTestOpen(false)}
                    testSetId={testSet?.id}
                    onSuccess={handleAddTestSuccess}
                />
            </div>
        </div>
    );
};

export default TestSetDetailModal;