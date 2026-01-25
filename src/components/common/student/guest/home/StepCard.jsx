import { motion } from 'framer-motion';

const StepCard = ({ step, variants }) => {
    return (
        <motion.div
            variants={variants}
            whileHover={{ y: -10 }}
            className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/30 flex flex-col justify-between h-full relative overflow-hidden group"
        >
            {/* Decoration Circle Blur */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500"></div>

            <div className="flex items-center gap-4 mb-6">
                {/* Icon Box */}
                <div className="w-14 h-14 bg-white text-primary rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm transform group-hover:rotate-6 transition-transform duration-300">
                    {step.icon}
                </div>
                {/* Title */}
                <h3 className="text-xl font-bold leading-tight">
                    {step.title}
                </h3>
            </div>

            {/* Description */}
            <p className="text-white/90 text-sm md:text-base leading-relaxed font-medium">
                {step.desc}
            </p>
        </motion.div>
    );
};

export default StepCard;