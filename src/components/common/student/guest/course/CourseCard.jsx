import { FaStar } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { hoverSpring } from "../../../../../constants/motionVariants";

const CourseCard = ({ data }) => {
    return (
        <motion.div
            // 3. Hiệu ứng hover: Bay lên 10px
            whileHover={hoverSpring}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col relative"
        >
            <Link to={`/courses/${data.id}`} className="absolute inset-0 z-10"></Link>
            {/* 1. IMAGE AREA */}
            <div className="relative overflow-hidden h-56 flex-shrink-0">
                <img src={data.image} alt={data.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded text-xs font-bold text-gray-700 shadow-sm uppercase tracking-wide">
                    {data.level}
                </span>
            </div>

            {/* 2. CONTENT AREA */}
            <div className="p-6 flex flex-col flex-grow">
                <span className="text-primary font-bold text-xs uppercase mb-2 block tracking-wide">{data.tag}</span>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 pr-4">{data.title}</h3>
                    <FiArrowUpRight className="text-2xl text-gray-900 group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{data.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-primary font-bold text-sm">{data.rating}</span>
                    <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.floor(data.rating) ? "text-yellow-400" : "text-gray-300"} />
                        ))}
                    </div>
                    <span className="text-gray-400 text-xs">({data.reviewCount})</span>
                </div>

                {/* Footer Card */}
                <div className="mt-auto">
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src={data.avatarGV} alt={data.tutor} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">{data.tutor}</h4>
                                <p className="text-xs text-gray-500">{data.students} người học</p>
                            </div>
                        </div>
                        <span className="text-xl font-bold text-primary">{data.price}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;