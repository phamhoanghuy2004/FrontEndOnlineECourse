import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaBriefcase, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [registerData, setRegisterData] = useState({
    fullName: '',
    username: '',
    password: '',
    birthDate: '',
    address: '',
    job: '',
    avatar: null
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRegisterData({ ...registerData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Đăng ký thành công!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4 pt-32">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-white text-3xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Tạo Tài Khoản Mới</h2>
              <p className="text-gray-500">Bắt đầu hành trình học tiếng Anh của bạn</p>
            </div>

            <div>
              {/* Avatar Upload */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-primary/20">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <FaImage className="text-gray-400 text-4xl" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full cursor-pointer hover:bg-primary-dark transition shadow-lg">
                    <FaImage />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                      placeholder="username123"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                      placeholder="••••••••"
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

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={registerData.birthDate}
                      onChange={(e) => setRegisterData({ ...registerData, birthDate: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.address}
                      onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                      placeholder="Hà Nội, Việt Nam"
                    />
                  </div>
                </div>

                {/* Job */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Công việc <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.job}
                      onChange={(e) => setRegisterData({ ...registerData, job: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition"
                      placeholder="Sinh viên, Nhân viên văn phòng,..."
                    />
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <button
                onClick={handleSubmit}
                className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition transform hover:-translate-y-1"
              >
                Đăng Ký Ngay
              </button>

              {/* Terms */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Bằng việc đăng ký, bạn đồng ý với{' '}
                <a href="#" className="text-primary hover:underline">Điều khoản dịch vụ</a> và{' '}
                <a href="#" className="text-primary hover:underline">Chính sách bảo mật</a>
              </p>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;