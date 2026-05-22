import React, { useState, useEffect } from 'react';
import { 
    FaSearch, FaUserShield, FaSpinner, 
    FaChevronLeft, FaChevronRight, FaPhoneAlt, FaEnvelope, FaFilter, FaLock, FaLockOpen, FaUserCircle, FaMapMarkerAlt, FaBriefcase, FaTimes, FaBookOpen
} from 'react-icons/fa';
import adminApi from '../../api/adminApi';
import { toast } from 'react-toastify';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    
    const [filters, setFilters] = useState({
        keyword: '',
        status: '',
        role: '',
        page: 1,
        size: 10
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const requestData = {
                keyword: filters.keyword || undefined,
                status: filters.status || undefined,
                role: filters.role || undefined,
                page: filters.page,
                size: filters.size
            };

            const response = await adminApi.getUsers(requestData);
            if (response.data) {
                setUsers(response.data.content || []);
                setTotalPages(response.data.totalPages || 1);
            }
        } catch (error) {
            console.error("Lỗi fetch danh sách người dùng:", error);
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters.status, filters.role, filters.page]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setFilters(prev => ({ ...prev, page: 1 }));
            fetchUsers();
        }
    };

    const handleOpenDetail = async (id) => {
        setIsModalOpen(true);
        setSelectedUser(null);
        try {
            const res = await adminApi.getUserDetail(id);
            setSelectedUser(res.data);
        } catch (error) {
            toast.error("Không thể tải chi tiết người dùng");
            setIsModalOpen(false);
        }
    };

    const handleBlockUser = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn khóa tài khoản này? Người dùng sẽ không thể đăng nhập nữa.")) return;
        
        setActionLoading(true);
        try {
            const res = await adminApi.blockUser(id);
            const updatedUser = res.data;
            
            // Cập nhật UI
            setUsers(prev => prev.map(item => item.id === id ? updatedUser : item));
            if (selectedUser && selectedUser.id === id) {
                setSelectedUser(updatedUser);
            }
            toast.success("Đã khóa tài khoản thành công!");
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra khi khóa tài khoản.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnblockUser = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn mở khóa tài khoản này?")) return;
        
        setActionLoading(true);
        try {
            const res = await adminApi.unblockUser(id);
            const updatedUser = res.data;
            
            // Cập nhật UI
            setUsers(prev => prev.map(item => item.id === id ? updatedUser : item));
            if (selectedUser && selectedUser.id === id) {
                setSelectedUser(updatedUser);
            }
            toast.success("Đã mở khóa tài khoản thành công!");
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra khi mở khóa tài khoản.");
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "---";
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">HOẠT ĐỘNG</span>;
            case 'INACTIVE':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">CHƯA KÍCH HOẠT</span>;
            case 'BLOCKED':
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">ĐÃ KHÓA</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    const renderRoleBadge = (roles) => {
        if (!roles || roles.length === 0) return null;
        
        const hasAdmin = roles.some(r => r.name === 'ADMIN');
        const hasTeacher = roles.some(r => r.name === 'TEACHER');
        const hasStudent = roles.some(r => r.name === 'STUDENT');

        if (hasAdmin) return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">Admin</span>;
        if (hasTeacher) return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">Teacher</span>;
        if (hasStudent) return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">Student</span>;
        return null;
    };

    return (
        <div className="p-6 bg-[#f1f5f9] min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
                <p className="text-gray-500 text-sm mt-1">Quản lý tài khoản giảng viên, học viên trong hệ thống</p>
            </div>

            {/* --- THANH BỘ LỌC (FILTER BAR) --- */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4 mb-6">
                
                {/* Lọc theo Keyword */}
                <div className="relative flex-1 min-w-[250px]">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo Tên, Email (Nhấn Enter)" 
                        value={filters.keyword}
                        onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                        onKeyDown={handleSearch}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    />
                </div>

                {/* Lọc theo Role */}
                <div className="min-w-[150px]">
                    <select 
                        value={filters.role}
                        onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
                    >
                        <option value="">Tất cả vai trò</option>
                        <option value="STUDENT">Student</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                {/* Lọc theo Trạng thái */}
                <div className="min-w-[150px]">
                    <select 
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="BLOCKED">Đã khóa</option>
                        <option value="INACTIVE">Chưa kích hoạt</option>
                    </select>
                </div>
            </div>

            {/* --- BẢNG DỮ LIỆU (TABLE) --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Người dùng</th>
                                <th className="px-6 py-4">Liên hệ</th>
                                <th className="px-6 py-4">Vai trò</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-emerald-500">
                                        <FaSpinner className="animate-spin text-3xl mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center">
                                        <p className="text-gray-500">Không tìm thấy người dùng nào.</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.avatarUrl ? (
                                                    <img src={item.avatarUrl} alt={item.fullName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                        <FaUserCircle className="text-2xl" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-800">{item.fullName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaEnvelope className="text-gray-400 text-xs" /> {item.email}
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            {renderRoleBadge(item.roles)}
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            {renderStatusBadge(item.status)}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleOpenDetail(item.id)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors"
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- PHÂN TRANG (PAGINATION) --- */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                        <span className="text-sm text-gray-500">
                            Trang <span className="font-semibold text-gray-800">{filters.page}</span> / {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <button 
                                disabled={filters.page === 1}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <FaChevronLeft size={12} />
                            </button>
                            <button 
                                disabled={filters.page === totalPages}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MODAL CHI TIẾT --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Thông tin chi tiết</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            {!selectedUser ? (
                                <div className="py-12 text-center text-emerald-500">
                                    <FaSpinner className="animate-spin text-3xl mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Đang tải...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                                        {selectedUser.avatarUrl ? (
                                            <img src={selectedUser.avatarUrl} alt={selectedUser.fullName} className="w-24 h-24 rounded-full object-cover border-4 border-emerald-50 shadow-sm" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-4 border-emerald-50">
                                                <FaUserCircle className="text-5xl" />
                                            </div>
                                        )}
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-2xl font-bold text-gray-900">{selectedUser.fullName}</h3>
                                                {renderStatusBadge(selectedUser.status)}
                                            </div>
                                            <div className="flex gap-2">
                                                {renderRoleBadge(selectedUser.roles)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-start gap-3">
                                            <FaEnvelope className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Email</p>
                                                <p className="text-sm text-gray-800 font-semibold">{selectedUser.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <FaBriefcase className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Nghề nghiệp</p>
                                                <p className="text-sm text-gray-800 font-semibold">{selectedUser.jobTitle || "---"}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <FaUserShield className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Ngày sinh</p>
                                                <p className="text-sm text-gray-800 font-semibold">{formatDate(selectedUser.dob)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-3">
                                            <FaMapMarkerAlt className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Địa chỉ</p>
                                                <p className="text-sm text-gray-800 font-semibold">{selectedUser.address || "---"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {selectedUser.courses && selectedUser.courses.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
                                                {selectedUser.roles?.some(r => r.name === 'TEACHER') ? "Các khóa học đang giảng dạy" : "Các khóa học đã tham gia"}
                                            </h4>
                                            <ul className="grid grid-cols-1 gap-2">
                                                {selectedUser.courses.map(course => (
                                                    <li key={course.id} className="bg-white border border-gray-100 p-3 rounded-xl text-sm font-medium text-gray-700 flex items-center gap-3 shadow-sm hover:border-emerald-200 transition-colors">
                                                        <FaBookOpen className="text-emerald-500 shrink-0" />
                                                        <span className="truncate">{course.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {selectedUser && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    Đóng
                                </button>
                                
                                {!selectedUser.roles?.some(r => r.name === 'ADMIN') && (
                                    selectedUser.status === 'BLOCKED' ? (
                                        <button 
                                            onClick={() => handleUnblockUser(selectedUser.id)}
                                            disabled={actionLoading}
                                            className="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {actionLoading ? <FaSpinner className="animate-spin" /> : <FaLockOpen />}
                                            Mở khóa tài khoản
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleBlockUser(selectedUser.id)}
                                            disabled={actionLoading}
                                            className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 flex items-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {actionLoading ? <FaSpinner className="animate-spin" /> : <FaLock />}
                                            Khóa tài khoản
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
