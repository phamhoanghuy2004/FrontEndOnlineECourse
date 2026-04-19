import { Outlet, Link } from 'react-router-dom';
import SidebarTeacher from './SidebarTeacher';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import ChatBox from '../common/teacher/ChatBox';

const TeacherLayout = () => {
    const { user } = useAuth();
    
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
                            <Link to="/teacher/profile" className="flex items-center gap-2 cursor-pointer bg-white py-1.5 px-3 rounded-full shadow-sm border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all">
                                {user?.avatarUrl ? (
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500">
                                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <FaUserCircle className="text-3xl text-emerald-500" />
                                )}
                                <span className="text-sm font-bold text-slate-700 hidden sm:block">
                                    {user?.fullName || "Giáo viên"}
                                </span>
                            </Link>
                        </div>
                    </header>

                    <Outlet />
                </div>
            </div>
            {/* Realtime Chat Box */}
            <ChatBox />
        </div>
    );
};

export default TeacherLayout;
