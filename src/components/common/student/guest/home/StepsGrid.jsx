import { motion } from 'framer-motion';
import StepCard from './StepCard';

// --- ANIMATION VARIANTS ---
const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        // delayChildren: 1s để đợi Header chạy xong mới bắt đầu hiện card
        transition: { staggerChildren: 0.3, delayChildren: 1 }, 
    },
};

const cardItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } },
};

const StepsGrid = ({ data }) => {
    return (
        <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
            {data.map((step) => (
                <StepCard 
                    key={step.id} 
                    step={step} 
                    variants={cardItemVariants} // Truyền variants xuống con để motion tự xử lý stagger
                />
            ))}
        </motion.div>
    );
};

export default StepsGrid;