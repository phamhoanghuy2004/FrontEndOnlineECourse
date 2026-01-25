import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from "react-icons/fa6";

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="mb-4">
            {/* 1. Header: Câu hỏi */}
            <button
                onClick={onClick}
                className={`w-full flex items-center justify-between p-5 rounded-2xl text-left transition-all duration-300 border 
                    ${isOpen 
                        ? "bg-white border-primary shadow-md" // Style khi mở
                        : "bg-white border-gray-200 hover:border-primary/50" // Style khi đóng
                    }
                `}
            >
                <span className={`font-bold text-lg ${isOpen ? "text-primary" : "text-gray-800"}`}>
                    {question}
                </span>
                
                {/* Icon xoay/đổi màu */}
                <div className={`p-2 rounded-full transition-colors duration-300 ${isOpen ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>
                    {isOpen ? <FaMinus size={14} /> : <FaPlus size={14} />}
                </div>
            </button>

            {/* 2. Body: Câu trả lời (Animation) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-2 text-gray-600 leading-relaxed border-l-2 border-primary/20 ml-5 mt-2">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AccordionItem;