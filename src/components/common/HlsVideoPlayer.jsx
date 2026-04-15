import React, { useEffect, useRef } from 'react';
// 💥 Import thẳng thư viện lõi HLS
import Hls from 'hls.js';

const HlsVideoPlayer = ({ url }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !url) return;

        let hls;

        // Kịch bản 1: Trình duyệt hỗ trợ HLS.js (Chrome, Edge, Firefox, Cốc Cốc...)
        if (Hls.isSupported()) {
            hls = new Hls({
                // Config tối ưu cho video học tập
                maxMaxBufferLength: 100, 
            });
            
            hls.loadSource(url);
            hls.attachMedia(video);

            // Bắt sự kiện khi load thành công để log ra cho sướng
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("✅ HLS.js đã parse thành công m3u8! Sẵn sàng phát.");
            });

            // Nếu Cloudinary giở chứng, báo lỗi đỏ ra Console luôn
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error("❌ Lỗi chí mạng từ HLS.js:", data);
                }
            });
        } 
        // Kịch bản 2: Safari của Apple (Tự nó hiểu m3u8, không cần hls.js)
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
        }

        // Dọn dẹp RAM khi user chuyển sang bài học khác
        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [url]);

    return (
        <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls // Hiển thị thanh tiến trình, nút Play, Loa
            // Bạn có thể thêm autoPlay nếu thích
        />
    );
};

export default HlsVideoPlayer;