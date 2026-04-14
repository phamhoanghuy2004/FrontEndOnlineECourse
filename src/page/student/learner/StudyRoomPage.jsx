import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseApi from '../../../api/courseApi';
import CurriculumSidebar from '../../../components/common/learner/CurriculumSidebar';
import { FaArrowLeft, FaPlay, FaBookOpen } from 'react-icons/fa';

const StudyRoomPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    
    const [curriculumData, setCurriculumData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLessonId, setActiveLessonId] = useState(null);

    // 💥 KHỞI TẠO REF ĐỂ MÓC VÀO CỘT TRÁI
    const leftColumnRef = useRef(null);

    const activeLesson = curriculumData?.lessons?.find(l => l.lessonId === activeLessonId);
    const activeLessonStatus = activeLesson?.status || 'NOT_STARTED';

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

    // LOGIC GỌI API 2 (Lấy chi tiết video)
    useEffect(() => {
        if (activeLessonId && activeLessonStatus !== 'NOT_STARTED') {
            console.log(`🚀 [API 2] Đang gọi API lấy nội dung chi tiết cho Lesson ID: ${activeLessonId}`);
            // TODO: Nối API 2 thật vào đây sau
        }
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

    const handleStartLesson = () => {
        console.log(`🔥 [API START] Đang gọi API đánh dấu bắt đầu học cho Lesson ID: ${activeLessonId}`);
        // TODO: Gọi API Start
    };

    if (loading) {
        return <div className="h-full flex items-center justify-center text-slate-500 font-bold">Đang tải phòng học...</div>;
    }

    if (!curriculumData) {
        return <div className="h-full flex items-center justify-center text-red-500">Không tìm thấy dữ liệu khóa học!</div>;
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col font-sans selection:bg-emerald-200">
            
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
                
                {/* ================= CỘT TRÁI ================= */}
                {/* 💥 GẮN REF VÀO THẺ CÓ OVERFLOW ĐỂ ĐIỀU KHIỂN THANH CUỘN */}
                <div 
                    ref={leftColumnRef} 
                    className="flex-1 overflow-y-auto custom-scrollbar pr-1"
                >
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-3xl border border-emerald-100/60 p-4 md:p-6 lg:p-8 flex flex-col gap-6 min-h-full relative overflow-hidden shadow-sm">
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none"></div>

                        {activeLessonStatus === 'NOT_STARTED' ? (
                            <div className="w-full aspect-video bg-black rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden shrink-0 group z-10">
                                <div className="text-center z-10">
                                    <span className="text-white font-bold text-lg opacity-60 block mb-6">Bạn chưa bắt đầu bài học này</span>
                                    <button 
                                        onClick={handleStartLesson}
                                        className="flex items-center gap-2 mx-auto bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-emerald-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                    >
                                        <FaPlay className="text-sm" /> Bắt đầu học bài này
                                    </button>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                            </div>
                        ) : (
                            <div className="w-full aspect-video bg-slate-900 rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden shrink-0 group z-10 border border-slate-700">
                                <div className="text-center">
                                    <FaPlay className="text-emerald-500 text-4xl mx-auto mb-4 opacity-50 animate-pulse" />
                                    <span className="text-emerald-400 font-bold text-lg">
                                        Đang tải dữ liệu bài học từ API 2...
                                    </span>
                                    <span className="block text-slate-400 text-sm mt-2">Mở Console (F12) để xem Log</span>
                                </div>
                            </div>
                        )}

                        <div className="relative z-10 shrink-0 mb-4 px-2 md:px-4">
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-emerald-950 flex items-center gap-3">
                                <FaBookOpen className="text-emerald-500 text-2xl shrink-0" />
                                {activeLesson?.title || "Đang tải..."}
                            </h2>
                            
                            {/* Cố tình nhét style minHeight vào đây để có cái mà cuộn test thử nha Chủ tịch */}
                            <div className="mt-5 text-emerald-800/80 leading-relaxed font-medium text-[15px] min-h-[800px]">
                                <p>Nội dung bài học, tài liệu đính kèm, và bài test sẽ xuất hiện ở đây.</p>
                                <p className="mt-2 opacity-80">
                                    Sau khi hoàn thành video, các tài liệu tóm tắt và bài kiểm tra năng lực sẽ được mở khóa để bạn rèn luyện.
                                </p>
                                <br/><br/><br/>
                                <p className="opacity-50 italic">(Nội dung dài... hãy cuộn xuống đáy rồi click bài khác ở cột phải để xem hiệu ứng auto-scroll)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= CỘT PHẢI ================= */}
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