import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

    // HÀM XỬ LÝ THANH TOÁN
    const handleCheckout = async () => {
        try {
            setIsProcessingPayment(true);
            const response = await paymentApi.checkoutCourse(course.id);

            const paymentUrl = response.data;

            if (paymentUrl) {
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
        toast.info("Tính năng Voucher đang được bảo trì!");
        setAppliedVoucher(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-24 font-sans text-gray-800">
            {/* 💥 FIX BỐ CỤC: Đổi max-w-5xl thành max-w-7xl để giao diện dạt ra 2 bên */}
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

                {/* 💥 HEADER: Tự động căn sát lề trái do container đã được nới rộng */}
                <div className="mb-8">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 mb-4 font-bold w-fit">
                        <FiArrowLeft size={20} /> Quay lại
                    </button>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Xác nhận thanh toán</h1>
                    <p className="text-gray-500 mt-2 text-lg">Vui lòng kiểm tra kỹ thông tin đơn hàng trước khi tiến hành thanh toán.</p>
                </div>

                {/* 💥 CHIA GRID: Trái chiếm 5 phần (Course), Phải chiếm 7 phần (Payment rộng hơn để chẻ đôi) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ================= CỘT TRÁI: THÔNG TIN KHÓA HỌC & VOUCHER ================= */}
                    <div className="lg:col-span-5 space-y-6">

                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Thông tin khóa học</h2>
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <div className="w-full sm:w-40 aspect-video rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col h-full justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-1 leading-snug">{course.title}</h3>
                                        
                                        {/* 💥 ĐÃ THÊM: Tên khóa học (course.name) theo đúng yêu cầu, giữ nguyên bố cục */}
                                        {course.name && (
                                            <p className="text-slate-600 text-sm font-medium mb-3">{course.name}</p>
                                        )}

                                        {/* 💥 ĐÃ THÊM: Tên giảng viên thay cho đoạn mô tả rác */}
                                        <p className="text-gray-600 font-medium flex items-center gap-2">
                                            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-wider">Giảng viên</span>
                                            <span className="text-slate-800 font-bold">{course.teacherName || course.teacher?.fullName || "Đang cập nhật"}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-end gap-3 mt-4">
                                        <span className="text-2xl font-black text-primary">{course.price === 0 ? "MIỄN PHÍ" : formatPrice(course.price)}</span>
                                        {course.originalPrice > course.price && (
                                            <span className="text-gray-400 line-through text-sm font-bold mb-1">{formatPrice(course.originalPrice)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FiTag className="text-primary" /> Mã giảm giá (Voucher)
                            </h2>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Nhập mã giảm giá..."
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                                />
                                <button
                                    onClick={handleApplyVoucher}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${voucherCode.trim() ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                >
                                    Áp dụng
                                </button>
                            </div>
                            {appliedVoucher && (
                                <p className="text-amber-500 text-sm mt-3 font-medium">
                                    * Tính năng áp dụng Voucher đang được phát triển!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ================= CỘT PHẢI: BILL TÍNH TIỀN CHẺ ĐÔI LÀM 2 ================= */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">

                            {/* 💥 CHẺ ĐÔI: Trái là Chi tiết, Phải là Phương thức */}
                            <div className="flex flex-col md:flex-row gap-8 md:gap-10">

                                {/* NỬA TRÁI: Bảng giá */}
                                <div className="flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Chi tiết thanh toán</h2>

                                    <div className="space-y-4 mb-6 text-base text-gray-600 font-medium flex-1">
                                        <div className="flex justify-between items-center">
                                            <span>Giá gốc</span>
                                            <span className="font-bold text-gray-800">{formatPrice(course.originalPrice || course.price)}</span>
                                        </div>
                                        {course.originalPrice > course.price && (
                                            <div className="flex justify-between items-center text-emerald-600">
                                                <span>Giảm giá</span>
                                                <span className="font-bold">-{formatPrice(course.originalPrice - course.price)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-emerald-600">
                                            <span>Voucher</span>
                                            <span className="font-bold">- 0 ₫</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-6">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="font-bold text-gray-800 text-lg mb-1">Tổng cộng</span>
                                            <span className="text-4xl font-black text-primary tracking-tight">{formatPrice(course.price)}</span>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 text-right uppercase">Đã bao gồm VAT</p>
                                    </div>
                                </div>

                                {/* ĐƯỜNG KẺ CHIA CẮT (Chỉ hiện trên màn hình lớn) */}
                                <div className="hidden md:block w-px bg-gray-100"></div>
                                <div className="md:hidden h-px bg-gray-100 w-full"></div>

                                {/* NỬA PHẢI: Phương thức & Nút Pay */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Phương thức</h2>

                                        <div className="border-2 border-primary bg-emerald-50 rounded-2xl p-4 flex items-center justify-between cursor-pointer mb-6 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPAY" className="h-7" />
                                                <span className="font-bold text-gray-800 text-base">Cổng VNPAY</span>
                                            </div>
                                            <FiCheckCircle className="text-primary text-2xl" />
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 md:pt-0">
                                        <button
                                            onClick={handleCheckout}
                                            disabled={isProcessingPayment}
                                            className={`w-full py-4 rounded-2xl font-black text-lg text-white transition-all flex justify-center items-center gap-2 
                                                ${isProcessingPayment ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-emerald-600 shadow-xl shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-1'}`}
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

                                        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-gray-400">
                                            <FiShield className="text-emerald-500 text-lg" />
                                            <span>Thanh toán an toàn & bảo mật 100%</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CourseCheckoutPage;