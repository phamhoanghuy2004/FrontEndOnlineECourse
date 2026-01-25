import React from 'react';
import { FaUser, FaCalendarAlt, FaFacebook, FaTwitter, FaLinkedin, FaLink } from 'react-icons/fa';

const BlogContent = ({ blog }) => {
    return (
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-64 md:h-96 relative">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="container mx-auto px-6 pb-8 md:pb-12">
                        <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                            {blog.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight shadow-sm">
                            {blog.title}
                        </h1>
                        <div className="flex items-center gap-6 text-white/90 text-sm font-medium">
                            <span className="flex items-center gap-2">
                                <FaUser /> {blog.author}
                            </span>
                            <span className="flex items-center gap-2">
                                <FaCalendarAlt /> {blog.date}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Main Content */}
                <div className="lg:col-span-8">
                    <div
                        className="prose prose-lg max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Share Buttons */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                        <span className="font-bold text-gray-900">Chia sẻ bài viết:</span>
                        <div className="flex gap-3">
                            <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <FaFacebook />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                                <FaTwitter />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center hover:bg-blue-800 hover:text-white transition-all">
                                <FaLinkedin />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-600 hover:text-white transition-all">
                                <FaLink />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Optional - e.g. Related Posts or Table of Contents) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="font-bold text-xl text-gray-900 mb-4">Mục lục</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li className="hover:text-primary cursor-pointer transition-colors">• 1. Nghe thụ động hàng ngày</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">• 2. Học từ vựng theo chủ đề</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">• 3. Chú ý đến keyword</li>
                        </ul>
                    </div>
                    {/* Could add subscription box here */}
                </div>

            </div>
        </article>
    );
};

export default BlogContent;
