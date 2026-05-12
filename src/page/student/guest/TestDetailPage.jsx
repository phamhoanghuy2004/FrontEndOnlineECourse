import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaClock } from "react-icons/fa";
import { toast } from 'react-toastify';
import TestDetailHero from "../../../components/sections/student/guest/testDetail/TestSetHero";
import TestListSection from "../../../components/sections/student/guest/testDetail/TestList";
import testApi from '../../../api/testApi';

const TestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchTestSetDetail = async () => {
            try {
                setLoading(true);

                const response = await testApi.getTestSetDetail(id);

                const responseData = response.data;

                if (isMounted && responseData) {
                    setData(responseData);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Lỗi tải chi tiết bộ đề:", error.message);
                    toast.error(error.message || "Không thể tải dữ liệu bộ đề!");
                    setTimeout(() => {
                        navigate(-1, { replace: true });
                    }, 2000);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchTestSetDetail();
        } else {
            navigate('/tests');
        }

        return () => {
            isMounted = false;
        };
    }, [id, navigate]);


    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-emerald-600">
                <FaSpinner className="animate-spin text-5xl mb-4" />
                <span className="font-bold text-lg text-slate-600">Đang tải thông tin bộ đề...</span>
            </div>
        );
    }

    if (!data) return null;

    // =======================================================================
    // 🔴 2. LOGIC MỚI: TÌM BẤT KỲ SESSION NÀO ĐANG DANG DỞ TRONG LOCAL STORAGE
    // =======================================================================
    let activeTestSetId = null;
    let hasActiveSession = false;

    // Duyệt qua toàn bộ LocalStorage để tìm key bắt đầu bằng 'echill_session_'
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('echill_session_')) {
            hasActiveSession = true;
            // Bóc tách ID bộ đề từ chuỗi key (VD: từ 'echill_session_123' -> lấy '123')
            activeTestSetId = key.replace('echill_session_', '');
            break; // Chỉ có 1 phiên làm việc duy nhất, thấy rồi thì dừng vòng lặp luôn
        }
    }

    const handleContinueTest = () => {
        // 🔴 Điều hướng tới đúng cái bộ đề đang làm dở (Dù user đang đứng ở bộ đề khác)
        if (activeTestSetId) {
            navigate(`/test-practice/${activeTestSetId}`);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background giữ nguyên */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-teal-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="relative z-10 pb-20">

                <TestDetailHero data={data} />

                {/* 🔴 3. HIỂN THỊ CÓ ĐIỀU KIỆN TẠI ĐÂY */}
                {hasActiveSession ? (
                    <div id="continue-test-section" className="container mx-auto px-4 mt-12 max-w-2xl">
                        <div className="bg-white rounded-3xl shadow-xl shadow-amber-500/5 border-2 border-amber-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
                            {/* Hiệu ứng tia sáng trang trí nhẹ cho cái card */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300"></div>

                            <div className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-2">
                                {/* Dòng thông báo có hiệu ứng chấm nhấp nháy */}
                                <div className="flex items-center justify-center gap-2 text-sm font-bold text-amber-600 bg-amber-50/80 py-2.5 px-4 rounded-xl border border-amber-100">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                    </span>
                                    Bạn đang có bài kiểm tra dang dở!
                                </div>

                                <button
                                    onClick={handleContinueTest}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-[16px] shadow-xl shadow-amber-500/20 transform transition hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <FaClock className="text-xl" /> TIẾP TỤC LÀM BÀI
                                </button>

                                <p className="text-xs text-gray-400 font-medium mt-2">
                                    Thời gian vẫn đang được đếm lùi, hãy quay lại hoàn thành sớm nhé!
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* 🔴 4. NẾU KHÔNG CÓ SESSION THÌ HIỆN LIST TEST BÌNH THƯỜNG */
                    <TestListSection tests={data.tests} testSetId={data.id} />
                )}

            </div>
        </div>
    );
};

export default TestDetailPage;