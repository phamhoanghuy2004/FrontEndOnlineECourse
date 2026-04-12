import React from 'react';
import { FaUser, FaCalendarAlt, FaFacebook, FaTwitter, FaLinkedin, FaLink } from 'react-icons/fa';
import DOMPurify from 'dompurify';

const BlogContent = ({ blog }) => {
    const cleanHTML = blog.content
        ? DOMPurify.sanitize(blog.content.replace(/&nbsp;/g, ' '))
        : '';

    return (
        <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm max-w-4xl mx-auto">

            {/* Hero image — aspect-ratio 16/9 để ảnh luôn vừa vặn */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                    src={blog.imageUrl || 'https://via.placeholder.com/900x506'}
                    alt={blog.title}
                    className="w-full h-full object-cover block"
                />

                {/* Overlay gradient từ dưới lên */}
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)' }}
                />

                {/* Nội dung overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-8 pb-7">
                    {/* Badge danh mục (tuỳ chọn) */}
                    {blog.category && (
                        <span className="inline-block mb-3 text-xs font-medium tracking-widest uppercase text-white/80
                            border border-white/30 bg-white/15 rounded-full px-3 py-1">
                            {blog.category}
                        </span>
                    )}

                    <h1 className="text-2xl md:text-4xl font-semibold text-white leading-snug mb-3">
                        {blog.title}
                    </h1>

                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-2 text-white/80 text-sm">
                            <FaUser size={12} />
                            {blog.authorName || 'Teacher'}
                        </span>
                        <span className="flex items-center gap-2 text-white/80 text-sm">
                            <FaCalendarAlt size={12} />
                            {blog.createdAt ? blog.createdAt.substring(0, 10) : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Nội dung bài viết */}
            <div className="px-8 md:px-12 py-10">

                {/* Prose content */}
                <div
                    className="prose prose-slate max-w-none text-slate-700 text-[16px] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: cleanHTML }}
                />

                {/* Divider */}
                <div className="mt-10 mb-6 border-t border-gray-100" />

                {/* Share row */}
                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-gray-500">Chia sẻ bài viết</span>
                    <div className="flex gap-2">
                        {[
                            { Icon: FaFacebook, color: 'hover:bg-blue-600 hover:text-white', base: 'text-blue-600 bg-blue-50' },
                            { Icon: FaTwitter,  color: 'hover:bg-sky-500  hover:text-white', base: 'text-sky-500  bg-sky-50'  },
                            { Icon: FaLinkedin, color: 'hover:bg-blue-800 hover:text-white', base: 'text-blue-800 bg-blue-50' },
                            { Icon: FaLink,     color: 'hover:bg-gray-600 hover:text-white', base: 'text-gray-500 bg-gray-100'},
                        ].map(({ Icon, color, base }, i) => (
                            <button
                                key={i}
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200
                                    border border-transparent ${base} ${color} hover:-translate-y-0.5`}
                            >
                                <Icon size={15} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogContent;