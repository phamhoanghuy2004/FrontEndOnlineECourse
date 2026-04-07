import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from "../../../hooks/useAuth";

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('processing');
    const { user } = useAuth();

    useEffect(() => {
        // Lấy mã phản hồi từ URL mà VNPAY gắn vào
        const responseCode = searchParams.get('vnp_ResponseCode');

        if (responseCode === '00') {
            setStatus('success');
        } else if (responseCode) {
            setStatus('failed');
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-100">
                {status === 'success' ? (
                    <>
                        <FiCheckCircle className="text-green-500 w-20 h-20 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
                        <p className="text-gray-500 mb-8">Khóa học đã được mở. Chúc bạn có những giờ học tập thật hiệu quả cùng Echill.</p>

                        {/* 💥 NÚT ĐIỀU HƯỚNG: THÀNH CÔNG -> VÀO HỌC NGAY */}
                        <Link
                            to={user ? `/learner/${user.id}/courses` : "/login"}
                            className="bg-primary text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-green-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 inline-block w-full"
                        >
                            Đến khóa học của tôi
                        </Link>
                    </>
                ) : (
                    <>
                        <FiXCircle className="text-red-500 w-20 h-20 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Giao dịch thất bại</h1>

                        {/* 💥 CÂU CHỮ CHĂM SÓC KHÁCH HÀNG */}
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Rất tiếc giao dịch của bạn không thành công. Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ qua tin nhắn để được giải quyết nhanh nhất.
                        </p>

                        <div className="space-y-3">
                            {/* 💥 NÚT ĐIỀU HƯỚNG: THẤT BẠI -> VỀ DANH SÁCH MUA SẮM */}
                            <Link
                                to="/courses"
                                className="bg-slate-800 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-900 shadow-md transition-all inline-block w-full"
                            >
                                Quay lại danh sách khóa học
                            </Link>

                            {/* Nút phụ: Liên hệ hỗ trợ */}
                            <Link
                                to={user ? `/learner/${user.id}/chat` : "/login"}
                                className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-primary font-medium transition-colors py-2"
                            >
                                <FiMessageCircle size={20} />
                                Nhắn tin cho CSKH
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentResultPage;