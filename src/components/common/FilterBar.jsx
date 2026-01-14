import { FaFilter } from "react-icons/fa";

const FilterBar = ({ filters, activeFilter, onFilterChange }) => {
    return (
        <div className="flex flex-wrap items-center gap-4 mb-16">
            {/* Lặp qua danh sách bộ lọc */}
            {filters.map((label, index) => {
                const isActive = activeFilter === label;
                
                return (
                    <button
                        key={index}
                        onClick={() => onFilterChange && onFilterChange(label)}
                        className={`px-6 py-2 rounded-full border font-medium transition-all duration-300
                            ${isActive 
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/30" // Style khi đang chọn
                                : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary bg-white" // Style mặc định
                            }
                        `}
                    >
                        {label}
                    </button>
                );
            })}

            {/* Nút Icon Filter (Giữ nguyên vị trí ml-auto trên mobile) */}
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-primary hover:text-primary transition-colors ml-auto md:ml-0 bg-white">
                <FaFilter />
            </button>
        </div>
    );
};

export default FilterBar;