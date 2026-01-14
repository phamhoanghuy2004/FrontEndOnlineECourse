import CommonMarquee from '../../common/CommonMarquee';
import StudentCard from '../../common/StudentCard';
import { topStudents } from '../../../data/mockData';

const TopStudentsSection = () => {
    return (
        <section className="py-20 bg-[#4ADE80] overflow-hidden">

            {/* Header */}
            <div className="container mx-auto px-6 mb-14 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    1000+ Học viên đạt <br /> thành tích xuất sắc
                </h2>
                <p className="text-white/90 text-lg md:text-xl max-w-2xl">
                    Tự hào đồng hành cùng các bạn trên con đường chinh phục ngoại ngữ với những điểm số ấn tượng.
                </p>
            </div>

            {/* 3. Marquee Area */}
            <div className="flex flex-col gap-8">

                {/* Hàng 1: Chạy từ trái sang phải */}
                <CommonMarquee
                    data={topStudents}
                    CardComponent={StudentCard}
                    duration="50s"
                    className="py-4"
                />

                {/* Hàng 2: Chạy ngược chiều */}
                <CommonMarquee
                    data={topStudents}
                    CardComponent={StudentCard}
                    direction="reverse"
                    duration="45s"
                    className="py-4"
                />
            </div>

        </section>
    );
};

export default TopStudentsSection;