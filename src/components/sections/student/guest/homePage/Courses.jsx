import { courses } from '../../../../../data/mockData';
import SectionHeader from '../../../../common/SectionHeader';
import { Link } from 'react-router-dom';
import CommonCarousel from '../../../../common/CommonCarousel';
import CourseCard from '../../../../common/student/guest/course/CourseCard';


const Courses = () => {
    // Nhân đôi data để demo slide
    const sliderData = [...courses, ...courses];

    return (
        <section id="courses" className="py-20 bg-white">
            <div className="container mx-auto px-6">

                {/* --- HeaderSection --- */}
                <SectionHeader
                    badge="Khóa học nổi bật"
                    title="Chinh phục tiếng Anh với các khóa học chuyên sâu"
                    description="Được biên soạn bởi đội ngũ giảng viên giàu kinh nghiệm, lộ trình học tập tinh gọn giúp bạn đạt mục tiêu điểm số và kỹ năng trong thời gian ngắn nhất."
                />

                {/* --- COMMON CAROUSEL --- */}
                <CommonCarousel 
                    data={sliderData} 
                    CardComponent={CourseCard} 
                />

                {/* Button Khám phá tất cả */}
                <div className="mt-8 text-center">
                    <Link
                        to="/courses"
                        className="inline-block px-8 py-3 rounded-full border border-gray-300 font-bold text-gray-700 hover:border-primary hover:text-primary hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Khám phá tất cả
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default Courses;