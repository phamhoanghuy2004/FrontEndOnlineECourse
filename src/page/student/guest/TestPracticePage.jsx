import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaArrowLeft, FaChevronLeft, FaChevronRight, FaSpinner } from "react-icons/fa";
import SingleQuestionBlock from '../../../components/common/student/guest/testPractice/SingleQuestionBlock';
import GroupQuestionBlock from '../../../components/common/student/guest/testPractice/GroupQuestionBlock';
import testApi from '../../../api/testApi';
import { toast } from 'react-toastify';

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TestPracticePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 🟢 DÙNG useSearchParams ĐỂ LẤY testId (Tùy chọn)
    const [searchParams] = useSearchParams();

    // 🔴 1. HỨNG DỮ LIỆU selectedParts TỪ MODAL TRUYỀN SANG
    const location = useLocation();
    const selectedParts = location.state?.selectedParts || [];

   // 🟢 REFACTOR TÊN BIẾN CHO CHUẨN XÁC
    const testSetId = id; 
    const specificTestId = searchParams.get("testId"); // Sẽ là null nếu không truyền trên URL

    const [testData, setTestData] = useState(null);
    const [filteredParts, setFilteredParts] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [flaggedQuestions, setFlaggedQuestions] = useState({});

    const [sessionId, setSessionId] = useState(null);

    const [timeLeft, setTimeLeft] = useState(0);
    const endTimeRef = useRef(null);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [showResultModal, setShowResultModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const [showFinalResultModal, setShowFinalResultModal] = useState(false);
    const [testResult, setTestResult] = useState(null);

    // 🟢 ĐỔI KEY STORAGE THEO testSetId (Nếu muốn lưu riêng rẽ từng bài test thì nối thêm specificTestId)
    const STORAGE_ANSWERS_KEY = `echill_answers_${testSetId}`;
    const STORAGE_ENDTIME_KEY = `echill_endtime_${testSetId}`;
    const STORAGE_SESSION_KEY = `echill_session_${testSetId}`;

    useEffect(() => {
        let isMounted = true;

        if (!testSetId) {
            navigate(-1, { replace: true });
            return;
        }

        const fetchTestPractice = async () => {
            try {
                setLoading(true);

                // 🔴 2. BIẾN MẢNG [1, 2] THÀNH CHUỖI "1,2" ĐỂ GỬI LÊN BACKEND
                const partsParam = selectedParts.length > 0 ? selectedParts.join(',') : null;

                // 🔴 3. TRUYỀN THÊM partsParam VÀO HÀM GỌI API
                const response = await testApi.getRandomTest(testSetId, specificTestId, partsParam);

                const beTest = response.data?.data || response.data;

                if (beTest && isMounted) {
                    setTestData(beTest);
                    setSessionId(beTest.sessionId);
                    localStorage.setItem(STORAGE_SESSION_KEY, beTest.sessionId)

                    let globalQuestionCounter = 1;
                    const formattedParts = beTest.sections.map((section, index) => {
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

                    const localAnswers = JSON.parse(localStorage.getItem(STORAGE_ANSWERS_KEY) || '{}');
                    if (Object.keys(localAnswers).length > 0) {
                        setUserAnswers(localAnswers);
                        toast.info("Đã phục hồi đáp án bạn đang làm dở.");
                    }

                    let savedEndTime = localStorage.getItem(STORAGE_ENDTIME_KEY);

                    if (savedEndTime) {
                        const remaining = Math.floor((parseInt(savedEndTime) - Date.now()) / 1000);
                        if (remaining > 0) {
                            endTimeRef.current = parseInt(savedEndTime);
                            setTimeLeft(remaining);
                        } else {
                            endTimeRef.current = Date.now();
                            setTimeLeft(0);
                        }
                    } else {
                        const totalSeconds = (beTest.durationMinutes || 120) * 60;
                        const newEndTime = Date.now() + (totalSeconds * 1000);
                        endTimeRef.current = newEndTime;
                        localStorage.setItem(STORAGE_ENDTIME_KEY, newEndTime.toString());
                        setTimeLeft(totalSeconds);
                    }
                }
            } catch (error) {
                if (isMounted) {
                    if (error?.code === 1057) {
                        toast.warning("Phiên làm bài đã kết thúc, hệ thống đang nộp bài...");
                        const localAnswers = JSON.parse(localStorage.getItem(STORAGE_ANSWERS_KEY) || '{}');
                        const savedSessionId = localStorage.getItem(STORAGE_SESSION_KEY);
                        if (savedSessionId) {
                            handleFinalSubmit(savedSessionId, localAnswers);
                        } else {
                            toast.error("Không tìm thấy phiên làm bài để nộp.");
                            // Delay 2s để user kịp thấy thông báo trước khi văng
                            setTimeout(() => navigate(-1, { replace: true }), 2000);
                        }
                    } 
                    else if (error?.code === 1068 || error?.response?.data?.code === 1068) {
                        // Ưu tiên lấy error.data, nếu không có thì lấy message mặc định
                        const errorMsg = error?.data || error?.response?.data?.message || error?.message || "Bạn đang có bài thi khác chưa hoàn thành!";
                        toast.error(errorMsg, { autoClose: 4000 }); // Cho hiển thị lâu hơn xíu để đọc
                        
                        // Trì hoãn 3.5 giây để user đọc kịp tên bài thi cũ đang làm dở
                        setTimeout(() => {
                            navigate(-1, { replace: true });
                        }, 3500);
                    }
                    else {
                        console.error("Lỗi tải đề thi:", error);
                        toast.error(error?.message || "Không thể vào thi. Vui lòng thử lại sau!");
                        // Trì hoãn 2.5 giây trước khi văng ra ngoài
                        setTimeout(() => {
                            navigate(-1, { replace: true });
                        }, 2500);
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTestPractice();

        return () => {
            isMounted = false;
        };

    }, [testSetId, specificTestId, navigate]);


    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timerId = setInterval(() => {
                const now = Date.now();
                const remaining = Math.ceil((endTimeRef.current - now) / 1000);

                if (remaining <= 0) {
                    setTimeLeft(0);
                    clearInterval(timerId);
                } else {
                    setTimeLeft(remaining);
                }
            }, 1000);

            return () => clearInterval(timerId);

        } else if (timeLeft <= 0 && !isSubmitted && testData) {
            setIsSubmitted(true);
            setShowResultModal(false);
            handleFinalSubmit();
        }
    }, [timeLeft, isSubmitted, testData]);


    const handleSelectAnswer = (questionId, optionId) => {
        if (isSubmitted) return;

        const newAnswers = {
            ...userAnswers,
            [questionId]: optionId
        };

        setUserAnswers(newAnswers);

        localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(newAnswers));
    };

    const handleToggleFlag = (questionId) => {
        if (isSubmitted) return;
        setFlaggedQuestions(prev => ({ ...prev, [questionId]: !prev[questionId] }));
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

    const handleSubmit = () => {
        setShowResultModal(true);
    };

    const handleFinalSubmit = async (arg1, arg2) => {
        setIsSubmitted(true);
        setShowResultModal(false);

        const loadingToast = toast.loading("Đang nộp bài...");

        try {
            const isReactEvent = arg1 && typeof arg1 === 'object' && arg1.nativeEvent;

            const finalSessionId = (isReactEvent || !arg1) ? sessionId : arg1;
            const finalAnswers = (isReactEvent || !arg2) ? userAnswers : arg2;

            const response = await testApi.submitTest(finalSessionId, finalAnswers);

            localStorage.removeItem(STORAGE_ANSWERS_KEY);
            localStorage.removeItem(STORAGE_ENDTIME_KEY);
            localStorage.removeItem(STORAGE_SESSION_KEY);

            toast.update(loadingToast, { render: response.data?.message || "Nộp bài thành công!", type: "success", isLoading: false, autoClose: 3000 });

            setTestResult(response.data?.data || response.data);

            setShowFinalResultModal(true);

        } catch (error) {
            console.log(error);
            toast.update(loadingToast, { render: error.message || "Mất kết nối mạng hoặc lỗi máy chủ! Vui lòng thử F5 nộp lại.", type: "error", isLoading: false, autoClose: 5000 });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-emerald-600">
                <FaSpinner className="animate-spin text-5xl mb-4" />
                <span className="font-bold text-lg text-slate-600">Đang khởi tạo đề thi cho bạn...</span>
            </div>
        );
    }

    if (!testData || filteredParts.length === 0) return null;

    const currentPart = filteredParts[currentPartIndex];

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-28">

            <header className="sticky top-20 z-40 bg-white shadow-sm border-b border-gray-200 transition-all rounded-2xl mx-4 mt-4">
                <div className="container mx-auto px-4 h-16 flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 line-clamp-1">{testData.title}</h1>
                        </div>
                    </div>

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

                    <div className="flex items-center gap-4 md:gap-6">
                        <div className={`flex items-center gap-2 text-xl font-mono font-bold px-3 py-1 rounded-lg ${timeLeft <= 300 ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
                            <FaClock className={timeLeft <= 300 && !isSubmitted ? 'animate-pulse' : ''} />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitted}
                            className={`hidden md:block px-6 py-2 rounded-full font-bold text-white transition-all shadow-lg
                                ${isSubmitted ? 'bg-gray-400 cursor-not-allowed hidden' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/30 active:scale-95'}
                            `}
                        >
                            Nộp bài
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-6">

                <div className="flex-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                        <div className="bg-emerald-50/50 px-6 py-5 border-b border-emerald-100">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-extrabold text-emerald-800">{currentPart.name} {currentPart.title ? `: ${currentPart.title}` : ''}</h2>
                                <span className="bg-white text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 text-emerald-600 shadow-sm">
                                    {currentPart.questionCount} câu hỏi
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 select-none">{currentPart.description}</p>
                        </div>

                        <div className="p-6 space-y-8">
                            {currentPart.groups && currentPart.groups.map((group) => (
                                <GroupQuestionBlock
                                    key={group.id}
                                    group={group}
                                    type={testData.type}
                                    userAnswers={userAnswers}
                                    flaggedQuestions={flaggedQuestions}
                                    onSelect={handleSelectAnswer}
                                    onToggleFlag={handleToggleFlag}
                                    isSubmitted={isSubmitted}
                                />
                            ))}
                            {currentPart.questions && currentPart.questions.map((question) => (
                                <SingleQuestionBlock
                                    key={question.id}
                                    question={question}
                                    type={testData.type}
                                    userAnswers={userAnswers}
                                    flaggedQuestions={flaggedQuestions}
                                    onSelect={handleSelectAnswer}
                                    onToggleFlag={handleToggleFlag}
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
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
                                    ${isSubmitted ? 'hidden' : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200'}
                                `}
                            >
                                <FaCheckCircle /> Nộp bài thi
                            </button>
                        )}
                    </div>
                </div>

                <div className="lg:w-72 flex-shrink-0">
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

                                        <div className="grid grid-cols-5 gap-1">
                                            {part.allQuestions.map((q) => {
                                                const isAnswered = !!userAnswers[q.id];
                                                const isFlagged = !!flaggedQuestions[q.id];
                                                const displayNum = q.displayNum;
                                                const isActivePart = pIndex === currentPartIndex;

                                                let btnClass = 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400';
                                                if (isFlagged) {
                                                    btnClass = 'bg-red-100 text-red-700 border-red-400 ring-1 ring-red-400';
                                                } else if (isAnswered) {
                                                    btnClass = 'bg-emerald-500 text-white border-emerald-500';
                                                }

                                                return (
                                                    <button
                                                        key={q.id}
                                                        onClick={() => scrollToQuestion(q.id, pIndex)}
                                                        className={`h-7 w-full rounded text-[10px] font-bold transition-all border
                                                            ${btnClass}
                                                            ${isActivePart && !isAnswered && !isFlagged ? 'ring-1 ring-emerald-400 bg-emerald-50' : ''}
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

            {showResultModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/30 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp border border-gray-100">
                        <div className="bg-emerald-600 p-8 text-center text-white relative overflow-hidden">
                            <FaCheckCircle className="text-6xl mx-auto mb-4 opacity-90" />
                            <h2 className="text-3xl font-extrabold mb-2">Xác nhận nộp bài?</h2>
                            <p className="opacity-90 mt-2 text-emerald-50 bg-emerald-700/50 py-1.5 px-4 rounded-full inline-block font-medium animate-pulse">
                                ⚠️ Thời gian còn lại vẫn đang đếm lùi
                            </p>
                        </div>

                        <div className="p-8 text-center">
                            <p className="text-gray-600 font-medium mb-6">
                                Bạn đã hoàn thành <span className="font-bold text-emerald-600">{Object.keys(userAnswers).length}</span> câu trả lời.
                                Bấm "Nộp bài ngay" để đóng băng kết quả.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowResultModal(false)}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                                >
                                    Quay lại làm tiếp
                                </button>
                                <button
                                    onClick={handleFinalSubmit}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                                >
                                    Nộp bài ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Hiển thị kết quả cuối cùng */}
            {showFinalResultModal && testResult && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp border border-gray-100">
                        <div className={`p-8 text-center text-white ${testResult.isPassed ? 'bg-emerald-600' : 'bg-red-500'}`}>
                            <FaCheckCircle className="text-6xl mx-auto mb-4 opacity-90" />
                            <h2 className="text-3xl font-extrabold mb-2">{testResult.isPassed ? 'Chúc mừng!' : 'Chưa đạt!'}</h2>
                            <p className="opacity-90 mt-2 bg-black/20 py-1.5 px-4 rounded-full inline-block font-medium">
                                {testResult.message || (testResult.isPassed ? 'Bạn đã vượt qua bài thi' : 'Bạn chưa vượt qua bài thi')}
                            </p>
                        </div>

                        <div className="p-8">
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-600 font-medium">Điểm số:</span>
                                    <span className={`text-2xl font-bold ${testResult.isPassed ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {testResult.score} đ
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-600 font-medium">Số câu đúng:</span>
                                    <span className="font-bold text-gray-800">{testResult.correctAnswers} / {testResult.totalQuestions}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-600 font-medium">Trạng thái nộp:</span>
                                    <span className={`font-bold ${testResult.isLate ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {testResult.isLate ? 'Nộp trễ (0đ)' : 'Đúng giờ'}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/test-results/${testResult.resultId}/review`, { state: { fromSubmit: true } })}
                                className="w-full py-4 rounded-xl font-bold text-white bg-gray-800 hover:bg-gray-900 shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <FaArrowLeft /> Đi đến trang xem kết quả
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestPracticePage;