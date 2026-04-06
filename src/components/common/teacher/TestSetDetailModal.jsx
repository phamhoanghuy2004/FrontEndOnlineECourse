import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaCheckCircle, FaClock, FaListOl, FaSpinner, FaBookOpen, FaTrash } from 'react-icons/fa';
import Button from '../Button';
import testApi from '../../../api/testApi';
import AddTestModal from './AddTestModal';

const TestSetDetailModal = ({ isOpen, onClose, testSet }) => {
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddTestOpen, setIsAddTestOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    useEffect(() => {
        if (isOpen && testSet?.id) {
            fetchTests();
        }
    }, [isOpen, testSet?.id]);

    const fetchTests = async () => {
        setIsLoading(true);
        try {
            const response = await testApi.getTestsByTestSetId(testSet.id);
            setTests(response.data?.data || response.data || []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách test:", error);
        } finally {
            setIsLoading(false);
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
            alert("Đã xóa bài Test thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa bài test:", error);
            alert(error.response?.data?.message || "Lỗi khi xóa bài test!");
        } finally {
            setIsDeleting(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <FaBookOpen size={18} />
                        </span>
                        <div>
                            <h3 className="font-bold text-slate-800 leading-none mb-1">
                                {testSet?.title}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">{testSet?.description}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                        <FaTimes />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-700 text-sm uppercase">Danh sách bài Test ({tests.length})</h4>
                        <Button
                            variant="secondary"
                            onClick={() => setIsAddTestOpen(true)}
                            className="!py-1.5 !px-3 !text-xs flex items-center gap-2 border-emerald-500 text-emerald-600"
                        >
                            <FaPlus size={10} /> Thêm Test mới
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20 text-indigo-500 font-bold bg-slate-50/50 rounded-2xl">
                            <FaSpinner className="animate-spin mr-3 text-2xl" /> Đang tải danh sách bài test...
                        </div>
                    ) : tests.length > 0 ? (
                        <div className="space-y-3">
                            {tests.map(test => (
                                <div key={test.id} className="p-4 border border-slate-100 bg-slate-50 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-black text-indigo-600 border border-slate-200 shadow-sm shadow-indigo-100">
                                                <FaCheckCircle size={14} />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-slate-700 text-sm">{test.title}</h5>
                                                <div className="flex items-center gap-4 mt-0.5">
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1.5">
                                                        <FaClock className="text-indigo-400" /> {test.durationMinutes} Phút
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1.5">
                                                        <FaListOl className="text-indigo-400" /> {test.questions?.length || 0} Câu hỏi
                                                    </span>
                                                    <span className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1.5 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                        Target: {test.passScore}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Button
                                            type="button"
                                            onClick={() => handleDeleteTest(test.id)}
                                            disabled={isDeleting === test.id}
                                            className="!p-2.5 !bg-red-50 !text-red-500 hover:!bg-red-500 hover:!text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            title="Xóa bài Test"
                                        >
                                            {isDeleting === test.id ? <FaSpinner className="animate-spin" /> : <FaTrash size={14} />}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 px-10 border border-dashed border-slate-200 rounded-2xl space-y-4">
                            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-200 mx-auto">
                                <FaListOl size={40} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400">Chưa có bài test nào trong bộ này.</p>
                                <p className="text-xs text-slate-300">Nhấn nút "Thêm Test mới" để bắt đầu import Excel.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <Button variant="secondary" onClick={onClose} className="!py-2 !px-6 !text-sm">
                        Đóng
                    </Button>
                </div>

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
