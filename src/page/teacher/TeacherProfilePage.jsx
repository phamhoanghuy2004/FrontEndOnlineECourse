import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    FaUserEdit, FaCamera, FaCoins, FaHistory, FaSave, FaTimes, 
    FaEnvelope, FaBirthdayCake, FaSignOutAlt, FaMapMarkerAlt, 
    FaBriefcase, FaIdCard, FaQuoteLeft, FaCertificate, FaExternalLinkAlt, FaPlus
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import userApi from "../../api/userApi";
import certificateApi from "../../api/certificateApi";
import CertificateModal from "../../components/common/teacher/CertificateModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { toast } from "react-hot-toast";

const TeacherProfilePage = () => {
    const { user, logout, fetchUserProfile } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("info");
    const [isEditing, setIsEditing] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Certificate states
    const [certificates, setCertificates] = useState([]);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [certToDelete, setCertToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        dob: "",
        jobTitle: "",
        bio: "",
        avatarUrl: "",
        currentCoin: 0,
        certificates: []
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                address: user.address || "Chưa cập nhật",
                dob: user.dob || "2000-01-01",
                jobTitle: user.jobTitle || "Giáo viên",
                bio: user.bio || "Chưa có giới thiệu bản thân",
                avatarUrl: user.avatarUrl || null,
                currentCoin: user.currentCoin || 0,
                certificates: user.certificates || []
            });
            setPreviewAvatar(user.avatarUrl);
            
            // Chỉ cập nhật certificates nếu local list đang trống (lần đầu load)
            // hoặc khi user thực sự thay đổi ID.
            // Điều này tránh việc AuthContext cập nhật chậm đè lên list local vừa CRUD xong.
            if (!certificates || certificates.length === 0) {
                console.log("Khởi tạo certificates từ AuthContext:", user.certificates);
                setCertificates(user.certificates || []);
            }
        }
    }, [user?.id]); // Chỉ chạy khi user ID thay đổi thực sự

    const fetchCertificates = async () => {
        try {
            const res = await certificateApi.getMyCertificates();
            setCertificates(res.data);
        } catch (err) {
            console.error("Fetch certificates error:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewAvatar(objectUrl);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const promises = [];
            const userData = {
                fullName: formData.fullName,
                dob: formData.dob,
                address: formData.address,
                jobTitle: formData.jobTitle
            };

            const userFormData = new FormData();
            userFormData.append("data", new Blob([JSON.stringify(userData)], { type: "application/json" }));
            
            if (selectedFile) {
                userFormData.append("avatar", selectedFile);
            }

            promises.push(userApi.updateUser(userFormData));

            // 2. Cập nhật bio nếu có thay đổi
            if (formData.bio !== user.bio) {
                promises.push(userApi.updateTeacherProfile({ bio: formData.bio }));
            }

            await Promise.all(promises);

            // 3. Refresh user data trong AuthContext
            const roles = user.roles || []; 
            await fetchUserProfile(roles);
            
            setIsEditing(false);
            setSelectedFile(null);
            toast.success("Cập nhật thông tin thành công!");
        } catch (err) {
            console.error("Update profile error:", err);
            toast.error(err.message || "Có lỗi xảy ra khi cập nhật hồ sơ");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                ...formData,
                fullName: user.fullName,
                address: user.address,
                jobTitle: user.jobTitle,
                dob: user.dob,
                bio: user.bio
            });
            setPreviewAvatar(user.avatarUrl);
        }
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // --- CERTIFICATE ACTIONS ---
    const handleOpenAddCert = () => {
        setEditingCert(null);
        setIsCertModalOpen(true);
    };

    const handleOpenEditCert = (e, cert) => {
        e.stopPropagation();
        setEditingCert(cert);
        setIsCertModalOpen(true);
    };

    const handleOpenDeleteCert = (e, cert) => {
        e.stopPropagation();
        setCertToDelete(cert);
        setIsDeleteModalOpen(true);
    };

    const handleSaveCertificate = async (formData, id) => {
        try {
            if (id) {
                await certificateApi.updateCertificate(id, formData);
                toast.success("Cập nhật chứng chỉ thành công!");
            } else {
                await certificateApi.createCertificate(formData);
                toast.success("Thêm chứng chỉ thành công!");
            }
            await fetchCertificates();
            if (user?.roles) await fetchUserProfile(user.roles);
        } catch (err) {
            console.error("Lỗi khi lưu chứng chỉ:", err);
            toast.error(err.message || "Có lỗi xảy ra khi lưu chứng chỉ");
            throw err;
        }
    };

    const confirmDeleteCertificate = async () => {
        if (!certToDelete) return;
        setIsDeleting(true);
        try {
            await certificateApi.deleteCertificate(certToDelete.id);
            toast.success("Xóa chứng chỉ thành công!");
            // 1. Fetch list local
            await fetchCertificates();
            // 2. Đồng bộ global state
            if (user?.roles) await fetchUserProfile(user.roles);
            
            setIsDeleteModalOpen(false);
            setCertToDelete(null);
        } catch (err) {
            console.error("Lỗi khi xóa chứng chỉ:", err);
            toast.error(err.message || "Không thể xóa chứng chỉ");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
            <div className="container mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Hồ sơ giáo viên</h1>
                    <p className="text-slate-500">Quản lý thông tin cá nhân và hồ sơ chuyên môn của bạn.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* 1. Profile Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-10"></div>

                            <div className="relative w-32 h-32 mb-4 mt-6 group">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img
                                        src={previewAvatar || "https://ui-avatars.com/api/?name=" + (formData.fullName || "T") + "&background=10b981&color=fff"}
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

                            <h2 className="text-2xl font-bold text-slate-800">{formData.fullName}</h2>
                            <span className="text-emerald-600 font-medium text-sm mb-4 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">{formData.jobTitle}</span>
                        </div>

                        {/* 2. Bio Quick View */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest text-slate-400">
                                <FaQuoteLeft className="text-emerald-500" /> Giới thiệu ngắn
                            </h3>
                            <p className="text-slate-600 italic text-sm leading-relaxed">
                                "{formData.bio || "Chưa có giới thiệu..."}"
                            </p>
                        </div>

                        {/* 3. LOGOUT BUTTON */}
                        <button
                            onClick={handleLogout}
                            className="w-full bg-white text-rose-500 font-bold py-4 rounded-3xl flex items-center justify-center gap-2 hover:bg-rose-50 hover:shadow-md transition-all border border-rose-100 group"
                        >
                            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
                            Đăng xuất
                        </button>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            <button 
                                onClick={() => setActiveTab("info")} 
                                className={`pb-4 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === "info" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                Thông tin cá nhân
                            </button>
                            <button 
                                onClick={() => setActiveTab("credentials")} 
                                className={`pb-4 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === "credentials" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                Hồ sơ năng lực
                            </button>
                        </div>

                        {activeTab === "info" && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 animate-fade-in-up">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-slate-800">Thông tin cơ bản</h3>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all">
                                            <FaUserEdit /> Chỉnh sửa
                                        </button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button onClick={handleCancel} className="flex items-center gap-2 text-slate-500 hover:bg-slate-100 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all">
                                                <FaTimes /> Hủy
                                            </button>
                                            <button 
                                                onClick={handleSave} 
                                                disabled={isSaving}
                                                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSaving ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : <FaSave />}
                                                {isSaving ? "Đang lưu..." : "Lưu hồ sơ"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Họ và tên</label>
                                        <div className="relative">
                                            <FaIdCard className="absolute top-1/2 left-4 transform -translate-y-1/2 text-slate-300" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all ${isEditing ? 'border-slate-300 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50' : 'border-transparent bg-slate-50 text-slate-600 cursor-not-allowed'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Email</label>
                                        <div className="flex items-center w-full px-4 py-3.5 rounded-2xl border border-transparent bg-slate-50 text-slate-400 cursor-not-allowed">
                                            <FaEnvelope className="mr-3 text-slate-300" />
                                            {formData.email}
                                        </div>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Địa chỉ</label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute top-1/2 left-4 transform -translate-y-1/2 text-slate-300" />
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all ${isEditing ? 'border-slate-300 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50' : 'border-transparent bg-slate-50 text-slate-600 cursor-not-allowed'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Ngày sinh</label>
                                        <div className="relative">
                                            <FaBirthdayCake className="absolute top-1/2 left-4 transform -translate-y-1/2 text-slate-300" />
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all ${isEditing ? 'border-slate-300 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50' : 'border-transparent bg-slate-50 text-slate-600 cursor-not-allowed'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Chức danh / Nghề nghiệp</label>
                                        <div className="relative">
                                            <FaBriefcase className="absolute top-1/2 left-4 transform -translate-y-1/2 text-slate-300" />
                                            <input
                                                type="text"
                                                name="jobTitle"
                                                value={formData.jobTitle}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border transition-all ${isEditing ? 'border-slate-300 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50' : 'border-transparent bg-slate-50 text-slate-600 cursor-not-allowed'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "credentials" && (
                            <div className="space-y-6 animate-fade-in-up">
                                {/* Bio Section */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <FaQuoteLeft className="text-emerald-500 text-sm" /> Giới thiệu bản thân
                                    </h3>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        rows="5"
                                        className={`w-full px-5 py-4 rounded-2xl border leading-relaxed transition-all ${isEditing ? 'border-slate-300 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50' : 'border-transparent bg-slate-50 text-slate-600 italic'}`}
                                        placeholder="Kể chút gì đó về kinh nghiệm giáo dục của bạn..."
                                    />
                                    {isEditing && (
                                        <div className="mt-4 flex justify-end">
                                            <button 
                                                onClick={handleSave} 
                                                disabled={isSaving}
                                                className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                                {isSaving ? "Đang cập nhật..." : "Cập nhật Bio"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Certificates Section */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                            <FaCertificate className="text-yellow-500" /> Bằng cấp & Chứng chỉ
                                        </h3>
                                        <button 
                                            onClick={handleOpenAddCert}
                                            className="text-emerald-600 font-bold text-sm hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                                        >
                                            <FaPlus className="text-xs" /> Thêm mới
                                        </button>
                                    </div>

                                    {certificates && certificates.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {certificates.map((cert) => (
                                                <div key={cert.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md hover:border-emerald-100 transition-all group">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                                            {cert.certType}
                                                        </span>
                                                        <div className="flex items-center gap-3">
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => handleOpenEditCert(e, cert)}
                                                                className="p-2 bg-white shadow-sm rounded-lg text-slate-400 hover:text-blue-500 hover:shadow transition-all"
                                                                title="Sửa"
                                                            >
                                                                <FaUserEdit className="text-sm" />
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => handleOpenDeleteCert(e, cert)}
                                                                className="p-2 bg-white shadow-sm rounded-lg text-slate-400 hover:text-rose-500 hover:shadow transition-all"
                                                                title="Xóa"
                                                            >
                                                                <FaTimes className="text-sm" />
                                                            </button>
                                                            <a 
                                                                href={cert.evidenceUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="p-2 bg-white shadow-sm rounded-lg text-slate-400 hover:text-emerald-600 hover:shadow transition-all text-center flex items-center justify-center" 
                                                                title="Xem minh chứng"
                                                            >
                                                                <FaExternalLinkAlt className="text-xs" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-slate-800 mb-1">{cert.certType}</h4>
                                                    <div className="flex items-end justify-between">
                                                        <div>
                                                            <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-tight">Ngày cấp: {cert.issuedDate}</p>
                                                            <div className="flex gap-2">
                                                                <span className="text-emerald-600 font-bold text-lg">{cert.totalScore}</span>
                                                                <span className="text-slate-400 text-[10px] self-end mb-1 uppercase">Total Score</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-[8px] text-slate-400 uppercase">L</span>
                                                                <span className="text-xs font-bold text-slate-600">{cert.listeningScore}</span>
                                                            </div>
                                                            <div className="flex flex-col items-center ml-2">
                                                                <span className="text-[8px] text-slate-400 uppercase">R</span>
                                                                <span className="text-xs font-bold text-slate-600">{cert.readingScore}</span>
                                                            </div>
                                                            {cert.certType !== "TOEIC_LR" && (
                                                                <>
                                                                    <div className="flex flex-col items-center ml-2">
                                                                        <span className="text-[8px] text-slate-400 uppercase">S</span>
                                                                        <span className="text-xs font-bold text-slate-600">{cert.speakingScore}</span>
                                                                    </div>
                                                                    <div className="flex flex-col items-center ml-2">
                                                                        <span className="text-[8px] text-slate-400 uppercase">W</span>
                                                                        <span className="text-xs font-bold text-slate-600">{cert.writingScore}</span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                            <FaCertificate className="text-5xl text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-medium font-sans">Bạn chưa cập nhật chứng chỉ nào.</p>
                                            <button 
                                                onClick={handleOpenAddCert}
                                                className="mt-4 text-emerald-600 font-bold text-sm hover:underline"
                                            >
                                                Thêm chứng chỉ mới
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CertificateModal 
                isOpen={isCertModalOpen}
                onClose={() => setIsCertModalOpen(false)}
                onSave={handleSaveCertificate}
                editingCert={editingCert}
            />

            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteCertificate}
                title="Xóa chứng chỉ"
                message={`Bạn có chắc chắn muốn xóa chứng chỉ ${certToDelete?.certType} này không? Hành động này không thể hoàn tác.`}
                confirmText="Xóa ngay"
                cancelText="Hủy"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default TeacherProfilePage;
