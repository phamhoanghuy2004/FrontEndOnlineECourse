import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit, Coins, X, Loader2 } from 'lucide-react';
import coinPackageApi from '../../api/coinPackageApi';

import { toast } from 'react-toastify';
const CoinPackageManagement = () => {
    // ==========================================
    // 1. STATE QUẢN LÝ DỮ LIỆU & PHÂN TRANG
    // ==========================================
    const [coinPackages, setCoinPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // State Modal Thêm/Sửa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form Data chuẩn khớp DTO Backend
    const initialFormState = {
        name: '',
        price: '',
        coinAmount: '',
        bonusCoin: 0,
        originalPrice: '',
        isActive: true
    };
    const [formData, setFormData] = useState(initialFormState);
    const searchTimeout = useRef(null);

    // ==========================================
    // 2. HÀM TIỆN ÍCH (FORMAT)
    // ==========================================
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || amount === '') return '';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatNumber = (num) => {
        if (num === null || num === undefined || num === '') return '0';
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    // ==========================================
    // 3. LOGIC GỌI API (CHUẨN CẤU TRÚC AXIOS CỦA HUY)
    // ==========================================
    const fetchCoinPackages = async (currentPage = 1, isReset = false) => {
        try {
            if (isReset) setLoading(true);
            else setLoadingMore(true);

            const response = await coinPackageApi.getAllCoinPackages({ 
                page: currentPage, 
                size: 10,
                keyword: searchTerm 
            });

            // Lấy data theo mô tả: Thành công nằm trong response.data
            // Bóc tách phòng hờ 2 lớp: ApiResponse -> PageResponse
            let responseData = response.data || response;
            if (responseData.data) responseData = responseData.data;

            // Spring Boot JPA mặc định trả mảng trong key 'content'
            const newData = responseData.content || responseData.items || (Array.isArray(responseData) ? responseData : []);
            
            if (isReset) {
                setCoinPackages(newData);
            } else {
                setCoinPackages((prev) => [...prev, ...newData]);
            }
            
            // Tính toán Load More
            const totalPages = responseData.totalPages || 1;
            setHasMore(currentPage < totalPages);

        } catch (error) {
            console.error('Lỗi khi tải danh sách:', error);
            // Lỗi nằm thẳng trong error (như Huy miêu tả)
            toast.error(error.message || 'Không thể tải danh sách gói xu!');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Debounce tìm kiếm (đợi 500ms sau khi ngừng gõ mới gọi API)
    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setPage(1);
            fetchCoinPackages(1, true);
        }, 500);
        return () => clearTimeout(searchTimeout.current);
    }, [searchTerm]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchCoinPackages(nextPage, false);
    };

    // ==========================================
    // 4. XỬ LÝ FORM & SUBMIT
    // ==========================================
    const openModal = (mode, pkg = null) => {
        setModalMode(mode);
        if (mode === 'edit' && pkg) {
            setEditId(pkg.id);
            setFormData({
                name: pkg.name,
                price: pkg.price,
                coinAmount: pkg.coinAmount,
                bonusCoin: pkg.bonusCoin || 0,
                originalPrice: pkg.originalPrice || '',
                isActive: pkg.isActive
            });
        } else {
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            
            // Ép kiểu cứng về Number để tránh lỗi Type Mismatch Spring Boot
            const payload = {
                name: formData.name,
                price: Number(formData.price),
                coinAmount: Number(formData.coinAmount),
                bonusCoin: Number(formData.bonusCoin) || 0,
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
            };

            if (modalMode === 'create') {
                await coinPackageApi.createCoinPackage(payload);
            } else {
                payload.isActive = formData.isActive;
                await coinPackageApi.updateCoinPackage(editId, payload);
            }

            closeModal();
            setPage(1);
            fetchCoinPackages(1, true);
            
        } catch (error) {
            console.error('Lỗi Submit:', error);
            // Lỗi nằm thẳng trong error
            toast.error(error.message || 'Có lỗi xảy ra khi lưu trữ!');
        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // 5. GIAO DIỆN (UI) TỪ A ĐẾN Z
    // ==========================================
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý gói xu</h1>
                    <p className="text-gray-500 mt-1">Thiết lập các gói nạp xu cho hệ thống Echill.</p>
                </div>
                <button 
                    onClick={() => openModal('create')}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Tạo gói xu mới</span>
                </button>
            </div>

            {/* Ô Tìm Kiếm */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex items-center gap-3">
                <Search size={20} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm gói xu theo tên..."
                    className="w-full outline-none text-gray-700 bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Bảng Dữ Liệu */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-100">
                            <th className="p-4 font-semibold">Tên gói xu</th>
                            <th className="p-4 font-semibold">Số lượng</th>
                            <th className="p-4 font-semibold">Giá bán</th>
                            <th className="p-4 font-semibold">Trạng thái</th>
                            <th className="p-4 font-semibold text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading && page === 1 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : coinPackages.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">Chưa có gói xu nào trong hệ thống.</td>
                            </tr>
                        ) : (
                            coinPackages.map((pkg) => (
                                <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
                                                <Coins size={20} />
                                            </div>
                                            <span className="font-semibold text-gray-800">{pkg.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-700 font-medium">
                                        {formatNumber(pkg.coinAmount)} xu
                                        {pkg.bonusCoin > 0 && (
                                            <span className="ml-2 text-xs text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                                                +{formatNumber(pkg.bonusCoin)} bonus
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-emerald-600">{formatCurrency(pkg.price)}</span>
                                            {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    {formatCurrency(pkg.originalPrice)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {pkg.isActive ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">Hoạt động</span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">Đã tắt</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => openModal('edit', pkg)}
                                                className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Nút Load More */}
            {hasMore && !loading && (
                <div className="flex justify-center pb-8">
                    <button 
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-2 bg-white border border-gray-200 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loadingMore ? 'Đang tải...' : 'Xem thêm'}
                    </button>
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">
                                {modalMode === 'create' ? 'Tạo gói xu mới' : 'Chỉnh sửa gói xu'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên gói xu *</label>
                                <input 
                                    type="text" required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="VD: Gói Khởi Động"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng xu *</label>
                                    <input 
                                        type="number" required min="1"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={formData.coinAmount}
                                        onChange={(e) => setFormData({...formData, coinAmount: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Xu tặng thêm</label>
                                    <input 
                                        type="number" min="0"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={formData.bonusCoin}
                                        onChange={(e) => setFormData({...formData, bonusCoin: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ) *</label>
                                    <input 
                                        type="number" required min="0"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (VNĐ)</label>
                                    <input 
                                        type="number" min="0"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                                    />
                                </div>
                            </div>

                            {modalMode === 'edit' && (
                                <div className="flex items-center gap-3 pt-2">
                                    <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
                                    <div 
                                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                        onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.isActive ? 'translate-x-6' : ''}`} />
                                    </div>
                                    <span className={`text-sm font-medium ${formData.isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
                                        {formData.isActive ? 'Đang hoạt động' : 'Đã tắt'}
                                    </span>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium transition-colors flex justify-center items-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {modalMode === 'create' ? 'Tạo mới' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoinPackageManagement;