import { motion } from 'framer-motion';

const StatBadge = ({ icon: Icon, amount, label, className, animation }) => {
  return (
    <motion.div
      animate={animation.animate}
      transition={animation.transition}
      className={`absolute bg-white p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 flex items-center gap-3 min-w-[200px] ${className}`}
    >
      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-primary text-xl">
        <Icon />
      </div>
      <div>
        <h4 className="text-xl font-bold text-gray-800">{amount}</h4>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatBadge;
