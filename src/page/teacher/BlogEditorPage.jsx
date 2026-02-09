import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import { FaSave, FaArrowLeft, FaImage, FaAlignLeft, FaCloudUploadAlt } from 'react-icons/fa';

const BlogEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        thumbnail: '',
        content: ''
    });

    useEffect(() => {
        if (isEditing) {
            // Mock fetch
            setFormData({
                title: '5 Mẹo luyện thi TOEIC hiệu quả',
                thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
                content: 'Nội dung bài viết mẫu...'
            });
        }
    }, [id, isEditing]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create fake local URL
            const url = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, thumbnail: url }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock submit
        setTimeout(() => {
            alert(isEditing ? 'Cập nhật bài viết thành công!' : 'Đăng bài viết thành công!');
            navigate('/teacher/blog');
        }, 500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between sticky top-0 bg-[#f8fafc]/80 backdrop-blur-md py-4 z-10 border-b border-slate-200/50">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/teacher/blog')}
                        className="!p-2 !rounded-lg !hover:bg-slate-200 !text-slate-500"
                    >
                        <FaArrowLeft />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isEditing ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                        </h1>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="secondary" onClick={() => navigate('/teacher/blog')}>
                        Hủy bỏ
                    </Button>
                    <Button type="submit" className="!bg-emerald-600 !shadow-emerald-500/30 hover:!bg-emerald-700">
                        <FaSave /> {isEditing ? 'Cập nhật' : 'Đăng bài'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                        <InputField
                            label="Tiêu đề bài viết"
                            name="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            icon={FaAlignLeft}
                        />

                        <div>
                            <label className="text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wide block mb-1">
                                Nội dung
                            </label>
                            <textarea
                                className="w-full h-[500px] p-4 text-slate-700 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition font-medium"
                                placeholder="Viết nội dung bài viết ở đây (Hỗ trợ Markdown)..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                        <h3 className="font-bold text-lg text-slate-800 border-b border-slate-50 pb-3 mb-4">Ảnh bìa</h3>

                        {/* Upload UI */}
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl">
                                    <FaCloudUploadAlt />
                                </div>
                                <p className="font-bold text-slate-700 text-sm">Nhấn để tải ảnh lên</p>
                                <p className="text-xs text-slate-400">PNG, JPG, GIF (Max 5MB)</p>
                            </div>
                        </div>

                        {/* Preview */}
                        {formData.thumbnail && (
                            <div className="mt-4 aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative group">
                                <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default BlogEditorPage;
