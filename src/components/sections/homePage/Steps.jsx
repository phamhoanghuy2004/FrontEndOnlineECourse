import { motion } from 'framer-motion';
import { steps } from "../../../data/mockData";

// --- 1. CONFIG ANIMATION CHO TEXT ---
const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Thời gian trễ giữa mỗi từ (0.1s)
            delayChildren: 0.2,   // Đợi 0.2s mới bắt đầu chạy
        },
    },
};

const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' }, // Ban đầu: mờ, nằm dưới, bị nhòe
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
            delay: 1.5, // Đợi 1.5s (cho tiêu đề chạy xong) mới hiện ra
            duration: 0.8,
            ease: "easeOut"
        },
    },
};

// Animation cho các thẻ Steps (giữ nguyên)
const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.3, delayChildren: 1 }, // Đợi header chạy xong mới hiện card
    },
};

const cardItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } },
};

const Steps = () => {
    // Tách tiêu đề thành 2 dòng để giữ layout <br> responsive
    const titleLine1 = "Thiết kế lộ trình riêng biệt, tối ưu theo".split(" ");
    const titleLine2 = "năng lực của chính bạn.".split(" ");

    return (
        <section id="steps" className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute top-[20%] right-[0%] w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">

                {/* Header Section */}
                <div className="text-center mb-16">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block"
                    >
                        <span className="text-primary font-bold uppercase text-sm tracking-wider bg-green-50 px-3 py-1 rounded-full">
                            Thấu hiểu nhu cầu người học
                        </span>
                    </motion.div>

                    {/* Tiêu đề to chạy từng từ */}
                    <motion.h2
                        variants={titleContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        className="text-3xl md:text-4xl font-bold mt-4 text-gray-900 max-w-3xl mx-auto leading-snug"
                    >
                        {/* Dòng 1 */}
                        {titleLine1.map((word, index) => (
                            <motion.span
                                key={`l1-${index}`}
                                variants={wordVariants}
                                className="inline-block mr-2" // inline-block để animation hoạt động, mr-2 để tạo khoảng cách từ
                            >
                                {word}
                            </motion.span>
                        ))}

                        {/* Xuống dòng trên Desktop */}
                        <br className="hidden md:block" />

                        {/* Dòng 2 */}
                        {titleLine2.map((word, index) => (
                            <motion.span
                                key={`l2-${index}`}
                                variants={wordVariants}
                                className="inline-block mr-2"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h2>

                    {/* Mô tả nhỏ xuất hiện sau */}
                    <motion.p
                        variants={descVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-gray-500 mt-4 max-w-xl mx-auto text-base md:text-lg"
                    >
                        Chúng tôi phân tích sâu kiến thức của bạn để xây dựng kế hoạch học tập độc nhất, giúp tiết kiệm thời gian và tối đa hóa kết quả.
                    </motion.p>
                </div>

                {/* Steps Grid */}
                <motion.div
                    variants={cardContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {steps.map((step) => (
                        <motion.div
                            key={step.id}
                            variants={cardItemVariants}
                            whileHover={{ y: -10 }}
                            className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/30 flex flex-col justify-between h-full relative overflow-hidden group"
                        >
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500"></div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-white text-primary rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm transform group-hover:rotate-6 transition-transform duration-300">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold leading-tight">
                                    {step.title}
                                </h3>
                            </div>

                            <p className="text-white/90 text-sm md:text-base leading-relaxed font-medium">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Steps;