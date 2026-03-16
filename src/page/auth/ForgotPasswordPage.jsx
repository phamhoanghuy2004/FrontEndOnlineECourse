import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaShieldAlt, FaKey, FaArrowLeft } from 'react-icons/fa';
import InputField from '../../components/common/InputField';
import PasswordField from '../../components/common/PasswordField';
import authApi from '../../api/authApi';

// ==========================================
// 1. TÁCH HÀM VALIDATION
// ==========================================
const validateEmailStep = (email) => {
    if (!email.trim()) return "Email không được để trống";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không đúng định dạng";
    return null;
};

const validateResetStep = (data) => {
    const errors = {};
    if (!data.otpCode.trim() || data.otpCode.length !== 6) {
        errors.otpCode = "Vui lòng nhập đủ 6 số mã OTP";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!data.newPassword.trim()) {
        errors.newPassword = "Mật khẩu không được để trống";
    } else if (data.newPassword.length < 6) {
        errors.newPassword = "Mật khẩu phải từ 6 ký tự trở lên";
    } else if (!passwordRegex.test(data.newPassword)) {
        errors.newPassword = "Phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số";
    }

    if (data.newPassword !== data.confirmPassword) {
        errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState("");
    const [errors, setErrors] = useState({});

    // 💥 MỚI: State cho bộ đếm ngược OTP
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        otpCode: '',
        newPassword: '',
        confirmPassword: ''
    });

    // 💥 MỚI: Hook đếm ngược thời gian (chỉ chạy khi ở bước 2)
    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer, step]);

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
        setGlobalError("");
    };

    // --- BƯỚC 1: GỬI EMAIL LẤY OTP ---
    const handleSendEmail = async (e) => {
        e.preventDefault();
        const emailError = validateEmailStep(formData.email);
        if (emailError) {
            setErrors({ email: emailError });
            return;
        }

        setIsLoading(true);
        setGlobalError("");
        setErrors({});

        try {
            await authApi.forgotPassword({ email: formData.email });
            setStep(2);
            // 💥 MỚI: Reset lại timer phòng trường hợp user back lại bước 1 rồi bấm tiếp
            setTimer(60);
            setCanResend(false);
        } catch (error) {
            setGlobalError(error || "Tài khoản không tồn tại hoặc chưa kích hoạt.");
        } finally {
            setIsLoading(false);
        }
    };

    // 💥 MỚI: HÀM GỬI LẠI OTP
    const handleResendOTP = async () => {
        if (!canResend || isLoading) return;

        setIsLoading(true);
        setGlobalError("");

        try {
            // Tái sử dụng lại chính api forgotPassword
            await authApi.forgotPassword({ email: formData.email });
            alert('Đã gửi lại mã OTP. Vui lòng kiểm tra email!');

            // Reset lại đồng hồ đếm ngược
            setTimer(60);
            setCanResend(false);

            // Xóa OTP cũ trên UI cho user nhập lại
            setFormData(prev => ({ ...prev, otpCode: '' }));
        } catch (error) {
            setGlobalError(error || "Gửi lại mã thất bại. Vui lòng thử lại sau!");
        } finally {
            setIsLoading(false);
        }
    };

    // --- BƯỚC 2: XÁC NHẬN ĐỔI MẬT KHẨU ---
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const { isValid, errors: validationErrors } = validateResetStep(formData);

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        setGlobalError("");

        try {
            const payload = {
                email: formData.email,
                otpCode: formData.otpCode,
                newPassword: formData.newPassword
            };
            await authApi.resetPassword(payload);

            alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            navigate('/login');
        } catch (error) {
            setGlobalError(error || "Mã OTP không chính xác hoặc đã hết hạn.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#f0fdf4] flex items-center justify-center overflow-hidden font-sans relative pt-12">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-orange-200/30 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="w-full max-w-[400px] px-4 relative z-10">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/50 p-6 md:px-8 md:py-7">

                        {/* Header chung */}
                        <div className="text-center mb-4">
                            <div className="relative inline-block mb-2">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 border-2 border-white">
                                    <FaKey className="text-white text-xl" />
                                </div>
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Khôi Phục Mật Khẩu</h2>
                            <p className="text-[12px] text-slate-500 mt-1">
                                {step === 1 ? "Nhập email của bạn để nhận mã xác thực" : "Tạo mật khẩu mới cho tài khoản của bạn"}
                            </p>

                            {/* Box chứa lỗi chung */}
                            <div className="h-6 mt-2">
                                {globalError && (
                                    <div className="text-[11px] text-red-500 bg-red-50 py-1 px-3 rounded text-center border border-red-100 font-medium inline-block">
                                        {globalError}
                                    </div>
                                )}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* ================================================= */}
                            {/* FORM BƯỚC 1: NHẬP EMAIL */}
                            {/* ================================================= */}
                            {step === 1 && (
                                <motion.form
                                    key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleSendEmail} className="space-y-4"
                                >
                                    <div className="relative pb-[14px]">
                                        <InputField
                                            label="Email đăng ký *" icon={FaEnvelope} type="email" placeholder="echill@example.com"
                                            value={formData.email} error={!!errors.email} size="compact"
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                        />
                                        {errors.email && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none">{errors.email}</p>}
                                    </div>

                                    <button
                                        type="submit" disabled={isLoading}
                                        className={`w-full text-white py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg transition-all ${isLoading ? 'bg-orange-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-orange-500/40 hover:-translate-y-0.5'}`}
                                    >
                                        {isLoading ? 'Đang gửi mã...' : 'Gửi Mã Xác Thực'}
                                    </button>
                                </motion.form>
                            )}

                            {/* ================================================= */}
                            {/* FORM BƯỚC 2: ĐỔI MẬT KHẨU */}
                            {/* ================================================= */}
                            {step === 2 && (
                                <motion.form
                                    key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleResetPassword} className="space-y-2"
                                >
                                    {/* OTP Input */}
                                    <div className="relative pb-[14px]">
                                        <InputField
                                            label="Mã OTP (6 số) *" icon={FaShieldAlt} type="text" placeholder="123456" maxLength={6}
                                            value={formData.otpCode} error={!!errors.otpCode} size="compact"
                                            onChange={(e) => handleInputChange('otpCode', e.target.value.replace(/[^0-9]/g, ''))}
                                        />
                                        {errors.otpCode && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none">{errors.otpCode}</p>}
                                    </div>

                                    {/* New Password Input */}
                                    <div className="relative pb-[14px]">
                                        <PasswordField
                                            label="Mật khẩu mới *" value={formData.newPassword} error={!!errors.newPassword} size="sm"
                                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                        />
                                        {errors.newPassword && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none">{errors.newPassword}</p>}
                                    </div>

                                    {/* Confirm Password Input */}
                                    <div className="relative pb-[14px]">
                                        <PasswordField
                                            label="Xác nhận mật khẩu *" value={formData.confirmPassword} error={!!errors.confirmPassword} size="sm"
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        />
                                        {errors.confirmPassword && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none">{errors.confirmPassword}</p>}
                                    </div>

                                    {/* 💥 MỚI: Phần Gửi lại mã (Resend OTP) */}
                                    <div className="text-right text-[11px] mb-3 -mt-1">
                                        <span className="text-slate-500">Chưa nhận được mã? </span>
                                        {canResend ? (
                                            <button
                                                type="button"
                                                onClick={handleResendOTP}
                                                disabled={isLoading}
                                                className="text-orange-600 font-bold hover:text-orange-700 hover:underline focus:outline-none disabled:text-orange-300 transition-colors"
                                            >
                                                Gửi lại mã
                                            </button>
                                        ) : (
                                            <span className="text-slate-400 font-medium">
                                                Gửi lại sau <span className="text-orange-500 font-bold">{timer}s</span>
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="submit" disabled={isLoading}
                                        className={`mt-2 w-full text-white py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg transition-all ${isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/40 hover:-translate-y-0.5'}`}
                                    >
                                        {isLoading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {/* Quay lại Đăng nhập */}
                        <div className="mt-5 text-center">
                            <Link to="/login" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-orange-600 transition-colors">
                                <FaArrowLeft className="mr-1.5" /> Quay lại Đăng nhập
                            </Link>
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;