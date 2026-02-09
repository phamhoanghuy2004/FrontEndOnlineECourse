import { Outlet } from 'react-router-dom';
import SidebarTeacher from './SidebarTeacher';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const TeacherLayout = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            <SidebarTeacher />

            {/* Main Content Wrapper */}
            <div className="md:ml-64 flex flex-col min-h-screen">

                {/* Main Content */}
                <div className="p-6 md:p-8 flex-grow">

                    {/* Topbar */}
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">
                            Teacher Dashboard
                        </h1>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 rounded-full bg-white shadow-sm text-slate-500 hover:text-blue-600 transition">
                                <FaBell />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <div className="flex items-center gap-2 cursor-pointer bg-white py-1.5 px-3 rounded-full shadow-sm border border-slate-100">
                                <FaUserCircle className="text-3xl text-emerald-500" />
                                <span className="text-sm font-bold text-slate-700 hidden sm:block">Giáo viên</span>
                            </div>
                        </div>
                    </header>

                    <Outlet />
                </div>

            </div>
        </div>
    );
};

export default TeacherLayout;
