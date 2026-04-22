import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiShield, FiTag, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import courseApi from "../../../api/courseApi";
import paymentApi from "../../../api/paymentApi";

const CourseCheckoutPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const [voucherCode, setVoucherCode] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const idsParam = searchParams.get("ids");
                if (!idsParam) {
                    toast.error("Không tìm thấy khóa học cần thanh toán!");
                    navigate("/courses");
                    return;
                }

                const idsArray = idsParam.split(",").map(id => id.trim());

                const coursePromises = idsArray.map(id => courseApi.getCourseDetail(id));
                const responses = await Promise.all(coursePromises);

                const loadedCourses = responses
                    .map(res => res?.data)
                    .filter(course => course != null);

                if (loadedCourses.length === 0) {
                    toast.error("Không tìm thấy thông tin các khóa học!");
                    navigate("/courses");
                } else {
                    setCourses(loadedCourses);
                }
            } catch (err) {
                toast.error(err.message || "Lỗi tải dữ liệu khóa học");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [searchParams, navigate]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const { totalOriginalPrice, totalPrice } = courses.reduce(
        (acc, course) => {
            acc.totalOriginalPrice += (course.originalPrice || course.price || 0);
            acc.totalPrice += (course.price || 0);
            return acc;
        },
        { totalOriginalPrice: 0, totalPrice: 0 }
    );

    const discountAmount = totalOriginalPrice - totalPrice;

    const handleCheckout = async () => {
        try {
            setIsProcessingPayment(true);
            const courseIds = courses.map(c => c.id);
            const response = await paymentApi.checkoutCourse({ courseIds });
            const paymentUrl = response.data;

            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                toast.error("Không thể lấy được đường dẫn thanh toán từ hệ thống!");
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

    if (courses.length === 0) return null;

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-24 font-sans text-gray-800">
            {/* 💥 FIX 1: Nới rộng hai bên (Dùng max-w-[1400px] và px-4 lg:px-12) */}
            <div className="mx-auto px-4 lg:px-12 max-w-[1400px]">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* ================= CỘT TRÁI (COL-SPAN-8 rộng rải) ================= */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* TIÊU ĐỀ */}
                        <div className="mb-4">
                            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 mb-4 font-bold w-fit">
                                <FiArrowLeft size={20} /> Quay lại
                            </button>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Xác nhận thanh toán</h1>
                            <p className="text-gray-500 mt-2 text-lg">Vui lòng kiểm tra kỹ thông tin đơn hàng trước khi tiến hành thanh toán.</p>
                        </div>

                        {/* BOX: DANH SÁCH KHÓA HỌC */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Thông tin khóa học ({courses.length})</h2>

                            <div className="space-y-6">
                                {courses.map((course) => (
                                    <div key={course.id} className="flex flex-col sm:flex-row gap-5 items-start pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="w-full sm:w-48 aspect-video rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                                            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col h-full justify-between w-full">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 mb-1 leading-snug line-clamp-2">{course.title}</h3>
                                                {course.name && (
                                                    <p className="text-slate-600 text-sm font-medium mb-2">{course.name}</p>
                                                )}
                                                <p className="text-gray-600 font-medium flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">GV</span>
                                                    <span className="text-slate-800 font-bold text-sm">{course.teacherName || course.teacher?.fullName || "Đang cập nhật"}</span>
                                                </p>
                                            </div>

                                            <div className="flex items-end justify-between mt-4">
                                                <div className="flex items-end gap-2">
                                                    <span className="text-xl font-black text-primary">{course.price === 0 ? "MIỄN PHÍ" : formatPrice(course.price)}</span>
                                                    {course.originalPrice > course.price && (
                                                        <span className="text-gray-400 line-through text-sm font-bold mb-0.5">{formatPrice(course.originalPrice)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ================= CỘT PHẢI (COL-SPAN-4 thon gọn, dính chặt) ================= */}
                    <div className="lg:col-span-4 sticky top-24 space-y-5 mt-8 lg:mt-0">

                        {/* 💥 BOX 1: VOUCHER (Làm gọn padding lại) */}
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <FiTag className="text-primary" /> Mã giảm giá (Voucher)
                            </h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nhập mã..."
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                                />
                                <button
                                    onClick={handleApplyVoucher}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${voucherCode.trim() ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>

                        {/* 💥 BOX 2: BILL & NÚT MUA (Ép chặt vertical space lại) */}
                        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
                            
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Chi tiết thanh toán</h2>

                            <div className="space-y-3 mb-4 text-sm text-gray-600 font-medium">
                                <div className="flex justify-between items-center">
                                    <span>Giá gốc ({courses.length} khóa)</span>
                                    <span className="font-bold text-gray-800">{formatPrice(totalOriginalPrice)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-600">
                                        <span>Giảm giá</span>
                                        <span className="font-bold">-{formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-emerald-600">
                                    <span>Voucher</span>
                                    <span className="font-bold">- 0 ₫</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-3 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-gray-800 text-base mb-1">Tổng cộng</span>
                                    <span className="text-3xl font-black text-primary tracking-tight">{formatPrice(totalPrice)}</span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 text-right uppercase mt-1">Đã bao gồm VAT</p>
                            </div>

                            <h2 className="text-base font-bold text-gray-800 mb-3">Phương thức</h2>

                            <div className="border-2 border-primary bg-emerald-50 rounded-2xl p-3 flex items-center justify-between cursor-pointer mb-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPAY" className="h-5" />
                                    <span className="font-bold text-gray-800 text-sm">Cổng VNPAY</span>
                                </div>
                                <FiCheckCircle className="text-primary text-lg" />
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isProcessingPayment}
                                className={`w-full py-3.5 rounded-2xl font-black text-base text-white transition-all flex justify-center items-center gap-2 
                                    ${isProcessingPayment ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-emerald-600 shadow-xl shadow-emerald-200 hover:-translate-y-1'}`}
                            >
                                {isProcessingPayment ? "Đang xử lý..." : "Thanh toán ngay"}
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400">
                                <FiShield className="text-emerald-500 text-sm" />
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