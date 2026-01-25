import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BlogCard = ({ blog }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden group h-full flex flex-col"
        >
            <Link to={`/blog/${blog.id}`} className="block relative overflow-hidden h-56">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {blog.category}
                    </span>
                </div>
            </Link>

            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                        <FaUser className="text-primary" /> {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-primary" /> {blog.date}
                    </span>
                </div>

                <Link to={`/blog/${blog.id}`} className="block mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                    </h3>
                </Link>

                <p className="text-gray-600 mb-6 text-sm line-clamp-3 flex-grow">
                    {blog.description}
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
