import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaUserCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import { completeProfileApi } from '../../api/userApi';
import { useAuth } from '../../hooks/useAuth'; // 💥 Đổi sang dùng useAuth cho đồng bộ

// ==========================================
// 1. TÁCH HÀM VALIDATION RA KHỎI COMPONENT
// ==========================================
const validateProfile = (data) => {
  const errors = {};

  if (!data.address.trim()) errors.address = "Địa chỉ không được để trống";
  if (!data.jobTitle.trim()) errors.jobTitle = "Nghề nghiệp không được để trống";

  if (!data.dob) {
    errors.dob = "Ngày sinh không được để trống";
  } else {
    const dobDate = new Date(data.dob);
    const today = new Date();
    if (dobDate >= today) errors.dob = "Ngày sinh phải ở trong quá khứ";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // 💥 Lấy hàm setUser từ hook

  const [profileData, setProfileData] = useState({ address: '', dob: '', jobTitle: '' });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
    // Xóa lỗi chữ đỏ khi user bắt đầu gõ
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    setGlobalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra validation (chặn từ Frontend)
    const { isValid, errors: validationErrors } = validateProfile(profileData);

    if (!isValid) {
      setErrors(validationErrors);
      setGlobalError("Vui lòng hoàn thiện thông tin");
      return;
    }

    // 2. Tiến hành gọi API
    setIsLoading(true);
    setErrors({});
    setGlobalError('');

    try {
      await completeProfileApi(profileData);

      // Update local storage user data
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        currentUser.address = profileData.address;
        currentUser.dob = profileData.dob;
        currentUser.jobTitle = profileData.jobTitle;

        setUser(currentUser);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }

      navigate('/');
    } catch (err) {
      setGlobalError(err || "Có lỗi xảy ra khi cập nhật hồ sơ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f0fdf4] flex items-center justify-center overflow-hidden font-sans relative pt-12">

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="w-full max-w-[450px] px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/50 p-6 md:p-8">

            {/* --- HEADER --- */}
            <div className="text-center mb-2">
              <div className="relative inline-block mb-3">
                <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-40 rounded-full transform scale-110"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 mx-auto">
                  <FaUserCheck className="text-white text-2xl drop-shadow-sm" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-2">Hoàn Tất Hồ Sơ</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Cập nhật thông tin để có trải nghiệm tốt nhất</p>
            </div>

            {/* Chừa sẵn không gian tĩnh (h-6) cho Error chung để form không bị giật */}
            <div className="h-6 mt-1 mb-2 text-center">
              {globalError && (
                <div className="text-[11px] text-red-500 bg-red-50 py-1 px-3 rounded border border-red-100 font-medium inline-block">
                  {globalError}
                </div>
              )}
            </div>

            {/* --- FORM --- */}
            <form onSubmit={handleSubmit} className="space-y-1">

              {/* Address Input */}
              <div className="relative pb-[14px]">
                <InputField
                  label="Địa chỉ"
                  icon={FaMapMarkerAlt}
                  type="text"
                  required={true}
                  size="compact"
                  placeholder="Nhập địa chỉ của bạn"
                  value={profileData.address}
                  error={!!errors.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
                {errors.address && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.address}</p>}
              </div>

              {/* DOB Input */}
              <div className="relative pb-[14px]">
                <InputField
                  label="Ngày sinh"
                  icon={FaCalendarAlt}
                  type="date"
                  required={true}
                  size="compact"
                  value={profileData.dob}
                  error={!!errors.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                />
                {errors.dob && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.dob}</p>}
              </div>

              {/* Job Title Input */}
              <div className="relative pb-[14px]">
                <InputField
                  label="Nghề nghiệp"
                  icon={FaBriefcase}
                  type="text"
                  required={true}
                  size="compact"
                  placeholder="Học sinh, Sinh viên, Người đi làm..."
                  value={profileData.jobTitle}
                  error={!!errors.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                />
                {errors.jobTitle && <p className="absolute bottom-0 left-1 text-red-500 text-[10px] leading-none whitespace-nowrap">{errors.jobTitle}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full text-white py-3 mt-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg transition-all transform overflow-hidden ${isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-[0.98]'}`}
              >
                <span className="relative z-10">
                  {isLoading ? "Đang cập nhật..." : "Lưu Thông Tin"}
                </span>
                {!isLoading && <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700"></div>}
              </button>
            </form>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;