import React, { useState, useEffect } from 'react';
import { Coins, Zap, ShieldCheck, Loader2, X, AlertCircle } from 'lucide-react';
import coinPackageApi from '../../../api/coinPackageApi';
import paymentApi from '../../../api/paymentApi';   

import { toast } from 'react-toastify';
const CoinShopPage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(''); // Thêm state để show lỗi UI cho đẹp
    
    // State cho Modal xác nhận
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    // 💥 REFACTOR 1: Hàm lấy danh sách gói xu
    const fetchPackages = async () => {
        try {
            setLoading(true);
            setErrorMsg('');
            
            // Tham số phân trang (Có thể mở rộng thêm filter sau này)
            const params = { page: 1, size: 50 }; 
            
            const response = await coinPackageApi.getActiveCoinPackages(params);
            
            // Vì axiosClient trả về response.data, nên response ở đây chính là ApiResponse
            // Cấu trúc BE: ApiResponse -> data -> PageResponse -> content
            const packageList = response.data?.content || [];
            
            setPackages(packageList);
        } catch (error) {
            console.error("Lỗi fetch packages:", error);
            // Lấy message từ error do Interceptor ném ra
            setErrorMsg(error.message || "Không thể tải danh sách gói xu. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (pkg) => {
        setSelectedPackage(pkg);
    };

    const handleCloseModal = () => {
        if (!isProcessing) {
            setSelectedPackage(null);
        }
    };

    // 💥 REFACTOR 2: Hàm xử lý thanh toán
    const handleConfirmPurchase = async () => {
        if (!selectedPackage) return;
        
        try {
            setIsProcessing(true);
            const payload = { coinPackageId: selectedPackage.id }; // Gửi đúng ID gói xu
            
            const response = await paymentApi.checkoutCoinPackage(payload);
            
            // response ở đây là ApiResponse. BE trả về String URL nên nó nằm ở response.data
            const paymentUrl = response.data; 

            if (paymentUrl && typeof paymentUrl === 'string' && paymentUrl.startsWith('http')) {
                // Chuyển hướng người dùng sang VNPay ngay lập tức
                window.location.href = paymentUrl;
            } else {
                throw new Error("Dữ liệu URL thanh toán trả về không hợp lệ.");
            }
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            // Có thể dùng thư viện react-hot-toast thay thế cho alert để UI xịn hơn
            toast.error(`Lỗi thanh toán: ${error.message || "Vui lòng thử lại sau."}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
                <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang kết nối đến cửa hàng xu...</p>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <p className="text-red-500 font-bold text-lg mb-4">{errorMsg}</p>
                <button 
                    onClick={fetchPackages}
                    className="px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
       <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-3">
                        <Coins className="w-12 h-12 text-yellow-500" />
                        Cửa Hàng Xu Echill
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Nạp xu để mở khóa các khóa học Premium và luyện thi thả ga. Thanh toán an toàn, tự động cộng xu ngay lập tức!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {packages.map((pkg) => (
                        <div 
                            key={pkg.id} 
                            className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative group transform hover:-translate-y-2 flex flex-col"
                        >
                            {pkg.discountPercent > 0 && (
                                <div className="absolute top-4 right-[-35px] bg-red-500 text-white text-xs font-bold px-10 py-1 rotate-45 shadow-sm z-10">
                                    GIẢM {pkg.discountPercent}%
                                </div>
                            )}

                            <div className="p-8 text-center flex-grow flex flex-col items-center">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                                
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <span className="text-4xl font-black text-yellow-500">{pkg.coinAmount}</span>
                                    <Coins className="w-8 h-8 text-yellow-500" />
                                </div>

                                {pkg.bonusCoin > 0 && (
                                    <div className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1 mb-6">
                                        <Zap className="w-4 h-4" />
                                        Tặng thêm {pkg.bonusCoin} Xu
                                    </div>
                                )}

                                <div className="mt-auto w-full">
                                    {pkg.discountPercent > 0 && pkg.originalPrice && (
                                        <div className="text-sm text-gray-400 line-through mb-1">
                                            {formatCurrency(pkg.originalPrice)}
                                        </div>
                                    )}
                                    <div className="text-3xl font-extrabold text-gray-900 mb-6">
                                        {formatCurrency(pkg.price)}
                                    </div>

                                    <button 
                                        onClick={() => handleOpenModal(pkg)}
                                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors flex justify-center items-center gap-2"
                                    >
                                        Mua Ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <ShieldCheck className="text-green-500 w-6 h-6" />
                                Xác nhận thanh toán
                            </h3>
                            <button 
                                onClick={handleCloseModal}
                                disabled={isProcessing}
                                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 mb-6 text-center">
                                Bạn đang tiến hành mua gói xu qua cổng thanh toán VNPay. Vui lòng kiểm tra lại thông tin:
                            </p>
                            
                            <div className="bg-yellow-50 rounded-2xl p-5 mb-6 border border-yellow-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600 font-medium">Tên gói:</span>
                                    <span className="font-bold text-gray-900">{selectedPackage.name}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600 font-medium">Tổng xu nhận:</span>
                                    <span className="font-bold text-yellow-600 text-lg flex items-center gap-1">
                                        {selectedPackage.coinAmount + (selectedPackage.bonusCoin || 0)} <Coins className="w-4 h-4"/>
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-yellow-200 mt-2">
                                    <span className="text-gray-800 font-bold">Số tiền thanh toán:</span>
                                    <span className="font-black text-red-500 text-xl">
                                        {formatCurrency(selectedPackage.price)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={handleCloseModal}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Hủy bỏ
                                </button>
                                <button 
                                    onClick={handleConfirmPurchase}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Đang tạo URL...
                                        </>
                                    ) : (
                                        'Thanh toán VNPay'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoinShopPage;