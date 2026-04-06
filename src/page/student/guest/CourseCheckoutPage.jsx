import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiShield, FiTag, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import courseApi from "../../../api/courseApi";
import paymentApi from "../../../api/paymentApi";

const CourseCheckoutPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    
    // State cho Voucher (UI Fake)
    const [voucherCode, setVoucherCode] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const response = await courseApi.getCourseDetail(id);
                if (response && response.data) {
                    setCourse(response.data);
                } else {
                    toast.error("Không tìm thấy thông tin khóa học");
                    navigate("/courses");
                }
            } catch (err) {
                toast.error(err.message || "Lỗi tải dữ liệu khóa học");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id, navigate]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // 💥 HÀM XỬ LÝ THANH TOÁN (GỌI API BE LẤY LINK)
    const handleCheckout = async () => {
        try {
            setIsProcessingPayment(true);
            const response = await paymentApi.checkoutCourse(course.id);
            
            // Lấy URL từ DTO ApiResponse.data
            const paymentUrl = response.data; 
            
            if (paymentUrl) {
                // Chuyển hướng trình duyệt sang trang của VNPAY
                window.location.href = paymentUrl; 
            } else {
                toast.error("Không thể tạo giao dịch lúc này. Vui lòng thử lại!");
            }
        } catch (error) {
            toast.error(error.message || "Lỗi khi khởi tạo thanh toán");
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleApplyVoucher = () => {
        if (!voucherCode.trim()) return;
        // Tương lai gọi API kiểm tra voucher ở đây. Hiện tại giả lập:
        toast.info("Tính năng Voucher đang được bảo trì!");
        setAppliedVoucher(true);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-primary font-bold text-xl">Đang tải hóa đơn...</div>;
    }

    if (!course) return null;

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-24 font-sans text-gray-800">
            <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                
                {/* Header */}
                <div className="mb-8">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 mb-4 font-medium">
                        <FiArrowLeft size={20} /> Quay lại
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900">Xác nhận thanh toán</h1>
                    <p className="text-gray-500 mt-2">Vui lòng kiểm tra kỹ thông tin đơn hàng trước khi tiến hành thanh toán.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* CỘT TRÁI: THÔNG TIN KHÓA HỌC & VOUCHER */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Box Thông tin khóa học */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-4">Thông tin khóa học</h2>
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <div className="w-full sm:w-40 aspect-video rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description || "Khóa học chất lượng cao từ Echill Learning."}</p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-bold text-primary">{course.price === 0 ? "MIỄN PHÍ" : formatPrice(course.price)}</span>
                                        {course.originalPrice > course.price && (
                                            <span className="text-gray-400 line-through text-sm font-medium">{formatPrice(course.originalPrice)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Box Voucher (Tương lai) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FiTag className="text-primary" /> Mã giảm giá (Voucher)
                            </h2>
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Nhập mã giảm giá..." 
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                                <button 
                                    onClick={handleApplyVoucher}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all ${voucherCode.trim() ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                >
                                    Áp dụng
                                </button>
                            </div>
                            {appliedVoucher && (
                                <p className="text-amber-500 text-sm mt-3 flex items-center gap-1">
                                    Tính năng áp dụng Voucher đang được phát triển!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* CỘT PHẢI: BILL TÍNH TIỀN & NÚT THANH TOÁN */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Chi tiết thanh toán</h2>
                            
                            <div className="space-y-4 mb-6 text-sm text-gray-600 font-medium">
                                <div className="flex justify-between">
                                    <span>Giá gốc</span>
                                    <span>{formatPrice(course.originalPrice || course.price)}</span>
                                </div>
                                {course.originalPrice > course.price && (
                                    <div className="flex justify-between text-green-500">
                                        <span>Giảm giá</span>
                                        <span>-{formatPrice(course.originalPrice - course.price)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-green-500">
                                    <span>Voucher áp dụng</span>
                                    <span>- 0 ₫</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800">Tổng cộng</span>
                                    <span className="text-3xl font-extrabold text-primary">{formatPrice(course.price)}</span>
                                </div>
                                <p className="text-xs text-gray-400 text-right">Đã bao gồm VAT</p>
                            </div>

                            {/* Phương thức thanh toán */}
                            <div className="mb-6">
                                <p className="font-bold text-gray-800 mb-3 text-sm">Phương thức thanh toán</p>
                                <div className="border-2 border-primary bg-green-50 rounded-xl p-4 flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPAY" className="h-6" />
                                        <span className="font-bold text-gray-800 text-sm">Cổng VNPAY</span>
                                    </div>
                                    <FiCheckCircle className="text-primary text-xl" />
                                </div>
                            </div>

                            <button 
                                onClick={handleCheckout}
                                disabled={isProcessingPayment}
                                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-md transition-all flex justify-center items-center gap-2 
                                    ${isProcessingPayment ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-600 hover:shadow-lg hover:-translate-y-1'}`}
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Đang tạo giao dịch...
                                    </>
                                ) : (
                                    "Thanh toán ngay"
                                )}
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <FiShield className="text-green-500" />
                                <span>Thanh toán an toàn & bảo mật 100%</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CourseCheckoutPage;