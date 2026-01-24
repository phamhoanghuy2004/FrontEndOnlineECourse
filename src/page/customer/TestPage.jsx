import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaClock, FaListOl, FaCheckCircle, FaTimesCircle, FaFlag, FaArrowLeft, FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { testSets } from "../../data/mockData";

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
                                                const displayNum = q.id.replace(/\D/g, ''); 
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
            {isSubmitted && result && (
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
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                            <button onClick={() => navigate('/testPractice')} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100">Thoát</button>
                            <button onClick={() => navigate(0)} className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">Làm lại</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ... (Giữ nguyên các component con SingleQuestionBlock và GroupQuestionBlock như cũ) ...
const SingleQuestionBlock = ({ question, type, userAnswers, onSelect, isSubmitted }) => {
    const optionsLabel = ['A', 'B', 'C', 'D'];
    return (
        <div id={`question-${question.id}`} className="flex flex-col gap-4">
            <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 font-bold rounded-full text-sm">{question.id.replace(/\D/g, '')}</span>
                <div className="flex-1 pt-1">
                    {question.image && <div className="mb-4 max-w-md rounded-lg overflow-hidden border border-gray-200"><img src={question.image} alt="Question" className="w-full h-auto" /></div>}
                    {question.audio && <div className="mb-4 bg-gray-100 p-2 rounded-full w-fit"><audio controls className="h-8 w-64"><source src={question.audio} type="audio/mpeg" /></audio></div>}
                    {question.text && <p className="font-medium text-gray-800 mb-3 text-lg">{question.text}</p>}
                    <div className="space-y-2">
                        {question.options.map((opt, idx) => {
                            const label = optionsLabel[idx];
                            const isSelected = userAnswers[question.id] === label;
                            let resultClass = "";
                            if (isSubmitted) {
                                if (question.correctAnswer === label) resultClass = "bg-green-100 border-green-500 text-green-700"; 
                                else if (isSelected && question.correctAnswer !== label) resultClass = "bg-red-50 border-red-500 text-red-700"; 
                            }
                            return (
                                <label key={idx} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-gray-50 ${isSelected && !isSubmitted ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200'} ${resultClass}`}>
                                    <input type="radio" name={question.id} className="hidden" disabled={isSubmitted} checked={isSelected} onChange={() => onSelect(question.id, label)} />
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-gray-500'} ${isSubmitted && question.correctAnswer === label ? '!bg-green-600 !border-green-600 !text-white' : ''} ${isSubmitted && isSelected && question.correctAnswer !== label ? '!bg-red-500 !border-red-500 !text-white' : ''}`}>{label}</div>
                                    <span className="text-sm md:text-base">{opt}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const GroupQuestionBlock = ({ group, type, userAnswers, onSelect, isSubmitted }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-8 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="lg:w-1/2 bg-gray-50/50 p-5 rounded-xl border border-gray-200 h-fit">
                {group.audio && <div className="mb-4"><div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-500 uppercase tracking-wide"><FaPlay size={10} /> Audio đoạn hội thoại</div><audio controls className="w-full h-10 rounded-lg"><source src={group.audio} type="audio/mpeg" /></audio></div>}
                {group.passageContent && <div className="prose prose-sm text-gray-700 bg-white p-4 rounded-lg shadow-sm border border-gray-100">{group.passageTitle && <h4 className="font-bold mb-2">{group.passageTitle}</h4>}<div dangerouslySetInnerHTML={{ __html: group.passageContent }}></div></div>}
                {isSubmitted && group.script && <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200 whitespace-pre-line"><strong>Transcript:</strong><br/>{group.script}</div>}
            </div>
            <div className="lg:w-1/2 space-y-8">
                {group.questions.map((question) => <SingleQuestionBlock key={question.id} question={question} type={type} userAnswers={userAnswers} onSelect={onSelect} isSubmitted={isSubmitted} />)}
            </div>
        </div>
    );
};

export default TestPracticePage;