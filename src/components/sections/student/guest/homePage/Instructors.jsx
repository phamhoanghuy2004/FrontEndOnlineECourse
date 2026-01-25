import { instructors } from '../../../../../data/mockData';
import SectionHeader from '../../../../common/SectionHeader';
import CommonCarousel from '../../../../common/CommonCarousel';
import InstructorCard from '../../../../common/student/guest/home/InstructorCard';

const Instructors = () => { 

    const instructorBreakpoints = {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 4 }, 
    };

    return (
        <section className="py-24 bg-gray-50/50">
            <div className="container mx-auto px-6">

                {/* --- HEADER SECTION VỚI ANIMATION --- */}
                <SectionHeader
                    badge="Đội ngũ giảng viên"
                    title="Gặp gỡ những chuyên gia hàng đầu"
                    description="Quy tụ những giáo viên sở hữu chứng chỉ quốc tế (TESOL, IELTS 8.0+) với nhiều năm kinh nghiệm thực chiến, sẵn sàng đồng hành cùng bạn chinh phục mọi mục tiêu."
                />
                
                {/* --- COMMON CAROUSEL --- */}
                <CommonCarousel 
                    data={instructors} 
                    CardComponent={InstructorCard} 
                    breakpoints={instructorBreakpoints}
                />

            </div>
        </section>
    );
};

export default Instructors;