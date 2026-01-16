import CourseLevelHeader from "../../common/CourseLevelHeader";
import FilterBar from "../../common/FilterBar";
import { useState } from 'react';
import { testSetType } from "../../../data/mockData";
import TestSetCard from "../../common/TestSetCard";
import CommonCarousel from "../../common/CommonCarousel";

const TestSet = () => {

    const [activeFilter, setActiveFilter] = useState("All");
    const filterOptions = ["All", "TOEIC", "IELTS"];

    const testSetBreakpoints = {
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
    };

    return (
        <section 
            id="test-list" 
            className="relative py-16 bg-transparent"
        >
            {/* 3. CẬP NHẬT CONTAINER: Thêm relative z-10 để nội dung nổi lên trên nền */}
            <div className="container mx-auto px-6 relative z-10">
                
                {/* --- TOP FILTER BAR --- */}
                <FilterBar
                    filters={filterOptions}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />
                
                {/* --- LOOP QUA CÁC TestSetType --- */}
                <div className="flex flex-col gap-20">
                    {testSetType.map((type) => (
                        <div key={type.id}>
                            <CourseLevelHeader
                                title={type.title}
                                description={type.description}
                            />

                            <CommonCarousel
                                data={type.data}
                                CardComponent={TestSetCard}
                                breakpoints={testSetBreakpoints} 
                            />
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}

export default TestSet;