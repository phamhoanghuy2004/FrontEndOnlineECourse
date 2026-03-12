import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import PasswordField from '../../components/common/PasswordField';
import { useAuth } from '../../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const { login, loginWithGoogle, loading, error: authError, setError } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [localError, setLocalError] = useState(''); // State lỗi nội bộ để reset khi user nhập lại


  // Clear lỗi khi user bắt đầu nhập liệu lại
  useEffect(() => {
    if (authError || localError) {
      setLocalError('');
      setError('');
    }
  }, [loginData.username, loginData.password]); 

  // Xu ly logic dang nhap
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate cơ bản
    if (!loginData.username || !loginData.password) {
      setLocalError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // 3. Gọi hàm Login từ Context
    const success = await login(loginData.username, loginData.password);

    if (success) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser?.role === 'STUDENT') {
        navigate('/');
      }
    } else if (currentUser?.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/'); // Mặc định về trang chủ
    }
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      if (result.isFirstTime) {
        navigate('/complete-profile');
      } else {
        navigate('/');
      }
    } else {
      setLocalError("Đăng nhập Google thất bại! rồi");
    }
  };

  const handleGoogleError = () => {
    setLocalError("Đăng nhập Google thất bại!");
  };


  return (
    // Container: pt-12 (đẩy lên cao hơn xíu), font-sans
    <div className="h-screen w-full bg-[#f0fdf4] flex items-center justify-center overflow-hidden font-sans relative pt-12">

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* Giảm max-w từ md xuống 400px để card thon gọn hơn */}
      <div className="w-full max-w-[400px] px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Card: Giảm padding xuống p-6 */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/50 p-6">

            {/* --- HEADER (Thu nhỏ) --- */}
            <div className="text-center mb-5">
              <div className="relative inline-block mb-1">
                <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-40 rounded-full transform scale-110"></div>
                {/* Icon giảm xuống w-16 h-16 */}
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <FaUser className="text-white text-2xl drop-shadow-sm" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mt-1">Chào Mừng Trở Lại!</h2>
              <p className="text-[11px] text-slate-500 font-medium">Đăng nhập để tiếp tục học tập</p>
            </div>

            {/* HIỂN THỊ LỖI (NẾU CÓ) */}
            {(authError || localError) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-4 py-2 rounded-lg mb-4 text-center"
              >
                {localError || authError}
              </motion.div>
            )}

            {/* --- FORM --- */}
            <div className="space-y-4"> {/* Giảm khoảng cách giữa các phần tử */}

              {/* Username Input */}
              <InputField
                label="Tên đăng nhập"
                icon={FaUser}
                type="text"
                required={true}
                size="compact"
                placeholder="Nhập tên đăng nhập"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />

              <PasswordField
                size="sm"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Nhập mật khẩu"
              />

              {/* Forgot Password */}
              <div className="text-right -mt-1">
                <button type="button" className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
                  Quên mật khẩu?
                </button>
              </div>

              {/* Login Button: Giảm py-3 */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="group relative w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:shadow-emerald-600/40 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden"
              >
                <span className="relative z-10">
                  {loading ? "Đang xử lý..." : "Đăng Nhập"}
                </span>
                {!loading && <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700"></div>}
              </button>

              {/* Divider */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wide font-bold">
                  <span className="px-3 bg-white/50 backdrop-blur-sm text-slate-400">Hoặc</span>
                </div>
              </div>

              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                  shape="rectangular"
                  width={318}
                  theme="outline"
                />
              </div>

              {/* Register Link */}
              <p className="text-center text-xs text-slate-500 mt-4">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline ml-1">
                  Đăng ký ngay
                </Link>
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};


export default LoginPage;