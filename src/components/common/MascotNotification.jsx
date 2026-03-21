import { motion, AnimatePresence } from 'framer-motion';

const MascotNotification = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Đồng ý", 
    cancelText = "Bỏ qua",
    mascotIcon = "🦉" // Bạn có thể truyền icon hoặc url ảnh vào đây sau này
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                // 💥 FIX: Xóa bg và blur, thêm pointer-events-none để không chặn click ở nền
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                    
                    {/* Hiệu ứng Pop-up nhún nhảy */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                        // 💥 FIX: Thêm pointer-events-auto để cái form này vẫn nhận click bình thường
                        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center border-4 border-emerald-100 pointer-events-auto"
                    >
                        {/* Linh vật (Mascot) bay lơ lửng */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-emerald-300 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 border-4 border-white"
                        >
                            <span className="text-5xl">{mascotIcon}</span>
                        </motion.div>

                        <div className="mt-10">
                            <h3 className="text-xl font-extrabold text-slate-800 mb-2">{title}</h3>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                                {message}
                            </p>

                            <div className="flex flex-col gap-3">
                                {/* Nút Hành động chính */}
                                <button
                                    onClick={onConfirm}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-wide text-sm"
                                >
                                    {confirmText}
                                </button>
                                
                                {/* Nút Bỏ qua */}
                                <button
                                    onClick={onClose}
                                    className="w-full py-2 px-4 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 hover:text-slate-700 transition-colors active:scale-95 text-sm"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MascotNotification;