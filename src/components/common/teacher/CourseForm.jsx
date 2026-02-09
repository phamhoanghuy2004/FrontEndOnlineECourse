import { useState, useEffect } from 'react';
import InputField from '../InputField';
import SelectField from '../SelectField';
import LessonList from './LessonList';
import Button from '../Button';
import { FaSave, FaImage, FaLayerGroup, FaTags, FaAlignLeft, FaDollarSign, FaArrowLeft, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CourseForm = ({ initialData, onSubmit, isEditing }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'BASIC',
        price: '',
        image: '',
        category: 'TOEIC',
        lessons: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
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
            // Create fake local URL
            const url = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, image: url }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* Action Bar */}
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
                <div className="flex gap-3">
                    <Button type="button" variant="secondary" onClick={() => navigate('/teacher/courses')}>
                        Hủy bỏ
                    </Button>
                    <Button type="submit" className="!bg-emerald-600 !shadow-emerald-500/30 hover:!bg-emerald-700">
                        <FaSave /> {isEditing ? 'Lưu thay đổi' : 'Tạo khóa học'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: General Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                        <h3 className="font-bold text-lg text-slate-800 border-b border-slate-50 pb-3 mb-4">Thông tin chung</h3>

                        <InputField
                            label="Tên khóa học"
                            name="title"
                            value={formData.title}
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
                                    { value: 'BASIC', label: 'Basic (Mới bắt đầu)' },
                                    { value: 'MEDIUM', label: 'Medium (Trung bình)' },
                                    { value: 'ADVANCE', label: 'Advanced (Nâng cao)' }
                                ]}
                            />
                            <SelectField
                                label="Danh mục"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                icon={FaLayerGroup}
                                options={[
                                    { value: 'TOEIC', label: 'TOEIC' },
                                    { value: 'IELTS', label: 'IELTS' }
                                ]}
                            />
                        </div>

                        <InputField
                            label="Học phí (VNĐ)"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="VD: 500000"
                            icon={FaDollarSign}
                            required
                        />

                        <div>
                            <label className="text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wide block mb-1">
                                Mô tả khóa học
                            </label>
                            <div className="relative group">
                                <FaAlignLeft className="absolute left-3 top-3 text-slate-400 text-xs" />
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                                    placeholder="Mô tả nội dung, mục tiêu khóa học..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lesson Management */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <LessonList lessons={formData.lessons} onChange={handleLessonsChange} />
                    </div>
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
                                <p className="text-xs text-slate-400">PNG, JPG, GIF (Max 5MB)</p>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {formData.image && (
                            <div className="mt-4 aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative group">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                <Button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
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
