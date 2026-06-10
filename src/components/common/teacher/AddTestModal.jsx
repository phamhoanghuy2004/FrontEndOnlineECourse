import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaSpinner, FaClock, FaCheckCircle, FaFileExcel, FaUpload } from 'react-icons/fa';
import Button from '../Button';
import InputField from '../InputField';
import testApi from '../../../api/testApi';

import { toast } from 'react-toastify';
const AddTestModal = ({ isOpen, onClose, testSetId, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        durationMinutes: 45,
        passScore: 50.0,
        testSetId: testSetId,
        type: "PRACTICE"
    });
    const [file, setFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Cập nhật testSetId khi modal được mở hoặc props thay đổi
    useEffect(() => {
        if (isOpen && testSetId) {
            setFormData(prev => ({ ...prev, testSetId: testSetId }));
        }
    }, [isOpen, testSetId]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSubmit = async () => {
        if (!file) return toast.warning("Vui lòng chọn file Excel!");
        setIsSaving(true);
        try {
            const data = new FormData();
            
            const json = JSON.stringify(formData);
            const testBlob = new Blob([json], { type: 'application/json' });
            
            data.append('data', testBlob);
            data.append('file', file);

            const response = await testApi.createTest(data);
            toast.success("Tạo bài Test và Import câu hỏi thành công!");
            onSuccess(response.data?.data || response.data);
            onClose();
        } catch (error) {
            console.error("Server Error Response:", error.response?.data);
            toast.error(error.response?.data?.message || "Lỗi hệ thống khi Import");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-emerald-100">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-emerald-50/30">
                    <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <FaFileExcel size={14} />
                        </span>
                        Thêm bài Test (Import Excel)
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                        <FaTimes />
                    </button>
                </div>

                {/* SỬ DỤNG DIV THAY CHO FORM */}
                <div className="p-6 space-y-4">
                    <InputField
                        label="Tên bài Test *"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                        placeholder="VD: Final Mock Test, Unit 1 Quiz..."
                        required
                        icon={FaCheckCircle}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Thời lượng (Phút) *"
                            type="number"
                            value={formData.durationMinutes}
                            onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            icon={FaClock}
                            required
                        />
                        <InputField
                            label="Điểm đạt (%) *"
                            type="number"
                            step="0.1"
                            value={formData.passScore}
                            onChange={(e) => setFormData({ ...formData, passScore: parseFloat(e.target.value) })}
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            icon={FaCheckCircle}
                            required
                        />
                    </div>

                    <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-3">
                        <label className="text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wide block mb-1">
                            File Excel (.xlsx) *
                        </label>
                        <div className="flex items-center gap-3">
                            <label className="flex-1 cursor-pointer">
                                <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-dashed border-emerald-200 rounded-lg hover:border-emerald-400 transition-colors group">
                                    <FaUpload className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs text-slate-500 font-medium">
                                        {file ? file.name : "Chọn file Excel câu hỏi"}
                                    </span>
                                    <input type="file" accept=".xlsx" onChange={handleFileChange} className="hidden" />
                                </div>
                            </label>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">
                            * Định dạng: Question | A | B | C | D | Correct | Explanation | Skill | Tag
                        </p>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                            Hủy
                        </Button>
                        <Button type="button" disabled={isSaving || !file} onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                            {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            Tạo và Import
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTestModal;