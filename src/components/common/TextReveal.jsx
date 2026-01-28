import { motion } from 'framer-motion';
import { staggerContainer, springIn } from '../../constants/motionVariants';

const TextReveal = ({ text, className = "", stagger = 0.1 }) => {
  if (!text) return null;
  
  const words = text.split(" ");

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      custom={{ stagger: stagger, delay: 0 }}
      className={`inline-block ${className}`} // inline-block để giữ dòng
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={springIn}
          className="inline-block mr-[0.25em]" // mr để tạo khoảng cách giữa các từ
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextReveal;