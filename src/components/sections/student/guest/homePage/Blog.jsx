import React from 'react';
import { FaLongArrowAltRight } from "react-icons/fa";

// 1. Mock Data chuẩn theo ảnh
const blogs = [
    {
        id: 1,
        date: "November 16, 2014",
        title: "Lộ trình học TOEIC cho người mất gốc",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: "Bạn đang là người muốn học TOEIC nhưng không biết bắt đầu từ đâu? Bài viết này sẽ vạch ra lộ trình chi tiết từng bước một..."
    },
    {
        id: 2,
        date: "September 24, 2017",
        title: "Lộ trình IELTS từ 0 - 6.5+",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: "Mất gốc tiếng Anh thì nên thi IELTS như thế nào? Chuẩn bị và bắt đầu ôn luyện thi IELTS từ con số 0 cần những tài liệu gì..."
    },
    {
        id: 3,
        date: "March 13, 2014",
        title: "100+ từ vựng TOEIC chủ đề Marketing thông dụng",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: "Để làm tốt phần thi TOEIC Reading, đặc biệt là Part 5 - 6 - 7, chắc chắn thí sinh phải có kiến thức từ vựng chuyên sâu về nhiều chủ đề thì mới dễ dàng chinh phục được điểm số tuyệt đối trong bài thi này."
    }
];

const Blog = () => {
    return (
        <section id="blog" className="py-20 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6">

                {/* Header Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-left">
                    Blogs
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT COLUMN: Danh sách bài viết nhỏ (2 Items) */}
                    <div className="flex flex-col gap-10">
                        {blogs.slice(0, 2).map((item) => (
                            <div key={item.id} className="group flex flex-col sm:flex-row gap-6 items-start cursor-pointer">
                                {/* Image Thumbnail */}
                                <div className="w-full sm:w-56 h-40 flex-shrink-0 overflow-hidden rounded-xl">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <span className="text-primary font-bold text-xs uppercase mb-2 block tracking-wide">
                                        {item.date}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-3 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                        {item.content}
                                    </p>

                                    {/* Link xem thêm (Optional) */}
                                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                        Read More <FaLongArrowAltRight />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT COLUMN: Bài viết nổi bật (Featured Post) */}
                    <div className="group cursor-pointer flex flex-col h-full">
                        {/* Featured Image */}
                        <div className="w-full h-64 lg:h-72 overflow-hidden rounded-xl mb-6">
                            <img
                                src={blogs[2].image}
                                alt={blogs[2].title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        {/* Featured Content */}
                        <div className="flex-1 flex flex-col">
                            <span className="text-primary font-bold text-xs uppercase mb-3 block tracking-wide">
                                {blogs[2].date}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-4 leading-tight">
                                {blogs[2].title}
                            </h3>
                            <p className="text-gray-500 text-base line-clamp-3 leading-relaxed mb-6">
                                {blogs[2].content}
                            </p>

                            {/* 3 Dots trang trí giống trong ảnh */}
                            <div className="mt-auto flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-orange-100"></span>
                                <span className="w-3 h-3 rounded-full bg-blue-100"></span>
                                <span className="w-3 h-3 rounded-full bg-pink-100"></span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Blog;