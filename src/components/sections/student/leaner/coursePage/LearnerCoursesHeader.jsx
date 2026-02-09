import React from 'react';
import SectionHeader from '../../../../common/SectionHeader';

const LearnerCoursesHeader = ({ stats }) => {
    return (
        // SỬA Ở ĐÂY: Đổi 'md:items-center' thành 'md:items-start'
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            
            {/* Title Section */}
            <div className="flex-1">
                <SectionHeader 
                    title="Khóa học của tôi" 
                    description="Tiếp tục hành trình chinh phục tri thức của bạn." 
                    align='left'
                    titleClassName="!text-emerald-600"
                    className="!px-0 !mb-0"
                    descriptionClassName="mt-2 text-slate-500"
                />
            </div>

            {/* Quick Stats Cards */}
            <div className="flex gap-3 shrink-0">
                {/* Card 1 */}
                <div className="px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center min-w-[80px]">
                    <span className="text-2xl font-bold text-slate-800">{stats.total}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Tổng số</span>
                </div>

                {/* Card 2 */}
                <div className="px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center min-w-[80px]">
                    <span className="text-2xl font-bold text-emerald-600">{stats.inProgress}</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Đang học</span>
                </div>

                {/* Card 3 */}
                <div className="px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center min-w-[80px]">
                    <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
                    <span className="text-[10px] font-bold text-green-500 uppercase">Đã xong</span>
                </div>
            </div>
        </div>
    );
};

export default LearnerCoursesHeader;