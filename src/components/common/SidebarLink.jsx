// src/components/common/SidebarLink.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarLink = ({ 
    to, 
    icon: Icon, 
    label, 
    onClick 
}) => {
    const location = useLocation();
    // Kiểm tra xem link này có đang active không
    const isActive = location.pathname === to;

    return (
        <Link to={to} onClick={onClick} className="block w-full">
            <div 
                className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                    ${isActive 
                        ? 'bg-emerald-50 text-emerald-600 font-bold shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }
                `}
            >
                {/* Icon */}
                <Icon className={`text-xl transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                
                {/* Label */}
                <span className="text-sm font-medium">{label}</span>

            </div>
        </Link>
    );
};

export default SidebarLink;