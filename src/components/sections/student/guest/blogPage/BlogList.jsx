import React, { useState, useEffect } from 'react';
import blogApi from '../../../../../api/blogApi';
import BlogCard from './BlogCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    
    // STATE PHÂN TRANG
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 3; // Hiển thị đúng 3 blog mỗi trang để nằm trên 1 hàng

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const params = {
                    page: currentPage,
                    size: pageSize
                };
                
                // Nếu có search term, backend hiện tại chưa hỗ trợ search kèm phân trang qua API getAll
                // Nhưng chúng ta vẫn gửi lên nếu sau này backend nâng cấp.
                // Hiện tại chúng ta sẽ lấy toàn bộ hoặc theo page.
                
                const res = await blogApi.getAll(params);
                const pageData = res.data?.data || res.data || {};
                
                setBlogs(pageData.content || []);
                setTotalPages(pageData.totalPages || 1);
            } catch (error) {
                console.error("Failed to fetch blogs", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, [currentPage]);

    // Render bộ nút phân trang (Giống CourseListSection)
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300 ${
                        currentPage === i
                            ? "bg-primary text-white shadow-lg shadow-primary/40 transform scale-105"
                            : "bg-white text-gray-500 hover:bg-green-50 hover:text-primary border border-gray-200"
                    }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center items-center gap-3 mt-16">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300 border ${
                        currentPage === 1 
                            ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-primary hover:text-white hover:border-primary shadow-sm"
                    }`}
                >
                    <FaChevronLeft size={14} />
                </button>

                <div className="flex gap-2">
                    {pages}
                </div>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300 border ${
                        currentPage === totalPages 
                            ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-primary hover:text-white hover:border-primary shadow-sm"
                    }`}
                >
                    <FaChevronRight size={14} />
                </button>
            </div>
        );
    };

    // Lọc blog theo searchTerm (Nếu backend chưa hỗ trợ search thì lọc ở frontend trên trang hiện tại)
    const filteredBlogs = blogs.filter(blog =>
        (blog.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.excerpt || blog.content || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="py-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6">
                {/* Search Input */}
                <div className="max-w-xl mx-auto mb-12 relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
                    />
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Đang tải dữ liệu...</div>
                ) : (
                    <>
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence mode='popLayout'>
                                {filteredBlogs.map((blog) => (
                                    <motion.div
                                        layout
                                        key={blog.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <BlogCard blog={blog} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                        
                        {/* Pagination UI */}
                        {renderPagination()}
                    </>
                )}

                {!isLoading && filteredBlogs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Không tìm thấy bài viết nào phù hợp.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogList;
