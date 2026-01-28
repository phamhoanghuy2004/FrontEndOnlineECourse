import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaVideo } from "react-icons/fa";
import ProgressBadge from '../../../../common/ProgressBadge';
import StatBadge from '../../../../common/StatBadge';
import { zoomIn, fadeInUp, floatX, floatY } from "../../../../../constants/motionVariants";

const HeroVisuals = () => {
    return (
        <div className="md:w-1/2 relative mt-16 md:mt-0 flex justify-center items-center">
            <div className="relative w-[450px] h-[450px]">
                
                {/* LAYER 1: Viền cong bo mảnh (Dùng zoomIn với scale bắt đầu 0.8) */}
                <motion.div
                    variants={zoomIn}
                    initial={() => zoomIn.hidden(0.8)} // <--- Scale từ 0.8
                    animate="visible"
                    className="absolute top-1/2 left-1/2 -translate-x-[52%] -translate-y-[52%] w-[105%] h-[105%] rounded-full border border-primary/40 z-0"
                ></motion.div>

                {/* LAYER 2: Vòng tròn nền xanh (Dùng zoomIn với scale bắt đầu 0) */}
                <motion.div
                    variants={zoomIn}
                    initial={() => zoomIn.hidden(0)}   // <--- Scale từ 0 (Mất hút)
                    animate="visible"
                    className="absolute inset-0 bg-primary rounded-full z-0 shadow-2xl shadow-primary/30"
                ></motion.div>

                {/* LAYER 3: Ảnh (Dùng fadeInUp với custom delay) */}
                <motion.div
                    variants={fadeInUp}
                    custom={0.2} 
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 flex items-end justify-center z-10 overflow-hidden rounded-full"
                >
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Student"
                        className="w-[90%] h-[90%] object-cover rounded-full mb-4 border-4 border-white/20"
                    />
                </motion.div>

                {/* LAYER 4: Các Badge nổi (Float giữ nguyên vì là loop) */}
                
                {/* Badge 1 */}
                <StatBadge
                    icon={FaVideo}
                    amount="2K+"
                    label="Video bài giảng"
                    className="top-1/2 -left-24 transform -translate-y-1/2"
                    animation={floatY} 
                />

                {/* Badge 2: Có delay riêng cho loop */}
                <ProgressBadge
                    amount="5K+"
                    label="Khóa học"
                    className="-top-10 -right-8"
                    animation={{
                        ...floatY,
                        transition: { ...floatY.transition, delay: 1, duration: 4 }
                    }}
                />

                {/* Badge 3 */}
                <StatBadge
                    icon={FaChalkboardTeacher}
                    amount="250+"
                    label="Giáo viên"
                    className="bottom-4 -right-16"
                    animation={floatX} 
                />
            </div>
        </div>
    )
}

export default HeroVisuals;