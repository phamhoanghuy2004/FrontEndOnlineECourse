import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaUserCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import { completeProfileApi } from '../../api/userApi';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ address: '', dob: '', jobTitle: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileData.address || !profileData.dob || !profileData.jobTitle) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem("token");
      await completeProfileApi(token, profileData);
      
      // Update local storage user fake data or refetch real info here if needed
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        currentUser.address = profileData.address;
        currentUser.dob = profileData.dob;
        currentUser.jobTitle = profileData.jobTitle;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }
      
      navigate('/');
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
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
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/10 border border-white/50 p-8">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-3">
                <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-40 rounded-full transform scale-110"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 mx-auto">
                  <FaUserCheck className="text-white text-2xl drop-shadow-sm" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-2">Hoàn Tất Hồ Sơ</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Cập nhật thông tin để có trải nghiệm tốt nhất</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-4 py-3 rounded-lg mb-5 text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                label="Địa chỉ"
                icon={FaMapMarkerAlt}
                type="text"
                required={true}
                placeholder="Nhập địa chỉ của bạn"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              />

              <InputField
                label="Ngày sinh"
                icon={FaCalendarAlt}
                type="date"
                required={true}
                value={profileData.dob}
                onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
              />

              <InputField
                label="Nghề nghiệp"
                icon={FaBriefcase}
                type="text"
                required={true}
                placeholder="Học sinh, Sinh viên, Người đi làm..."
                value={profileData.jobTitle}
                onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
              />

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:shadow-emerald-600/40 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden mt-6"
              >
                <span className="relative z-10">
                  {loading ? "Đang cập nhật..." : "Lưu Thông Tin"}
                </span>
                {!loading && <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700"></div>}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
