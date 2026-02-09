import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const TeacherBlogPage = () => {
    const navigate = useNavigate();
    // Mock Data
    const [blogs, setBlogs] = useState([
        { id: 1, title: '5 Mẹo luyện thi TOEIC hiệu quả', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80', excerpt: 'Chia sẻ kinh nghiệm học từ vựng và nghe hiểu...', createdAt: '2025-01-15' },
        { id: 2, title: 'Lộ trình học IELTS cho người mất gốc', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', excerpt: 'Bắt đầu từ đâu khi bạn chưa biết gì về IELTS...', createdAt: '2025-01-20' },
        { id: 3, title: 'Tổng hợp từ vựng chủ đề Business', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', excerpt: 'Danh sách 100 từ vựng thông dụng nhất trong môi trường công sở...', createdAt: '2025-01-25' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);

    const handleDeleteClick = (id) => {
        setSelectedBlogId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedBlogId) {
            setBlogs(blogs.filter(b => b.id !== selectedBlogId));
            setSelectedBlogId(null);
        }
    };

    const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quản lý bài viết</h1>
                    <p className="text-slate-500 text-sm">Chia sẻ kiến thức và thông báo tới học viên</p>
                </div>
                <Button onClick={() => navigate('/teacher/blog/new')}>
                    <FaPlus /> Viết bài mới
                </Button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <InputField
                    label="Tìm kiếm bài viết"
                    name="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm bài viết..."
                    icon={FaSearch}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                    <div key={blog.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                        <div className="relative h-48 overflow-hidden">
                            <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                                <FaCalendarAlt className="text-emerald-500" /> {blog.createdAt}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">{blog.title}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <Link to={`/teacher/blog/${blog.id}/edit`} className="text-sm font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-1 transition">
                                    <FaEdit /> Chỉnh sửa
                                </Link>
                                <button onClick={() => handleDeleteClick(blog.id)} className="text-sm font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition">
                                    <FaTrash /> Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa bài viết?"
                message="Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn."
                confirmText="Xóa bài viết"
                variant="danger"
            />
        </div>
    );
};

export default TeacherBlogPage;
