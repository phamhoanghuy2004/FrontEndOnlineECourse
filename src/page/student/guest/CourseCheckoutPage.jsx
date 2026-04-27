import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiShield, FiTag, FiCheckCircle, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaTicketAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import courseApi from "../../../api/courseApi";
import paymentApi from "../../../api/paymentApi";
import voucherApi from "../../../api/voucherApi";

const CourseCheckoutPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // STATE QUẢN LÝ VOUCHER
    const [publicVouchers, setPublicVouchers] = useState([]);
    const [voucherCode, setVoucherCode] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [autoAppliedMessage, setAutoAppliedMessage] = useState(""); 
    const [showVoucherList, setShowVoucherList] = useState(false); 

    const calculateDiscount = (voucher, coursesList) => {
        if (!voucher || coursesList.length === 0) return 0;
        
        const cartTotal = coursesList.reduce((acc, c) => acc + (c.price || 0), 0);

        if (voucher.minOrderValue && cartTotal < voucher.minOrderValue) return 0;
        if (voucher.minCourseCount && coursesList.length < voucher.minCourseCount) return 0;

        let discount = 0;
        if (voucher.discountType === 'PERCENT') {
            discount = (cartTotal * voucher.discountValue) / 100;
            if (voucher.maxDiscountAmount && discount > voucher.maxDiscountAmount) {
                discount = voucher.maxDiscountAmount;
            }
        } else {
            discount = voucher.discountValue; 
        }

        return Math.min(discount, cartTotal);
    };

    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                setLoading(true);
                const idsParam = searchParams.get("ids");
                const urlVoucher = searchParams.get("voucher"); 
                
                if (!idsParam) {
                    toast.error("Không tìm thấy khóa học cần thanh toán!");
                    navigate("/courses");
                    return;
                }

                const idsArray = idsParam.split(",").map(id => id.trim());

                const [coursesRes, vouchersRes] = await Promise.allSettled([
                    Promise.all(idsArray.map(id => courseApi.getCourseDetail(id))),
                    voucherApi.getPublicVouchers() 
                ]);

                let loadedCourses = [];
                if (coursesRes.status === 'fulfilled') {
                    loadedCourses = coursesRes.value.map(res => res?.data).filter(c => c != null);
                }

                if (loadedCourses.length === 0) {
                    toast.error("Không tìm thấy thông tin các khóa học!");
                    navigate("/courses");
                    return;
                }
                setCourses(loadedCourses);

                let loadedVouchers = [];
                if (vouchersRes.status === 'fulfilled' && vouchersRes.value?.data) {
                    loadedVouchers = vouchersRes.value.data;
                    setPublicVouchers(loadedVouchers);
                }

                autoApplyBestVoucher(loadedCourses, loadedVouchers, urlVoucher);

            } catch (err) {
                toast.error("Lỗi tải dữ liệu thanh toán");
            } finally {
                setLoading(false);
            }
        };
        fetchCheckoutData();
        // eslint-disable-next-line
    }, []);

    const autoApplyBestVoucher = (coursesList, vouchersList, urlCode) => {
        let bestVoucher = null;
        let maxDiscount = 0;

        vouchersList.forEach(v => {
            const discount = calculateDiscount(v, coursesList);
            if (discount > maxDiscount) {
                maxDiscount = discount;
                bestVoucher = v;
            }
        });

        if (bestVoucher) {
            setAppliedVoucher(bestVoucher);
            setVoucherCode(bestVoucher.code);
            if (urlCode && bestVoucher.code.toUpperCase() === urlCode.toUpperCase()) {
                setAutoAppliedMessage(`Đã tự động áp dụng mã từ lộ trình!`);
                toast.success(`Đã tự động áp dụng ưu đãi ${bestVoucher.code}!`);
            } else {
                setAutoAppliedMessage(`Hệ thống đã tự động áp dụng lựa chọn tốt nhất cho bạn!`);
                toast.success(`Đã chọn ưu đãi tốt nhất cho bạn!`);
            }
        }
    };

    const handleApplyVoucher = () => {
        if (!voucherCode.trim()) {
            setAppliedVoucher(null);
            return;
        }

        const code = voucherCode.trim().toUpperCase();
        const foundVoucher = publicVouchers.find(v => v.code === code);

        if (!foundVoucher) {
            toast.error("Mã giảm giá không tồn tại hoặc đã hết hạn!");
            return;
        }

        const discount = calculateDiscount(foundVoucher, courses);
        if (discount === 0) {
            toast.warning("Đơn hàng chưa đủ điều kiện áp dụng mã này!");
            return;
        }

        setAppliedVoucher(foundVoucher);
        setAutoAppliedMessage(""); 
        toast.success("Áp dụng mã giảm giá thành công!");
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setVoucherCode("");
        setAutoAppliedMessage("");
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const baseCartInfo = courses.reduce(
        (acc, course) => {
            acc.totalOriginalPrice += (course.originalPrice || course.price || 0);
            acc.totalCoursePrice += (course.price || 0);
            return acc;
        },
        { totalOriginalPrice: 0, totalCoursePrice: 0 }
    );

    const courseDiscount = baseCartInfo.totalOriginalPrice - baseCartInfo.totalCoursePrice;
    const finalVoucherDiscount = calculateDiscount(appliedVoucher, courses);
    const finalPayablePrice = baseCartInfo.totalCoursePrice - finalVoucherDiscount;

    const handleCheckout = async () => {
        try {
            setIsProcessingPayment(true);
            const courseIds = courses.map(c => c.id);
            const payload = { courseIds, voucherCode: appliedVoucher ? appliedVoucher.code : null };
            
            const response = await paymentApi.checkoutCourse(payload);
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
            <div className="mx-auto px-4 lg:px-12 max-w-[1400px]">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    
                    {/* CỘT TRÁI */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="mb-4">
                            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 mb-4 font-bold w-fit">
                                <FiArrowLeft size={20} /> Quay lại
                            </button>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Xác nhận thanh toán</h1>
                            <p className="text-gray-500 mt-2 text-lg">Vui lòng kiểm tra kỹ thông tin đơn hàng trước khi tiến hành thanh toán.</p>
                        </div>

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
                                                {course.name && <p className="text-slate-600 text-sm font-medium mb-2">{course.name}</p>}
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

                    {/* 💥 CỘT PHẢI (Đã sửa thành lg:mt-8 để vừa in với thẻ H1 bên trái) */}
                    <div className="lg:col-span-5 sticky top-24 space-y-5 mt-8 lg:mt-8">

                        {/* BOX VOUCHER */}
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FiTag className="text-primary" /> Mã giảm giá (Voucher)
                            </h2>
                            
                            {appliedVoucher ? (
                                <div>
                                    <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-3 flex justify-between items-center shadow-sm">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wide mb-1">{appliedVoucher.code}</h4>
                                            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                                                <FiCheckCircle size={14} /> Đã áp dụng ưu đãi -{formatPrice(finalVoucherDiscount)}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={handleRemoveVoucher} 
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-100 transition-colors border border-transparent hover:border-rose-200 flex items-center gap-1"
                                        >
                                            <FiX size={14} /> Bỏ
                                        </button>
                                    </div>
                                    {autoAppliedMessage && (
                                        <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
                                            <FaTicketAlt /> {autoAppliedMessage}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập mã..."
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium uppercase"
                                    />
                                    <button 
                                        onClick={handleApplyVoucher} 
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${voucherCode.trim() ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            )}

                            {publicVouchers.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <button 
                                        onClick={() => setShowVoucherList(!showVoucherList)}
                                        className="w-full flex items-center justify-between text-sm font-bold text-primary hover:text-emerald-700 transition-colors"
                                    >
                                        <span>Mã giảm giá có sẵn ({publicVouchers.length})</span>
                                        {showVoucherList ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                                    </button>

                                    {showVoucherList && (
                                        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar mt-4">
                                            {publicVouchers.map(v => {
                                                const discountAmt = calculateDiscount(v, courses);
                                                const isEligible = discountAmt > 0;
                                                const isCurrentlyApplied = appliedVoucher?.id === v.id;

                                                return (
                                                    <div 
                                                        key={v.id} 
                                                        onClick={() => {
                                                            if (isEligible && !isCurrentlyApplied) {
                                                                setVoucherCode(v.code);
                                                                setAppliedVoucher(v);
                                                                setAutoAppliedMessage("");
                                                                setShowVoucherList(false); 
                                                                toast.success(`Áp dụng mã ${v.code} thành công!`);
                                                            }
                                                        }}
                                                        className={`border rounded-xl p-3 flex gap-3 items-center transition-all 
                                                            ${isCurrentlyApplied ? 'border-emerald-500 bg-emerald-50' : 
                                                              isEligible ? 'border-emerald-200 bg-white hover:bg-emerald-50 cursor-pointer' : 
                                                              'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'}`}
                                                    >
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                                                            ${isCurrentlyApplied ? 'bg-emerald-500 text-white' : 
                                                              isEligible ? 'bg-emerald-100 text-emerald-600' : 
                                                              'bg-slate-200 text-slate-400'}`}>
                                                            {isCurrentlyApplied ? <FiCheckCircle size={16} /> : <FaTicketAlt size={16} />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className={`text-sm font-bold ${isCurrentlyApplied ? 'text-emerald-700' : isEligible ? 'text-slate-800' : 'text-slate-500'}`}>{v.code}</h4>
                                                            
                                                            {/* 💥 GIAO DIỆN HIỂN THỊ ĐIỀU KIỆN VOUCHER CHI TIẾT */}
                                                            <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                                                                <p className="font-semibold text-slate-600">
                                                                    {v.discountType === 'PERCENT' ? `Giảm ${v.discountValue}%` : `Giảm ${formatPrice(v.discountValue)}`}
                                                                    {v.discountType === 'PERCENT' && v.maxDiscountAmount ? ` (Tối đa ${formatPrice(v.maxDiscountAmount)})` : ''}
                                                                </p>
                                                                {(v.minOrderValue > 0 || v.minCourseCount > 1) && (
                                                                    <p className="text-slate-400">
                                                                        {v.minCourseCount > 1 ? `Từ ${v.minCourseCount} khóa` : ''}
                                                                        {v.minCourseCount > 1 && v.minOrderValue > 0 ? ' • ' : ''}
                                                                        {v.minOrderValue > 0 ? `Đơn tối thiểu ${formatPrice(v.minOrderValue)}` : ''}
                                                                    </p>
                                                                )}
                                                            </div>

                                                        </div>
                                                        {isEligible && !isCurrentlyApplied && (
                                                            <div className="text-xs font-bold text-emerald-600 whitespace-nowrap bg-emerald-100/50 px-2 py-1 rounded">
                                                                Dùng ngay
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* BOX TÍNH TIỀN */}
                        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-6">
                                
                                <div className="flex-1">
                                    <h2 className="text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Chi tiết thanh toán</h2>

                                    <div className="space-y-3 mb-4 text-sm text-gray-600 font-medium">
                                        <div className="flex justify-between items-center">
                                            <span>Giá gốc ({courses.length} khóa)</span>
                                            <span className="font-bold text-gray-800">{formatPrice(baseCartInfo.totalOriginalPrice)}</span>
                                        </div>
                                        {courseDiscount > 0 && (
                                            <div className="flex justify-between items-center text-emerald-600">
                                                <span>Giảm giá</span>
                                                <span className="font-bold">-{formatPrice(courseDiscount)}</span>
                                            </div>
                                        )}
                                        {finalVoucherDiscount > 0 && (
                                            <div className="flex justify-between items-center text-emerald-600 bg-emerald-50 p-2 rounded-lg -mx-2 px-2 border border-emerald-100">
                                                <span className="flex items-center gap-1">Voucher <span className="text-[10px] bg-white border border-emerald-200 px-1.5 py-0.5 rounded text-emerald-700 font-bold uppercase">{appliedVoucher.code}</span></span>
                                                <span className="font-bold">-{formatPrice(finalVoucherDiscount)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100 pt-3">
                                        <div className="flex justify-between items-end">
                                            <span className="font-bold text-gray-800 text-base mb-1">Tổng cộng</span>
                                            <span className="text-2xl font-black text-primary tracking-tight">{formatPrice(finalPayablePrice)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:block lg:hidden xl:block w-px bg-gray-100"></div>
                                <div className="block sm:hidden lg:block xl:hidden h-px w-full bg-gray-100"></div>

                                <div className="flex-1 flex flex-col justify-end">
                                    <h2 className="text-base font-bold text-gray-800 mb-3 hidden sm:block lg:hidden xl:block">Phương thức</h2>
                                    <h2 className="text-base font-bold text-gray-800 mb-3 block sm:hidden lg:block xl:hidden">Phương thức</h2>
                                    
                                    <div className="border-2 border-primary bg-emerald-50 rounded-xl p-3 flex items-center justify-between cursor-pointer mb-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPAY" className="h-5" />
                                            <span className="font-bold text-gray-800 text-sm">Cổng VNPAY</span>
                                        </div>
                                        <FiCheckCircle className="text-primary text-lg" />
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={isProcessingPayment}
                                        className={`w-full py-3.5 rounded-xl font-black text-base text-white transition-all flex justify-center items-center gap-2 
                                            ${isProcessingPayment ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-emerald-600 shadow-xl shadow-emerald-200 hover:-translate-y-1'}`}
                                    >
                                        {isProcessingPayment ? "Đang xử lý..." : "Thanh toán ngay"}
                                    </button>
                                    
                                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400">
                                        <FiShield className="text-emerald-500 text-xs" />
                                        <span>Thanh toán an toàn bảo mật</span>
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