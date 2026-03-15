import { useState, useEffect } from "react";
import { navLinks } from "../../data/mockData";
import LOGO from "../../assets/LOGO.png";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
            ? "bg-white/30 backdrop-blur-md shadow-sm py-0"
            : "bg-transparent py-4"
            }`}>
            <div className="container mx-auto px-6 flex justify-between items-center h-full">
                {/* LOGO AREA */}
                <a href="/" className="flex items-center h-18">
                    <img
                        src={LOGO}
                        alt="EduSkill Logo"
                        className="w-auto h-full object-contain"
                    />
                </a>
                {/* Menu Option */}
                <ul className="hidden md:flex gap-8 font-medium text-gray-600 items-center">
                    {navLinks.map((link) => (
                        <li key={link.name} className="relative group h-full flex items-center">
                            <Link
                                to={link.href}
                                className="flex items-center gap-1 hover:text-primary transition-colors py-2"
                            >
                                {link.name}
                                {link.dropdown && <FaChevronDown className="text-xs transition-transform group-hover:rotate-180" />}
                            </Link>
                            {/* DROPDOWN AREA */}
                            {link.dropdown && (
                                <div className="absolute top-full left-0 pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-2 translate-y-0 z-50">
                                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-2">
                                        {link.dropdown.map((subItem) => (
                                            <Link
                                                key={subItem.name}
                                                to={subItem.href}
                                                className="block px-4 py-3 rounded-lg hover:bg-green-50 hover:text-primary transition-colors text-sm font-semibold"
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* --- RIGHT SIDE: AUTH BUTTONS OR USER PROFILE --- */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        /* ================== TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP ================== */
                        <div className="flex items-center gap-4">

                            {/* Check Role: Nếu là Student thì hiện nút Học ngay */}
                            {user.role === 'STUDENT' && (
                                <Link
                                    to={`/learner/dashboad`} // Link đến trang dashboard của student
                                    className="bg-primary text-white px-5 py-2 rounded-full font-semibold shadow-md hover:bg-green-600 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                >
                                    Học ngay
                                </Link>
                            )}

                            {/* User Avatar Link (Có thể link tới trang profile) */}
                            <Link
                                to={user.role === 'STUDENT' ? `/learner/dashboad/profile` : "/"}
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm cursor-pointer hover:border-primary transition-colors"
                                title={user.name}
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    // Fallback nếu không có avatar
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <FaUserCircle size={24} />
                                    </div>
                                )}
                            </Link>
                        </div>
                    ) : (
                        /* ================== TRƯỜNG HỢP KHÁCH (GUEST) ================== */
                        <>
                            <Link
                                to="/register"
                                className="text-gray-600 font-semibold hover:text-primary transition-colors px-4 py-2"
                            >
                                Đăng ký
                            </Link>
                            <Link
                                to="/login"
                                className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg shadow-primary/30"
                            >
                                Đăng nhập
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;