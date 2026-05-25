import { Outlet, useNavigate } from 'react-router-dom'; // 🔴 1. Import useNavigate
import SidebarLearner from './SidebarLearner';
import Footer from './Footer';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const LearnerLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // 🔴 2. Khởi tạo hook navigate

  // Helper: Lấy chữ cái đầu tiên của tên (VD: "Phạm Hoàng Huy" -> "P")
  const getInitial = (name) => {
    if (!name) return "H";
    return name.charAt(0).toUpperCase();
  };

  // 🔴 3. Hàm xử lý chuyển hướng khi click vào User Pill
  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/learner/${user.id}/profile`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-emerald-200">
      <SidebarLearner />

      <div className="md:ml-64 flex flex-col min-h-screen">

        {/* 💥 HEADER TRUYỀN THỐNG: KHÔNG dùng sticky/fixed. Cuộn là trôi đi luôn */}
        <header className="flex justify-between items-center px-6 md:px-8 py-6">

          {/* 💥 Tiêu đề góc trái (Đã làm TO, SIÊU ĐẬM và bóp khoảng cách chữ lại cho sang) */}
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800">
            Learner Layout
          </h1>

          {/* Cụm Chuông + Thông tin User góc phải */}
          <div className="flex items-center gap-4">

            {/* Nút Chuông */}
            <button className="relative p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 shadow-sm transition-all">
              <FaBell className="text-lg m-1" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Pill (Viên thuốc) */}
            {/* 🔴 4. Thêm sự kiện onClick vào thẻ div bọc ngoài User Pill */}
            <div 
              onClick={handleProfileClick}
              className="flex items-center gap-3 cursor-pointer bg-white border border-slate-200 shadow-sm py-1.5 px-1.5 pr-4 rounded-full transition-all hover:border-emerald-300 hover:shadow-md"
            >

              {/* Avatar hoặc Chữ cái đầu */}
              <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center overflow-hidden font-bold text-sm">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitial(user?.fullName)}</span>
                )}
              </div>

              <span className="text-sm font-bold text-slate-700 hidden sm:block">
                {user?.fullName || "Học viên"}
              </span>
            </div>
          </div>
        </header>

        {/* 💥 NỘI DUNG TRANG: Bỏ hết các padding top lềnh bềnh, nối thẳng vào Header */}
        <div className="px-6 md:px-8 pb-8 flex-grow">
          <Outlet />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default LearnerLayout;