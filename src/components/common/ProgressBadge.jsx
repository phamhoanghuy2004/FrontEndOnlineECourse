import { motion } from 'framer-motion';

const ProgressBadge = ({ amount, label, className, animation }) => {
  return (
    <motion.div
      animate={animation.animate}
      transition={animation.transition}
      className={`absolute bg-white p-5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 text-center min-w-[140px] ${className}`}
    >
      <div className="relative w-16 h-16 mx-auto mb-2">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="32" cy="32" r="28" stroke="#F3F4F6" strokeWidth="6" fill="none" />
          <circle cx="32" cy="32" r="28" stroke="#34D399" strokeWidth="6" fill="none" strokeDasharray="175" strokeDashoffset="40" strokeLinecap="round" />
        </svg>
      </div>
      <h4 className="text-xl font-bold text-gray-800">{amount}</h4>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </motion.div>
  );
};

export default ProgressBadge;