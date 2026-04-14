import { FaHome, FaBookOpen, FaDumbbell, FaChartLine, FaMicrophone, FaComments, FaBullseye  } from 'react-icons/fa';
import SidebarLink from '../common/SidebarLink';
import LOGO from '../../assets/LOGO.png'
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  { path: '/learner/:id', label: 'Tổng quan', icon: FaHome },
  { path: '/learner/:id/courses', label: 'Khóa học', icon: FaBookOpen },
  { path: '/tests', label: 'Luyện đề', icon: FaDumbbell },
  { path: '/learner/:id/progresss', label: 'Tiến độ học', icon: FaChartLine },
  { path: '/learner/:id/study-goal', label: 'Theo dõi mục tiêu', icon: FaBullseye },
  { path: '/learner/:id/virtualSpeaking', label: 'Phòng nói ảo', icon: FaMicrophone },
  { path: '/learner/:id/chat', label: 'Chat trực tiếp', icon: FaComments },
];

const SidebarLearner = () => {

  const { user } = useAuth(); // Lấy thông tin user
  const userId = user?.id || user?._id || 'me';

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 hidden md:flex flex-col z-30 border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">

      {/* 💥 PHẦN HEADER CỦA SIDEBAR: Đổi sang nền trắng, chữ xanh, gọn gàng */}
      <div className="h-20 px-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-emerald-50 border border-emerald-100">
          <img
            src={LOGO}
            alt="Echill Logo"
            className="w-full h-full object-contain p-1.5 drop-shadow-sm"
          />
        </div>
        <span className="text-2xl font-black text-emerald-600 tracking-tight">
          Echill.
        </span>
      </div>

      {/* PHẦN MENU */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const realPath = item.path.replace(':id', userId);
            return (
              <SidebarLink
                key={item.path}
                to={realPath}
                icon={item.icon}
                label={item.label}
              />
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default SidebarLearner;