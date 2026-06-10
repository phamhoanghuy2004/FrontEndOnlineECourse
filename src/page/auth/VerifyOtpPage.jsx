import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaEnvelopeOpenText } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom'; // Bỏ useLocation
import Button from '../../components/common/Button';
import authApi from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

import { toast } from 'react-toastify';
// ===== Helpers 
const getRolesFromToken = (token) => {
    try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        const scope = decoded.scope || '';
        return scope.split(' ').filter(s => s.startsWith('ROLE_')).map(s => s.replace('ROLE_', ''));
    } catch {
        return [];
    }
};

const resolveRedirectPath = (roles, isFirstTime) => {
    if (isFirstTime){
        return '/complete-profile';
    }
    if (roles.includes('ADMIN')) return '/admin';
    if (roles.includes('TEACHER')) return '/teacher';
    return '/';
};
// ==============================================================================================

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    
    // 💥 1. Lấy hàm fetchUserProfile mới nhất từ Context
    const { fetchUserProfile } = useAuth();

    // 💥 2. LẤY DATA TỪ SESSION STORAGE (Bao F5 không mất)
    const [verifyInfo] = useState(() => {
        const saved = sessionStorage.getItem("verifyData");
        return saved ? JSON.parse(saved) : { email: "", isFromLogin: false };
    });

    const email = verifyInfo.email;
    const fromLogin = verifyInfo.isFromLogin;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef([]);

    const hasAutoSent = useRef(false);

    const [globalError, setGlobalError] = useState("");
    const [isError, setIsError] = useState(false);

    // Kích người dùng ra ngoài nếu không có email
    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    // TỰ ĐỘNG GỬI OTP NẾU TỪ TRANG LOGIN QUA
    useEffect(() => {
        if (fromLogin && email && !hasAutoSent.current) {
            hasAutoSent.current = true; // Sập chốt

            const autoSendOtp = async () => {
                setIsLoading(true);
                try {
                    await authApi.resendOtp({ email });
                    setGlobalError("Mã xác thực mới vừa được gửi đến email của bạn.");
                    setTimer(60);
                } catch (error) {
                    // 💥 CHỈ CẦN GỌI error.message VÌ AXIOS INTERCEPTOR ĐÃ CHUẨN HÓA
                    setGlobalError(error.message || "Hệ thống đang gửi mã, vui lòng kiểm tra email.");
                } finally {
                    setIsLoading(false);
                }
            };

            autoSendOtp();
        }
    }, [fromLogin, email]);

    // Đếm ngược 60s
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // XỬ LÝ NHẬP LIỆU OTP
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return;

        const newOtp = [...otp];
        const digit = value.slice(-1);
        newOtp[index] = digit;
        setOtp(newOtp);

        setGlobalError("");
        setIsError(false);

        if (digit && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            e.preventDefault(); 
            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = '';
                setOtp(newOtp);
            }
            else if (index > 0) {
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6).split('');
        if (pastedData.length === 0) return;

        const newOtp = [...otp];
        pastedData.forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);

        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex].focus();
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length < 6) {
            setGlobalError('Vui lòng nhập đủ 6 chữ số mã OTP!');
            setIsError(true);
            return;
        }

        setIsLoading(true);

        try {
            const payload = { email, otpCode };
            const response = await authApi.verifyOtp(payload);

            const { token, authenticated, isFirstTime } = response.data;

            if (authenticated) {
                localStorage.setItem('token', token);
                
                // 💥 3. XÓA RÁC TRONG SESSION STORAGE KHI ĐÃ XONG VIỆC
                sessionStorage.removeItem("verifyData");

                // 💥 4. GỌI HÀM PROFILE CÓ KÈM ROLES VÀ BẺ LÁI ĐÚNG TRANG
                const roles = getRolesFromToken(token);
                
                try {
                    await fetchUserProfile(roles);
                    const redirectPath = resolveRedirectPath(roles, isFirstTime);
                    navigate(redirectPath);
                } catch (profileError) {
                    setGlobalError(profileError.message || "Xác thực thành công nhưng không thể lấy thông tin");
                }
            }
        } catch (error) {
            setGlobalError(error.message || "Mã xác thực không chính xác hoặc đã hết hạn!");
            setIsError(true);
            setOtp(['', '', '', '', '', '']);
            if (inputRefs.current[0]) inputRefs.current[0].focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend || isLoading) return;

        setIsLoading(true);

        try {
            await authApi.resendOtp({ email }); 

            toast.success('Đã gửi lại mã OTP. Vui lòng kiểm tra email!');
            setTimer(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            setGlobalError("");
            setIsError(false);
            if (inputRefs.current[0]) inputRefs.current[0].focus();

        } catch (error) {
            setGlobalError(error.message || "Gửi lại mã thất bại. Vui lòng thử lại sau!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#f0fdf4] flex items-center justify-center overflow-hidden font-sans relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-200/40 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="w-full max-w-md px-4 relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/50 p-8 text-center">

                        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-5 shadow-inner border-2 border-white">
                            <FaShieldAlt className="text-emerald-500 text-2xl" />
                        </div>

                        <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Xác Thực Email</h2>
                        <p className="text-[13px] text-slate-500 mb-2">
                            Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến email <br />
                            <span className="font-bold text-emerald-600 inline-flex items-center gap-1 mt-1">
                                <FaEnvelopeOpenText /> {email || "email@example.com"}
                            </span>
                        </p>

                        <div className="h-8 mb-3 flex items-center justify-center w-full">
                            {globalError && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[11px] text-red-500 bg-red-50 py-1.5 px-3 rounded-lg border border-red-100 font-medium w-full text-center">
                                    {globalError}
                                </motion.div>
                            )}
                        </div>

                        <form onSubmit={handleVerify}>
                            <div className="flex justify-between gap-2 mb-6">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={2} 
                                        value={digit}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste} 
                                        disabled={isLoading}
                                        className={`w-12 h-14 text-center text-2xl font-bold rounded-xl outline-none transition-all shadow-sm border
                                        ${isError
                                                ? 'bg-red-50 border-red-400 text-red-900 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                                : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                                    />
                                ))}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading}
                                className={`w-full uppercase tracking-wider ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                            >
                                {isLoading ? 'Đang xác thực...' : 'Xác Thực Ngay'}
                            </Button>
                        </form>

                        <div className="mt-5 text-sm">
                            <span className="text-slate-500">Chưa nhận được mã? </span>
                            {canResend ? (
                                <button
                                    onClick={handleResend}
                                    disabled={isLoading}
                                    className="text-emerald-600 font-bold hover:underline focus:outline-none disabled:text-emerald-300"
                                >
                                    Gửi lại mã
                                </button>
                            ) : (
                                <span className="text-slate-400 font-medium">
                                    Gửi lại sau <span className="text-emerald-500 font-bold">{timer}s</span>
                                </span>
                            )}
                        </div>

                        <div className="mt-4">
                            <Link to="/register" className="text-xs text-slate-400 hover:text-emerald-600 transition-colors">
                                &larr; Quay lại trang đăng ký
                            </Link>
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyOtpPage;