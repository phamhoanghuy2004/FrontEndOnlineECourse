import { FaStar } from "react-icons/fa";
import { motion } from 'framer-motion';
import { hoverSpring } from "../../../../../constants/motionVariants";

// Component con: Thẻ Review đơn lẻ
const ReviewCard = ({ data }) => (
  <motion.div
    whileHover={hoverSpring}
    className="w-[350px] bg-white p-6 rounded-xl shadow-md mx-3 flex flex-col justify-center h-full border border-green-100/50"
  >
    {/* Header: Avatar + Tên */}
    <div className="flex items-center gap-3 mb-4">
      <img
        src={data.avatar}
        alt={data.name}
        className="w-10 h-10 rounded-full object-cover border border-gray-200"
      />
      <span className="font-bold text-gray-800 text-sm">{data.name}</span>
    </div>

    {/* Content: Comment */}
    <h4 className="text-lg font-bold text-gray-900 mb-3">
      {data.comment}
    </h4>

    {/* Footer: Stars */}
    <div className="flex text-yellow-400 text-sm gap-1">
      {[...Array(5)].map((_, i) => (
        <FaStar 
          key={i} 
          className={i < (data.rating || 5) ? "text-yellow-400" : "text-gray-200"} 
        />
      ))}
    </div>
  </motion.div>
);

export default ReviewCard;