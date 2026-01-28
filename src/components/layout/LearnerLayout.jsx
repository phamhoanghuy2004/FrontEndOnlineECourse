// src/components/layout/LearnerLayout.jsx
import { Outlet } from 'react-router-dom'; // Dùng Outlet thay cho children
import SidebarLearner from './SidebarLearner'; // (hoặc đường dẫn đúng tới sidebar của bạn)
import Footer from './Footer'; // <--- 1. Import Footer cũ vào
import { FaBell, FaUserCircle } from 'react-icons/fa';

const LearnerLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <SidebarLearner />
      
      {/* Main Content Wrapper (Khối bên phải) 
         Thêm flex flex-col min-h-screen để Footer luôn nằm dưới cùng
      */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        
        {/* Phần nội dung chính (Header + Nội dung trang)
           Thêm flex-grow để nó đẩy Footer xuống đáy
        */}
        <div className="p-6 md:p-8 flex-grow">
          
          {/* Topbar */}
          <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-slate-800">
                  {/* Bạn có thể dùng Context hoặc State để thay đổi tiêu đề này tùy trang */}
              </h1>
              <div className="flex items-center gap-4">
                  <button className="relative p-2 rounded-full bg-white shadow-sm text-slate-500 hover:text-emerald-500 transition">
                      <FaBell />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  </button>
                  <div className="flex items-center gap-2 cursor-pointer bg-white py-1.5 px-3 rounded-full shadow-sm border border-slate-100">
                      <FaUserCircle className="text-3xl text-emerald-500" />
                      <span className="text-sm font-bold text-slate-700 hidden sm:block">Huy Nguyen</span>
                  </div>
              </div>
          </header>

          {/* Vị trí hiển thị các trang con (Dashboard, Course...) */}
          <Outlet /> 
        </div>

        {/* Footer nằm ở đây */}
        <Footer />
        
      </div>
    </div>
  );
};

export default LearnerLayout;