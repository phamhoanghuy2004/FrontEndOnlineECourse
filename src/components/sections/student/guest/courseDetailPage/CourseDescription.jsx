import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
// 💥 Import thư viện rửa mã độc
import DOMPurify from 'dompurify'; 

const CourseDescription = ({ description }) => {
    // Nếu không có mô tả thì ẩn luôn khối này cho sạch
    if (!description) return null;

    // 💥 CHÌA KHÓA NẰM Ở ĐÂY: Quét sạch mã độc VÀ chém đứt mọi khoảng trắng dính chùm (&nbsp;)
    const cleanHTML = DOMPurify.sanitize(description.replace(/&nbsp;/g, ' '));

    return (
        // 💥 Thêm min-w-0 để chống trào viền nếu lỡ bị bọc trong Flexbox
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm w-full min-w-0 overflow-hidden">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-primary shrink-0" />
                Giới thiệu khóa học
            </h2>
            
            <div 
                // 💥 Class được dọn dẹp siêu sạch, giao trọn niềm tin cho 'prose'
                className="prose prose-slate max-w-none w-full text-slate-600 text-[15px]"
                dangerouslySetInnerHTML={{ __html: cleanHTML }}
            />
        </div>
    );
};

export default CourseDescription;