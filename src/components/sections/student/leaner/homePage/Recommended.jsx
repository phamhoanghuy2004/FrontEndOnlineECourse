import Title from "../../../../common/Title"
import {fadeInUp} from "../../../../../constants/motionVariants"
import Button from "../../../../common/Button";

const Recommended = () => {
    return (
        <section>
            <Title
                text="Đề xuất cho bạn"
                className="!text-xl font-bold !text-slate-800 mb-4"
                variants={fadeInUp}
            />
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                    <h4 className="text-2xl font-bold mb-2">Luyện đề IELTS Full Test</h4>
                    <p className="opacity-90 mb-4 text-sm max-w-md">Bộ đề mới nhất 2026, có giải thích chi tiết và chấm điểm AI.</p>
                    <Button variant="secondary"> Thử ngay </Button>
                </div>
                {/* Decor circle */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            </div>
        </section>
    )
}

export default Recommended 