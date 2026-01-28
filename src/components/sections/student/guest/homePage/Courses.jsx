import { courses } from '../../../../../data/mockData';
import SectionHeader from '../../../../common/SectionHeader';
import CommonCarousel from '../../../../common/CommonCarousel';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../../../../common/student/guest/course/CourseCard';
import Button from '../../../../common/Button';


const Courses = () => {
    // Nhân đôi data để demo slide
    const sliderData = courses;
    const navigate = useNavigate();

    const handleNavigateToCourses = () => {
        console.log("Đang chuyển hướng đến danh sách khóa học...");
        navigate('/courses');
    };

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

                {/* Button khám phá tất cả */}
                <div className="mt-8 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={handleNavigateToCourses}
                        className="border-gray-300 text-gray-700 hover:border-primary hover:text-primary hover:bg-green-50"
                    >
                        Khám phá tất cả
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default Courses;