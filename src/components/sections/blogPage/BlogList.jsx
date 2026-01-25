import React, { useState } from 'react';
import { blogs } from '../../../data/mockData';
import BlogCard from './BlogCard';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ["ALL", "TOEIC", "IELTS", "Giao tiếp", "Kinh nghiệm ôn thi"];

const BlogList = () => {
    const [activeCategory, setActiveCategory] = useState("ALL");

    const filteredBlogs = activeCategory === "ALL"
        ? blogs
        : blogs.filter(blog => blog.category === activeCategory);

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full font-bold transition-all text-sm ${activeCategory === cat
                                    ? 'bg-primary text-white shadow-lg transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
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

                {filteredBlogs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Chưa có bài viết nào trong danh mục này.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogList;
