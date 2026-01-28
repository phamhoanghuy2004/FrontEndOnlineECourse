import { motion } from 'framer-motion';
import { FaPlay, FaClock } from 'react-icons/fa';

const ContinueLearning = () => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
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
         <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2">Bài 1: Giới thiệu về TOEIC và các thì cơ bản</h3>
         <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
             <div className="bg-emerald-500 h-full rounded-full w-[35%]"></div>
         </div>
         <p className="text-xs text-slate-400">Đã hoàn thành 35%</p>
         
         <div className="mt-4 flex gap-3">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/30">
                Học tiếp
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold py-2 px-4 rounded-xl transition-all">
                Chi tiết
            </button>
         </div>
      </div>
    </motion.div>
  );
};
export default ContinueLearning;