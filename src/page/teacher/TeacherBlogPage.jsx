import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import blogApi from '../../api/blogApi';

const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

const TeacherBlogPage = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setIsLoading(true);
            const res = await blogApi.getMyBlogs();
            setBlogs(res.data || []);
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedBlogId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedBlogId) {
            setIsDeleting(true);
            try {
                await blogApi.delete(selectedBlogId);
                setBlogs(blogs.filter(b => b.id !== selectedBlogId));
                setSelectedBlogId(null);
                setIsDeleteModalOpen(false);
            } catch (error) {
                console.error("Failed to delete blog", error);
                alert("Failed to delete blog: " + (error.response?.data?.message || error.message));
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const filteredBlogs = (blogs || []).filter(b =>
        (b.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            {isLoading ? (
                <div className="text-center text-slate-500 py-10">Đang tải dữ liệu...</div>
            ) : filteredBlogs.length === 0 ? (
                <div className="text-center text-slate-500 py-10">Chưa có bài viết nào.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBlogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col">
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                {blog.imageUrl ? (
                                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">Không có ảnh bìa</div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                                    <FaCalendarAlt className="text-emerald-500" /> {blog.createdAt ? blog.createdAt.substring(0, 10) : 'N/A'}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">{blog.title}</h3>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{stripHtml(blog.excerpt || blog.content)}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
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
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa bài viết?"
                message="Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn."
                confirmText="Xóa bài viết"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default TeacherBlogPage;
