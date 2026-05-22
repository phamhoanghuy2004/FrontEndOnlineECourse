import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBookOpen, FaUserShield, FaClipboardList, FaFileImport, FaHeadset, FaTicketAlt, FaCoins } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from '../../assets/LOGO.png';

const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FaHome },
    { path: '/admin/test-sets', label: 'Quản lý bộ đề', icon: FaClipboardList },
    { path: '/admin/consultations', label: 'Yêu cầu tư vấn', icon: FaHeadset },
    { path: '/admin/vouchers', label: 'Mã giảm giá', icon: FaTicketAlt },
    { path: '/admin/coin-packages', label: 'Quản lý gói xu', icon: FaCoins },
];

const SidebarAdmin = () => {
    const location = useLocation();

    return (
        <aside className="w-64 bg-emerald-50 text-slate-800 h-screen fixed left-0 top-0 hidden md:flex flex-col z-20 border-r border-emerald-100">
            <div className="p-8 flex items-center gap-3">
                <img src={logo} alt="Echill Logo" className="w-16 h-16 object-contain" />
                <span className="text-xl font-black text-emerald-900 tracking-tight">Admin</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const isActive = item.path === '/admin'
                        ? location.pathname === '/admin'
                        : (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
                    return (
                        <Link to={item.path} key={item.path}>
                            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative ${isActive
                                ? 'bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-200'
                                : 'text-emerald-700/70 hover:bg-emerald-100 hover:text-emerald-800'
                                }`}>
                                <item.icon className={isActive ? 'text-white' : 'text-emerald-600/50'} />
                                <span className="text-sm tracking-wide">{item.label}</span>
                                {isActive && <motion.div layoutId="sidebar-active-admin" className="absolute left-0 w-1.5 h-8 bg-emerald-400 rounded-r-full" />}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6">
                <div className="bg-white/50 rounded-[24px] p-4 border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-800/40 uppercase tracking-widest mb-1">Hệ thống quản trị</p>
                    <p className="text-xs font-bold text-emerald-900">Echill Online Course</p>
                </div>
            </div>
        </aside>
    );
};

export default SidebarAdmin;
