import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

const BlogCard = ({ blog }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden group h-full flex flex-col"
        >
            <Link to={`/blog/${blog.id}`} className="block relative overflow-hidden h-56">
                <img
                    src={blog.imageUrl || 'https://via.placeholder.com/800'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </Link>

            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                        <FaUser className="text-primary" /> {blog.authorName || 'Teacher'}
                    </span>
                    <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-primary" /> {blog.createdAt ? blog.createdAt.substring(0, 10) : 'N/A'}
                    </span>
                </div>

                <Link to={`/blog/${blog.id}`} className="block mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                    </h3>
                </Link>

                <p className="text-gray-600 mb-6 text-sm line-clamp-3 flex-grow">
                    {stripHtml(blog.excerpt || blog.content)}
                </p>

                <Link
                    to={`/blog/${blog.id}`}
                    className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                >
                    Đọc tiếp <FaArrowRight />
                </Link>
            </div>
        </motion.div>
    );
};

export default BlogCard;
