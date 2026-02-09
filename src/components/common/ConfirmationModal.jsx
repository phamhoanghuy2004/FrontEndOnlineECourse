import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import Button from './Button';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Xác nhận hành động',
    message = 'Bạn có chắc chắn muốn thực hiện hành động này không?',
    confirmText = 'Xác nhận',
    cancelText = 'Hủy bỏ',
    variant = 'danger' // danger, warning, info
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: {
            icon: 'text-red-500',
            bg: 'bg-red-100',
            button: '!bg-red-500 hover:!bg-red-600 !shadow-red-500/30'
        },
        warning: {
            icon: 'text-orange-500',
            bg: 'bg-orange-100',
            button: '!bg-orange-500 hover:!bg-orange-600 !shadow-orange-500/30'
        },
        info: {
            icon: 'text-blue-500',
            bg: 'bg-blue-100',
            button: '!bg-blue-500 hover:!bg-blue-600 !shadow-blue-500/30'
        }
    };

    const colorScheme = colors[variant] || colors.danger;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full ${colorScheme.bg} flex items-center justify-center flex-shrink-0`}>
                                <FaExclamationTriangle className={`text-xl ${colorScheme.icon}`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <Button variant="secondary" onClick={onClose} className="!py-2 !px-4 !text-sm">
                            {cancelText}
                        </Button>
                        <Button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`!py-2 !px-4 !text-sm text-white ${colorScheme.button}`}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
