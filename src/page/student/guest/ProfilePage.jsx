import React, { useState, useEffect } from "react";
// 1. Import thêm useNavigate
import { useNavigate } from "react-router-dom";
// 2. Import thêm icon FaSignOutAlt
import { 
    FaUserEdit, FaCamera, FaCoins, FaHistory, FaBullseye, 
    FaSave, FaTimes, FaEnvelope, FaPhone, FaBirthdayCake, FaSignOutAlt 
} from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth"; 

const MOCK_TRANSACTIONS = [
    { id: 1, date: "2023-10-25", desc: "Nạp xu qua Momo", amount: 500, type: "deposit", status: "Success" },
    { id: 2, date: "2023-10-26", desc: "Đăng ký khóa học IELTS Speaking", amount: -200, type: "payment", status: "Success" },
    { id: 3, date: "2023-11-02", desc: "Thưởng hoàn thành bài tập", amount: 50, type: "reward", status: "Success" },
    { id: 4, date: "2023-11-10", desc: "Mua tài liệu Reading", amount: -30, type: "payment", status: "Success" },
];

const ProfilePage = () => {
    // 3. Lấy hàm logout từ useAuth
    const { user, logout } = useAuth(); 
    const navigate = useNavigate(); // Hook để chuyển trang
    
    const [activeTab, setActiveTab] = useState("info");
    const [isEditing, setIsEditing] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState(null);

    const [formData, setFormData] = useState({
        fullName: "", 
        email: "",
        phone: "",
        dob: "",
        bio: "",
        targetScore: 0,
        avatar: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "", 
                email: user.email || "",
                phone: user.phone || "Chưa cập nhật",
                dob: user.dob || "2000-01-01",
                bio: user.bio || "Học viên tích cực tại EduSkill",
                targetScore: user.targetScore || 6.5,
                avatar: user.avatar || "https://via.placeholder.com/150",
            });
            setPreviewAvatar(user.avatar);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewAvatar(objectUrl);
        }
    };

    const handleSave = () => {
        console.log("Saving data:", formData);
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
    };

    const handleCancel = () => {
        if (user) {
            setFormData({ 
                ...formData, 
                fullName: user.fullName, 
                phone: user.phone, 
                bio: user.bio,
                dob: user.dob, 
                targetScore: user.targetScore
            });
            setPreviewAvatar(user.avatar);
        }
        setIsEditing(false);
    };

    // 4. Hàm xử lý đăng xuất
    const handleLogout = () => {
        // Gọi hàm logout từ context (xóa token, user info...)
        logout();
        // Chuyển hướng về trang chủ hoặc trang login
        navigate("/"); 
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
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-green-400 to-primary opacity-20"></div>
                            
                            <div className="relative w-32 h-32 mb-4 mt-6 group">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img 
                                        src={previewAvatar || "https://via.placeholder.com/150"} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                {isEditing && (
                                    <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FaCamera className="text-white text-2xl" />
                                        <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                    </label>
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800">{formData.fullName}</h2>
                            <span className="text-gray-500 text-sm mb-4">Học viên</span>

                            <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold text-xl">
                                        <FaCoins /> {user?.coins || 0}
                                    </div>
                                    <span className="text-xs text-gray-400 uppercase font-semibold">Xu hiện có</span>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-blue-500 font-bold text-xl">
                                        <FaBullseye /> {formData.targetScore}
                                    </div>
                                    <span className="text-xs text-gray-400 uppercase font-semibold">Mục tiêu</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Target Setting Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaBullseye className="text-red-500" /> Đặt lại mục tiêu điểm số
                            </h3>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    name="targetScore"
                                    value={formData.targetScore}
                                    onChange={handleChange} 
                                    disabled={!isEditing}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-primary disabled:opacity-60"
                                    placeholder="Ví dụ: 7.0"
                                />
                                {isEditing && (
                                    <button onClick={handleSave} className="bg-primary text-white px-4 rounded-lg hover:bg-green-600 transition-colors">
                                        Lưu
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Cập nhật mục tiêu để nhận lộ trình phù hợp.</p>
                        </div>

                        {/* 3. LOGOUT BUTTON */}
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
                            <button onClick={() => setActiveTab("info")} className={`pb-3 font-semibold text-lg transition-all ${activeTab === "info" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-800"}`}>
                                Thông tin cá nhân
                            </button>
                            <button onClick={() => setActiveTab("history")} className={`pb-3 font-semibold text-lg transition-all ${activeTab === "history" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-800"}`}>
                                Lịch sử giao dịch
                            </button>
                        </div>

                        {activeTab === "info" && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in-up">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Chi tiết hồ sơ</h3>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-primary hover:bg-green-50 px-4 py-2 rounded-full font-medium transition-colors">
                                            <FaUserEdit /> Chỉnh sửa
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={handleCancel} className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-full font-medium transition-colors">
                                                <FaTimes /> Hủy
                                            </button>
                                            <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 shadow-md transition-all">
                                                <FaSave /> Lưu thay đổi
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name Input */}
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-gray-600 text-sm font-semibold mb-2">Họ và tên</label>
                                        <input 
                                            type="text" 
                                            name="fullName" 
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-xl border ${isEditing ? 'border-gray-300 bg-white focus:border-primary focus:ring-2 focus:ring-green-100' : 'border-transparent bg-gray-50 text-gray-500'}`}
                                        />
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-gray-600 text-sm font-semibold mb-2">Email (Không thể thay đổi)</label>
                                        <div className="flex items-center w-full px-4 py-3 rounded-xl border border-transparent bg-gray-100 text-gray-500 cursor-not-allowed">
                                            <FaEnvelope className="mr-2 text-gray-400" />
                                            {formData.email}
                                        </div>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-gray-600 text-sm font-semibold mb-2">Số điện thoại</label>
                                        <div className="relative">
                                            <FaPhone className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="text" 
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isEditing ? 'border-gray-300 bg-white focus:border-primary' : 'border-transparent bg-gray-50 text-gray-500'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-gray-600 text-sm font-semibold mb-2">Ngày sinh</label>
                                        <div className="relative">
                                            <FaBirthdayCake className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="date" 
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isEditing ? 'border-gray-300 bg-white focus:border-primary' : 'border-transparent bg-gray-50 text-gray-500'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-gray-600 text-sm font-semibold mb-2">Giới thiệu bản thân</label>
                                        <textarea 
                                            name="bio"
                                            rows="4"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-xl border ${isEditing ? 'border-gray-300 bg-white focus:border-primary' : 'border-transparent bg-gray-50 text-gray-500'}`}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in-up">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FaHistory className="text-gray-400" /> Lịch sử biến động số dư
                                </h3>
                                {/* Table content */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-gray-500 text-sm border-b border-gray-100">
                                                <th className="py-4 font-semibold">Thời gian</th>
                                                <th className="py-4 font-semibold">Nội dung</th>
                                                <th className="py-4 font-semibold text-right">Số xu</th>
                                                <th className="py-4 font-semibold text-right">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {MOCK_TRANSACTIONS.map((trans) => (
                                                <tr key={trans.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 text-gray-600">{trans.date}</td>
                                                    <td className="py-4 text-gray-800 font-medium">{trans.desc}</td>
                                                    <td className={`py-4 text-right font-bold ${trans.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {trans.amount > 0 ? `+${trans.amount}` : trans.amount}
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trans.status === 'Success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                            {trans.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {MOCK_TRANSACTIONS.length === 0 && <p className="text-center text-gray-500 py-8">Bạn chưa có giao dịch nào.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;