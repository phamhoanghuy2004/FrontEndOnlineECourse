import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBookOpen, FaChartBar, FaUserGraduate, FaPenFancy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from '../../assets/LOGO.png';

const menuItems = [
    { path: '/teacher', label: 'Tổng quan', icon: FaHome },
    { path: '/teacher/courses', label: 'Quản lý khóa học', icon: FaBookOpen },
    { path: '/teacher/revenue', label: 'Doanh thu', icon: FaChartBar },
    { path: '/teacher/students', label: 'Học viên', icon: FaUserGraduate },
    { path: '/teacher/blog', label: 'Blog', icon: FaPenFancy },
];

const SidebarTeacher = () => {
    const location = useLocation();

    return (
        <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-slate-100 hidden md:flex flex-col z-20">
            <div className="p-6 flex items-center gap-3">
                <img src={logo} alt="Echill Logo" className="w-16 h-16 object-contain" />
                <span className="text-xl font-extrabold text-emerald-800 tracking-tight">Teacher</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    return (
                        <Link to={item.path} key={item.path}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-emerald-50 text-emerald-600 font-bold shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}>
                                <item.icon className={isActive ? 'text-emerald-500' : 'text-slate-400'} />
                                <span>{item.label}</span>
                                {isActive && <motion.div layoutId="sidebar-active-teacher" className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full" />}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default SidebarTeacher;
