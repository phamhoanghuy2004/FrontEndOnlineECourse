import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import { FaSave, FaArrowLeft, FaCloudUploadAlt, FaAlignLeft } from 'react-icons/fa';
import blogApi from '../../api/blogApi';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAuth } from '../../hooks/useAuth';

const BlogEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const { user } = useAuth(); // or from context

    const [formData, setFormData] = useState({
        title: '',
        thumbnail: '',
        content: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean'] // Nút xóa format
        ]
    };

    useEffect(() => {
        if (isEditing) {
            const fetchBlog = async () => {
                try {
                    console.log("Fetching blog with ID:", id);
                    const res = await blogApi.getById(id);
                    console.log("API Response:", res);
                    
                    const blogData = res.data; 
                    if (blogData) {
                        setFormData({
                            title: blogData.title || '',
                            thumbnail: blogData.imageUrl || '',
                            content: blogData.content || ''
                        });
                        console.log("Form data set:", blogData);
                    } else {
                        console.warn("No data found in API response for blog ID:", id);
                    }
                } catch (error) {
                    console.error("Failed to fetch blog:", error);
                }
            };
            fetchBlog();
        }
    }, [id, isEditing]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, thumbnail: url }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const currentUser = user || JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser || !currentUser.id) {
                alert("Vui lòng đăng nhập lại để thực hiện.");
                return;
            }

            const data = new FormData();
            data.append("title", formData.title);
            data.append("content", formData.content);
            data.append("userId", currentUser.id);
            if (imageFile) {
                data.append("file", imageFile);
            }

            if (isEditing) {
                await blogApi.update(id, data);
            } else {
                await blogApi.create(data);
            }
            alert(isEditing ? 'Cập nhật bài viết thành công!' : 'Đăng bài viết thành công!');
            navigate('/teacher/blog');
        } catch (error) {
            console.error("Failed to save blog", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
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
                    <Button type="submit" disabled={isLoading} className="!bg-emerald-600 !shadow-emerald-500/30 hover:!bg-emerald-700 disabled:opacity-50">
                        <FaSave /> {isLoading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Đăng bài')}
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
                            <div className="relative group">
                                <div className="bg-white rounded-lg">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(htmlValue) => setFormData(prev => ({ ...prev, content: htmlValue }))}
                                        modules={modules}
                                        className="h-[400px] mb-12 pb-12"
                                        placeholder="Viết nội dung bài viết ở đây..."
                                    />
                                </div>
                            </div>
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
