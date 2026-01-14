import { motion } from 'framer-motion';

const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const CourseLevelHeader = ({ title, description }) => {
    return (
        <div className="text-center mb-8 max-w-4xl mx-auto px-4">
            {/* Title: Hiện lên trước */}
            <motion.h2
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                className="text-3xl md:text-4xl font-bold text-primary mb-3"
            >
                {title}
            </motion.h2>

            {/* Description: Hiện lên sau (delay 0.2s) */}
            <motion.p
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                transition={{ delay: 0.2 }} // Delay cho mô tả
                className="text-gray-500 text-sm md:text-base leading-relaxed"
            >
                {description}
            </motion.p>
        </div>
    );
};

export default CourseLevelHeader;