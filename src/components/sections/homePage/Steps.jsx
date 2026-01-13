import { motion } from 'framer-motion';
import { steps } from "../../../data/mockData";
import SectionHeader from '../../common/SectionHeader';
import StepsGrid from '../../common/StepsGrid';


const Steps = () => {
    return (
        <section id="steps" className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute top-[20%] right-[0%] w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">

                {/* --- SỬ DỤNG SECTION HEADER --- */}
                <SectionHeader
                    badge="Thấu hiểu nhu cầu người học"
                    title="Thiết kế lộ trình riêng biệt, tối ưu theo năng lực của chính bạn."
                    description="Chúng tôi phân tích sâu kiến thức của bạn để xây dựng kế hoạch học tập độc nhất, giúp tiết kiệm thời gian và tối đa hóa kết quả."
                    titleClassName="max-w-3xl mx-auto"
                />

                {/* 2. STEPS GRID (Đã tách riêng) */}
                <StepsGrid data={steps} />
                
            </div>
        </section>
    );
};

export default Steps;