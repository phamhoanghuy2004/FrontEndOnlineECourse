import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaGraduationCap, FaChalkboardTeacher, FaInfoCircle, FaUserShield } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import PasswordField from '../../components/common/PasswordField';
import { useAuth } from '../../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';

// ==========================================
// 1. TÁCH HÀM VALIDATION RA KHỎI COMPONENT
// ==========================================
const validateLogin = (data) => {
  const errors = {};

  if (!data.username.trim()) {
    errors.username = "Tên đăng nhập không được để trống";
  }

  if (!data.password.trim()) {
    errors.password = "Mật khẩu không được để trống";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
const LoginPage = () => {
  const { login, loginWithGoogle, loading, error: authError, setError } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  
  // 💥 MỚI: Thêm state lưu Role riêng cho việc đăng nhập Google
  const [googleRole, setGoogleRole] = useState('STUDENT');

  // Reset lỗi API khi trang vừa load xong để tránh "lỗi ma" từ phiên trước
  useEffect(() => {
    if (setError) setError('');
  }, [setError]);

  const handleInputChange = (field, value) => {
    setLoginData({ ...loginData, [field]: value });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (authError && setError) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateLogin(loginData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    await login(loginData.username, loginData.password);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    // 💥 Truyền THÊM googleRole vào AuthContext
    await loginWithGoogle(credentialResponse.credential, googleRole);
  };

  const handleGoogleError = () => {
    if (setError) {
      setError("Đăng nhập Google bị hủy hoặc thất bại!");
    }
  };

  return (
    <div className="h-screen w-full bg-[#f0fdf4] flex items-center justify-center overflow-hidden font-sans relative pt-12">

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* Main Container for Form and Info Box */}
      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        {/* Left Side: Login Form */}
        <div className="w-full max-w-[400px]">
          <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/50 p-6">

            {/* --- HEADER --- */}
            <div className="text-center mb-1">
              <div className="relative inline-block mb-1">
                <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-40 rounded-full transform scale-110"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <FaUser className="text-white text-2xl drop-shadow-sm" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mt-1">Chào Mừng Trở Lại!</h2>
              <p className="text-[11px] text-slate-500 font-medium">Đăng nhập để tiếp tục học tập</p>

              <div className="h-6 mt-2 flex justify-center items-center">
                {authError && (
                  <div className="text-[11px] text-red-500 bg-red-50 py-1 px-3 rounded text-center border border-red-100 font-medium inline-block">
                    {typeof authError === 'string' ? authError : authError.message || "Đã có lỗi xảy ra"}
                  </div>
                )}
              </div>
            </div>

            {/* --- FORM --- */}
            <form onSubmit={handleSubmit} className="space-y-1 mt-2">

              <div className="relative pb-[14px]">
                <InputField
                  label="Tên đăng nhập" icon={FaUser} type="text" required={true} size="compact"
                  placeholder="Nhập tên đăng nhập" value={loginData.username} error={!!errors.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
                {errors.username && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.username}</p>}
              </div>

              <div className="relative pb-[14px]">
                <PasswordField
                  label="Mật khẩu" size="sm" required={true} value={loginData.password} error={!!errors.password}
                  onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Nhập mật khẩu"
                />
                {errors.password && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.password}</p>}
              </div>

              <div className="text-right pb-3">
                <button type="button" onClick={() => navigate('/forgot-password')} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit" disabled={loading}
                className={`group relative w-full text-white py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg transition-all transform overflow-hidden ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-[0.98]'}`}
              >
                <span className="relative z-10">{loading ? "Đang xử lý..." : "Đăng Nhập"}</span>
                {!loading && <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700"></div>}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wide font-bold">
                  <span className="px-3 bg-white/50 backdrop-blur-sm text-slate-400">Hoặc</span>
                </div>
              </div>

              {/* 💥 BỘ CHỌN ROLE TRƯỚC KHI ĐĂNG NHẬP GOOGLE */}
              <div className="flex flex-col items-center mb-3">
                <span className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Đăng nhập Google với vai trò:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input
                      type="radio" name="googleRole" value="STUDENT"
                      checked={googleRole === 'STUDENT'}
                      onChange={(e) => setGoogleRole(e.target.value)}
                      className="cursor-pointer accent-emerald-500 w-3.5 h-3.5"
                    />
                    <span className={`text-[11px] font-medium transition-colors ${googleRole === 'STUDENT' ? 'text-emerald-600 font-bold' : 'text-slate-500 group-hover:text-emerald-500'}`}>
                      <FaGraduationCap className="inline mb-0.5 mr-1"/>Học viên
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input
                      type="radio" name="googleRole" value="TEACHER"
                      checked={googleRole === 'TEACHER'}
                      onChange={(e) => setGoogleRole(e.target.value)}
                      className="cursor-pointer accent-emerald-500 w-3.5 h-3.5"
                    />
                    <span className={`text-[11px] font-medium transition-colors ${googleRole === 'TEACHER' ? 'text-emerald-600 font-bold' : 'text-slate-500 group-hover:text-emerald-500'}`}>
                      <FaChalkboardTeacher className="inline mb-0.5 mr-1"/>Giáo viên
                    </span>
                  </label>
                </div>
              </div>

              {/* Google Login Component */}
              <div className={`w-full flex justify-center mt-2 overflow-hidden transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="max-w-full overflow-x-auto overflow-y-hidden no-scrollbar">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signin_with"
                    shape="rectangular"
                    width={318}
                    theme="outline"
                  />
                </div>
              </div>

              {/* Register Link */}
              <p className="text-center text-xs text-slate-500 mt-4 pt-2">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline ml-1">
                  Đăng ký ngay
                </Link>
              </p>
            </form>

          </div>
          </motion.div>
        </div>

        {/* Right Side: Test Accounts Info Box */}
        <div className="w-full max-w-[400px] lg:max-w-[360px]">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-emerald-900/10 border border-white/60 p-6 relative overflow-hidden group">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/50 to-teal-100/10 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100/40 to-transparent rounded-tr-full -z-10"></div>
              
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 relative">
                <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-20 rounded-full transform scale-110"></div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-white/20 relative z-10">
                  <FaInfoCircle className="text-xl drop-shadow-sm" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Tài khoản dùng thử</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Dành cho việc trải nghiệm</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Account Item - Sinh Viên */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                      <FaGraduationCap />
                    </span>
                    <span className="text-sm font-bold text-slate-700">Sinh viên</span>
                  </div>
                  <div className="ml-9 space-y-2 text-[12px]">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400 font-medium w-8">TK:</span>
                      <code className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-md text-emerald-700 font-bold select-all flex-1 ml-2 text-right">student</code>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400 font-medium w-8">MK:</span>
                      <code className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-md text-emerald-700 font-bold select-all flex-1 ml-2 text-right">123456A@</code>
                    </div>
                  </div>
                </div>


              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;