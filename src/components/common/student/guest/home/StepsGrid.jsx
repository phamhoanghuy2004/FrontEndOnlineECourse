import { motion } from 'framer-motion';
import StepCard from './StepCard';
import { staggerContainer, springIn } from '../../../../../constants/motionVariants';


const StepsGrid = ({ data }) => {
    
    return (
        <motion.div
            variants={staggerContainer} // Dùng biến đã customize
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={{ stagger: 0.3, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
            {data.map((step) => (
                <StepCard 
                    key={step.id} 
                    step={step} 
                    // Dùng cardSpring chung cho tất cả các Card trong dự án
                    variants={springIn} 
                />
            ))}
        </motion.div>
    );
};

export default StepsGrid;