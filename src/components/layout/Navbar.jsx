import { useState, useEffect, useMemo } from "react";
import LOGO from "../../assets/LOGO.png";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import categoryApi from "../../api/categoryApi";
import testApi from "../../api/testApi";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [categories, setCategories] = useState([]);
    const [testTypes, setTestTypes] = useState([]);
    const { user } = useAuth();

    // Xử lý hiệu ứng scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 💥 CALL API SONG SONG (TỐI ƯU HIỆU NĂNG)
    useEffect(() => {
        const fetchNavbarData = async () => {
            try {
                // Dùng Promise.all để gọi 2 API cùng một lúc thay vì phải chờ đợi nhau
                const [categoryRes, testTypeRes] = await Promise.all([
                    categoryApi.getAll(),
                    testApi.getAllowedTestTypes()
                ]);

                // Xử lý dữ liệu Khóa học
                if (categoryRes && categoryRes.data) {
                    setCategories(categoryRes.data);
                }

                // 🟢 Xử lý dữ liệu Luyện đề (Trả về mảng ["TOEIC", "IELTS",...])
                // Đảm bảo cấu trúc response khớp với file testApi.js của bạn
                if (testTypeRes && testTypeRes.data) {
                    // Tùy vào format bọc ApiResponse, có thể là testTypeRes.data hoặc testTypeRes.data.data
                    setTestTypes(testTypeRes.data || testTypeRes.data.data || []);
                }

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu Navbar:", error.message);
            }
        };
        fetchNavbarData();
    }, []);


    // 🟢 CẬP NHẬT: Build cây Navigation tự động
    const navLinks = useMemo(() => {
        
        // 1. Map dữ liệu Khóa học
        const dynamicCourseDropdown = categories.map(cat => ({
            name: cat.name,
            href: `/courses?category=${cat.id}`
        }));

        // 2. Map dữ liệu Luyện đề (Chứng chỉ)
        const dynamicTestDropdown = testTypes.map(type => ({
            name: type, // VD: "TOEIC"
            href: `/tests?type=${type}` // Gắn luôn query params để click vào là lọc sẵn type đó
        }));

        return [
            {
                name: "Khóa học",
                href: "/courses",
                dropdown: dynamicCourseDropdown.length > 0 ? dynamicCourseDropdown : null,
            },
            {
                name: "Đánh giá trình độ",
                href: "/level-test",
            },
            {
                name: "Luyện đề",
                href: "/tests",
                // Gắn dropdown tự động sinh ra từ API vào đây
                dropdown: dynamicTestDropdown.length > 0 ? dynamicTestDropdown : null,
            },
            {
                name: "Blog",
                href: "/blog",
            },
            {
                name: "Liên hệ tư vấn",
                href: "/consultation",
            },
        ];
    }, [categories, testTypes]); // 🔴 Nhớ thêm testTypes vào dependency array

    // Kiểm tra Role
    const isStudent = user?.roles?.includes('STUDENT') || user?.roles?.includes('LEARNER');
    const isAdmin = user?.roles?.includes('ADMIN');
    const isTeacher = user?.roles?.includes('TEACHER');

    // Đồng bộ DTO
    const userAvatar = user?.avatarUrl || user?.avatar;
    const userName = user?.fullName || user?.name || user?.username;

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
            ? "bg-white/30 backdrop-blur-md shadow-sm py-0"
            : "bg-transparent py-4"
            }`}>
            <div className="container mx-auto px-6 flex justify-between items-center h-full">
                {/* LOGO AREA */}
                <Link to="/" className="flex items-center h-18">
                    <img
                        src={LOGO}
                        alt="Echill Logo"
                        className="w-auto h-full object-contain"
                    />
                </Link>

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
                        <div className="flex items-center gap-4">
                            {isStudent && (
                                <Link
                                    to={`/learner/${user.id}`}
                                    className="bg-primary text-white px-5 py-2 rounded-full font-semibold shadow-md hover:bg-green-600 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                >
                                    Học ngay
                                </Link>
                            )}
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="bg-primary text-white px-5 py-2 rounded-full font-semibold shadow-md hover:bg-green-600 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                >
                                    Quản trị
                                </Link>
                            )}
                            {isTeacher && (
                                <Link
                                    to="/teacher"
                                    className="bg-primary text-white px-5 py-2 rounded-full font-semibold shadow-md hover:bg-green-600 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                >
                                    Giảng dạy
                                </Link>
                            )}

                            {/* User Avatar Link */}
                            <Link
                                to={isStudent ? `/learner/${user.id}/profile` : isAdmin ? "/admin" : isTeacher ? "/teacher" : "/"}
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm cursor-pointer hover:border-primary transition-colors"
                                title={userName}
                            >
                                {userAvatar ? (
                                    <img
                                        src={userAvatar}
                                        alt={userName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=random&color=fff`}
                                            alt={userName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </Link>
                        </div>
                    ) : (
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