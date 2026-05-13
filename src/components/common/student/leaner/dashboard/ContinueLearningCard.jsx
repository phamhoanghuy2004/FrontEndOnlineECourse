import { motion } from 'framer-motion';
import { FaPlay, FaBookOpen } from 'react-icons/fa';
import { hoverSpring } from '../../../../../constants/motionVariants';
import Button from '../../../Button';
import ProgressBar from '../../../../common/ProgressBar';
import { useNavigate } from 'react-router-dom';

// 🔴 Nhận thêm prop 'userId'
const ContinueLearningCard = ({ course, userId }) => {
   const navigate = useNavigate();

   // 🔴 CẬP NHẬT ROUTE MỚI: /learner/{userId}/study-room/{courseId}
   const handleNavigate = () => {
      if (course?.courseId && userId) {
         navigate(`/learner/${userId}/study-room/${course.courseId}`); 
      }
   };

   return (
      <motion.div
         whileHover={hoverSpring}
         className="bg-white rounded-[2rem] p-5 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row gap-6 items-center"
      >
         {/* 🔴 KHÔI PHỤC ẢNH KHÓA HỌC: Bọc trong background xám đề phòng ảnh load chậm */}
         <div className="relative w-full md:w-56 h-36 rounded-2xl overflow-hidden group flex-shrink-0 bg-slate-100">
            {course.courseImageUrl ? (
               <img
                  src={course.courseImageUrl}
                  alt={course.courseName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
               />
            ) : (
               // 🔴 BACKUP UI: Lỡ như khóa học đó quên up hình thì vẫn hiển thị cái nền gradient cho đẹp (Không bị vỡ layout)
               <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                  <FaBookOpen className="text-white/40 text-5xl" />
               </div>
            )}
            
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors flex items-center justify-center">
               <div 
                  onClick={handleNavigate} // 🔴 Cho phép click vào icon Play ở giữa ảnh luôn
                  className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-emerald-600 shadow-lg cursor-pointer transform group-hover:scale-110 transition-all"
               >
                  <FaPlay className="ml-1" />
               </div>
            </div>
         </div>

         {/* Info */}
         <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Đang học
               </span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
               {course.courseName}
            </h3>

            <ProgressBar
               value={course.progressPercent || 0}
               max={100}
               height="h-2"
               trackColor="bg-slate-100"
               fillColor="bg-emerald-500"
               className="mb-2"
            />

            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
               <p>Đã hoàn thành {course.progressPercent || 0}%</p>
               <p>{course.completedLessons || 0} / {course.totalLessons || 0} bài</p>
            </div>

            <div className="mt-4 flex gap-3">
               {/* 🔴 Hai nút bấm đã được cấu hình chạy chung hàm handleNavigate có chứa link mới */}
               <Button onClick={handleNavigate}>
                  Học tiếp
               </Button>
               <Button variant='outline' onClick={handleNavigate}>
                  Chi tiết
               </Button>
            </div>
         </div>
      </motion.div>
   );
};

export default ContinueLearningCard;