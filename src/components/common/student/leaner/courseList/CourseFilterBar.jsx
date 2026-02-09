import React from 'react';
import { FaSearch } from 'react-icons/fa';
import InputField from '../../../InputField'; 
import Button from '../../../Button';

const CourseFilterBar = ({ 
    tabs, 
    searchQuery, 
    setSearchQuery, 
    activeTab, 
    setActiveTab 
}) => {
    
    return (
        <div className="bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center gap-2">
            
            {/* --- SEARCH INPUT --- */}
            <div className="flex-1">
                <InputField
                    type="text"
                    name="search"
                    placeholder="Tìm kiếm khóa học..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={FaSearch}
                    className="!mb-0" 
                />
            </div>

            {/* --- FILTER TABS (Dùng lại Button Component) --- */}
            <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar gap-1">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    
                    return (
                        <Button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            // Dùng variant mặc định, nhưng override bằng className
                            className={`
                                !px-4 !py-2 !text-xs !font-bold !rounded-lg whitespace-nowrap !transition-all
                                ${isActive 
                                    ? '!bg-white !text-emerald-600 !shadow-sm !translate-y-0' // Style khi Active
                                    : '!bg-transparent !text-slate-500 !shadow-none hover:!text-emerald-600 hover:!bg-slate-200/50' // Style khi Inactive
                                }
                            `}
                        >
                            {tab.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};

export default CourseFilterBar;