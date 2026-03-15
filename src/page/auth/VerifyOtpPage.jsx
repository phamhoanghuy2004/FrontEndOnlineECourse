import { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaEnvelopeOpenText } from 'react-icons/fa';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import authApi from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { setUser } = useContext(AuthContext);

    const email = location.state?.email || "";

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Thêm loading chống spam
    const inputRefs = useRef([]);

    // State quản lý lỗi hiển thị
    const [globalError, setGlobalError] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

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

    // 💥 FIX LỖI NHẬP LIỆU OTP
    const handleChange = (e, index) => {
        const value = e.target.value;
        // Chỉ cho phép nhập số (Chặn cả dấu cách)
        if (/[^0-9]/.test(value)) return;

        const newOtp = [...otp];
        // Luôn lấy ký tự cuối cùng vừa gõ (Cắt đứt chuỗi cũ nếu bị kẹt bộ gõ)
        const digit = value.slice(-1);
        newOtp[index] = digit;
        setOtp(newOtp);

        // Xóa lỗi khi gõ lại
        setGlobalError("");
        setIsError(false);

        // Tự động nhảy sang ô tiếp theo nếu có nhập dữ liệu
        if (digit && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // 💥 XỬ LÝ NÚT XÓA (BACKSPACE) MƯỢT MÀ
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            e.preventDefault(); // Chặn hành vi xóa mặc định của trình duyệt
            const newOtp = [...otp];

            // Nếu ô hiện tại đang có số -> Xóa số đó
            if (otp[index]) {
                newOtp[index] = '';
                setOtp(newOtp);
            }
            // Nếu ô hiện tại đã trống -> Lùi về ô trước và xóa luôn số ở ô đó
            else if (index > 0) {
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1].focus();
            }
        }
    };

    // 💥 TÍNH NĂNG MỚI: PASTE (DÁN) 6 SỐ CÙNG LÚC
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6).split('');
        if (pastedData.length === 0) return;

        const newOtp = [...otp];
        pastedData.forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);

        // Đưa con trỏ tới ô cuối cùng được điền
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
            // 1. Gửi OTP xuống Backend để xác thực
            const response = await authApi.verifyOtp(payload);

            const { token, authenticated } = response.data;

            if (authenticated) {
                // 2. Lưu token vào LocalStorage TRƯỚC (Rất quan trọng)
                // Phải lưu trước để file AxiosClient có thể lấy gắn vào Header Authorization (Bearer token)
                localStorage.setItem('token', token);

                try {
                    // 3. Gọi API lấy thông tin Profile mới nhất
                    const profileRes = await authApi.getMyProfile();

                    // 4. Set vào Context và LocalStorage (Giống hệt cách làm trong hàm login)
                    setUser(profileRes.data);
                    localStorage.setItem("currentUser", JSON.stringify(profileRes.data));

                    alert('Xác thực thành công! Chào mừng đến với Echill.');
                    navigate('/'); // Chuyển thẳng vào Home, lúc này hệ thống đã nhận diện được User!
                } catch (profileError) {
                    // Nếu lỗi khi lấy profile (ít khi xảy ra), có thể đá về trang login
                    setGlobalError("Không thể tải thông tin tài khoản. Vui lòng đăng nhập lại.");
                    localStorage.removeItem('token');
                    setIsError(true);
                }
            }
        } catch (error) {
            setGlobalError(error || "Mã xác thực không chính xác hoặc đã hết hạn!");
            setIsError(true);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0].focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend || isLoading) return;

        setIsLoading(true);
        try {
            await authApi.resendOtp(email); // Đóng gói object theo chuẩn DTO Backend

            alert('Đã gửi lại mã OTP. Vui lòng kiểm tra email!');
            setTimer(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            setGlobalError("");
            setIsError(false);
            inputRefs.current[0].focus();

        } catch (error) {
            setGlobalError(error || "Gửi lại mã thất bại. Vui lòng thử lại sau!");
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

                        {/* 💥 GIẢI PHÁP STATIC LAYOUT (KHUNG TĨNH 32px) CHỐNG PHÌNH FORM */}
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
                                        maxLength={2} // Cho phép 2 để hứng số mới, sau đó bị cắt lại bằng slice(-1)
                                        value={digit}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste} // Gọi hàm Paste
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