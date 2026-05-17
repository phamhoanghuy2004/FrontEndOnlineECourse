import React, { useState, useEffect } from 'react';
import CommonMarquee from '../../../../common/CommonMarquee';
import StudentCard from '../../../../common/student/guest/course/StudentCard';
import SectionHeader from '../../../../common/SectionHeader';
import certificateApi from '../../../../../api/certificateApi';

const TopStudentsSection = () => {
    const [topStudents, setTopStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopStudents = async () => {
            try {
                const response = await certificateApi.getTopToeicCertificates();
                if (response.data) {
                    let data = response.data;
                    
                    // Nếu không có dữ liệu, không render marquee
                    if (data.length === 0) {
                        setTopStudents([]);
                        return;
                    }

                    // Nếu dữ liệu dưới 10, nhân bản lên cho đủ 10
                    while (data.length < 10 && data.length > 0) {
                        data = [...data, ...data];
                    }
                    // Cắt lấy đúng 10 (trong trường hợp nhân lên bị dư)
                    data = data.slice(0, 10);
                    
                    // Thêm index vào id để tránh trùng lặp key khi render React component
                    data = data.map((item, index) => ({ ...item, uniqueId: `${item.id}_${index}` }));
                    
                    setTopStudents(data);
                }
            } catch (error) {
                console.error("Failed to fetch top students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopStudents();
    }, []);

    if (loading) return null;
    if (topStudents.length === 0) return null;

    // Chia đôi dữ liệu (5 trên, 5 dưới)
    const row1 = topStudents.slice(0, 5);
    const row2 = topStudents.slice(5, 10);

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
                    data={row1}
                    CardComponent={StudentCard}
                    duration="50s"
                    className="py-4"
                />

                {/* Hàng 2: Chạy ngược chiều */}
                <CommonMarquee
                    data={row2}
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