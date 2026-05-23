import React, { useState, useEffect, useRef } from 'react';
import { 
    FaSearch, FaSpinner, FaChevronLeft, FaChevronRight, FaBookOpen, FaTimes, 
    FaCheckCircle, FaBan, FaEyeSlash, FaStar, FaUser, FaFileAlt, FaGraduationCap, 
    FaCalendarAlt, FaTags, FaList, FaUserCircle, FaDownload, FaClipboardList, FaFileDownload,
    FaVideo
} from 'react-icons/fa';
import adminApi from '../../api/adminApi';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import Hls from 'hls.js';

const AdminLessonVideoPlayer = ({ url }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        let hls;
        const video = videoRef.current;
        if (!video || !url) return;

        if (url.includes('.m3u8')) {
            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data.fatal) console.error('HLS Error:', data);
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            }
        } else {
            video.src = url;
        }

        return () => {
            if (hls) hls.destroy();
        };
    }, [url]);

    return (
        <div className="relative aspect-video max-w-xl mx-auto bg-black rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <video
                ref={videoRef}
                controls
                className="w-full h-full object-contain"
            />
        </div>
    );
};

const AdminCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Filters state
    const [filters, setFilters] = useState({
        courseName: '',
        teacherName: '',
        status: '',
        page: 1,
        size: 10
    });

    const fetchCourses = async (customFilters = null) => {
        setLoading(true);
        try {
            const activeFilters = customFilters || filters;
            const requestData = {
                courseName: activeFilters.courseName || undefined,
                teacherName: activeFilters.teacherName || undefined,
                status: activeFilters.status || undefined,
                page: activeFilters.page,
                size: activeFilters.size
            };

            const response = await adminApi.getCourses(requestData);
            if (response.data) {
                setCourses(response.data.content || []);
                setTotalPages(response.data.totalPages || 1);
            }
        } catch (error) {
            console.error("Lỗi fetch danh sách khóa học:", error);
            toast.error("Không thể tải danh sách khóa học");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [filters.status, filters.page]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setFilters(prev => ({ ...prev, page: 1 }));
            fetchCourses();
        }
    };

    const handleSearchClick = () => {
        setFilters(prev => ({ ...prev, page: 1 }));
        fetchCourses();
    };

    const handleResetFilters = () => {
        const cleared = {
            courseName: '',
            teacherName: '',
            status: '',
            page: 1,
            size: 10
        };
        setFilters(cleared);
        fetchCourses(cleared);
    };

    const handleOpenDetail = async (id) => {
        setIsModalOpen(true);
        setSelectedCourse(null);
        setModalLoading(true);
        try {
            const res = await adminApi.getCourseDetail(id);
            if (res.data) {
                setSelectedCourse(res.data);
            }
        } catch (error) {
            toast.error("Không thể tải chi tiết khóa học");
            setIsModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        let confirmMsg = "";
        switch (newStatus) {
            case 'ACTIVE':
                confirmMsg = "Bạn có chắc chắn muốn duyệt khóa học này? Khóa học sẽ được hiển thị công khai tới học viên.";
                break;
            case 'INACTIVE':
                confirmMsg = "Bạn có chắc chắn muốn tạm ẩn khóa học này? Khóa học sẽ không còn hiển thị với học viên mới.";
                break;
            case 'BLOCKED':
                confirmMsg = "Bạn có chắc chắn muốn KHÓA khóa học này? Học viên sẽ không thể đăng ký và giảng dạy sẽ bị tạm ngưng.";
                break;
            default:
                confirmMsg = `Xác nhận đổi trạng thái khóa học sang ${newStatus}?`;
        }

        if (!window.confirm(confirmMsg)) return;

        setActionLoading(true);
        try {
            const res = await adminApi.updateCourseStatus(id, newStatus);
            const updatedCourse = res.data;

            // Cập nhật danh sách ở trang chính
            setCourses(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
            
            // Cập nhật modal detail nếu đang hiển thị
            if (selectedCourse && selectedCourse.id === String(id)) {
                setSelectedCourse(prev => ({ ...prev, status: newStatus }));
            }
            
            toast.success("Cập nhật trạng thái khóa học thành công!");
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra khi cập nhật trạng thái.");
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "---";
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return "---";
        if (Number(price) === 0) return "Miễn phí";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        HOẠT ĐỘNG
                    </span>
                );
            case 'INACTIVE':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        CHƯA DUYỆT
                    </span>
                );
            case 'BLOCKED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        ĐÃ KHÓA
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-bold shadow-sm">
                        {status}
                    </span>
                );
        }
    };

    const renderLevelBadge = (level) => {
        switch (level) {
            case 'BEGINNER':
                return <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-150 rounded text-xs font-semibold">Cơ bản</span>;
            case 'INTERMEDIATE':
                return <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-150 rounded text-xs font-semibold">Trung cấp</span>;
            case 'ADVANCED':
                return <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-150 rounded text-xs font-semibold">Nâng cao</span>;
            default:
                return <span className="px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 rounded text-xs font-semibold">{level || "Mọi trình độ"}</span>;
        }
    };

    return (
        <div className="p-6 bg-[#f8fafc] min-h-screen text-slate-700">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <FaBookOpen className="text-emerald-600" />
                        Quản lý Khóa học
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Phê duyệt, kiểm tra nội dung và quản lý trạng thái khóa học của giảng viên.</p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4 mb-6">
                {/* Course Name */}
                <div className="relative flex-1 min-w-[240px]">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm tên khóa học (Nhấn Enter)" 
                        value={filters.courseName}
                        onChange={(e) => setFilters(prev => ({ ...prev, courseName: e.target.value }))}
                        onKeyDown={handleSearch}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    />
                </div>

                {/* Teacher Name */}
                <div className="relative flex-1 min-w-[240px]">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm tên giảng viên (Nhấn Enter)" 
                        value={filters.teacherName}
                        onChange={(e) => setFilters(prev => ({ ...prev, teacherName: e.target.value }))}
                        onKeyDown={handleSearch}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                    />
                </div>

                {/* Status Filter */}
                <div className="min-w-[180px]">
                    <select 
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 transition-all text-sm cursor-pointer"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="INACTIVE">Chưa duyệt</option>
                        <option value="BLOCKED">Đã khóa</option>
                    </select>
                </div>

                {/* Search Action Button */}
                <button
                    onClick={handleSearchClick}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-sm"
                >
                    Lọc dữ liệu
                </button>

                {/* Reset Button */}
                <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-200 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-sm"
                >
                    Đặt lại
                </button>
            </div>

            {/* Courses Table Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 text-sm font-bold uppercase tracking-wider">
                                <th className="px-6 py-5 min-w-[520px]">Khóa học</th>
                                <th className="px-6 py-5 min-w-[320px]">Giảng viên</th>
                                <th className="px-6 py-5 min-w-[150px]">Trình độ</th>
                                <th className="px-6 py-5 text-center min-w-[200px]">Học viên / Đánh giá</th>
                                <th className="px-6 py-5 text-right min-w-[200px]">Giá bán / Gốc</th>
                                <th className="px-6 py-5 min-w-[180px]">Trạng thái</th>
                                <th className="px-6 py-5 text-center min-w-[150px]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-emerald-500">
                                        <FaSpinner className="animate-spin text-4xl mx-auto mb-3" />
                                        <p className="text-sm font-semibold text-slate-400">Đang đồng bộ dữ liệu hệ thống...</p>
                                    </td>
                                </tr>
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                                            <FaBookOpen className="text-slate-300 text-2xl" />
                                        </div>
                                        <p className="text-slate-400 font-medium">Không tìm thấy khóa học nào phù hợp.</p>
                                    </td>
                                </tr>
                            ) : (
                                courses.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                                        {/* Image & Title */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3.5 max-w-[500px]">
                                                {item.imageUrl ? (
                                                    <img 
                                                        src={item.imageUrl} 
                                                        alt={item.name} 
                                                        className="w-14 h-10 object-cover rounded-xl border border-slate-100 shadow-sm shrink-0" 
                                                    />
                                                ) : (
                                                    <div className="w-14 h-10 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                                        <FaBookOpen className="text-base" />
                                                    </div>
                                                )}
                                                <div className="truncate">
                                                    <span className="font-bold text-slate-800 text-sm block truncate hover:text-emerald-600 transition-colors" title={item.name}>
                                                        {item.name}
                                                    </span>
                                                    <span className="text-slate-400 text-xs mt-0.5 block truncate">
                                                        Danh mục: {item.categoryName || "---"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Teacher */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                {item.teacherAvatarUrl ? (
                                                    <img 
                                                        src={item.teacherAvatarUrl} 
                                                        alt={item.teacherName} 
                                                        className="w-7 h-7 rounded-full object-cover border border-slate-200" 
                                                    />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                                        <FaUser className="text-xs" />
                                                    </div>
                                                )}
                                                <span className="text-sm font-semibold text-slate-650">{item.teacherName || "Chưa gán"}</span>
                                            </div>
                                        </td>

                                        {/* Level */}
                                        <td className="px-6 py-5">
                                            {renderLevelBadge(item.level)}
                                        </td>

                                        {/* Student stats & Rating */}
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center justify-center gap-0.5">
                                                <span className="text-sm font-bold text-slate-700">{item.studentCount || 0} HV</span>
                                                {item.averageRating > 0 ? (
                                                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                                        <FaStar className="shrink-0" />
                                                        <span>{item.averageRating.toFixed(1)}</span>
                                                        <span className="text-slate-400 font-normal">({item.reviewCount || 0})</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-full">Chưa có đánh giá</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Pricing */}
                                        <td className="px-6 py-5 text-right font-medium">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-bold text-slate-800">
                                                    {formatPrice(item.price)}
                                                </span>
                                                {item.originalPrice > item.price && (
                                                    <span className="text-xs text-slate-400 line-through">
                                                        {formatPrice(item.originalPrice)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-5">
                                            {renderStatusBadge(item.status)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-5 text-center">
                                            <button 
                                                onClick={() => handleOpenDetail(item.id)}
                                                className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 hover:border-emerald-250 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 shadow-sm"
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-between bg-white">
                        <span className="text-sm text-slate-500 font-medium">
                            Trang <span className="font-bold text-slate-850 bg-slate-50 px-2.5 py-1 border border-slate-200 rounded-lg">{filters.page}</span> trên tổng số <span className="font-bold text-slate-700">{totalPages}</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <button 
                                disabled={filters.page === 1}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                className="p-2.5 border border-slate-200 rounded-xl text-slate-650 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all active:scale-95"
                            >
                                <FaChevronLeft size={12} />
                            </button>
                            <button 
                                disabled={filters.page === totalPages}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                className="p-2.5 border border-slate-200 rounded-xl text-slate-650 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all active:scale-95"
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Course Detail Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2.5">
                                <FaBookOpen className="text-emerald-600" />
                                Chi tiết nội dung khóa học
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-205 transition-all">
                                <FaTimes size={16} />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
                            {modalLoading ? (
                                <div className="py-24 text-center text-emerald-500">
                                    <FaSpinner className="animate-spin text-4xl mx-auto mb-3" />
                                    <p className="text-sm font-semibold text-slate-400">Đang trích xuất cấu trúc khóa học...</p>
                                </div>
                            ) : !selectedCourse ? (
                                <div className="py-20 text-center">
                                    <p className="text-rose-500 font-bold">Không tìm thấy hoặc không có quyền truy cập khóa học này.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* General Overview Card */}
                                    <div className="flex flex-col md:flex-row gap-6 items-start bg-slate-50/40 p-5 rounded-2xl border border-slate-100">
                                        {selectedCourse.imageUrl ? (
                                            <img 
                                                src={selectedCourse.imageUrl} 
                                                alt={selectedCourse.name} 
                                                className="w-full md:w-48 h-32 object-cover rounded-xl border border-slate-200 shadow-sm shrink-0" 
                                            />
                                        ) : (
                                            <div className="w-full md:w-48 h-32 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center justify-center shrink-0">
                                                <FaBookOpen className="text-4xl" />
                                            </div>
                                        )}
                                        
                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {renderStatusBadge(selectedCourse.status)}
                                                {renderLevelBadge(selectedCourse.level)}
                                                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-xs font-semibold">
                                                    Danh mục: {selectedCourse.categoryName}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-800 leading-tight">{selectedCourse.name}</h3>
                                            {selectedCourse.description ? (
                                                <div 
                                                    className="prose prose-slate prose-sm max-w-none text-slate-600 mt-2 max-h-48 overflow-y-auto bg-slate-50 p-4 rounded-2xl border border-slate-100/60"
                                                    dangerouslySetInnerHTML={{ 
                                                        __html: DOMPurify.sanitize(selectedCourse.description.replace(/&nbsp;/g, ' ')) 
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-slate-400 text-sm italic mt-2">Chưa cập nhật mô tả chi tiết.</p>
                                            )}
                                            
                                            <div className="flex flex-wrap gap-4 pt-1.5 text-xs font-medium text-slate-550 border-t border-slate-100">
                                                <span className="flex items-center gap-1.5">
                                                    <FaUser className="text-slate-400" />
                                                    Giảng viên: <span className="font-bold text-slate-700">{selectedCourse.teacherName}</span>
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <FaCalendarAlt className="text-slate-400" />
                                                    Ngày tạo: <span className="font-bold text-slate-700">{formatDate(selectedCourse.createdAt)}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 rounded-xl border border-slate-100 text-center bg-white shadow-xs">
                                            <p className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-0.5">Số học viên</p>
                                            <p className="text-xl font-black text-slate-800">{selectedCourse.studentCount || 0}</p>
                                        </div>
                                        <div className="p-4 rounded-xl border border-slate-100 text-center bg-white shadow-xs">
                                            <p className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-0.5">Đánh giá TB</p>
                                            <p className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
                                                <FaStar className="text-sm shrink-0" />
                                                <span>{selectedCourse.averageRating > 0 ? selectedCourse.averageRating.toFixed(1) : "---"}</span>
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl border border-slate-100 text-center bg-white shadow-xs">
                                            <p className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-0.5">Số lượt đánh giá</p>
                                            <p className="text-xl font-black text-slate-800">{selectedCourse.reviewCount || 0}</p>
                                        </div>
                                        <div className="p-4 rounded-xl border border-slate-100 text-center bg-white shadow-xs">
                                            <p className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-0.5">Giá bán hiện tại</p>
                                            <p className="text-xl font-black text-emerald-600">{formatPrice(selectedCourse.price)}</p>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {selectedCourse.tags && selectedCourse.tags.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 pb-1">
                                            <span className="text-xs font-bold text-slate-450 flex items-center gap-1">
                                                <FaTags /> Tags:
                                            </span>
                                            {selectedCourse.tags.map(tag => (
                                                <span key={tag.id} className="text-xs font-bold bg-slate-50 text-slate-650 px-2.5 py-0.5 border border-slate-200 rounded-full">
                                                    #{tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Syllabus (Lessons, Docs, Tests) */}
                                    <div className="space-y-3.5">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                                            <FaList className="text-emerald-600" />
                                            Cấu trúc chương trình học ({selectedCourse.lessons?.length || 0} bài học)
                                        </h4>

                                        {!selectedCourse.lessons || selectedCourse.lessons.length === 0 ? (
                                            <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                                <p className="text-slate-400 text-sm">Chưa có bài học nào được tải lên cho khóa học này.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedCourse.lessons.map((lesson, idx) => (
                                                    <div key={lesson.id} className="bg-slate-50/30 rounded-xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
                                                        {/* Lesson header */}
                                                        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                                            <div className="flex items-start gap-2.5">
                                                                <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                                                                    {idx + 1}
                                                                </span>
                                                                <div>
                                                                    <h5 className="font-bold text-slate-800 text-sm">{lesson.title}</h5>
                                                                    <p className="text-[11px] text-slate-450 mt-0.5">
                                                                        {lesson.isPreview ? <span className="text-emerald-600 font-bold">Xem trước miễn phí</span> : "Nội dung khóa"}
                                                                        {lesson.durationSeconds > 0 && ` • Thời lượng video: ${Math.round(lesson.durationSeconds / 60)} phút`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Lesson content body */}
                                                        <div className="p-4 space-y-3 bg-white">
                                                            {lesson.content && (
                                                                <div className="text-sm text-slate-650 border-l-2 border-emerald-500 pl-3 py-1 bg-slate-50/50 rounded-r-xl">
                                                                    <div 
                                                                        className="prose prose-slate prose-sm max-w-none text-slate-600"
                                                                        dangerouslySetInnerHTML={{ 
                                                                            __html: DOMPurify.sanitize(lesson.content.replace(/&nbsp;/g, ' ')) 
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Lesson Video */}
                                                            {(lesson.hlsUrl || lesson.rawUrl) && (
                                                                <div className="mt-2 mb-4">
                                                                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-2">
                                                                        <FaVideo className="text-slate-400" /> Video bài giảng
                                                                    </div>
                                                                    <AdminLessonVideoPlayer url={lesson.hlsUrl || lesson.rawUrl} />
                                                                </div>
                                                            )}

                                                            {/* Documents & test set nested */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                                                {/* Documents List */}
                                                                <div className="space-y-2">
                                                                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                                                        <FaFileAlt className="text-slate-400" /> Tài liệu tự học ({lesson.documents?.length || 0})
                                                                    </div>
                                                                    {!lesson.documents || lesson.documents.length === 0 ? (
                                                                        <p className="text-[11px] text-slate-400 italic">Không có tài liệu đính kèm.</p>
                                                                    ) : (
                                                                        <div className="space-y-1.5">
                                                                            {lesson.documents.map(doc => (
                                                                                <div key={doc.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2 rounded-lg text-xs hover:bg-slate-100 transition-colors">
                                                                                    <span className="truncate pr-2 font-medium text-slate-650" title={doc.title}>{doc.title}</span>
                                                                                    {doc.fileUrl && (
                                                                                        <a 
                                                                                            href={doc.fileUrl} 
                                                                                            target="_blank" 
                                                                                            rel="noopener noreferrer" 
                                                                                            className="text-emerald-600 hover:text-emerald-700 font-bold shrink-0 flex items-center gap-0.5"
                                                                                        >
                                                                                            <FaDownload size={10} /> Tải về
                                                                                        </a>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Test Set details */}
                                                                <div className="space-y-2">
                                                                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                                                        <FaClipboardList className="text-slate-400" /> Bài luyện tập liên quan
                                                                    </div>
                                                                    {lesson.testSet ? (
                                                                        <div className="bg-emerald-50/20 border border-emerald-100 p-2.5 rounded-lg text-xs flex items-start gap-2.5">
                                                                            <div className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold text-[9px] uppercase tracking-wide shrink-0">
                                                                                {lesson.testSet.type || "TEST"}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="font-bold text-slate-700 truncate" title={lesson.testSet.title}>
                                                                                    {lesson.testSet.title}
                                                                                </p>
                                                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                                                    Năm: {lesson.testSet.year || "---"} • Trạng thái: {lesson.testSet.isPublic ? "Công khai" : "Ẩn"}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-[11px] text-slate-400 italic">Không có bài tập liên kết.</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Modal Footer (Action Toggles) */}
                        {selectedCourse && !modalLoading && (
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
                                <div className="text-xs text-slate-450 font-medium">
                                    Mã khóa học: {selectedCourse.id}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 rounded-2xl font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                                    >
                                        Đóng
                                    </button>
                                    
                                    {/* Action items */}
                                    <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                                        {selectedCourse.status !== 'ACTIVE' && (
                                            <button 
                                                onClick={() => handleUpdateStatus(selectedCourse.id, 'ACTIVE')}
                                                disabled={actionLoading}
                                                className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                                Duyệt hoạt động
                                            </button>
                                        )}
                                        {selectedCourse.status !== 'INACTIVE' && (
                                            <button 
                                                onClick={() => handleUpdateStatus(selectedCourse.id, 'INACTIVE')}
                                                disabled={actionLoading}
                                                className="px-4.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading ? <FaSpinner className="animate-spin" /> : <FaEyeSlash />}
                                                Tạm ẩn
                                            </button>
                                        )}
                                        {selectedCourse.status !== 'BLOCKED' && (
                                            <button 
                                                onClick={() => handleUpdateStatus(selectedCourse.id, 'BLOCKED')}
                                                disabled={actionLoading}
                                                className="px-4.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading ? <FaSpinner className="animate-spin" /> : <FaBan />}
                                                Khóa học
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoursesPage;
