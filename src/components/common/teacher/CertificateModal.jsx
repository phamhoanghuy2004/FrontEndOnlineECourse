import React, { useState, useEffect } from "react";
import { FaTimes, FaUpload, FaCertificate, FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";

const CertificateModal = ({ isOpen, onClose, onSave, editingCert }) => {
    const [formData, setFormData] = useState({
        certType: "TOEIC_LR",
        listeningScore: 10,
        readingScore: 10,
        speakingScore: 0,
        writingScore: 0,
        issuedDate: new Date().toISOString().split("T")[0],
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const certTypes = ["TOEIC_LR"];

    useEffect(() => {
        if (editingCert) {
            setFormData({
                certType: editingCert.certType || "IELTS",
                listeningScore: editingCert.listeningScore || 0,
                readingScore: editingCert.readingScore || 0,
                speakingScore: editingCert.speakingScore || 0,
                writingScore: editingCert.writingScore || 0,
                issuedDate: editingCert.issuedDate || new Date().toISOString().split("T")[0],
            });
            setPreviewUrl(editingCert.evidenceUrl);
            setSelectedFile(null);
        } else {
            setFormData({
                certType: "TOEIC_LR",
                listeningScore: 0,
                readingScore: 0,
                speakingScore: 0,
                writingScore: 0,
                issuedDate: new Date().toISOString().split("T")[0],
            });
            setPreviewUrl(null);
            setSelectedFile(null);
        }
    }, [editingCert, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!editingCert && !selectedFile) {
            toast.error("Vui lòng tải lên ảnh minh chứng!");
            return;
        }

        if (formData.listeningScore < 10 || formData.listeningScore > 495 ||
            formData.readingScore < 10 || formData.readingScore > 495) {
            toast.error("Điểm Nghe và Đọc phải nằm trong khoảng 10 - 495!");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));
            if (selectedFile) {
                data.append("evidence", selectedFile);
            }
            
            await onSave(data, editingCert?.id);
            onClose();
        } catch (err) {
            console.error("Save certificate error:", err);
            toast.error(err.message || "Có lỗi xảy ra khi lưu chứng chỉ");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in">
                <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FaCertificate className="text-emerald-500" />
                        {editingCert ? "Chỉnh sửa chứng chỉ" : "Thêm chứng chỉ mới"}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <FaTimes className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Cert Type (Hidden since it's only one type) */}
                        <div className="hidden">
                            <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Loại chứng chỉ</label>
                            <select
                                name="certType"
                                value={formData.certType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                            >
                                {certTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Display Type Information */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Loại chứng chỉ</label>
                            <div className="w-full px-4 py-3 rounded-2xl border border-transparent bg-slate-50 text-slate-600 font-bold">
                                TOEIC Listening & Reading
                            </div>
                        </div>

                        {/* Issued Date */}
                        <div>
                            <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Ngày cấp</label>
                            <input
                                type="date"
                                name="issuedDate"
                                value={formData.issuedDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                            />
                        </div>

                        {/* Scores */}
                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Điểm Nghe (Listening)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="10"
                                        max="495"
                                        step="5"
                                        name="listeningScore"
                                        value={formData.listeningScore}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none font-bold text-lg text-emerald-600"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">/ 495</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 ml-1">Khoảng điểm: 10 - 495</p>
                            </div>
                            <div>
                                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Điểm Đọc (Reading)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="10"
                                        max="495"
                                        step="5"
                                        name="readingScore"
                                        value={formData.readingScore}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none font-bold text-lg text-emerald-600"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">/ 495</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 ml-1">Khoảng điểm: 10 - 495</p>
                            </div>
                        </div>

                        {/* Evidence Image */}
                        <div className="col-span-2">
                            <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Ảnh minh chứng</label>
                            <div className="relative group border-2 border-dashed border-slate-200 rounded-3xl p-4 text-center hover:border-emerald-300 transition-all bg-slate-50">
                                {previewUrl ? (
                                    <div className="relative inline-block w-full h-48 overflow-hidden rounded-2xl border border-slate-200">
                                        <img src={previewUrl} alt="Evidence Preview" className="w-full h-full object-contain bg-white" />
                                        <label htmlFor="evidence-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <FaUpload className="text-white text-3xl" />
                                        </label>
                                    </div>
                                ) : (
                                    <label htmlFor="evidence-upload" className="flex flex-col items-center justify-center py-8 cursor-pointer">
                                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-300 group-hover:text-emerald-500 transition-colors">
                                            <FaUpload className="text-2xl" />
                                        </div>
                                        <p className="text-slate-500 font-medium">Bấm để tải lên ảnh chứng chỉ</p>
                                        <p className="text-[10px] text-slate-400 mt-1 uppercase">Support PNG, JPG (MAX. 2MB)</p>
                                    </label>
                                )}
                                <input id="evidence-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] py-4 rounded-2xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                editingCert ? "Cập nhật chứng chỉ" : "Thêm chứng chỉ"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CertificateModal;
