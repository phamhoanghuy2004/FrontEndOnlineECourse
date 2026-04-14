import React, { useState, useEffect } from 'react';
import blogApi from '../../../../../api/blogApi';
import BlogCard from './BlogCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const res = await blogApi.getAll();
                setBlogs(res.data || []);
            } catch (error) {
                console.error("Failed to fetch blogs", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter(blog =>
        (blog.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.excerpt || blog.content || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="py-16 bg-gray-50">
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
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredBlogs.map((blog) => (
                                <motion.div
                                    layout
                                    key={blog.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <BlogCard blog={blog} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
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
