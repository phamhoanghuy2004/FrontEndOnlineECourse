import CommonMarquee from '../../../../common/CommonMarquee';
import StudentCard from '../../../../common/student/guest/course/StudentCard';
import { topStudents } from '../../../../../data/mockData'
import SectionHeader from '../../../../common/SectionHeader';

const TopStudentsSection = () => {
    return (
        <section className="py-20 bg-[#4ADE80] overflow-hidden">

            {/* Header */}
            <SectionHeader
                title="1000+ Học viên đạt thành tích xuất sắc"
                description="Tự hào đồng hành cùng các bạn trên con đường chinh phục ngoại ngữ với những điểm số ấn tượng."
                align="left"
                titleClassName='text-white'
                descriptionClassName='text-white'
            />

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