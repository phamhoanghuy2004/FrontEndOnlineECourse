import React from 'react';
import { Link } from 'react-router-dom';

const StatsGrid = ({ stats, columns = 4 }) => {
    // Determine grid columns class based on prop
    const gridCols = {
        3: 'lg:grid-cols-3',
        4: 'lg:grid-cols-4'
    }[columns] || 'lg:grid-cols-4';

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`}>
            {stats.map((stat, index) => {
                const CardContent = (
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{stat.value}</h3>
                            {stat.change && (
                                <p className={`text-xs font-bold mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.change} so với tháng trước
                                </p>
                            )}
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon />
                        </div>
                    </div>
                );

                if (stat.link) {
                    return (
                        <Link to={stat.link} key={index} className="block group h-full">
                            {CardContent}
                        </Link>
                    );
                }

                return (
                    <div key={index} className="group h-full">
                        {CardContent}
                    </div>
                );
            })}
        </div>
    );
};

export default StatsGrid;
