import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaBriefcase, FaCamera } from 'react-icons/fa';
import InputField from '../../components/common/InputField';
import PasswordField from '../../components/common/PasswordField';
import authApi from '../../api/authApi';

// ==========================================
// 1. TÁCH HÀM VALIDATION RA KHỎI COMPONENT
// ==========================================
const validateRegistration = (data, agreeTerms) => {
  const errors = {};

  // Full Name
  if (!data.fullName.trim()) errors.fullName = "Họ và tên không được để trống";
  else if (data.fullName.length > 100) errors.fullName = "Họ và tên không vượt quá 100 ký tự";

  // Username
  if (!data.username.trim()) errors.username = "Tên đăng nhập không được để trống";
  else if (data.username.length > 50) errors.username = "Tên đăng nhập không vượt quá 50 ký tự";

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) errors.email = "Email không được để trống";
  else if (!emailRegex.test(data.email)) errors.email = "Email không đúng định dạng";
  else if (data.email.length > 255) errors.email = "Email không vượt quá 255 ký tự";

  // Password (Regex: Ít nhất 1 hoa, 1 thường, 1 số)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  if (!data.password.trim()) errors.password = "Mật khẩu không được để trống";
  else if (data.password.length < 6 || data.password.length > 50) errors.password = "Mật khẩu phải từ 6 - 50 ký tự";
  else if (!passwordRegex.test(data.password)) errors.password = "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số";

  // Job Title
  if (!data.jobTitle.trim()) errors.jobTitle = "Công việc không được để trống";
  else if (data.jobTitle.length > 100) errors.jobTitle = "Công việc không vượt quá 100 ký tự";

  // Address
  if (data.address && data.address.length > 255) errors.address = "Địa chỉ không vượt quá 255 ký tự";

  // Date of Birth (Phải trong quá khứ và >= 16 tuổi)
  if (data.dob) {
    const dobDate = new Date(data.dob);
    const today = new Date();

    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (dobDate >= today) errors.dob = "Ngày sinh phải ở trong quá khứ";
    else if (age < 16) errors.dob = "Bạn phải đủ 16 tuổi để đăng ký";
  }

  // Checkbox
  if (!agreeTerms) errors.terms = "Vui lòng đồng ý với điều khoản sử dụng!";

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
const RegisterPage = () => {
  const navigate = useNavigate();

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  // State lưu dữ liệu (Key đồng bộ 100% với DTO Backend)
  const [registerData, setRegisterData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    dob: '',       // Đổi birthDate -> dob
    address: '',
    jobTitle: '',  // Đổi job -> jobTitle
    avatar: null
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRegisterData({ ...registerData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setRegisterData({ ...registerData, [field]: value });
    // Xóa lỗi của trường đó khi user bắt đầu gõ lại
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    setGlobalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra validation
    const { isValid, errors: validationErrors } = validateRegistration(registerData, agreeTerms);

    if (!isValid) {
      setErrors(validationErrors);
      if (validationErrors.terms) setGlobalError(validationErrors.terms);
      else setGlobalError("Vui lòng kiểm tra lại thông tin bị lỗi màu đỏ.");
      return;
    }

    // 2. Xóa lỗi & Hiển thị Loading
    setErrors({});
    setGlobalError("");
    setIsLoading(true);

    try {
      // Vì key đã khớp với DTO, chỉ cần loại bỏ trường avatar (file) 
      // AvatarUrl tạm để null chờ upload sau nếu backend yêu cầu String
      const { avatar, ...payload } = registerData;
      payload.avatarUrl = null;

      await authApi.register(payload);

      // Thành công -> Chuyển hướng
      navigate('/verify-otp', {
        state: { email: registerData.email }
      });

    } catch (error) {
      setGlobalError(`Đăng ký thất bại: ${error}`);
    } finally {
      setIsLoading(false); // Tắt loading dù thành công hay thất bại
    }
  };

  return (
    <div className="h-screen w-full bg-[#f0fdf4] flex items-center justify-center overflow-hidden font-sans relative pt-12">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="w-full max-w-2xl px-4 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>

          {/* BỎ TÍNH NĂNG CUỘN - GỌT LẠI PADDING */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/50 p-5 md:px-7 md:py-5">

            <div className="text-center mb-1">
              <div className="relative inline-block">
                {/* Thu nhỏ Avatar tối đa để tiết kiệm không gian (w-14, h-14) */}
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 overflow-hidden border-2 border-white">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-white text-xl drop-shadow-sm" />
                  )}
                </div>
                <label className="absolute bottom-[-2px] right-[-4px] bg-white p-1 rounded-full cursor-pointer shadow-md hover:bg-gray-50 hover:scale-110 transition-transform border border-gray-200 group">
                  <FaCamera className="text-emerald-500 text-[9px] group-hover:text-emerald-600" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight mt-1">Tạo Tài Khoản</h2>

              {/* Chừa sẵn không gian tĩnh cho Global Error (h-6) để form không bị giật */}
              <div className="h-6 mt-1">
                {globalError && (
                  <div className="text-[11px] text-red-500 bg-red-50 py-1 px-3 rounded text-center border border-red-100 font-medium inline-block">
                    {globalError}
                  </div>
                )}
              </div>
            </div>

            {/* gap-y-1 cực nhỏ, khoảng trống lỗi được xử lý bằng pb-[14px] ở mỗi field */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-1">

              <div className="relative pb-[14px]">
                <InputField
                  label="Họ và tên *" icon={FaUser} type="text" placeholder="Nguyễn Văn A"
                  value={registerData.fullName} error={!!errors.fullName} size="compact"
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
                {errors.fullName && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.fullName}</p>}
              </div>

              <div className="relative pb-[14px]">
                <InputField
                  label="Tên đăng nhập *" icon={FaUser} type="text" placeholder="username123"
                  value={registerData.username} error={!!errors.username} size="compact"
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
                {errors.username && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.username}</p>}
              </div>

              <div className="relative pb-[14px]">
                <InputField
                  label="Email *" icon={FaEnvelope} type="email" placeholder="echill@example.com"
                  value={registerData.email} error={!!errors.email} size="compact"
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                {errors.email && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.email}</p>}
              </div>

              <div className="relative pb-[14px]">
                <PasswordField
                  label="Mật khẩu *" value={registerData.password} error={!!errors.password} size="sm"
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
                {errors.password && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.password}</p>}
              </div>

              <div className="relative pb-[14px]">
                <InputField
                  label="Ngày sinh" icon={FaCalendar} type="date"
                  value={registerData.dob} error={!!errors.dob} size="compact"
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                />
                {errors.dob && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.dob}</p>}
              </div>

              <div className="relative pb-[14px]">
                <InputField
                  label="Công việc *" icon={FaBriefcase} type="text" placeholder="Sinh viên"
                  value={registerData.jobTitle} error={!!errors.jobTitle} size="compact"
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                />
                {errors.jobTitle && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.jobTitle}</p>}
              </div>

              <div className="md:col-span-2 relative pb-[14px]">
                <InputField
                  label="Địa chỉ" icon={FaMapMarkerAlt} type="text" placeholder="Hà Nội"
                  value={registerData.address} error={!!errors.address} size="compact"
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
                {errors.address && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.address}</p>}
              </div>

              {/* Checkbox */}
              <div className="md:col-span-2 relative pb-1">
                <label className="flex items-center gap-2 cursor-pointer group w-max">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox" checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (errors.terms) setErrors(prev => ({ ...prev, terms: null }));
                        setGlobalError("");
                      }}
                      className="peer h-3.5 w-3.5 cursor-pointer appearance-none rounded border border-slate-300 shadow transition-all checked:border-emerald-500 checked:bg-emerald-500 hover:shadow-md"
                    />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 group-hover:text-slate-700 transition-colors select-none">
                    Tôi đồng ý với <a href="#" className="text-emerald-600 font-bold hover:underline">Điều khoản sử dụng</a>
                  </span>
                </label>
              </div>

              <div className="md:col-span-2 mt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full text-white py-2 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg transition-all transform overflow-hidden ${isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-[0.98]'}`}
                >
                  <span className="relative z-10">{isLoading ? 'Đang xử lý...' : 'Đăng Ký Ngay'}</span>
                  {!isLoading && <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700"></div>}
                </button>
              </div>
            </form>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;