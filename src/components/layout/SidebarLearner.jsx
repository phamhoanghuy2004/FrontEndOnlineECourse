// src/components/learner/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBookOpen, FaDumbbell, FaChartLine, FaMicrophone, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';

const menuItems = [
  { path: '/learner', label: 'Tổng quan', icon: FaHome },
  { path: '/learner/courses', label: 'Khóa học', icon: FaBookOpen },
  { path: '/learner/practice', label: 'Luyện tập', icon: FaDumbbell },
  { path: '/learner/level', label: 'Trình độ', icon: FaChartLine },
  { path: '/learner/speaking', label: 'Phòng nói ảo', icon: FaMicrophone },
  { path: '/learner/ai-chat', label: 'Hỏi AI', icon: FaRobot },
];

const SidebarLearner = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-slate-100 hidden md:flex flex-col z-20">
      <div className="p-6 flex items-center gap-3">
        {/* Logo Echill (Thay bằng logo của bạn) */}
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">E</div>
        <span className="text-xl font-extrabold text-emerald-800 tracking-tight">Echill</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link to={item.path} key={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-emerald-50 text-emerald-600 font-bold shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}>
                <item.icon className={isActive ? 'text-emerald-500' : 'text-slate-400'} />
                <span>{item.label}</span>
                {isActive && <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full" />}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarLearner;