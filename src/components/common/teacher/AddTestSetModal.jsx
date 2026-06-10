import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes, FaSave, FaSpinner, FaHeading, FaCalendarAlt } from 'react-icons/fa';
import Button from '../Button';
import InputField from '../InputField';
import testApi from '../../../api/testApi';

import { toast } from 'react-toastify';
const AddTestSetModal = ({ isOpen, onClose, lessonId, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isPublic: true,
        year: new Date().getFullYear(),
        lessonId: lessonId,
        type: 'PRACTICE'
    });

    const [isSaving, setIsSaving] = useState(false);

    // ✅ sync lessonId khi prop thay đổi
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            lessonId: lessonId
        }));
    }, [lessonId]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSaving(true);
        try {
            const response = await testApi.createTestSet(formData);
            const newTestSet = response.data?.data || response.data;
            toast.success("Tạo TestSet thành công!");
            onSuccess(newTestSet);
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi tạo TestSet");
        } finally {
            setIsSaving(false);
        }
    };

    // ✅ dùng Portal render ra ngoài body
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <FaHeading size={14} />
                        </span>
                        Thêm TestSet mới
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    <InputField
                        label="Tiêu đề TestSet *"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="VD: Kiểm tra cuối khóa..."
                        required
                        icon={FaHeading}
                    />

                    <div>
                        <label className="text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wide block mb-1">
                            Mô tả *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-slate-700 text-sm resize-none"
                            rows="3"
                            placeholder="Nhập mô tả..."
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Năm *"
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            icon={FaCalendarAlt}
                            required
                        />

                        <div className="flex items-center mt-6">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={formData.isPublic}
                                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                                />
                                <span className="text-sm font-medium text-slate-700">Công khai</span>
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                            Hủy
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                        >
                            {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            Lưu ngay
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddTestSetModal;