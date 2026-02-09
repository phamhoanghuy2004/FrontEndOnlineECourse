import { Outlet } from 'react-router-dom';
import SidebarLearner from './SidebarLearner';
import Footer from './Footer';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const LearnerLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <SidebarLearner />

      <div className="md:ml-64 flex flex-col min-h-screen">

        {/* --- HEADER --- */}
        <header className="h-20 flex justify-between items-center bg-emerald-600 px-8 shadow-sm z-20 sticky top-0">
          <h1 className="text-2xl font-bold text-white">
            {/* Tiêu đề trang */}
          </h1>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition backdrop-blur-sm">
              <FaBell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <div className="flex items-center gap-3 cursor-pointer bg-white/10 hover:bg-white/20 py-1.5 px-1 pr-4 rounded-full transition border border-white/20">
              <div className="bg-white text-emerald-600 rounded-full p-1">
                <FaUserCircle className="text-2xl" />
              </div>
              <span className="text-sm font-bold text-white hidden sm:block">
                {user?.fullName || "Học viên"}
              </span>
            </div>
          </div>
        </header>

        {/* Nội dung trang */}
        <div className="p-6 md:p-8 flex-grow bg-[#f8fafc]">
          <Outlet />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default LearnerLayout;