import { FaCheckCircle, FaCommentDots } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../hooks/useAuth';
import { useChat } from '../../../../../context/ChatContext';
import chatApi from '../../../../../api/chatApi';
import { toast } from 'react-hot-toast';

const CourseSidebar = ({ course, isRegistered }) => {
    const navigate = useNavigate();

    const { user } = useAuth();
    const { setActiveConversation } = useChat();

    // Format tiền VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleConsultation = async () => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để nhận tư vấn");
            navigate('/login');
            return;
        }

        if (!course.teacherId) {
            toast.error("Không tìm thấy thông tin giảng viên");
            return;
        }

        try {
            const response = await chatApi.createOrGetConversation(course.teacherId, user.id);
            setActiveConversation(response.data);
            navigate(`/learner/${user.id}/chat`);
        } catch (error) {
            console.error("Lỗi khi kết nối tư vấn:", error);
            toast.error("Không thể kết nối với giảng viên lúc này");
        }
    };

    return (
        <div className="sticky top-28 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

                <div className="mb-6 rounded-2xl overflow-hidden shadow-sm border border-slate-100 aspect-video">
                    <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="text-center mb-6 border-b border-slate-100 pb-6">
                    {course.originalPrice > course.price && (
                        <p className="text-slate-400 text-sm line-through mb-1 font-medium">
                            {formatPrice(course.originalPrice)}
                        </p>
                    )}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-4xl font-extrabold text-primary">
                            {course.price === 0 ? "MIỄN PHÍ" : formatPrice(course.price)}
                        </span>
                    </div>

                    {!isRegistered ? (
                        <button onClick={() => navigate(`/checkout?ids=${course.id}`)} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg hover:bg-green-600 transition-all transform hover:-translate-y-1 block">
                            Đăng ký học ngay
                        </button>
                    ) : (
                        <button className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:bg-slate-900 transition-all block">
                            Tiếp tục học thuật
                        </button>
                    )}
                    
                    <button 
                        onClick={handleConsultation}
                        className="w-full mt-3 bg-white text-emerald-600 border-2 border-emerald-600 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                    >
                        <FaCommentDots /> Nhận tư vấn từ giảng viên
                    </button>
                    
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" size={18} />
                        <span>Sở hữu khóa học trọn đời</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" size={18} />
                        <span>Học mọi lúc, mọi nơi</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" size={18} />
                        <span>Đạt target khi hoàn thành</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSidebar;