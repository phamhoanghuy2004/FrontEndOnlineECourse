import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('processing');

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
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                {status === 'success' ? (
                    <>
                        <FiCheckCircle className="text-green-500 w-20 h-20 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
                        <p className="text-gray-500 mb-6">Khóa học đã được mở. Vui lòng kiểm tra mục "Khóa học của tôi".</p>
                    </>
                ) : (
                    <>
                        <FiXCircle className="text-red-500 w-20 h-20 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Giao dịch thất bại</h1>
                        <p className="text-gray-500 mb-6">Bạn đã hủy giao dịch hoặc có lỗi xảy ra. Chưa có khoản tiền nào bị trừ.</p>
                    </>
                )}
                <Link to="/courses" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors inline-block w-full">
                    Quay lại danh sách khóa học
                </Link>
            </div>
        </div>
    );
};

export default PaymentResultPage;