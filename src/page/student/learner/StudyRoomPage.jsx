import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseApi from '../../../api/courseApi';
import CurriculumSidebar from '../../../components/common/learner/CurriculumSidebar';
import {
    FaArrowLeft, FaPlay, FaBookOpen, FaSpinner,
    FaFilePdf, FaFileWord, FaFilePowerpoint, FaDownload, FaTasks
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import HlsVideoPlayer from '../../../components/common/HlsVideoPlayer';

const StudyRoomPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [curriculumData, setCurriculumData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLessonId, setActiveLessonId] = useState(null);

    const [isStarting, setIsStarting] = useState(false);

    const [lessonDetail, setLessonDetail] = useState(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    // 💥 KHỞI TẠO REF ĐỂ MÓC VÀO CỘT TRÁI
    const leftColumnRef = useRef(null);

    const activeLesson = curriculumData?.lessons?.find(l => l.lessonId === activeLessonId);
    const activeLessonStatus = activeLesson?.status || 'NOT_STARTED';

    const [realtimeProgress, setRealtimeProgress] = useState(0);

    // 💥 [GÓC TECH LEAD]: Hàm hứng sự kiện "Hoàn thành 90% video" từ HlsVideoPlayer truyền lên
    const handleVideoComplete = async (lessonId) => {
        try {
            // Gọi API báo BE: "Ê tao xem xong 90% video rồi nhé"
            await courseApi.completeVideoProgress(lessonId);
            
            // 💥 CHECK LOGIC NGAY TRÊN FRONTEND
            // Kiểm tra xem bài học hiện tại có bài test không (Dựa vào state hoặc detail)
            const hasQuiz = activeLesson?.hasTest || lessonDetail?.testSet;

            if (hasQuiz) {
                // Kịch bản 1: CÓ TEST -> Chỉ thông báo xem xong video, giục làm test. KHÔNG đổi màu Sidebar.
                toast.success("🎬 Đã xem xong Video! Hãy làm bài tập bên dưới để hoàn thành bài học nhé.");
            } else {
                // Kịch bản 2: KHÔNG CÓ TEST -> Xem xong video là xong bài. Bắn pháo hoa và cập nhật Sidebar.
                toast.success("🎉 Chúc mừng! Bạn đã hoàn thành bài học này.");
                
                // Chỉ update icon Sidebar thành màu xanh khi thực sự đã xong bài học
                setCurriculumData(prev => {
                    const updated = prev.lessons.map(l => 
                        l.lessonId === lessonId ? { ...l, status: 'COMPLETED' } : l
                    );
                    return { ...prev, lessons: updated };
                });
            }

        } catch (error) {
            // BE chửi (400 Bad Request) vì chưa đủ 90% do tua lố -> Nuốt lỗi âm thầm
            console.warn("Chưa đủ điều kiện hoàn thành video (BE từ chối).", error);
        }
    };

    // Gọi API lấy Curriculum
    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                setLoading(true);
                const response = await courseApi.getCourseCurriculum(courseId);
                const data = response.data || response;
                setCurriculumData(data);

                if (data?.lessons?.length > 0) {
                    const lessonToPlay = data.lessons.find(l => l.status === 'IN_PROGRESS')
                        || data.lessons.find(l => l.status === 'NOT_STARTED')
                        || data.lessons[0];
                    setActiveLessonId(lessonToPlay.lessonId);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu phòng học:", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCurriculum();
        }
    }, [courseId]);

   // 💥 EFFECT 2: LOGIC GỌI API LẤY CHI TIẾT BÀI HỌC VÀ TIẾN ĐỘ REALTIME
    useEffect(() => {
        const fetchDetailAndProgress = async () => {
            if (!activeLessonId || activeLessonStatus === 'NOT_STARTED') return;

            try {
                setIsLoadingDetail(true);
                setLessonDetail(null);
                setRealtimeProgress(0); // Reset tiến độ cũ

                // 💥 [GÓC TECH LEAD]: Dùng Promise.all để gọi 2 API song song cực mượt
                // Mạng sẽ tải cả 2 cục data cùng 1 lúc -> Tiết kiệm 50% thời gian chờ
                const [detailResponse, progressResponse] = await Promise.all([
                    courseApi.getLessonDetailForStudy(activeLessonId),
                    courseApi.getCurrentProgress(activeLessonId)
                ]);

                // Xử lý data Detail
                const detailData = detailResponse.data || detailResponse;
                setLessonDetail(detailData);

                // Xử lý data Progress (Lấy từ Redis/DB)
                const progressData = progressResponse.data || progressResponse;
                // Nhớ check kỹ cấu trúc trả về của ApiResponse (thường data thực nằm trong property 'data')
                setRealtimeProgress(progressData); 

            } catch (error) {
                console.error("Lỗi khi tải chi tiết hoặc tiến độ:", error);
                toast.error("Không thể tải nội dung bài học. Vui lòng thử lại!");
            } finally {
                setIsLoadingDetail(false);
            }
        };

        fetchDetailAndProgress();
    }, [activeLessonId, activeLessonStatus]);

    // 💥 HIỆU ỨNG AUTO SCROLL LÊN ĐẦU KHI ĐỔI BÀI HỌC
    useEffect(() => {
        if (leftColumnRef.current) {
            leftColumnRef.current.scrollTo({
                top: 0,
                behavior: 'smooth' // Cuộn mượt mà trơn tru
            });
        }
    }, [activeLessonId]); // Kích hoạt mỗi khi activeLessonId thay đổi

    const handleStartLesson = async () => {
        if (!activeLessonId) return;

        try {
            setIsStarting(true);

            const response = await courseApi.startLesson(activeLessonId);
            const data = response.data || response;

            setCurriculumData(prevData => {
                const updatedLessons = prevData.lessons.map(lesson => {
                    if (lesson.lessonId === activeLessonId) {
                        return { ...lesson, status: data.status };
                    }
                    return lesson;
                });

                return { ...prevData, lessons: updatedLessons };
            });

            toast.success(data.message || "Bắt đầu bài học thành công!");

        } catch (error) {
            console.error("Lỗi khi bắt đầu bài học:", error);
            const errorMsg = error.response?.data?.message || error.message || "Không thể bắt đầu bài học!";
            toast.error(errorMsg);
        } finally {
            setIsStarting(false);
        }
    };

    // 💥 HÀM RENDER ICON TÀI LIỆU
    const renderFileIcon = (fileType) => {
        switch (fileType) {
            case 'PDF': return <FaFilePdf className="text-red-500 text-2xl" />;
            case 'WORD': return <FaFileWord className="text-blue-500 text-2xl" />;
            case 'POWERPOINT': return <FaFilePowerpoint className="text-orange-500 text-2xl" />;
            default: return <FaFilePdf className="text-slate-400 text-2xl" />;
        }
    };

    if (loading) {
        return <div className="h-full flex items-center justify-center text-slate-500 font-bold">Đang tải phòng học...</div>;
    }

    if (!curriculumData) {
        return <div className="h-full flex items-center justify-center text-red-500">Không tìm thấy dữ liệu khóa học!</div>;
    }

    // 💥 LỌC MÃ ĐỘC VÀ XÓA KHOẢNG TRẮNG CHO NỘI DUNG BÀI HỌC
    const cleanHTML = lessonDetail?.content
        ? DOMPurify.sanitize(lessonDetail.content.replace(/&nbsp;/g, ' '))
        : '';

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col font-sans selection:bg-emerald-200">

            {/* HEADER */}
            <div className="flex items-center mb-6 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-600 mr-4"
                >
                    <FaArrowLeft />
                </button>
                <h1 className="text-xl font-extrabold text-slate-800 truncate border-l-2 border-emerald-500 pl-4">
                    {curriculumData.courseName}
                </h1>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">

                {/* ================= CỘT TRÁI (KHU VỰC HỌC) ================= */}
                <div ref={leftColumnRef} className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-3xl border border-emerald-100/60 p-4 md:p-6 lg:p-8 flex flex-col gap-6 min-h-full relative overflow-hidden shadow-sm">
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none"></div>

                        {/* ================= KHU VỰC VIDEO ================= */}
                        {activeLessonStatus === 'NOT_STARTED' ? (
                            <div className="w-full aspect-video bg-black rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden shrink-0 group z-10">
                                <div className="text-center z-10">
                                    <span className="text-white font-bold text-lg opacity-60 block mb-6">Bạn chưa bắt đầu bài học này</span>
                                    <button
                                        onClick={handleStartLesson}
                                        disabled={isStarting}
                                        className={`flex items-center gap-2 mx-auto px-8 py-3.5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]
                                            ${isStarting ? 'bg-emerald-800 text-emerald-300 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105'}
                                        `}
                                    >
                                        {isStarting ? <><FaSpinner className="animate-spin text-sm" /> Đang xử lý...</> : <><FaPlay className="text-sm" /> Bắt đầu học bài này</>}
                                    </button>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                            </div>
                        ) : isLoadingDetail ? (
                            <div className="w-full aspect-video bg-slate-900 rounded-2xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden shrink-0 z-10 border border-slate-700">
                                <FaSpinner className="animate-spin text-emerald-500 text-4xl mb-4" />
                                <span className="text-emerald-400 font-bold text-lg animate-pulse">Đang tải dữ liệu bài học...</span>
                            </div>
                        ) : lessonDetail?.hlsUrl ? (
                            <div className="w-full aspect-video bg-black rounded-2xl shadow-lg relative overflow-hidden shrink-0 z-10 border border-slate-700/50">
                                <div className="absolute top-0 left-0 w-full h-full">
                                    {/* 💥 [GÓC TECH LEAD]: TRUYỀN PROPS CHO HLS VIDEO PLAYER */}
                                    <HlsVideoPlayer 
                                        url={lessonDetail.hlsUrl} 
                                        lessonId={activeLessonId}
                                        // Lấy số giây học dở từ curriculum list hoặc DB
                                        initialProgress={realtimeProgress}
                                        // Truyền duration để player tính Rule 90%
                                        duration={activeLesson?.durationSeconds || lessonDetail.durationSeconds}
                                        // Hàm callback khi pass 90%
                                        onComplete={handleVideoComplete}
                                    />
                                </div>
                            </div>
                        ) : (
                            // Không có HLS Url thì báo đang xử lý hoặc không có video
                            <div className="w-full aspect-video bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden shrink-0 z-10 border border-slate-700">
                                <span className="text-slate-400 font-bold text-lg">{lessonDetail?.videoStatus === 'PROCESSING' ? 'Video đang được xử lý...' : 'Bài học này không có Video'}</span>
                            </div>
                        )}

                        {/* ================= KHU VỰC CHI TIẾT (TEXT + DOCS + TEST) ================= */}
                        <div className="relative z-10 shrink-0 mb-4 px-2 md:px-4">

                            {/* 💥 LUÔN LUÔN HIỆN TÊN BÀI HỌC (Lấy từ state cục bộ, không cần chờ API 2) */}
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-emerald-950 flex items-center gap-3 mb-6">
                                <FaBookOpen className="text-emerald-500 text-2xl shrink-0" />
                                {activeLesson?.title || "Đang tải..."}
                            </h2>

                            {activeLessonStatus === 'NOT_STARTED' ? (
                                // 🔒 TRẠNG THÁI 1: CHƯA BẮT ĐẦU -> HIỆN TEXT CHÀO MỜI
                                <div className="mt-5 text-emerald-800/80 leading-relaxed font-medium text-[15px] bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20">
                                    <p>Nội dung bài học, tài liệu đính kèm, và bài test sẽ xuất hiện ở đây.</p>
                                    <p className="mt-2 opacity-80">
                                        Hãy bấm nút <strong className="text-emerald-700">"Bắt đầu học bài này"</strong> ở màn hình video phía trên để mở khóa toàn bộ nội dung và bắt đầu rèn luyện nhé!
                                    </p>
                                </div>

                            ) : isLoadingDetail ? (
                                // ⏳ TRẠNG THÁI 2: ĐANG TẢI API 2 -> HIỆN HIỆU ỨNG NHẤP NHÁY
                                <div className="mt-5 text-emerald-600/50 animate-pulse italic font-medium p-4">
                                    Đang tải nội dung chi tiết...
                                </div>

                            ) : lessonDetail ? (
                                // 🔓 TRẠNG THÁI 3: ĐÃ LOAD XONG -> ĐỔ DATA VÀO
                                <>
                                    {/* NỘI DUNG CHÍNH (Đã nhúng DOMPurify & Tailwind Prose) */}
                                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-emerald-100 shadow-sm w-full min-w-0 overflow-hidden mb-6">
                                        <div
                                            className="prose prose-emerald max-w-none w-full text-slate-700 text-[15px] leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: cleanHTML }}
                                        />
                                    </div>

                                    {/* KHU VỰC TÀI LIỆU ĐÍNH KÈM (Nếu có) */}
                                    {lessonDetail.documents && lessonDetail.documents.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-emerald-900 mb-3">Tài liệu đính kèm ({lessonDetail.documents.length})</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {lessonDetail.documents.map(doc => (
                                                    <a
                                                        key={doc.id}
                                                        href={doc.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-400 hover:shadow-md transition-all group"
                                                    >
                                                        {renderFileIcon(doc.fileType)}
                                                        <span className="ml-3 font-semibold text-slate-700 truncate group-hover:text-emerald-600 transition-colors">
                                                            {doc.title}
                                                        </span>
                                                        <FaDownload className="ml-auto text-slate-300 group-hover:text-emerald-500" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 💥 KHU VỰC BÀI KIỂM TRA (Nếu có) - ĐÃ FIX ALIGNMENT */}
                                    {lessonDetail.testSet && (
                                        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-3xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">

                                            {/* Cột trái: Chứa Icon và Text (Ép lên top để chống lệch dòng) */}
                                            <div className="flex items-start gap-4">
                                                {/* Icon được bọc riêng, shrink-0 để không bị bóp méo khi text quá dài */}
                                                <div className="bg-indigo-100 p-2.5 rounded-xl shrink-0">
                                                    <FaTasks className="text-indigo-600 text-xl" />
                                                </div>

                                                {/* Chữ được gom vào 1 cục để luôn luôn thẳng hàng mép trái */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-indigo-900 leading-snug">
                                                        {lessonDetail.testSet.title}
                                                    </h3>
                                                    <p className="text-sm text-indigo-700/80 mt-1.5">
                                                        Hoàn thành bài tập để đánh dấu tiến độ bài học này.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Cột phải: Nút bấm */}
                                            <button
                                                onClick={() => {
                                                    setTimeout(() => navigate(`/test-sets/${lessonDetail.testSet.id}`), 50); // Chuyển trang sau 50ms
                                                }}
                                                className="shrink-0 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-500 hover:scale-105 transition-all shadow-md whitespace-nowrap w-full sm:w-auto"
                                            >
                                                Làm bài ngay
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* ================= CỘT PHẢI (MỤC LỤC) ================= */}
                <div className="w-full lg:w-[420px] shrink-0 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
                    <CurriculumSidebar
                        curriculum={curriculumData}
                        activeLessonId={activeLessonId}
                        onLessonSelect={(id) => setActiveLessonId(id)}
                    />
                </div>
            </div>
        </div>
    );
};

export default StudyRoomPage;