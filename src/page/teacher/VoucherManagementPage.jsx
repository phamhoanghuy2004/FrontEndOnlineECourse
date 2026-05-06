import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTimes, FaTag, FaRobot, FaLayerGroup } from 'react-icons/fa';
import { toast } from 'react-toastify';
import voucherApi from '../../api/voucherApi';

const VoucherManagementPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Phân trang
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State (💥 Đã bổ sung isAutoApplied và minCourseCount)
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENT',
        discountValue: '',
        maxDiscountAmount: '',
        minOrderValue: '',
        startDate: '',
        endDate: '',
        usageLimit: '',
        minCourseCount: 1, // Mặc định là 1 khóa
        isAutoApplied: false, // Mặc định không tự động
        isActive: true
    });

    const formatCurrency = (amount) => amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount) : 'Không giới hạn';
    const formatDate = (isoString) => new Date(isoString).toLocaleString('vi-VN');
    
    const formatDateTimeForInput = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    };

    const fetchVouchers = async (currentPage = 1) => {
        try {
            setLoading(true);
            const response = await voucherApi.getMyVouchers({ page: currentPage, size: 10, sortBy: 'createdAt' });
            const pageData = response.data; 
            
            setVouchers(pageData.content || []);
            setTotalPages(pageData.totalPages);
            setTotalElements(pageData.totalElements);
            setPage(pageData.currentPage);
        } catch (error) {
            toast.error(error.message || "Lỗi khi tải danh sách Voucher");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers(page);
    }, [page]);

    const openModal = (voucher = null) => {
        if (voucher) {
            setEditingVoucher(voucher);
            setFormData({
                code: voucher.code,
                discountType: voucher.discountType,
                discountValue: voucher.discountValue,
                maxDiscountAmount: voucher.maxDiscountAmount || '',
                minOrderValue: voucher.minOrderValue || '',
                startDate: formatDateTimeForInput(voucher.startDate),
                endDate: formatDateTimeForInput(voucher.endDate),
                usageLimit: voucher.usageLimit || '',
                minCourseCount: voucher.minCourseCount || 1, // 💥 Cập nhật State
                isAutoApplied: voucher.isAutoApplied || false, // 💥 Cập nhật State
                isActive: voucher.isActive
            });
        } else {
            setEditingVoucher(null);
            setFormData({
                code: '', discountType: 'PERCENT', discountValue: '', maxDiscountAmount: '',
                minOrderValue: '', startDate: '', endDate: '', usageLimit: '', 
                minCourseCount: 1, isAutoApplied: false, isActive: true // 💥 Reset State
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            
            // 💥 Xử lý ép kiểu dữ liệu chuẩn chỉnh cho Backend
            const payload = {
                ...formData,
                discountValue: parseFloat(formData.discountValue),
                maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
                minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : 0,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                minCourseCount: parseInt(formData.minCourseCount), // 💥 Gửi minCourseCount
                isAutoApplied: Boolean(formData.isAutoApplied), // 💥 Gửi isAutoApplied
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
            };

            if (editingVoucher) {
                delete payload.code; 
                await voucherApi.updateVoucher(editingVoucher.id, payload);
                toast.success("Cập nhật mã giảm giá thành công!");
            } else {
                await voucherApi.createVoucher(payload);
                toast.success("Tạo mã giảm giá thành công!");
            }

            setIsModalOpen(false);
            fetchVouchers(page); 
        } catch (error) {
            toast.error(error.message || "Thao tác thất bại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        Quản lý mã giảm giá (Voucher)
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">Thiết lập các chiến dịch Flash Sale và Combo khóa học.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
                >
                    <FaPlus /> Tạo mã mới
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm mã voucher..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Mã Voucher</th>
                                <th className="px-6 py-4">Mức giảm</th>
                                <th className="px-6 py-4">Điều kiện</th>
                                <th className="px-6 py-4">Lượt dùng</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10">Đang tải dữ liệu...</td></tr>
                            ) : vouchers.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-slate-400">Bạn chưa tạo mã giảm giá nào.</td></tr>
                            ) : (
                                vouchers.map((v) => (
                                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800 flex items-center gap-2 mb-1">
                                                <FaTag className="text-emerald-500" /> {v.code}
                                            </div>
                                            {/* 💥 Hiển thị thêm cờ Auto Apply nếu có */}
                                            {v.isAutoApplied && (
                                                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 w-fit">
                                                    <FaRobot /> Tự động áp dụng
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">
                                            {v.discountType === 'PERCENT' ? `${v.discountValue}%` : formatCurrency(v.discountValue)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* 💥 Hiển thị điều kiện Khóa học */}
                                            <div className="text-xs text-slate-500 mb-1">
                                                Tối thiểu: <span className="font-bold text-slate-700">{v.minCourseCount} khóa</span>
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                Đơn từ: <span className="font-bold text-slate-700">{formatCurrency(v.minOrderValue || 0)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-slate-700">{v.usedCount}</span>
                                            <span className="text-slate-400"> / {v.usageLimit || '∞'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {v.isActive ? (
                                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">Hoạt động</span>
                                            ) : (
                                                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">Đã tắt</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => openModal(v)}
                                                className="text-slate-400 hover:text-emerald-500 p-2 transition-colors bg-white border border-slate-200 rounded-lg hover:border-emerald-200 hover:bg-emerald-50"
                                                title="Chỉnh sửa"
                                            >
                                                <FaEdit />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-sm text-slate-500">Tổng cộng {totalElements} mã</span>
                        <div className="flex gap-2">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50 text-sm font-medium hover:bg-slate-50">Trước</button>
                            <span className="px-3 py-1 font-bold text-slate-700">{page} / {totalPages}</span>
                            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50 text-sm font-medium hover:bg-slate-50">Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* ================= MODAL THÊM / SỬA ================= */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white px-8 py-5 border-b border-slate-100 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingVoucher ? `Chỉnh sửa mã: ${editingVoucher.code}` : 'Tạo mã giảm giá mới'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 p-2"><FaTimes size={20}/></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            
                            {/* Dòng 1: Mã và Loại */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mã Voucher (Code) *</label>
                                    <input 
                                        required disabled={!!editingVoucher} 
                                        type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-100 outline-none uppercase disabled:bg-slate-100"
                                        placeholder="VD: COMBO2026"
                                    />
                                    {editingVoucher && <p className="text-[11px] text-orange-500 mt-1">* Không thể thay đổi mã sau khi tạo</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Loại giảm giá</label>
                                    <select 
                                        disabled={editingVoucher && editingVoucher.usedCount > 0} 
                                        value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-100 outline-none disabled:bg-slate-100"
                                    >
                                        <option value="PERCENT">Giảm theo Phần trăm (%)</option>
                                        <option value="VALUE">Giảm Trực tiếp (VNĐ)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Dòng 2: Mức giảm và Tối đa */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Mức giảm * {formData.discountType === 'PERCENT' ? '(%)' : '(VNĐ)'}
                                    </label>
                                    <input 
                                        required type="number" step="0.1" min="1"
                                        disabled={editingVoucher && editingVoucher.usedCount > 0} 
                                        value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-100 outline-none disabled:bg-slate-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Giảm tối đa (VNĐ)</label>
                                    <input 
                                        type="number" min="1" disabled={formData.discountType === 'VALUE' || (editingVoucher && editingVoucher.usedCount > 0)}
                                        value={formData.maxDiscountAmount} onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                                        placeholder={formData.discountType === 'VALUE' ? "Không áp dụng" : "VD: 100000"}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-100 outline-none disabled:bg-slate-100"
                                    />
                                </div>
                            </div>

                            {/* Dòng 3: ĐIỀU KIỆN ÁP DỤNG (💥 Chuyển thành Grid 3 cột) */}
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                                    <FaLayerGroup className="text-emerald-500" /> Điều kiện áp dụng
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-2">Đơn tối thiểu (VNĐ)</label>
                                        <input 
                                            type="number" min="0" value={formData.minOrderValue} onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" placeholder="VD: 500000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-2">Mua tối thiểu (Khóa học)</label>
                                        <input 
                                            type="number" min="1" value={formData.minCourseCount} onChange={(e) => setFormData({...formData, minCourseCount: e.target.value})}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" placeholder="VD: 2 (Dành cho Combo)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-2">Lượt dùng tối đa</label>
                                        <input 
                                            type="number" min="1" value={formData.usageLimit} onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm" placeholder="Trống = Vô hạn"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dòng 4: Thời gian */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Từ ngày *</label>
                                    <input 
                                        required type="datetime-local" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Đến ngày *</label>
                                    <input 
                                        required type="datetime-local" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
                                    />
                                </div>
                            </div>

                            {/* 💥 Dòng 5: Các Tùy chọn Settings (Checkbox) */}
                            <div className="flex flex-col gap-3 pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                    <input 
                                        type="checkbox" checked={formData.isAutoApplied} 
                                        onChange={(e) => setFormData({...formData, isAutoApplied: e.target.checked})}
                                        className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500 cursor-pointer"
                                    />
                                    <div>
                                        <span className="block text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                            Tự động áp dụng (Auto-Apply)
                                        </span>
                                        <span className="text-xs text-slate-500">Hệ thống sẽ tự động thêm mã này vào giỏ hàng nếu đủ điều kiện (Flash Sale)</span>
                                    </div>
                                </label>

                                {editingVoucher && (
                                    <label className="flex items-center gap-3 cursor-pointer group w-fit mt-2">
                                        <input 
                                            type="checkbox" checked={formData.isActive} 
                                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                            className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500 cursor-pointer"
                                        />
                                        <div>
                                            <span className="block text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                                Kích hoạt Voucher
                                            </span>
                                            <span className="text-xs text-slate-500">Cho phép học viên nhìn thấy và sử dụng mã này.</span>
                                        </div>
                                    </label>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                                    Hủy bỏ
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-2">
                                    {isSubmitting ? 'Đang lưu...' : 'Lưu Voucher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoucherManagementPage;