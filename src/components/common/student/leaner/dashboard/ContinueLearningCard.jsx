import { motion } from 'framer-motion';
import { FaPlay, FaClock } from 'react-icons/fa';
import { hoverSpring } from '../../../../../constants/motionVariants';
import Button from '../../../Button'; // Button của bạn
import ProgressBar from '../../../../common/ProgressBar';
import { useNavigate } from 'react-router-dom';

const ContinueLearningCard = () => {
   // Đặt biến để dễ quản lý dữ liệu sau này
   const progressValue = 35;
   const navigate = useNavigate();
   const courseId = 1; // Giả định ID khóa học cần điều hướng tới là 1

   // 3. Hàm xử lý điều hướng chung
   const handleNavigate = () => {
      navigate(`/courses/${courseId}`);
   };

   return (
      <motion.div
         whileHover={hoverSpring}
         className="bg-white rounded-[2rem] p-5 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row gap-6 items-center"
      >
         {/* Thumbnail Video */}
         <div className="relative w-full md:w-56 h-36 rounded-2xl overflow-hidden group flex-shrink-0">
            <img
               src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
               alt="Lesson"
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
               <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-emerald-600 shadow-lg cursor-pointer transform group-hover:scale-110 transition-all">
                  <FaPlay className="ml-1" />
               </div>
            </div>
         </div>

         {/* Info */}
         <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Học thử</span>
               <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <FaClock size={10} /> 45:00
               </span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
               Bài 1: Giới thiệu về TOEIC và các thì cơ bản
            </h3>

            {/* --- 2. SỬ DỤNG PROGRESS BAR TÁI SỬ DỤNG --- */}
            <ProgressBar
               value={progressValue}
               max={100}
               height="h-2" // Chỉnh độ cao nhỏ lại cho hợp với card này
               trackColor="bg-slate-100" // Màu nền xám nhạt
               fillColor="bg-emerald-500" // Màu xanh
               className="mb-2" // Margin bottom
            />

            <p className="text-xs text-slate-400">
               Đã hoàn thành {progressValue}%
            </p>

            <div className="mt-4 flex gap-3">
               {/* 4. Gắn hàm handleNavigate vào 2 nút */}
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