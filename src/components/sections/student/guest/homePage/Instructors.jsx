import { useState, useEffect } from 'react';
import userApi from '../../../../../api/userApi';
import SectionHeader from '../../../../common/SectionHeader';
import CommonCarousel from '../../../../common/CommonCarousel';
import InstructorCard from '../../../../common/student/guest/home/InstructorCard';
import { Skeleton } from 'antd';

const Instructors = () => {
    const [sliderData, setSliderData] = useState([]);
    const [loading, setLoading] = useState(true);

    const instructorBreakpoints = {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
    };

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await userApi.getAllTeachersApi();
                if (response.data) {
                    const mappedData = response.data.map(teacher => ({
                        id: teacher.id,
                        name: teacher.fullName,
                        image: teacher.avatarUrl || "https://i.pravatar.cc/300?img=11",
                        qualification: teacher.certificates && teacher.certificates.length > 0
                            ? `${teacher.certificates[0].certType} ${teacher.certificates[0].totalScore}`
                            : teacher.jobTitle || "Giảng viên",
                        bio: teacher.bio || "Chuyên gia giảng dạy tiếng Anh với nhiều năm kinh nghiệm.",
                        social: { twitter: "#", linkedin: "#" }
                    }));
                    setSliderData(mappedData);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách giáo viên:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, []);

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
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                                <Skeleton active avatar paragraph={{ rows: 2 }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <CommonCarousel
                        data={sliderData}
                        CardComponent={InstructorCard}
                        breakpoints={instructorBreakpoints}
                    />
                )}

            </div>
        </section>
    );
};

export default Instructors;