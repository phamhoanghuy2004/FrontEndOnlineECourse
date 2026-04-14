import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaSpinner, FaTrophy, FaClock } from "react-icons/fa";
import SingleQuestionBlock from '../../../components/common/student/guest/testPractice/SingleQuestionBlock';
import GroupQuestionBlock from '../../../components/common/student/guest/testPractice/GroupQuestionBlock';
import testApi from '../../../api/testApi';
import { toast } from 'react-toastify';

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TestReviewPage = () => {
    const { id } = useParams(); // resultId
    const navigate = useNavigate();
    const location = useLocation();

    const [reviewData, setReviewData] = useState(null);
    const [filteredParts, setFilteredParts] = useState([]);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviewDetail = async () => {
            try {
                setLoading(true);
                const response = await testApi.getTestReviewDetails(id);
                const data = response.data?.data || response.data;
                
                setReviewData(data);

                // Re-format các section y hệt lúc làm bài
                let globalQuestionCounter = 1;
                const formattedParts = data.testData.sections.map((section, index) => {
                    const groupsMap = new Map();
                    const standaloneQuestions = [];
                    const allQuestions = [];

                    section.questions.forEach(q => {
                        const feQuestion = { ...q, displayNum: globalQuestionCounter++ };
                        allQuestions.push(feQuestion);

                        if (q.group) {
                            if (!groupsMap.has(q.group.id)) {
                                groupsMap.set(q.group.id, { ...q.group, questions: [] });
                            }
                            groupsMap.get(q.group.id).questions.push(feQuestion);
                        } else {
                            standaloneQuestions.push(feQuestion);
                        }
                    });

                    return {
                        id: section.id,
                        name: section.title || `Part ${index + 1}`,
                        title: '',
                        description: section.instructions,
                        questionCount: section.questions.length,
                        groups: Array.from(groupsMap.values()),
                        questions: standaloneQuestions,
                        allQuestions: allQuestions
                    };
                });

                setFilteredParts(formattedParts);
            } catch (error) {
                console.error("Lỗi tải chi tiết:", error);
                toast.error("Không thể tải kết quả bài thi!");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchReviewDetail();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-emerald-600">
                <FaSpinner className="animate-spin text-5xl mb-4" />
                <span className="font-bold text-lg text-slate-600">Đang tải kết quả bài thi...</span>
            </div>
        );
    }

    if (!reviewData) return null;

    const { summary, testData, userAnswers } = reviewData;
    const currentPart = filteredParts[currentPartIndex];

    const handleGoBack = () => {
        if (location.state?.fromSubmit) {
            navigate(-2);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-28">
            
            {/* HEADER TỐI GIẢN */}
            <header className="sticky top-20 z-40 bg-white shadow-sm border-b border-gray-200 transition-all rounded-2xl mx-4 mt-4">
                <div className="container mx-auto px-4 h-16 flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={handleGoBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 line-clamp-1">Xem chi tiết: {summary.testTitle}</h1>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-xl no-scrollbar">
                        {filteredParts.map((part, index) => (
                            <button
                                key={part.id}
                                onClick={() => setCurrentPartIndex(index)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all
                                    ${currentPartIndex === index
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                                    }
                                `}
                            >
                                {part.name}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-6">

                {/* CỘT TRÁI: ĐỀ THI & GIẢI THÍCH */}
                <div className="flex-1 space-y-6">

                    {/* BẢNG TÓM TẮT ĐIỂM SỐ TRƯỚC KHI VÀO ĐỀ */}
                    {currentPartIndex === 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm ${summary.isPassed ? 'bg-emerald-100 text-emerald-500' : 'bg-red-100 text-red-500'}`}>
                                    <FaTrophy />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-bold uppercase">Tổng điểm</p>
                                    <p className={`text-3xl font-black ${summary.isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {summary.totalScore}
                                        <span className="text-sm font-bold text-gray-400 ml-2">({summary.isPassed ? 'ĐẠT' : 'KHÔNG ĐẠT'})</span>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 border-l border-gray-100 pl-6">
                                <div className="text-center">
                                    <p className="text-[11px] text-gray-400 font-bold uppercase mb-1">Nghe</p>
                                    <p className="font-bold text-gray-700">{summary.listeningScore || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] text-gray-400 font-bold uppercase mb-1">Đọc</p>
                                    <p className="font-bold text-gray-700">{summary.readingScore || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] text-gray-400 font-bold uppercase mb-1">Nói</p>
                                    <p className="font-bold text-gray-700">{summary.speakingScore || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] text-gray-400 font-bold uppercase mb-1">Viết</p>
                                    <p className="font-bold text-gray-700">{summary.writingScore || 0}</p>
                                </div>
                            </div>
                            
                            <div className="border-l border-gray-100 pl-6 text-center">
                                <p className="text-[11px] text-gray-400 font-bold uppercase mb-1">Thời gian làm bài</p>
                                <p className="font-bold text-blue-600 flex items-center gap-1 justify-center">
                                    <FaClock /> {formatTime(summary.timeTakenSeconds)}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                        <div className="bg-blue-50/50 px-6 py-5 border-b border-blue-100">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-extrabold text-blue-800">{currentPart.name} {currentPart.title ? `: ${currentPart.title}` : ''}</h2>
                            </div>
                            <p className="text-sm text-gray-600">{currentPart.description}</p>
                        </div>

                        <div className="p-6 space-y-8">
                            {currentPart.groups && currentPart.groups.map((group) => (
                                <GroupQuestionBlock
                                    key={group.id}
                                    group={group}
                                    type={testData.type}
                                    userAnswers={userAnswers}
                                    isReviewMode={true} 
                                />
                            ))}
                            {currentPart.questions && currentPart.questions.map((question) => (
                                <SingleQuestionBlock
                                    key={question.id}
                                    question={question}
                                    type={testData.type}
                                    userAnswers={userAnswers}
                                    isReviewMode={true} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* ĐIỀU HƯỚNG TRANG */}
                    <div className="flex justify-between items-center pt-4">
                        <button
                            onClick={() => {
                                setCurrentPartIndex(prev => prev - 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPartIndex === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentPartIndex === 0 ? 'opacity-0 pointer-events-none' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'}`}
                        >
                            <FaChevronLeft /> Quay lại
                        </button>

                        <button
                            onClick={() => {
                                setCurrentPartIndex(prev => prev + 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPartIndex === filteredParts.length - 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentPartIndex === filteredParts.length - 1 ? 'opacity-0 pointer-events-none' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}
                        >
                            Tiếp theo <FaChevronRight />
                        </button>
                    </div>
                </div>

                {/* CỘT PHẢI: PHIẾU ĐÁP ÁN TÔ MÀU */}
                <div className="lg:w-72 flex-shrink-0">
                    <div className="sticky top-40 space-y-4">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col max-h-[calc(100vh-180px)]">
                            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 flex items-center justify-between">
                                <span>Kết quả chi tiết</span>
                            </div>

                            <div className="p-3 overflow-y-auto custom-scrollbar flex-1">
                                {filteredParts.map((part, pIndex) => (
                                    <div key={part.id} className="mb-4">
                                        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                            {part.name}
                                        </h4>

                                        <div className="grid grid-cols-5 gap-1">
                                            {part.allQuestions.map((q) => {
                                                const selectedId = userAnswers?.[q.id] || userAnswers?.[q.id?.toString()];
                                                // 💥 CHỐT CHẶN BÊN PHẢI: Bắt cả isCorrect và correct
                                                const correctAns = q.answers?.find(a => a.isCorrect === true || a.correct === true);
                                                
                                                let btnClass = 'bg-gray-100 text-gray-400 border-transparent'; 
                                                
                                                if (selectedId) {
                                                    // 💥 ÉP CHUỖI ĐỂ SO SÁNH TRÁNH LỖI JS
                                                    if (correctAns && selectedId?.toString() === correctAns.id?.toString()) {
                                                        btnClass = 'bg-emerald-500 text-white border-emerald-500 shadow-sm'; // Đúng
                                                    } else {
                                                        btnClass = 'bg-red-500 text-white border-red-500 shadow-sm'; // Sai
                                                    }
                                                }

                                                const isActivePart = pIndex === currentPartIndex;

                                                return (
                                                    <button
                                                        key={q.id}
                                                        onClick={() => {
                                                            setCurrentPartIndex(pIndex);
                                                            setTimeout(() => {
                                                                const el = document.getElementById(`question-${q.id}`);
                                                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                            }, 100);
                                                        }}
                                                        className={`h-7 w-full rounded text-[10px] font-bold transition-all border ${btnClass} ${isActivePart && !selectedId ? 'ring-1 ring-blue-300' : ''}`}
                                                    >
                                                        {q.displayNum}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestReviewPage;