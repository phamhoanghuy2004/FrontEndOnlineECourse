import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaBriefcase, FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import PasswordField from '../../components/common/PasswordField';


const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
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
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản sử dụng!');
      return;
    }
    alert('Đăng ký thành công!');
  };

  return (
    <div className="h-screen w-full bg-[#f0fdf4] flex items-center justify-center overflow-hidden font-sans relative pt-16">

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="w-full max-w-4xl px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/50 p-6 md:p-8">

            <div className="text-center mb-4">
              <div className="relative inline-block mt-4 mb-2"> {/* Thêm margin để đẩy xuống 1 xíu */}

                {/* --- VÒNG TRÒN LỚN (HIỂN THỊ ICON HOẶC ẢNH) --- */}
                {/* w-24 h-24: Kích thước lớn */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 overflow-hidden border-4 border-white">
                  {avatarPreview ? (
                    // Nếu có ảnh: Hiển thị ảnh full vòng tròn
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // Nếu chưa có ảnh: Hiển thị Icon User mặc định
                    <FaUser className="text-white text-4xl drop-shadow-sm" />
                  )}
                </div>

                {/* --- NÚT UPLOAD NHỎ (NẰM GÓC DƯỚI PHẢI) --- */}
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-50 hover:scale-110 transition-transform border border-gray-200 group">
                  <FaCamera className="text-emerald-500 text-sm group-hover:text-emerald-600" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>

              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-2">Tạo Tài Khoản</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">

              <InputField
                label="Họ và tên" icon={FaUser} type="text" placeholder="Nguyễn Văn A"
                value={registerData.fullName}
                required={true}
                onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
              />
              <InputField
                label="Tên đăng nhập" icon={FaEnvelope} type="text" placeholder="username123"
                value={registerData.username}
                required={true}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              />

              <PasswordField
                required 
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />

              <InputField
                label="Ngày sinh" icon={FaCalendar} type="date"
                value={registerData.birthDate}
                onChange={(e) => setRegisterData({ ...registerData, birthDate: e.target.value })}
              />

              <InputField
                label="Địa chỉ" icon={FaMapMarkerAlt} type="text" placeholder="Hà Nội"
                value={registerData.address}
                onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
              />
              <InputField
                label="Công việc" icon={FaBriefcase} type="text" placeholder="Sinh viên"
                value={registerData.job}
                onChange={(e) => setRegisterData({ ...registerData, job: e.target.value })}
              />

              {/* Checkbox */}
              <div className="md:col-span-2 mt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 shadow transition-all checked:border-emerald-500 checked:bg-emerald-500 hover:shadow-md"
                    />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors select-none">
                    Tôi đồng ý với <a href="#" className="text-emerald-600 font-bold hover:underline">Điều khoản sử dụng</a> và <a href="#" className="text-emerald-600 font-bold hover:underline">Chính sách bảo mật</a>
                  </span>
                </label>
              </div>

              <div className="md:col-span-2 space-y-3">
                <button
                  type="submit"
                  className="group relative w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:shadow-emerald-600/40 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden"
                >
                  <span className="relative z-10">Đăng Ký Ngay</span>
                  <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700"></div>
                </button>

                <div className="text-center flex items-center justify-center gap-1 text-xs text-slate-500">
                  <span>Đã có tài khoản?</span>
                  <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
                    Đăng nhập ngay
                  </Link>
                </div>
              </div>
            </form>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;