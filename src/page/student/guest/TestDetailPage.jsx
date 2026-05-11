import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
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

    return (
        <div className="relative min-h-screen w-full overflow-hidden">

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-teal-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="relative z-10 pb-20"> 
                
                <TestDetailHero data={data} />
                
                <TestListSection tests={data.tests} />
                
            </div>

        </div>
    );
};

export default TestDetailPage;