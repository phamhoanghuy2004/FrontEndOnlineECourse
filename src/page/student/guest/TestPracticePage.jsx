import React, { useState, useEffect  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { testSets } from "../../../data/mockData";
import SingleQuestionBlock from '../../../components/common/student/guest/testPractice/SingleQuestionBlock';
import GroupQuestionBlock from '../../../components/common/student/guest/testPractice/GroupQuestionBlock';


// Helper: Format giây thành mm:ss
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TestPracticePage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { testId, selectedParts, mode } = location.state || {};

    const [testData, setTestData] = useState(null);
    const [filteredParts, setFilteredParts] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [showResultModal, setShowResultModal] = useState(false);

    // --- 1. KHỞI TẠO DỮ LIỆU ---
    useEffect(() => {
        if (!testId) {
            navigate('/');
            return;
        }

        let foundTest = null;
        for (const set of testSets) {
            const test = set.tests.find(t => t.id === testId);
            if (test) {
                foundTest = test;
                break;
            }
        }

        if (foundTest) {
            setTestData(foundTest);
            const selectedPartsIds = selectedParts || [];
            const parts = foundTest.parts.filter(p => selectedPartsIds.includes(p.id));
            setFilteredParts(parts);

            let totalSeconds = 0;
            if (foundTest.time) {
                totalSeconds = foundTest.time * 60;
            } else {
                totalSeconds = 120 * 60;
            }
            setTimeLeft(totalSeconds);
        }
    }, [testId, selectedParts, mode, navigate]);

    // --- 2. TIMER ---
    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timerId = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else if (timeLeft === 0 && !isSubmitted && testData) {
            handleSubmit();
        }
    }, [timeLeft, isSubmitted, testData]);

    // --- 3. LOGIC ---
    const handleSelectAnswer = (questionId, optionKey) => {
        if (isSubmitted) return;
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: optionKey
        }));
    };

    const scrollToQuestion = (questionId, partIndex) => {
        if (partIndex !== currentPartIndex) {
            setCurrentPartIndex(partIndex);
            setTimeout(() => {
                const element = document.getElementById(`question-${questionId}`);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            const element = document.getElementById(`question-${questionId}`);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setShowResultModal(true);
        let totalCorrect = 0;
        let totalQuestions = 0;
        const partResults = [];

        filteredParts.forEach(part => {
            let partCorrect = 0;
            let partTotal = 0;
            const processQuestions = (questions) => {
                questions.forEach(q => {
                    partTotal++;
                    const userAnswer = userAnswers[q.id];
                    if (userAnswer === q.correctAnswer) {
                        partCorrect++;
                    }
                });
            };
            if (part.groups) {
                part.groups.forEach(g => processQuestions(g.questions));
            } else if (part.questions) {
                processQuestions(part.questions);
            }
            totalCorrect += partCorrect;
            totalQuestions += partTotal;
            partResults.push({ id: part.id, name: part.name, correct: partCorrect, total: partTotal });
        });

        setResult({ score: totalCorrect, total: totalQuestions, details: partResults });
    };

    const handleNextPart = () => {
        if (currentPartIndex < filteredParts.length - 1) {
            setCurrentPartIndex(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPart = () => {
        if (currentPartIndex > 0) {
            setCurrentPartIndex(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (!testData || filteredParts.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const currentPart = filteredParts[currentPartIndex];

    return (
        // 1. THÊM pt-28 (padding top ~ 112px) ĐỂ ĐẨY TRANG XUỐNG DƯỚI NAVBAR CHÍNH
        <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-28">

            {/* --- HEADER (STICKY) --- */}
            {/* 2. SỬA top-0 THÀNH top-20 ĐỂ HEADER DÍNH BÊN DƯỚI NAVBAR CHÍNH KHI SCROLL */}
            <header className="sticky top-20 z-40 bg-white shadow-sm border-b border-gray-200 transition-all rounded-2xl mx-4 mt-4">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 line-clamp-1">{testData.title}</h1>
                        </div>
                    </div>

                    {/* Part Navigation */}
                    <div className="hidden lg:flex items-center gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-xl no-scrollbar">
                        {filteredParts.map((part, index) => (
                            <button
                                key={part.id}
                                onClick={() => setCurrentPartIndex(index)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all
                                    ${currentPartIndex === index
                                        ? 'bg-white text-emerald-600 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                                    }
                                `}
                            >
                                {part.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xl font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                            <FaClock className="animate-pulse" />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitted}
                            className={`hidden md:block px-6 py-2 rounded-full font-bold text-white transition-all shadow-lg
                                ${isSubmitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/30 active:scale-95'}
                            `}
                        >
                            Nộp bài
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-6">

                {/* --- LEFT CONTENT --- */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                        <div className="bg-emerald-50/50 px-6 py-5 border-b border-emerald-100">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-extrabold text-emerald-800">{currentPart.name}: {currentPart.title}</h2>
                                <span className="bg-white text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 text-emerald-600 shadow-sm">
                                    {currentPart.questionCount} câu hỏi
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{currentPart.description}</p>
                        </div>

                        <div className="p-6 space-y-8">
                            {currentPart.groups && currentPart.groups.map((group) => (
                                <GroupQuestionBlock
                                    key={group.id}
                                    group={group}
                                    type={currentPart.type}
                                    userAnswers={userAnswers}
                                    onSelect={handleSelectAnswer}
                                    isSubmitted={isSubmitted}
                                />
                            ))}
                            {currentPart.questions && currentPart.questions.map((question) => (
                                <SingleQuestionBlock
                                    key={question.id}
                                    question={question}
                                    type={currentPart.type}
                                    userAnswers={userAnswers}
                                    onSelect={handleSelectAnswer}
                                    isSubmitted={isSubmitted}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                        <button
                            onClick={handlePrevPart}
                            disabled={currentPartIndex === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                                ${currentPartIndex === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                                }
                            `}
                        >
                            <FaChevronLeft /> Quay lại
                        </button>

                        {currentPartIndex < filteredParts.length - 1 ? (
                            <button
                                onClick={handleNextPart}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                            >
                                Tiếp theo <FaChevronRight />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitted}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
                            >
                                <FaCheckCircle /> Nộp bài thi
                            </button>
                        )}
                    </div>
                </div>

                {/* --- RIGHT SIDEBAR --- */}
                <div className="lg:w-72 flex-shrink-0">
                    {/* 3. SỬA sticky top-24 THÀNH top-40 ĐỂ SIDEBAR CŨNG NÉ NAVBAR CHÍNH */}
                    <div className="sticky top-40 space-y-4">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col max-h-[calc(100vh-180px)]">
                            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 flex items-center justify-between">
                                <span>Phiếu trả lời</span>
                                <span className="text-xs font-normal text-gray-500">{Object.keys(userAnswers).length} đã làm</span>
                            </div>

                            <div className="p-3 overflow-y-auto custom-scrollbar flex-1">
                                {filteredParts.map((part, pIndex) => (
                                    <div key={part.id} className="mb-4">
                                        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                            {part.name}
                                        </h4>
                                        {/* 4. THU GỌN GRID: gap-1 và giảm size button */}
                                        <div className="grid grid-cols-5 gap-1">
                                            {(part.groups
                                                ? part.groups.flatMap(g => g.questions)
                                                : part.questions
                                            ).map((q) => {
                                                const isAnswered = !!userAnswers[q.id];
                                                const displayNum = q.id.replace(/\D/g, '');  // chổ này về sau có thể thay bằng thứ tự của câu hỏi nà
                                                const isActivePart = pIndex === currentPartIndex;

                                                return (
                                                    <button
                                                        key={q.id}
                                                        onClick={() => scrollToQuestion(q.id, pIndex)}
                                                        className={`h-7 w-full rounded text-[10px] font-bold transition-all border
                                                            ${isAnswered
                                                                ? 'bg-emerald-500 text-white border-emerald-500'
                                                                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'
                                                            }
                                                            ${isActivePart && !isAnswered ? 'ring-1 ring-emerald-400 bg-emerald-50' : ''}
                                                        `}
                                                    >
                                                        {displayNum}
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

            {/* Modal Kết Quả (Giữ nguyên) */}
            {showResultModal && result && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
                        <div className="bg-emerald-600 p-8 text-center text-white">
                            <h2 className="text-3xl font-extrabold mb-2">Kết quả bài làm</h2>
                            <div className="text-6xl font-black my-4">{result.score}<span className="text-2xl font-medium opacity-80">/{result.total}</span></div>
                            <p className="opacity-90">Bạn đã hoàn thành bài thi!</p>
                        </div>
                        <div className="p-6 max-h-[50vh] overflow-y-auto">
                            <h3 className="font-bold text-gray-700 mb-4">Chi tiết từng phần:</h3>
                            <div className="space-y-3">
                                {result.details.map(detail => (
                                    <div key={detail.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="font-medium text-gray-700">{detail.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-600 font-bold">{detail.correct}</span>
                                            <span className="text-gray-400">/</span>
                                            <span className="text-gray-600">{detail.total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                            <div className="flex gap-3">
                                <button onClick={() => navigate('/tests')} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100">Thoát</button>
                                <button onClick={() => navigate(0)} className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">Làm lại</button>
                            </div>
                            <button
                                onClick={() => setShowResultModal(false)}
                                className="w-full py-3 rounded-xl font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
                            >
                                Xem đáp án chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default TestPracticePage;