import { motion } from 'framer-motion';
import { FaMedal } from "react-icons/fa"; 
const StudentCard = ({ data }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="relative bg-white rounded-xl shadow-md p-4 w-[280px] h-full mx-3 border border-gray-100 flex flex-col items-center text-center overflow-visible"
        >
            {/* --- 2. HUY CHƯƠNG VÀNG --- */}
            <motion.div 
                className="absolute -top-3 left-4 z-9999" 
                animate={{ y: [0, -8, 0] }} 
                transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
            >
                {/* Icon Medal màu vàng + đổ bóng */}
                <div className="bg-white rounded-full p-1 shadow-md">
                     <FaMedal className="text-yellow-400 text-3xl drop-shadow-sm" />
                </div>
            </motion.div>

            {/* Avatar */}
            <div className="w-24 h-24 rounded-lg overflow-hidden mb-4 shadow-sm mt-2">
                <img 
                    src={data.avatar} 
                    alt={data.name} 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Tên học viên */}
            <h4 className="font-bold text-gray-900 text-lg mb-4">{data.name}</h4>

            {/* --- 3. BẢNG ĐIỂM (Đã chỉnh căn trái) --- */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full px-4 mb-4">
                {/* Reading */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-gray-600 w-5 text-left">R:</span> {/* w-5 để căn thẳng cột */}
                    <span className="font-extrabold text-orange-500 text-base">{data.scores.reading}</span>
                </div>
                {/* Listening */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-gray-600 w-5 text-left">L:</span>
                    <span className="font-extrabold text-orange-500 text-base">{data.scores.listening}</span>
                </div>
                {/* Speaking */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-gray-600 w-5 text-left">S:</span>
                    <span className="font-extrabold text-orange-500 text-base">{data.scores.speaking}</span>
                </div>
                {/* Writing */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-gray-600 w-5 text-left">W:</span>
                    <span className="font-extrabold text-orange-500 text-base">{data.scores.writing}</span>
                </div>
            </div>

            {/* Điểm tổng */}
            <div className="w-full border-t border-gray-100 pt-3 mt-auto flex justify-between items-center px-4">
                <span className="font-bold text-gray-800 text-sm">Total:</span>
                <span className="font-extrabold text-orange-500 text-2xl">{data.scores.total}</span>
            </div>
        </motion.div>
    );
};

export default StudentCard;