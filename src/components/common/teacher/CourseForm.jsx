import { FaSave, FaImage, FaLayerGroup, FaTags, FaAlignLeft, FaDollarSign, FaArrowLeft, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import Button from '../../common/Button';
import InputField from '../../common/InputField';
import SelectField from '../../common/SelectField';
import LessonList from './LessonList';
import categoryApi from '../../../api/categoryApi';

const CourseForm = ({ initialData, onSubmit, isEditing, isSubmitting }) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        level: 'BEGINNER',
        price: '',
        originalPrice: '',
        categoryId: '',
        lessons: []
    });

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
        const fetchCategories = async () => {
            try {
                const response = await categoryApi.getAll();
                setCategories(response.data || []);
                if (!isEditing && response.data?.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: response.data[0].id }));
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, [isEditing]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || initialData.title || '',
                description: initialData.description || '',
                level: initialData.level || 'BEGINNER',
                price: initialData.price || '',
                originalPrice: initialData.originalPrice || '',
                categoryId: initialData.categoryId || (initialData.category?.id) || '',
                lessons: initialData.lessons || []
            });
            setImagePreview(initialData.imageUrl || initialData.image || '');
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLessonsChange = (lessons) => {
        setFormData(prev => ({ ...prev, lessons }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* Action Bar - Đã dọn dẹp nút Hủy và Lưu ở đây */}
            <div className="flex items-center justify-between sticky top-0 bg-[#f8fafc]/80 backdrop-blur-md py-4 z-10 border-b border-slate-200/50">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/teacher/courses')}
                        className="!p-2 !rounded-lg !hover:bg-slate-200 !text-slate-500"
                    >
                        <FaArrowLeft />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isEditing ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
                        </h1>
                        <p className="text-slate-500 text-xs">
                            {isEditing ? `ID: ${initialData?.id}` : 'Điền thông tin khóa học bên dưới'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: General Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                        <h3 className="font-bold text-lg text-slate-800 border-b border-slate-50 pb-3 mb-4">Thông tin chung</h3>

                        <InputField
                            label="Tên khóa học"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="VD: TOEIC Basic 450+"
                            icon={FaLayerGroup}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <SelectField
                                label="Cấp độ"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                icon={FaTags}
                                options={[
                                    { value: 'BEGINNER', label: 'Beginner (Mới bắt đầu)' },
                                    { value: 'INTERMEDIATE', label: 'Intermediate (Trung bình)' },
                                    { value: 'ADVANCED', label: 'Advanced (Nâng cao)' }
                                ]}
                            />
                            <SelectField
                                label="Danh mục"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                icon={FaLayerGroup}
                                options={categories.map(cat => ({
                                    value: cat.id,
                                    label: cat.name
                                }))}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField
                                label="Giá bán (VNĐ)"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="VD: 500000"
                                icon={FaDollarSign}
                                required
                            />
                            <InputField
                                label="Giá gốc (VNĐ)"
                                name="originalPrice"
                                type="number"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                placeholder="VD: 1000000"
                                icon={FaDollarSign}
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wide block mb-1">
                                Mô tả khóa học
                            </label>
                            <div className="relative group">
                                <div className="bg-white rounded-lg">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.description}
                                        onChange={(htmlValue) => setFormData(prev => ({ ...prev, description: htmlValue }))}
                                        modules={modules}
                                        className="h-64 mb-12 pb-12"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="!bg-emerald-600 !shadow-emerald-500/30 hover:!bg-emerald-700 !px-6"
                            >
                                <FaSave /> {isSubmitting ? 'Đang lưu...' : (isEditing ? 'Lưu thay đổi khóa học' : 'Tạo khóa học & Tiếp tục')}
                            </Button>
                        </div>
                    </div>

                    {/* Lesson Management */}
                    {isEditing ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <LessonList lessons={formData.lessons} onChange={handleLessonsChange} courseId={initialData?.id} />
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
                            <div className="w-12 h-12 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto text-xl">
                                <FaLayerGroup />
                            </div>
                            <h4 className="font-bold text-slate-700">Quản lý bài giảng</h4>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                Bạn có thể thêm và quản lý các bài giảng sau khi đã tạo thông tin cơ bản cho khóa học.
                            </p>
                        </div>
                    )}
                </div>

                {/* Column 2: Media & Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                        <h3 className="font-bold text-lg text-slate-800 border-b border-slate-50 pb-3 mb-4">Hình ảnh</h3>

                        {/* File Upload UI */}
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
                                <p className="text-xs text-slate-400">PNG, JPG, GIF (Max 2MB)</p>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mt-4 aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative group">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview('');
                                        setImageFile(null);
                                    }}
                                    className="!absolute !top-2 !right-2 !bg-red-500 !text-white !p-1.5 !rounded-full !opacity-0 group-hover:!opacity-100 !shadow-sm !w-8 !h-8"
                                    title="Xóa ảnh"
                                >
                                    <FaTrash size={12} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CourseForm;