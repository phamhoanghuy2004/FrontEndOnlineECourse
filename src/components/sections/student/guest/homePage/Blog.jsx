import React, { useEffect, useState } from 'react';
import { FaLongArrowAltRight } from "react-icons/fa";
import blogApi from '../../../../../api/blogApi';
import { Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLatestBlogs = async () => {
            try {
                const response = await blogApi.getLatestBlogsApi();
                if (response.data) {
                    setBlogs(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách blog mới nhất:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestBlogs();
    }, []);

    const formatBlogDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        let content = tmp.textContent || tmp.innerText || "";
        // Loại bỏ khoảng trắng dư thừa
        return content.trim();
    };

    if (loading) {
        return (
            <section id="blog" className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-10 text-left">Blogs</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="flex flex-col gap-10">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex flex-col sm:flex-row gap-6">
                                    <Skeleton.Image active className="!w-full !sm:w-56 !h-40" />
                                    <div className="flex-1">
                                        <Skeleton active paragraph={{ rows: 2 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <Skeleton.Image active className="!w-full !h-64 !lg:h-72 mb-6" />
                            <Skeleton active paragraph={{ rows: 3 }} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Nếu không có blog nào
    if (blogs.length === 0) return null;

    // Giả sử blogs[0] và blogs[1] bên trái, blogs[2] là featured bên phải (nếu có 3 cái)
    // Nếu có ít hơn 3, chúng ta vẫn xử lý linh hoạt
    const leftBlogs = blogs.length > 2 ? blogs.slice(0, 2) : (blogs.length > 0 ? blogs.slice(0, Math.min(blogs.length, 2)) : []);
    const featuredBlog = blogs.length >= 3 ? blogs[2] : (blogs.length === 1 ? blogs[0] : (blogs.length === 2 ? null : null));

    return (
        <section id="blog" className="py-20 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6">

                {/* Header Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-left">
                    Blogs
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT COLUMN: Danh sách bài viết nhỏ */}
                    <div className="flex flex-col gap-10">
                        {leftBlogs.map((item) => (
                            <div 
                                key={item.id} 
                                className="group flex flex-col sm:flex-row gap-6 items-start cursor-pointer"
                                onClick={() => navigate(`/blog/${item.id}`)}
                            >
                                {/* Image Thumbnail */}
                                <div className="w-full sm:w-56 h-40 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                    <img
                                        src={item.imageUrl || "https://via.placeholder.com/400x300?text=EChill+Blog"}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <span className="text-primary font-bold text-xs uppercase mb-2 block tracking-wide">
                                        {formatBlogDate(item.createdAt)}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-3 leading-tight line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                        {stripHtml(item.excerpt || item.content).substring(0, 120)}
                                    </p>

                                    {/* Link xem thêm */}
                                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                        Read More <FaLongArrowAltRight />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT COLUMN: Bài viết nổi bật (Featured Post) */}
                    {featuredBlog && (
                        <div 
                            className="group cursor-pointer flex flex-col h-full"
                            onClick={() => navigate(`/blog/${featuredBlog.id}`)}
                        >
                            {/* Featured Image */}
                            <div className="w-full h-64 lg:h-72 overflow-hidden rounded-xl mb-6 bg-gray-100">
                                <img
                                    src={featuredBlog.imageUrl || "https://via.placeholder.com/800x600?text=EChill+Featured+Blog"}
                                    alt={featuredBlog.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* Featured Content */}
                            <div className="flex-1 flex flex-col">
                                <span className="text-primary font-bold text-xs uppercase mb-3 block tracking-wide">
                                    {formatBlogDate(featuredBlog.createdAt)}
                                </span>
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-4 leading-tight">
                                    {featuredBlog.title}
                                </h3>
                                <p className="text-gray-500 text-base line-clamp-3 leading-relaxed mb-6">
                                    {stripHtml(featuredBlog.excerpt || featuredBlog.content).substring(0, 200)}
                                </p>

                                {/* 3 Dots trang trí */}
                                <div className="mt-auto flex gap-2">
                                    <span className="w-3 h-3 rounded-full bg-orange-100"></span>
                                    <span className="w-3 h-3 rounded-full bg-blue-100"></span>
                                    <span className="w-3 h-3 rounded-full bg-pink-100"></span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
};

export default Blog;
