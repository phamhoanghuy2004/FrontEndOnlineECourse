import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
// 💥 Import thư viện rửa mã độc
import DOMPurify from 'dompurify'; 

const CourseDescription = ({ description }) => {
    // Nếu không có mô tả thì ẩn luôn khối này cho sạch
    if (!description) return null;

    // 💥 Rửa sạch mã HTML độc hại (nếu có) trước khi cho hiển thị
    const cleanHTML = DOMPurify.sanitize(description);

    return (
        // 💥 Thêm `overflow-hidden`, `break-words` và `w-full` vào thẻ bọc ngoài cùng
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm w-full overflow-hidden break-words">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-primary shrink-0" />
                Giới thiệu khóa học
            </h2>
            
            {/* 💥 Thêm `w-full` và `break-words` vào thẻ render HTML */}
            {/* Thêm `[&>img]:max-w-full` để phòng hờ giảng viên chèn ảnh to quá nó cũng tự bóp nhỏ lại */}
            <div 
                className="text-slate-600 leading-relaxed text-[15px] prose prose-slate max-w-none w-full break-words [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg"
                dangerouslySetInnerHTML={{ __html: cleanHTML }}
            />
        </div>
    );
};

export default CourseDescription;