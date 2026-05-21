import React, { useState, useEffect } from 'react';
import { 
    FaSearch, FaCheckCircle, FaUserCheck, FaSpinner, 
    FaChevronLeft, FaChevronRight, FaPhoneAlt, FaEnvelope, FaFilter 
} from 'react-icons/fa';
import consultaionApi from '../../api/consultaionApi';
import { useAuth } from '../../hooks/useAuth';

const ConsultationManagement = () => {
    const { user } = useAuth(); // Lấy thông tin admin hiện tại
    
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    
    // State cho bộ lọc
    const [filters, setFilters] = useState({
        keyword: '',
        status: '',
        isMine: false, // Trạng thái của nút "Ca tư vấn của tôi"
        page: 1,
        size: 10
    });

    // Gọi API fetch danh sách
    const fetchConsultations = async () => {
        setLoading(true);
        try {
            // Map state filter sang request DTO
            const requestData = {
                keyword: filters.keyword || undefined,
                status: filters.status || undefined,
                adminId: filters.isMine ? user?.id : undefined,
                page: filters.page,
                size: filters.size
            };

            const response = await consultaionApi.getAll(requestData);
            // Giả định backend trả về ApiResponse<PageResponse<ConsultationResponse>>
            if (response.data) {
                setConsultations(response.data.content || []);
                setTotalPages(response.data.totalPages || 1);
            }
        } catch (error) {
            console.error("Lỗi fetch danh sách tư vấn:", error);
        } finally {
            setLoading(false);
        }
    };

    // Chạy lại fetch khi các dependency thay đổi (trừ keyword sẽ cần bấm Enter để tìm)
    useEffect(() => {
        fetchConsultations();
    }, [filters.status, filters.isMine, filters.page]);

    // Xử lý tìm kiếm bằng Keyword (khi bấm Enter)
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setFilters(prev => ({ ...prev, page: 1 }));
            fetchConsultations();
        }
    };

    // Xử lý khi bấm nút "Nhận tư vấn"
    const handleClaim = async (id) => {
        try {
            const res = await consultaionApi.claim(id);
            const updatedItem = res.data; // Data trả về từ Backend
            
            // Cập nhật ngay dòng đó trên UI
            setConsultations(prev => prev.map(item => item.id === id ? updatedItem : item));
            alert("Đã nhận tư vấn thành công!");
        } catch (error) {
            alert(error.message || "Có lỗi xảy ra hoặc đã có người khác nhận.");
        }
    };

    // Xử lý khi bấm nút "Hoàn thành"
    const handleComplete = async (id) => {
        if (!window.confirm("Xác nhận đã tư vấn xong cho khách hàng này?")) return;
        
        try {
            const res = await consultaionApi.complete(id);
            const updatedItem = res.data; // Data trả về từ Backend
            
            // Cập nhật ngay dòng đó trên UI
            setConsultations(prev => prev.map(item => item.id === id ? updatedItem : item));
            alert("Đã hoàn tất tư vấn!");
        } catch (error) {
            alert(error.message || "Có lỗi xảy ra.");
        }
    };

    // Helper format ngày giờ
    const formatDate = (instant) => {
        if (!instant) return "---";
        return new Date(instant).toLocaleString('vi-VN');
    };

    // Helper render Badge trạng thái
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">CHỜ XỬ LÝ</span>;
            case 'IN_PROGRESS':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">ĐANG TƯ VẤN</span>;
            case 'COMPLETED':
                return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">ĐÃ HOÀN TẤT</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Yêu cầu Tư vấn</h1>
                    <p className="text-gray-500 text-sm mt-1">Phân bổ và theo dõi tiến độ chăm sóc khách hàng</p>
                </div>
            </div>

            {/* --- THANH BỘ LỌC (FILTER BAR) --- */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4 mb-6">
                
                {/* 1. Lọc theo Keyword */}
                <div className="relative flex-1 min-w-[250px]">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo Tên, Email, SĐT (Nhấn Enter)" 
                        value={filters.keyword}
                        onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                        onKeyDown={handleSearch}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    />
                </div>

                {/* 2. Lọc theo Trạng thái */}
                <div className="min-w-[180px]">
                    <select 
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ xử lý (Chưa ai nhận)</option>
                        <option value="IN_PROGRESS">Đang tư vấn</option>
                        <option value="COMPLETED">Đã hoàn tất</option>
                    </select>
                </div>

                {/* 3. Nút gạt: Ca tư vấn của tôi */}
                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                    <button 
                        onClick={() => setFilters(prev => ({ ...prev, isMine: !prev.isMine, page: 1 }))}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${filters.isMine ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <FaFilter size={12} />
                        Ca của tôi
                    </button>
                </div>
            </div>

            {/* --- BẢNG DỮ LIỆU (TABLE) --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Khách hàng</th>
                                <th className="px-6 py-4">Liên hệ</th>
                                <th className="px-6 py-4">Chủ đề tư vấn</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Người phụ trách</th>
                                <th className="px-6 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-emerald-500">
                                        <FaSpinner className="animate-spin text-3xl mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                                    </td>
                                </tr>
                            ) : consultations.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        <p className="text-gray-500">Không tìm thấy yêu cầu tư vấn nào.</p>
                                    </td>
                                </tr>
                            ) : (
                                consultations.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        
                                        {/* Cột 1: Tên & Tuổi */}
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800">{item.fullName}</p>
                                            <p className="text-xs text-gray-500 mt-1">Năm sinh: {item.birthYear || "---"}</p>
                                        </td>
                                        
                                        {/* Cột 2: Email & SĐT */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                <FaPhoneAlt className="text-gray-400 text-xs" /> {item.phoneNumber}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaEnvelope className="text-gray-400 text-xs" /> {item.email}
                                            </div>
                                        </td>
                                        
                                        {/* Cột 3: Topic & Ngày giờ tạo */}
                                        <td className="px-6 py-4 max-w-[200px] truncate" title={item.topic}>
                                            <p className="text-sm font-medium text-gray-700 truncate">{item.topic}</p>
                                            <p className="text-xs text-gray-400 mt-1">{formatDate(item.createdAt)}</p>
                                        </td>
                                        
                                        {/* Cột 4: Status Badge */}
                                        <td className="px-6 py-4">
                                            {renderStatusBadge(item.status)}
                                        </td>

                                        {/* Cột 5: Tên Admin */}
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-slate-700">
                                                {item.handledByName || <span className="text-gray-400 italic">Chưa phân công</span>}
                                            </span>
                                        </td>

                                        {/* Cột 6: Nút thao tác (LOGIC CHÍNH NẰM Ở ĐÂY) */}
                                        <td className="px-6 py-4 text-center">
                                            {item.status === 'PENDING' && (
                                                <button 
                                                    onClick={() => handleClaim(item.id)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors"
                                                >
                                                    <FaUserCheck /> Nhận tư vấn
                                                </button>
                                            )}

                                            {item.status === 'IN_PROGRESS' && item.handledById === user?.id && (
                                                <button 
                                                    onClick={() => handleComplete(item.id)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-bold transition-colors"
                                                >
                                                    <FaCheckCircle /> Hoàn tất
                                                </button>
                                            )}

                                            {/* Nếu là IN_PROGRESS nhưng của Admin khác thì hiện text báo */}
                                            {item.status === 'IN_PROGRESS' && item.handledById !== user?.id && (
                                                <span className="text-xs text-gray-400 italic">Đang được xử lý</span>
                                            )}

                                            {item.status === 'COMPLETED' && (
                                                <span className="text-emerald-500"><FaCheckCircle className="mx-auto text-xl" title="Đã hoàn tất" /></span>
                                            )}
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
        </div>
    );
};

export default ConsultationManagement;