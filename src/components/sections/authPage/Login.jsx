import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Đăng nhập thành công!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4 pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-white text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Chào Mừng Trở Lại!</h2>
            <p className="text-gray-500">Đăng nhập để tiếp tục học tập</p>
          </div>

          <div className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-primary hover:underline font-medium"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition transform hover:-translate-y-1"
            >
              Đăng Nhập
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-primary hover:text-primary transition flex items-center justify-center gap-3"
            >
              <FaGoogle className="text-xl" />
              Đăng nhập bằng Google
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;