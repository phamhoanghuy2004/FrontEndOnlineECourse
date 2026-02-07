import ContinueLearningCard from "../../../../common/student/leaner/dashboard/ContinueLearningCard"
import Title from "../../../../common/Title";
import { fadeInUp } from "../../../../../constants/motionVariants";

const ContinueLearningSection = () => {
    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <Title text='Tiếp tục học bài trước' as="h3" variants={fadeInUp} className="text-xl font-bold !text-slate-800"></Title>
                <a href="#" className="text-emerald-600 text-sm font-bold hover:underline">Xem tất cả</a>
            </div>
            <ContinueLearningCard />
        </section>

    )
}

export default ContinueLearningSection;
