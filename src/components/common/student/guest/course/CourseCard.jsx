import { FaStar } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { hoverSpring } from "../../../../../constants/motionVariants";

const CourseCard = ({ data }) => {
    // 💥 Helper format giá tiền sang VNĐ
    const formatPrice = (amount) => {
        if (!amount || amount === 0) return "Miễn phí";
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    };

    // 💥 Helper hiển thị Level thân thiện hơn
    const formatLevel = (level) => {
        const levelMap = {
            'BEGINNER': 'Cơ bản',
            'INTERMEDIATE': 'Trung cấp',
            'ADVANCED': 'Nâng cao',
            'ALL': 'Mọi trình độ'
        };
        return levelMap[level] || level;
    };

    // 💥 Ảnh mặc định phòng trường hợp Backend trả về null
    const defaultCourseImg = "https://placehold.co/600x400/e2e8f0/1e293b?text=Course+Image";
    const defaultAvatar = "https://placehold.co/100x100/e2e8f0/1e293b?text=GV";

    return (
        <motion.div
            whileHover={hoverSpring}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col relative"
        >
            <Link to={`/courses/${data.id}`} className="absolute inset-0 z-10"></Link>

            {/* 1. IMAGE AREA */}
            <div className="relative overflow-hidden h-56 flex-shrink-0 bg-slate-100">
                <img
                    src={data.imageUrl || defaultCourseImg}
                    alt={data.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded text-xs font-bold text-gray-700 shadow-sm uppercase tracking-wide">
                    {formatLevel(data.level)}
                </span>

                {data.discountPercent > 0 && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-xs font-bold shadow-sm animate-pulse">
                        -{data.discountPercent}%
                    </span>
                )}
            </div>

            {/* 2. CONTENT AREA */}
            <div className="p-6 flex flex-col flex-grow">
                <span className="text-primary font-bold text-xs uppercase mb-2 block tracking-wide truncate">
                    {data.categoryName}
                </span>

                <div className="flex justify-between items-start mb-2 gap-2">
                    {/* 💥 FIX: Ép cứng chiều cao h-14 (đúng 2 dòng) và thêm thuộc tính title để hover chuột hiện full tên */}
                    <h3
                        className="text-xl leading-7 font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 h-14 flex-grow"
                        title={data.name}
                    >
                        {data.name}
                    </h3>
                    <FiArrowUpRight className="text-2xl text-gray-900 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>

                {/* Phần mô tả cũng đã được ép h-10 (đúng 2 dòng) từ trước */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10" title={`Khóa học ${data.categoryName} chất lượng cao được thiết kế chuyên biệt bởi giảng viên ${data.teacherName}.`}>
                    Khóa học {data.categoryName} chất lượng cao được thiết kế chuyên biệt bởi giảng viên {data.teacherName}.
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-primary font-bold text-sm">5.0</span>
                    <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                        ))}
                    </div>
                    <span className="text-gray-400 text-xs">(0)</span>
                </div>

                {/* Footer Card */}
                <div className="mt-auto">
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">

                        <div className="flex items-center gap-3 w-1/2"> {/* Giới hạn độ rộng để chừa chỗ cho giá */}
                            <img
                                src={data.teacherAvatarUrl || defaultAvatar}
                                alt={data.teacherName}
                                className="w-10 h-10 rounded-full object-cover border border-gray-100 flex-shrink-0"
                            />
                            <div className="overflow-hidden">
                                {/* 💥 FIX: Thêm truncate cho tên giáo viên lỡ họ tên dài quá */}
                                <h4 className="font-bold text-sm text-gray-900 truncate" title={data.teacherName}>
                                    {data.teacherName}
                                </h4>
                                <p className="text-xs text-gray-500">0 người học</p>
                            </div>
                        </div>

                        <div className="text-right flex flex-col justify-center flex-shrink-0">
                            {data.discountPercent > 0 && data.originalPrice && (
                                <span className="text-xs text-gray-400 line-through mb-[-4px]">
                                    {formatPrice(data.originalPrice)}
                                </span>
                            )}
                            <span className="text-xl font-bold text-primary">
                                {formatPrice(data.price)}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;