import { motion } from 'framer-motion';
import TextReveal from './TextReveal';

// 1. Import bộ animation chuẩn (Đã gộp)
import { fadeInUp, zoomIn } from '../../constants/motionVariants'; 

const SectionHeader = ({ 
    badge, 
    title, 
    description, 
    align = "center", 
    titleClassName = "",
    descriptionClassName = ""
}) => {
    return (
        <div className={`mb-12 px-4 ${align === "center" ? "text-center" : "text-left"}`}>

            {/* 1. Badge: Dùng zoomIn  */}
            {badge && (
                <motion.div
                    variants={zoomIn}
                    initial={() => zoomIn.hidden(0.8)} // <--- Bắt đầu hơi nhỏ (0.8)
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="inline-block mb-3"
                >
                    <span className="text-primary font-bold uppercase text-sm tracking-wider bg-green-50 px-3 py-1 rounded-full">
                        {badge}
                    </span>
                </motion.div>
            )}

            {/* 2. Title: Component TextReveal đã tự xử lý animation bên trong */}
            {title && (
                <h2 className={`text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug ${titleClassName}`}>
                    <TextReveal text={title} />
                </h2>
            )}

            {/* 3. Description: Dùng fadeInUp với Delay tùy chỉnh */}
            {description && (
                <motion.p
                    variants={fadeInUp}
                    custom={0.5} // <--- Delay 0.4s (để chờ Tiêu đề chạy xong 1 chút rồi mới hiện)
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={`text-gray-500 mt-4 max-w-3xl text-base md:text-lg leading-relaxed ${align === "center" ? "mx-auto" : ""} ${descriptionClassName}`}
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
};

export default SectionHeader;