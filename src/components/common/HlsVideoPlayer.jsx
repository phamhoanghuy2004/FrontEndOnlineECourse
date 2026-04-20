import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import courseApi from '../../api/courseApi';
import { toast } from 'react-toastify'; // 💥 Nhớ import toast để hiện thông báo phạt

const HlsVideoPlayer = ({ url, lessonId, initialProgress = 0, duration = 0, onComplete }) => {
    const videoRef = useRef(null);
    const [isCompleted, setIsCompleted] = useState(false);

    const heartbeatIntervalRef = useRef(null);
    const currentSecondRef = useRef(initialProgress);

    // 💥 [GÓC TECH LEAD]: Thêm Ref để lưu mốc an toàn cuối cùng.
    // Dùng để giật lùi video về đây nếu phát hiện tua láo.
    const lastValidSecondRef = useRef(initialProgress);

    // ==========================================
    // 💥 [GÓC TECH LEAD]: HÀM BẮN API LƯU TIẾN ĐỘ
    // ==========================================
    const syncProgress = async (isBeacon = false) => {
        if (!lessonId) return;
        const currentSec = Math.floor(currentSecondRef.current);
        
        // Tránh lưu 0 giây nếu chưa xem gì
        if (currentSec <= 0) return; 

        // 💥 LẤY TỐC ĐỘ HIỆN TẠI (Mặc định là 1.0 nếu không lấy được)
        const currentSpeed = videoRef.current ? videoRef.current.playbackRate : 1.0;

        // 💥 Đóng gói payload mới
        const payload = { 
            currentSecond: currentSec,
            playbackSpeed: currentSpeed 
        };

        if (isBeacon) {
            // Trường hợp 4 & 5: Tắt trình duyệt hoặc Chuyển bài (Unmount)
            const token = localStorage.getItem('token'); // Hoặc 'access_token' tùy project của bạn
            
            fetch(`http://localhost:8080/lessons/${lessonId}/progress`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // 💥 Truyền payload mới có speed
                body: JSON.stringify(payload),
                keepalive: true 
            }).catch(e => console.log("Lỗi gửi progress ngầm", e));
        } else {
            // Trường hợp 1, 2, 3: Đang xem bình thường
            try {
                // 💥 Gọi API với payload mới
                await courseApi.syncVideoProgress(lessonId, payload);
                console.log(`📡 Heartbeat: Đã lưu mốc ${currentSec}s (Tốc độ: ${currentSpeed}x)`);
                
                // 💥 BE GẬT ĐẦU -> CẬP NHẬT LẠI MỐC AN TOÀN
                lastValidSecondRef.current = currentSec;

            } catch (error) {
                console.error("Lỗi đồng bộ tiến độ, BE đã từ chối:", error);
                
                // 💥 HÌNH PHẠT DÀNH CHO HACKER TUA LÁO
                const status = error.code;
                if (status === 1066) {
                    // Cảnh cáo vào mặt
                    toast.error("🚨 Phát hiện tua video không hợp lệ! Đã trả về vị trí an toàn.");
                    
                    // Giật lùi video ngay lập tức về mốc hợp lệ gần nhất
                    if (videoRef.current) {
                        videoRef.current.currentTime = lastValidSecondRef.current;
                    }
                }
            }
        }
    };

    // ==========================================
    // 💥 CÀI ĐẶT CÁC SỰ KIỆN VIDEO (Giữ nguyên)
    // ==========================================
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = setInterval(() => {
                syncProgress(false);
            }, 30000); 
        };

        const handlePauseOrEnded = () => {
            clearInterval(heartbeatIntervalRef.current);
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