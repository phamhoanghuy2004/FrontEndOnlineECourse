import { useState, useRef, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    return (
        <div className="min-h-screen bg-[#f1f5f9] font-sans">
            <SidebarAdmin />

            {/* Main Content Wrapper */}
            <div className="md:ml-64 flex flex-col min-h-screen">

                {/* Main Content */}
                <div className="p-6 md:p-8 flex-grow">

                    {/* Topbar */}
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">
                            Admin Control Panel
                        </h1>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 rounded-full bg-white shadow-sm text-slate-500 hover:text-blue-600 transition">
                                <FaBell />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 cursor-pointer bg-white py-1.5 px-3 rounded-full shadow-sm border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                >
                                    {user?.avatarUrl ? (
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-500">
                                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <FaUserCircle className="text-3xl text-blue-500" />
                                    )}
                                    <span className="text-sm font-bold text-slate-700 hidden sm:block">
                                        {user?.fullName || "Admin"}
                                    </span>
                                </div>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition-all text-left"
                                        >
                                            <FaSignOutAlt className="text-red-500" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
