import { motion } from 'framer-motion';

// --- ANIMATION VARIANTS (Đã tách ra khỏi file chính) ---
const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
        },
    },
};

const descVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 1.2,
            duration: 0.8,
            ease: "easeOut"
        },
    },
};

const SectionHeader = ({ badge, title, description, align = "center", titleClassName = "" }) => {
    // Tách chuỗi title thành mảng các từ ngay trong component
    const titleWords = title ? title.split(" ") : [];

    return (
        <div className={`mb-12 px-4 ${align === "center" ? "text-center" : "text-left"}`}>

            {/* 1. Badge Animation */}
            {badge && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-block"
                >
                    <span className="text-primary font-bold uppercase text-sm tracking-wider bg-green-50 px-3 py-1 rounded-full">
                        {badge}
                    </span>
                </motion.div>
            )}

            {/* 2. Title Animation */}
            {title && (
                <motion.h2
                    variants={titleContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    className="text-3xl md:text-4xl font-bold mt-3 text-gray-900 leading-snug ${titleClassName}"
                >
                    {titleWords.map((word, index) => (
                        <motion.span
                            key={index}
                            variants={wordVariants}
                            className="inline-block mr-2"
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.h2>
            )}

            {/* 3. Description Animation */}
            {description && (
                <motion.p
                    variants={descVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={`text-gray-500 mt-4 max-w-3xl text-base md:text-lg leading-relaxed ${align === "center" ? "mx-auto" : ""}`}
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
};

export default SectionHeader;