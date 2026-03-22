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
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 hidden md:flex flex-col z-30">

      {/* 2. PHẦN HEADER */}
      <div className="h-20 bg-emerald-600 px-6 flex items-center gap-3">
        <div className="w-15 h-15 bg-white rounded-lg flex items-center justify-center text-emerald-600 font-bold shadow-sm">
          <div className="w-15 h-15 bg-white rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
            <img
              src={LOGO}
              alt="Echill Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
        </div>
        <span className="text-xl font-extrabold text-white tracking-tight">
          Echill
        </span>
      </div>

      {/* 3. PHẦN MENU */}
      <div className="flex-1 border-r border-slate-100 flex flex-col overflow-hidden">
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          {menuItems.map((item) => {
            // Xử lý thay thế :id bằng ID thật của user
            const realPath = item.path.replace(':id', userId);

            // QUAN TRỌNG: Phải có từ khóa return ở đây
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