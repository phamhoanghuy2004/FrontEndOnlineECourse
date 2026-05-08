import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import courseApi from '../../api/courseApi';
// 🔴 Đã xóa import axiosClient vì bây giờ ta gọi qua courseApi
import { toast } from 'react-toastify';

const HlsVideoPlayer = ({ url, lessonId, initialProgress = 0, duration = 0, onComplete }) => {
    const videoRef = useRef(null);
    const [isCompleted, setIsCompleted] = useState(false);

    const heartbeatIntervalRef = useRef(null);
    const currentSecondRef = useRef(initialProgress);
    const lastValidSecondRef = useRef(initialProgress);

    // ==========================================
    // 🔴 [GÓC TECH LEAD]: BỘ ĐẾM THỜI GIAN THỰC TẾ
    // ==========================================
    const accumulatedStudySecondsRef = useRef(0); // Tích lũy số giây học thực tế
    const studyTimerIntervalRef = useRef(null);   // Bộ đếm mỗi 1 giây

    const syncProgress = async (isBeacon = false) => {
        if (!lessonId) return;
        const currentSec = Math.floor(currentSecondRef.current);
        const currentSpeed = videoRef.current ? videoRef.current.playbackRate : 1.0;

        // Lấy số giây học tích lũy được kể từ lần đồng bộ trước
        const addedSeconds = accumulatedStudySecondsRef.current;
        
        // Reset ngay lập tức để đếm lại vòng mới
        if (addedSeconds > 0) {
            accumulatedStudySecondsRef.current = 0; 
        }

        // --- 1. LUỒNG CŨ: LƯU MỐC VIDEO (Giữ nguyên) ---
        if (currentSec > 0) {
            const payload = { currentSecond: currentSec, playbackSpeed: currentSpeed };

            if (isBeacon) {
                const token = localStorage.getItem('token'); 
                fetch(`http://localhost:8080/lessons/${lessonId}/progress`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                    keepalive: true 
                }).catch(e => console.log("Lỗi gửi progress ngầm", e));
            } else {
                try {
                    await courseApi.syncVideoProgress(lessonId, payload);
                    lastValidSecondRef.current = currentSec;
                } catch (error) {
                    console.error("Lỗi đồng bộ tiến độ:", error);
                    if (error.code === 1066) {
                        toast.error("🚨 Phát hiện tua video không hợp lệ! Đã trả về vị trí an toàn.");
                        if (videoRef.current) {
                            videoRef.current.currentTime = lastValidSecondRef.current;
                        }
                    }
                }
            }
        }

        // --- 2. 🔴 LUỒNG MỚI: BẮN API CỘNG THỜI GIAN HỌC ---
        if (addedSeconds > 0) {
            const studyPayload = { addedSeconds };

            if (isBeacon) {
                // Bắn ngầm khi tắt trình duyệt
                const token = localStorage.getItem('token'); 
                // 🔴 Đã sửa URL fetch thành /students/ping cho đồng bộ với API mới của bạn
                fetch(`http://localhost:8080/students/ping`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(studyPayload),
                    keepalive: true 
                }).catch(e => console.log("Lỗi gửi study time ngầm", e));
            } else {
                // 🔴 Gọi API bình qua courseApi thay vì axiosClient
                courseApi.pingStudyTime(studyPayload)
                    .catch(e => console.error("Lỗi đồng bộ thống kê thời gian học", e));
            }
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => {
            // 1. Luồng cũ
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = setInterval(() => {
                syncProgress(false);
            }, 30000); 

            // 2. Luồng đếm giây thực tế
            clearInterval(studyTimerIntervalRef.current);
            studyTimerIntervalRef.current = setInterval(() => {
                if (!document.hidden) {
                    accumulatedStudySecondsRef.current += 1;
                }
            }, 1000);
        };

        const handlePauseOrEnded = () => {
            clearInterval(heartbeatIntervalRef.current);
            clearInterval(studyTimerIntervalRef.current);
            syncProgress(false);
        };

        const handleSeeked = () => {
            currentSecondRef.current = video.currentTime;
            syncProgress(false);
        };

        const handleTimeUpdate = async () => { 
            currentSecondRef.current = video.currentTime;
            if (!isCompleted && duration > 0) {
                const percent = (video.currentTime / duration) * 100;
                if (percent >= 90) {
                    setIsCompleted(true); 
                    await syncProgress(false); 
                    onComplete(lessonId); 
                }
            }
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePauseOrEnded);
        video.addEventListener('ended', handlePauseOrEnded);
        video.addEventListener('seeked', handleSeeked);
        video.addEventListener('timeupdate', handleTimeUpdate);

        const handleBeforeUnload = () => syncProgress(true);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePauseOrEnded);
            video.removeEventListener('ended', handlePauseOrEnded);
            video.removeEventListener('seeked', handleSeeked);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            
            clearInterval(heartbeatIntervalRef.current);
            clearInterval(studyTimerIntervalRef.current);

            syncProgress(true);
        };
    }, [lessonId, duration, isCompleted]);

    // ==========================================
    // KHỞI TẠO HLS VÀ RESUME VIDEO
    // ==========================================
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !url) return;

        let hls;

        const handleVideoReadyToPlay = () => {
            if (initialProgress > 0 && video.currentTime === 0) {
                video.currentTime = initialProgress;
            }
        };

        if (Hls.isSupported()) {
            hls = new Hls({ maxMaxBufferLength: 100 });
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, handleVideoReadyToPlay);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', handleVideoReadyToPlay);
        }

        return () => {
            if (hls) hls.destroy();
            video.removeEventListener('loadedmetadata', handleVideoReadyToPlay);
        };
    }, [url, initialProgress]);

    return (
        <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls
        />
    );
};

export default HlsVideoPlayer;