import { FaSave, FaLayerGroup, FaTags, FaDollarSign, FaArrowLeft, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import Button from '../../common/Button';
import InputField from '../../common/InputField';
import SelectField from '../../common/SelectField';
import LessonList from './LessonList';
import categoryApi from '../../../api/categoryApi';
// 🔴 [THÊM MỚI] Import API gọi tag
import tagApi from '../../../api/tagApi';


const CourseForm = ({ initialData, onSubmit, isEditing, isSubmitting }) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    // 🔴 [THÊM MỚI] State lưu danh sách tags từ API
    const [availableTags, setAvailableTags] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        level: 'BEGINNER',
        price: '',
        originalPrice: '',
        categoryId: '',
        // 🔴 [THÊM MỚI] Thêm mảng chứa ID của tags được chọn
        tagIds: [],
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
        const fetchInitialMetadata = async () => {
            // Luồng 1: Gọi Categories
            try {
                const catResponse = await categoryApi.getAll();
                setCategories(catResponse.data || []);
                if (!isEditing && catResponse.data?.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: catResponse.data[0].id }));
                }
            } catch (error) {
                console.error('Lỗi khi tải Categories:', error);
            }

            // Luồng 2: Gọi Tags (Nếu API Tags lỗi 500, Categories vẫn hiển thị bình thường)
            try {
                const tagResponse = await tagApi.getAll();
                setAvailableTags(tagResponse.data || []);
            } catch (error) {
                console.error('Lỗi khi tải Tags:', error);
                // Báo lỗi nhẹ cho User biết
                alert("Không thể tải danh sách Kỹ năng trọng tâm do lỗi máy chủ!");
            }
        };

        fetchInitialMetadata();
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
                // 🔴 [THÊM MỚI] Map danh sách TagResponse từ backend ra mảng ID
                tagIds: initialData.tags ? initialData.tags.map(t => t.id) : [],
                lessons: initialData.lessons || []
            });
            setImagePreview(initialData.imageUrl || initialData.image || '');
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 🔴 [THÊM MỚI] Hàm xử lý Toggle khi click chọn/bỏ chọn Tag
    const handleTagToggle = (tagId) => {
        setFormData(prev => {
            const isSelected = prev.tagIds.includes(tagId);
            if (isSelected) {
                // Xóa tag nếu đã chọn
                return { ...prev, tagIds: prev.tagIds.filter(id => id !== tagId) };
            } else {
                // Kiểm tra giới hạn 3 tag (rào cản UI)
                if (prev.tagIds.length >= 3) {
                    alert("Chỉ được chọn tối đa 3 kỹ năng trọng tâm!");
                    return prev;
                }
                return { ...prev, tagIds: [...prev.tagIds, tagId] };
            }
        });
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

        // 🔴 [THÊM MỚI] Validate chặn lại lần nữa trước khi gửi (Đề phòng)
        if (formData.tagIds.length === 0) {
            alert("Vui lòng chọn ít nhất 1 Tag trọng tâm cho khóa học!");
            return;
        }

        onSubmit(formData, imageFile);
    };

    // Group availableTags by parentName
    const groupedTags = availableTags.reduce((acc, tag) => {
        const groupName = tag.parentName || "Khác";
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(tag);
        return acc;
    }, {});

    const getGroupConfig = (parentName) => {
        switch (parentName) {
            case 'Grammar':
                return {
                    title: 'Ngữ Pháp (Grammar)',
                    bgColor: 'bg-indigo-50/40',
                    borderColor: 'border-indigo-100',
                    badgeColor: 'bg-indigo-100 text-indigo-700',
                    pillSelectedColor: 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/10',
                    pillHoverColor: 'hover:border-indigo-400 hover:text-indigo-600',
                    textColor: 'text-indigo-800'
                };
            case 'Vocabulary':
                return {
                    title: 'Từ Vựng (Vocabulary)',
                    bgColor: 'bg-amber-50/40',
                    borderColor: 'border-amber-100',
                    badgeColor: 'bg-amber-100 text-amber-700',
                    pillSelectedColor: 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/10',
                    pillHoverColor: 'hover:border-amber-400 hover:text-amber-600',
                    textColor: 'text-amber-800'
                };
            case 'Listening Comprehension':
                return {
                    title: 'Nghe Hiểu (Listening)',
                    bgColor: 'bg-purple-50/40',
                    borderColor: 'border-purple-100',
                    badgeColor: 'bg-purple-100 text-purple-700',
                    pillSelectedColor: 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-600/10',
                    pillHoverColor: 'hover:border-purple-400 hover:text-purple-600',
                    textColor: 'text-purple-800'
                };
            case 'Reading Comprehension':
                return {
                    title: 'Đọc Hiểu (Reading)',
                    bgColor: 'bg-rose-50/40',
                    borderColor: 'border-rose-100',
                    badgeColor: 'bg-rose-100 text-rose-700',
                    pillSelectedColor: 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/10',
                    pillHoverColor: 'hover:border-rose-400 hover:text-rose-600',
                    textColor: 'text-rose-800'
                };
            default:
                return {
                    title: parentName,
                    bgColor: 'bg-slate-50/40',
                    borderColor: 'border-slate-100',
                    badgeColor: 'bg-slate-100 text-slate-700',
                    pillSelectedColor: 'bg-slate-800 text-white border-slate-800',
                    pillHoverColor: 'hover:border-slate-400 hover:text-slate-800',
                    textColor: 'text-slate-800'
                };
        }
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
                                    { value: 'BEGINNER', label: 'Beginner (Sơ cấp)' },
                                    { value: 'INTERMEDIATE', label: 'Intermediate (Trung cấp)' },
                                    { value: 'ADVANCED', label: 'Advanced (Nâng cao)' },
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
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField
                                label="Giá khuyến mãi (đ)"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="VD: 50000"
                                icon={FaDollarSign}
                                required
                            />
                            <InputField
                                label="Giá gốc (đ)"
                                name="originalPrice"
                                type="number"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                placeholder="VD: 1000000"
                                icon={FaDollarSign}
                            />
                        </div>

                        {/* 🔴 [THÊM MỚI] GIAO DIỆN CHỌN TAG ĐÃ GOM NHÓM THEO TAG CHA */}
                        <div>
                            <label className="text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wide block mb-2">
                                Kỹ năng trọng tâm (Tags) <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                {Object.entries(groupedTags).map(([parentName, tags]) => {
                                    const config = getGroupConfig(parentName);
                                    return (
                                        <div key={parentName} className={`p-4 rounded-xl border ${config.borderColor} ${config.bgColor} flex flex-col justify-between`}>
                                            <div>
                                                <div className="flex items-center justify-between mb-3 border-b border-dashed border-slate-200 pb-2">
                                                    <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-md ${config.badgeColor}`}>
                                                        {config.title}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {tags.map(tag => {
                                                        const isSelected = formData.tagIds.includes(tag.id);
                                                        const isMaxReached = formData.tagIds.length >= 3 && !isSelected;

                                                        return (
                                                            <button
                                                                type="button"
                                                                key={tag.id}
                                                                onClick={() => handleTagToggle(tag.id)}
                                                                disabled={isMaxReached}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${isSelected
                                                                    ? config.pillSelectedColor
                                                                    : 'bg-white text-slate-600 border border-slate-200 shadow-xs ' + config.pillHoverColor
                                                                    } ${isMaxReached ? 'opacity-40 cursor-not-allowed hover:border-slate-200 hover:text-slate-600' : ''}`}
                                                            >
                                                                <FaTags size={10} className={isSelected ? "text-white" : "text-slate-400"} />
                                                                {tag.name}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {availableTags.length === 0 && (
                                    <div className="col-span-full py-6 text-center">
                                        <span className="text-sm text-slate-400 font-medium">Đang tải danh sách thẻ tag...</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-2 ml-1">
                                Đã chọn <span className={formData.tagIds.length === 3 ? "text-emerald-600 font-bold" : ""}>{formData.tagIds.length}/3</span> thẻ tag. Phân loại kỹ giúp thuật toán phân phối khóa học tốt hơn.
                            </p>
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