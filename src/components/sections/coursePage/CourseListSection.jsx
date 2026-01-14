import CourseLevelHeader from "../../common/CourseLevelHeader";
import CommonCarousel from "../../common/CommonCarousel";
import CourseCard from "../../common/CourseCard"     
import { sections } from "../../../data/mockData"; 
import { useState } from 'react';
import FilterBar from "../../common/FilterBar";

const CourseListSection = () => {
    // State để lưu bộ lọc đang chọn (Mặc định là TOEIC)
    const [activeFilter, setActiveFilter] = useState("TOEIC");
    // Danh sách các bộ lọc muốn hiển thị
    const filterOptions = ["TOEIC", "IELTS"];

    return (
        <section id="course-list" className="py-16 bg-white">
            <div className="container mx-auto px-6">

                {/* --- TOP FILTER BAR --- */}
                < FilterBar
                    filters={filterOptions}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                {/* --- LOOP QUA CÁC CẤP ĐỘ --- */}
                <div className="flex flex-col gap-20">
                    {sections.map((section) => (
                        <div key={section.id}>
                            {/* 1. Header (Animation Tiêu đề -> Mô tả) */}
                            <CourseLevelHeader 
                                title={section.title} 
                                description={section.description} 
                            />

                            {/* 2. Carousel (Tái sử dụng CommonCarousel & CourseCard) */}
                            <CommonCarousel 
                                data={section.data} 
                                CardComponent={CourseCard} 
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CourseListSection;