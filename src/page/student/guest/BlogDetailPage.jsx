import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import blogApi from '../../../api/blogApi';
import { FiArrowLeft } from "react-icons/fi";
import BlogContent from '../../../components/sections/student/guest/blogPage/BlogContent';

const BlogDetailPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlog = async () => {
            try {
                setIsLoading(true);
                const res = await blogApi.getById(id);
                setBlog(res.data);
            } catch (error) {
                console.error("Failed to fetch blog detailing", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
                <p className="text-gray-500">Đang tải bài viết...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Bài viết không tồn tại</h2>
                <Link to="/blog" className="text-primary hover:underline flex items-center gap-2">
                    <FiArrowLeft /> Quay lại trang Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-24 font-sans text-gray-800">
            {/* Breadcrumb / Back Navigation */}
            <div className="container mx-auto px-6 mb-6">
                <Link to="/blog" className="text-gray-500 hover:text-primary flex items-center gap-2 w-fit mb-4">
                    <FiArrowLeft /> Quay lại danh sách bài viết
                </Link>
            </div>

            <BlogContent blog={blog} />

        </div>
    );
};

export default BlogDetailPage;
