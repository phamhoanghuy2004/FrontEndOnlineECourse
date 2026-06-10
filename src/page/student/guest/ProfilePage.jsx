import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUserEdit, FaCamera, FaCoins, FaHistory, FaBullseye,
    FaSave, FaTimes, FaEnvelope, FaBirthdayCake, FaSignOutAlt,
    FaMapMarkerAlt, FaBriefcase, FaPlus, FaSpinner, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import userApi from "../../../api/userApi";

import { toast } from 'react-toastify';
const validateProfile = (data) => {
    const errors = {};

    if (!data.fullName.trim()) errors.fullName = "Họ và tên không được để trống";
    else if (data.fullName.length > 100) errors.fullName = "Họ và tên không vượt quá 100 ký tự";

    if (!data.jobTitle.trim()) errors.jobTitle = "Nghề nghiệp không được để trống";
    else if (data.jobTitle.length > 100) errors.jobTitle = "Nghề nghiệp không vượt quá 100 ký tự";

    if (data.address && data.address.length > 255) errors.address = "Địa chỉ không vượt quá 255 ký tự";

    if (data.dob) {
        const dobDate = new Date(data.dob);
        const today = new Date();

        let age = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }

        if (dobDate >= today) errors.dob = "Ngày sinh phải ở trong quá khứ";
        else if (age < 16) errors.dob = "Bạn phải đủ 16 tuổi";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// 🔴 [THÊM MỚI]: Hàm lấy dải ngày của tuần hiện tại (Thứ 2 -> Chủ Nhật)
const getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0: CN, 1: T2...

    // Tính toán ngày Thứ 2
    const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(new Date().setDate(diffToMonday));

    // Tính toán ngày Chủ Nhật
    const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));

    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    return {
        start: formatDate(monday),
        end: formatDate(sunday)
    };
};

const ProfilePage = () => {
    const { user, logout, fetchUserProfile } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("info");
    const [isEditing, setIsEditing] = useState(false);

    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        dob: "",
        jobTitle: "",
    });

    const MAX_SIZE = 2 * 1024 * 1024;

    // 🔴 [THÊM MỚI]: Khai báo State cho Lịch sử giao dịch
    const [transactions, setTransactions] = useState([]);
    const [transLoading, setTransLoading] = useState(false);
    const [transPage, setTransPage] = useState(1);
    const [transTotalPages, setTransTotalPages] = useState(1);

    // 🔴 [THÊM MỚI]: State cho bộ lọc
    const defaultRange = getCurrentWeekRange();
    const [transType, setTransType] = useState("");
    const [transStartDate, setTransStartDate] = useState(defaultRange.start);
    const [transEndDate, setTransEndDate] = useState(defaultRange.end);

    useEffect(() => {
        if (user) {
            fetchUserProfile();
        }
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                address: user.address || "",
                dob: user.dob || "",
                jobTitle: user.jobTitle || "",
            });
            setPreviewAvatar(user.avatarUrl);
        }
    }, [user]);

    // 🔴 [THÊM MỚI]: Cập nhật useEffect gọi API để nhận thêm tham số lọc
    useEffect(() => {
        let isMounted = true;

        const fetchTransactions = async () => {
            if (activeTab !== "history") return;

            try {
                setTransLoading(true);
                // Truyền toàn bộ filter xuống API qua params
                const response = await userApi.getMyTransactions({
                    page: transPage,
                    size: 10,
                    type: transType || undefined, // Nếu rỗng thì gửi undefined để axios bỏ qua key này
                    startDate: transStartDate || undefined,
                    endDate: transEndDate || undefined
                });

                if (isMounted && response.data) {
                    setTransactions(response.data.content || []);
                    setTransTotalPages(response.data.totalPages || 1);
                }
            } catch (error) {
                if (isMounted) console.error("Lỗi fetch transactions:", error);
            } finally {
                if (isMounted) setTransLoading(false);
            }
        };

        fetchTransactions();
        return () => { isMounted = false; };
        // 🔴 [THÊM MỚI]: Chạy lại Effect khi bất kỳ bộ lọc nào thay đổi
    }, [activeTab, transPage, transType, transStartDate, transEndDate]);



    // 🔴 [THÊM MỚI]: Hàm reset về trang 1 khi thay đổi bất kỳ filter nào
    const handleFilterChange = (setter, value) => {
        setter(value);
        setTransPage(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
        setGlobalError("");
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setGlobalError("Chỉ chấp nhận file định dạng hình ảnh (JPG, PNG...)");
                e.target.value = null;
                return;
            }

            if (file.size > MAX_SIZE) {
                setGlobalError("Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.");
                e.target.value = null;
                return;
            }

            setGlobalError("");
            setAvatarFile(file);

            const reader = new FileReader();
            reader.onloadend = () => setPreviewAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const { isValid, errors: validationErrors } = validateProfile(formData);

        if (!isValid) {
            setErrors(validationErrors);
            setGlobalError("Vui lòng kiểm tra lại thông tin bị lỗi màu đỏ.");
            return;
        }

        setErrors({});
        setGlobalError("");
        setIsLoading(true);

        try {
            const submitFormData = new FormData();
            const payload = {
                fullName: formData.fullName,
                dob: formData.dob,
                address: formData.address,
                jobTitle: formData.jobTitle
            };

            const dataBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
            submitFormData.append("data", dataBlob);

            if (avatarFile) {
                submitFormData.append("avatar", avatarFile);
            }

            await userApi.updateUser(submitFormData);

            console.log("Payload gọi API:", payload, avatarFile);
            toast.success("Cập nhật thông tin thành công!");

            await fetchUserProfile(user.roles);

            setIsEditing(false);
            setAvatarFile(null);
        } catch (error) {
            setGlobalError(`Cập nhật thất bại: ${error.message || "Có lỗi xảy ra"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                address: user.address || "",
                dob: user.dob || "",
                jobTitle: user.jobTitle || "",
            });
            setPreviewAvatar(user.avatarUrl);
        }
        setErrors({});
        setGlobalError("");
        setAvatarFile(null);
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Tạo một hàm nhỏ xử lý URL
    const getAvatarSrc = (url) => {
        if (!url) return "https://via.placeholder.com/150";
        // Ép HTTP thành HTTPS để không bị trình duyệt chặn
        return url.replace(/^http:\/\//i, 'https://');
    };

    // 🔴 [THÊM MỚI]: Hàm Helper format tiền VNĐ
    const formatCurrency = (amount) => {
        if (!amount) return "-";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-12 font-sans">
            <div className="container mx-auto px-6">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
                    <p className="text-gray-500">Quản lý thông tin và theo dõi quá trình học tập của bạn.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* 1. Profile Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-green-400 to-emerald-500 opacity-20"></div>

                            <div className="relative w-32 h-32 mb-4 mt-6 group">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img
                                        src={getAvatarSrc(previewAvatar)}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                {isEditing && (
                                    <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FaCamera className="text-white text-2xl" />
                                        <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isLoading} />
                                    </label>
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800">{formData.fullName || "---"}</h2>
                            <span className="text-gray-500 text-sm mb-4">{user?.level || "None"} LEVEL</span>

                            <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-gray-100">
                                {/* 🔴 [SỬA 2]: Fix lệch xu bằng cách đưa dấu + ra absolute */}
                                <div className="text-center p-2 flex flex-col items-center justify-center">
                                    <button
                                        onClick={() => navigate('/coinShop')}
                                        // 🔴 Đổi từ flex thành inline-flex và thêm relative
                                        className="relative inline-flex items-center justify-center gap-1 text-yellow-500 font-bold text-xl hover:text-yellow-600 transition-colors group"
                                        title="Nạp thêm xu"
                                    >
                                        <FaCoins /> {user?.currentCoin || 0}

                                        {/* 🔴 Thêm absolute, -right-5, -top-1 để dấu + nổi lên góc trên bên phải mà không đẩy số xu lệch đi */}
                                        <div className="absolute -right-5 -top-1 bg-yellow-500 text-white rounded-full p-[3px] text-[9px] group-hover:scale-110 transition-transform shadow-sm">
                                            <FaPlus />
                                        </div>
                                    </button>
                                    {/* 🔴 Thêm mt-1 để có khoảng trống một xíu cho dễ nhìn */}
                                    <span className="text-xs text-gray-400 uppercase font-semibold mt-1">Xu hiện có</span>
                                </div>

                                <div
                                    onClick={() => navigate(`/learner/${user?.id}/study-goal`)}
                                    className="text-center p-2 rounded-xl cursor-pointer hover:bg-blue-50 hover:scale-105 transition-all group"
                                    title="Nhấn để xem chi tiết mục tiêu"
                                >
                                    <div className="flex items-center justify-center gap-1 text-blue-500 font-bold text-xl group-hover:text-blue-600">
                                        <FaBullseye /> {user?.activeGoal?.targetTotal || "---"}
                                    </div>
                                    <span className="text-xs text-gray-400 uppercase font-semibold group-hover:text-blue-500">Mục tiêu</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. LOGOUT BUTTON */}
                        <button
                            onClick={handleLogout}
                            className="w-full bg-white text-red-500 font-bold py-4 rounded-3xl flex items-center justify-center gap-2 hover:bg-red-50 hover:shadow-md transition-all border border-red-100 group"
                        >
                            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
                            Đăng xuất
                        </button>

                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                            <button onClick={() => setActiveTab("info")} className={`pb-3 font-semibold text-lg transition-all ${activeTab === "info" ? "text-emerald-500 border-b-2 border-emerald-500" : "text-gray-500 hover:text-gray-800"}`}>
                                Thông tin cá nhân
                            </button>
                            <button onClick={() => setActiveTab("history")} className={`pb-3 font-semibold text-lg transition-all ${activeTab === "history" ? "text-emerald-500 border-b-2 border-emerald-500" : "text-gray-500 hover:text-gray-800"}`}>
                                Lịch sử giao dịch
                            </button>
                        </div>

                        {activeTab === "info" && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in-up">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-bold text-gray-800">Chi tiết hồ sơ</h3>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-emerald-500 hover:bg-emerald-50 px-4 py-2 rounded-full font-medium transition-colors">
                                            <FaUserEdit /> Chỉnh sửa
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={handleCancel} disabled={isLoading} className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-full font-medium transition-colors disabled:opacity-50">
                                                <FaTimes /> Hủy
                                            </button>
                                            <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-2 rounded-full font-medium hover:bg-emerald-600 shadow-md transition-all disabled:opacity-50">
                                                <FaSave /> {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* 💥 KHỐI GIỮ CHỖ GLOBAL ERROR (Cố định chiều cao) */}
                                <div className="h-10 mb-4 w-full flex items-center justify-center">
                                    {globalError && (
                                        <div className="w-full bg-red-50 border border-red-100 text-red-500 px-4 py-2 rounded-lg text-sm font-medium text-center">
                                            {globalError}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                    {/* Full Name Input */}
                                    {/* 💥 Tăng pb-5 và bọc lớp whitespace-nowrap cho các lỗi input */}
                                    <div className="col-span-2 md:col-span-1 relative pb-5">
                                        <label className="block text-gray-600 text-sm font-semibold mb-2">Họ và tên</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            disabled={!isEditing || isLoading}
                                            className={`w-full px-4 py-3 rounded-xl border outline-none ${isEditing ? 'bg-white focus:ring-2 focus:ring-emerald-100' : 'border-transparent bg-gray-50 text-gray-500'} ${errors.fullName ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-emerald-500'}`}
                                        />
                                        {errors.fullName && <span className="absolute bottom-1 left-1 text-[11px] text-red-500 whitespace-nowrap truncate w-full">{errors.fullName}</span>}
                                    </div>

                                    {/* Email (Read-only) */}
                                    <div className="col-span-2 md:col-span-1 relative pb-5">
                                        <label className="block text-gray-600 text-sm font-semibold mb-2">Email (Không thể thay đổi)</label>
                                        <div className="flex items-center w-full px-4 py-3 rounded-xl border border-transparent bg-gray-100 text-gray-500 cursor-not-allowed">
                                            <FaEnvelope className="mr-2 text-gray-400" />
                                            {formData.email}
                                        </div>
                                    </div>

                                    {/* Address Input */}
                                    <div className="col-span-2 md:col-span-1 relative pb-5">
                                        <label className="block text-gray-600 text-sm font-semibold mb-2">Địa chỉ</label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className={`absolute top-1/2 left-4 transform -translate-y-1/2 ${errors.address ? 'text-red-400' : 'text-gray-400'}`} />
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                disabled={!isEditing || isLoading}
                                                placeholder="Hà Nội, Việt Nam"
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${isEditing ? 'bg-white focus:ring-2 focus:ring-emerald-100' : 'border-transparent bg-gray-50 text-gray-500'} ${errors.address ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-emerald-500'}`}
                                            />
                                        </div>
                                        {errors.address && <span className="absolute bottom-1 left-1 text-[11px] text-red-500 whitespace-nowrap truncate w-full">{errors.address}</span>}
                                    </div>

                                    {/* DOB Input */}
                                    <div className="col-span-2 md:col-span-1 relative pb-5">
                                        <label className="block text-gray-600 text-sm font-semibold mb-2">Ngày sinh</label>
                                        <div className="relative">
                                            <FaBirthdayCake className={`absolute top-1/2 left-4 transform -translate-y-1/2 ${errors.dob ? 'text-red-400' : 'text-gray-400'}`} />
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                disabled={!isEditing || isLoading}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${isEditing ? 'bg-white focus:ring-2 focus:ring-emerald-100' : 'border-transparent bg-gray-50 text-gray-500'} ${errors.dob ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-emerald-500'}`}
                                            />
                                        </div>
                                        {errors.dob && <span className="absolute bottom-1 left-1 text-[11px] text-red-500 whitespace-nowrap truncate w-full">{errors.dob}</span>}
                                    </div>

                                    {/* Job Title Input */}
                                    <div className="col-span-2 relative pb-5">
                                        <label className="block text-gray-600 text-sm font-semibold mb-2">Nghề nghiệp</label>
                                        <div className="relative">
                                            <FaBriefcase className={`absolute top-1/2 left-4 transform -translate-y-1/2 ${errors.jobTitle ? 'text-red-400' : 'text-gray-400'}`} />
                                            <input
                                                type="text"
                                                name="jobTitle"
                                                value={formData.jobTitle}
                                                onChange={handleChange}
                                                disabled={!isEditing || isLoading}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none ${isEditing ? 'bg-white focus:ring-2 focus:ring-emerald-100' : 'border-transparent bg-gray-50 text-gray-500'} ${errors.jobTitle ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-emerald-500'}`}
                                                placeholder="Học sinh, Sinh viên, Kỹ sư..."
                                            />
                                        </div>
                                        {errors.jobTitle && <span className="absolute bottom-1 left-1 text-[11px] text-red-500 whitespace-nowrap truncate w-full">{errors.jobTitle}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 🔴 [SỬA]: TAB HISTORY - Bọc Loader, Empty State, và Map Data thật */}
                        {activeTab === "history" && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in-up">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FaHistory className="text-gray-400" /> Lịch sử biến động số dư
                                </h3>

                                {/* 🔴 [THÊM MỚI]: THANH BỘ LỌC (FILTER BAR) */}
                                <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    {/* Lọc theo Loại */}
                                    <div className="flex-1">
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Loại giao dịch</label>
                                        <select
                                            value={transType}
                                            onChange={(e) => handleFilterChange(setTransType, e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        >
                                            <option value="">Tất cả loại</option>
                                            <option value="TEST_PAYMENT">Làm test</option>
                                            <option value="VNPAY">Thanh toán</option>
                                            <option value="SYSTEM_BONUS">Thưởng</option>
                                        </select>
                                    </div>

                                    {/* Lọc theo Từ ngày */}
                                    <div className="flex-1">
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Từ ngày</label>
                                        <input
                                            type="date"
                                            value={transStartDate}
                                            onChange={(e) => handleFilterChange(setTransStartDate, e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:border-emerald-500 transition-all"
                                        />
                                    </div>

                                    {/* Lọc theo Đến ngày */}
                                    <div className="flex-1">
                                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Đến ngày</label>
                                        <input
                                            type="date"
                                            value={transEndDate}
                                            onChange={(e) => handleFilterChange(setTransEndDate, e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:border-emerald-500 transition-all"
                                        />
                                    </div>

                                    {/* Nút Xóa nhanh bộ lọc (Chỉ hiện khi có filter) */}
                                    {(transType || transStartDate || transEndDate) && (
                                        <div className="flex items-end">
                                            <button
                                                onClick={() => {
                                                    setTransType("");
                                                    setTransStartDate("");
                                                    setTransEndDate("");
                                                    setTransPage(1);
                                                }}
                                                className="px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                                            >
                                                <FaTimes size={12} /> Xóa lọc
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {transLoading ? (
                                    <div className="flex flex-col justify-center items-center py-12 text-emerald-500 gap-3">
                                        <FaSpinner className="animate-spin text-3xl" />
                                        <span className="text-sm font-medium text-slate-400">Đang tải dữ liệu...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto relative">
                                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                                <thead>
                                                    <tr className="text-gray-500 text-sm border-b border-gray-100">
                                                        <th className="py-4 font-semibold pr-4">Thời gian</th>
                                                        <th className="py-4 font-semibold pr-4">Nội dung</th>
                                                        <th className="py-4 font-semibold text-right pr-4">Tiền thanh toán</th> {/* 🔴 Thêm cột */}
                                                        <th className="py-4 font-semibold text-right pr-4">Biến động xu</th>
                                                        <th className="py-4 font-semibold text-right pr-4">Số dư sau GD</th>    {/* 🔴 Thêm cột */}
                                                        <th className="py-4 font-semibold text-right">Trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transactions.map((trans) => (
                                                        <tr key={trans.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors text-sm">
                                                            {/* Cột 1: Thời gian */}
                                                            <td className="py-4 text-gray-600 pr-4">
                                                                {new Date(trans.createdAt).toLocaleString('vi-VN')}
                                                            </td>

                                                            {/* Cột 2: Nội dung */}
                                                            <td className="py-4 text-gray-800 font-medium pr-4 max-w-[200px] truncate" title={trans.description}>
                                                                {trans.description}
                                                            </td>

                                                            {/* 🔴 Cột 3 (Mới): Tiền thanh toán */}
                                                            <td className="py-4 text-right text-gray-500 font-medium pr-4">
                                                                {formatCurrency(trans.totalAmount)}
                                                            </td>

                                                            {/* Cột 4: Biến động xu (+/-) */}
                                                            <td className={`py-4 text-right font-bold pr-4 ${trans.totalCoinsChanged > 0 ? 'text-emerald-500' : trans.totalCoinsChanged < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                                                {trans.totalCoinsChanged > 0 ? `+${trans.totalCoinsChanged}` : trans.totalCoinsChanged} <FaCoins className="inline-block text-[10px] mb-0.5 ml-0.5" />
                                                            </td>

                                                            {/* 🔴 Cột 5 (Mới): Số dư sau giao dịch */}
                                                            <td className="py-4 text-right text-yellow-500 font-bold pr-4">
                                                                {trans.balanceAfter} <FaCoins className="inline-block text-[10px] mb-0.5 ml-0.5" />
                                                            </td>

                                                            {/* Cột 6: Trạng thái (Map Enum sang Badge) */}
                                                            <td className="py-4 text-right">
                                                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${trans.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' :
                                                                    trans.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                                        'bg-red-100 text-red-600'
                                                                    }`}>
                                                                    {trans.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* 🔴 Empty State */}
                                            {transactions.length === 0 && (
                                                <div className="flex flex-col items-center justify-center py-10 opacity-60">
                                                    <div className="text-4xl mb-2 grayscale">📂</div>
                                                    <p className="text-gray-500 text-sm font-medium">Bạn chưa có giao dịch nào.</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* 🔴 Phân trang */}
                                        {transTotalPages > 1 && (
                                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                                                <span className="text-xs text-slate-400 font-medium">
                                                    Trang <strong className="text-slate-600">{transPage}</strong> / {transTotalPages}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled={transPage === 1}
                                                        onClick={() => setTransPage(p => p - 1)}
                                                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <FaChevronLeft size={12} />
                                                    </button>
                                                    <button
                                                        disabled={transPage === transTotalPages}
                                                        onClick={() => setTransPage(p => p + 1)}
                                                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <FaChevronRight size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;