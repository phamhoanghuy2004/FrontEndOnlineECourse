import { useState, useEffect, useRef } from 'react';
import {
    FaTrash, FaVideo, FaFileAlt, FaClipboardList, FaPlus,
    FaChevronDown, FaChevronUp, FaUpload, FaSave, FaSpinner,
    FaSortNumericDown
} from 'react-icons/fa';
import Hls from 'hls.js'; // 💥 IMPORT THƯ VIỆN HLS
import Button from '../Button';
import ConfirmationModal from '../ConfirmationModal';
import InputField from '../InputField';
import lessonApi from '../../../api/lessonApi';
import axios from 'axios';


// ==========================================
// COMPONENT CON: QUẢN LÝ TỪNG BÀI HỌC
// ==========================================
const LessonItem = ({ index, lesson, courseId, onUpdateLocal, onDelete }) => {
    // 💥 Mặc định bài cũ thì thu gọn, bài mới tạo (temp_) thì mở rộng ra luôn
    const isNewLesson = String(lesson.id).startsWith('temp_');
    const [expanded, setExpanded] = useState(isNewLesson);
    const itemRef = useRef(null);

    // Dùng để gắn Hls.js vào thẻ video
    const videoRef = useRef(null);

    useEffect(() => {
        if (expanded && itemRef.current && isNewLesson) {
            setTimeout(() => {
                itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [expanded, isNewLesson]);

    const [formData, setFormData] = useState({
        title: lesson.title || '',
        content: lesson.content || '',
        isPreview: lesson.isPreview || false,
        displayOrder: lesson.displayOrder !== undefined ? lesson.displayOrder : index
    });

    const [isSavingText, setIsSavingText] = useState(false);

    // State Upload Video
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(''); // File chọn từ máy
    const [videoUploading, setVideoUploading] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);

    // 💥 Ưu tiên hiển thị: Nếu vừa chọn file mới -> chiếu file mới. Nếu không -> chiếu link HLS từ DB
    const displayVideoUrl = videoPreviewUrl || lesson.hlsUrl;

    // 💥 LOGIC PHÁT VIDEO HLS (.m3u8)
    // 💥 LOGIC PHÁT VIDEO HLS (.m3u8) ĐÃ ĐƯỢC FIX LỖI VÒNG ĐỜI REACT
    useEffect(() => {
        let hls;

        // 💥 BẮT BỆNH: Thêm điều kiện `expanded` để khi mở thẻ ra, nó mới đi tìm thẻ video để gắn
        if (expanded && displayVideoUrl && displayVideoUrl.includes('.m3u8') && videoRef.current) {

            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(displayVideoUrl);
                hls.attachMedia(videoRef.current);

                // (Tùy chọn) Log lỗi ra console nếu link Cloudinary bị hỏng để dễ bắt bệnh
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data.fatal) {
                        console.error('HLS Error:', data);
                    }
                });

            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                // Hỗ trợ riêng cho trình duyệt Safari (Apple)
                videoRef.current.src = displayVideoUrl;
            }
        }

        // Cleanup khi đóng bài học hoặc component bị hủy
        return () => {
            if (hls) hls.destroy();
        };

        // 💥 TỬ HUYỆT: Phải đưa `expanded` vào mảng dependency này!
    }, [displayVideoUrl, expanded]);

    // Cleanup Blob URL để tránh tràn RAM
    useEffect(() => {
        return () => {
            if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
        };
    }, [videoPreviewUrl]);

    const handleTextChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 💥 GỌI API THEO TRẠNG THÁI (CREATE vs UPDATE)
    const handleSaveDetails = async () => {
        setIsSavingText(true);
        try {
            const payload = {
                ...formData,
                courseId,
                displayOrder: Number(formData.displayOrder)
            };

            let savedLesson;

            if (isNewLesson) {
                // 1. GỌI API TẠO MỚI
                const response = await lessonApi.create(payload);

                // 💥 BÓC RUỘT DATA: Tùy cấu hình api/axios của bạn.
                // Thường nếu Backend trả về ApiResponse<LessonResponse> thì data nằm ở response.data.data
                savedLesson = response.data?.data || response.data || response;

                alert("Tạo bài học mới thành công!");
            } else {
                // 2. GỌI API CẬP NHẬT
                const response = await lessonApi.update(lesson.id, payload);

                // 💥 CŨNG PHẢI BÓC RUỘT DATA ĐỂ CẬP NHẬT LẠI UI
                savedLesson = response.data?.data || response.data || response;

                alert("Cập nhật thông tin bài học thành công!");
            }

            if (savedLesson) {
                // Truyền cục data ĐÃ BÓC SẠCH SẼ lên Component cha
                onUpdateLocal(lesson.id, savedLesson);
            }

        } catch (error) {
            console.error("Lỗi khi lưu bài học:", error);
            alert(error.response?.data?.message || error.message || "Lỗi khi lưu thông tin bài học!");
        } finally {
            setIsSavingText(false);
        }
    };

    const handleSelectVideo = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUploadVideo = async () => {
        if (!videoFile) return alert("Vui lòng chọn file video!");
        if (isNewLesson) return alert("Vui lòng Lưu thông tin bài học (để tạo ID) trước khi tải video!");

        setVideoUploading(true);
        setVideoProgress(0);

        try {
            // Bước 1: Xin chữ ký (Signature) từ Spring Boot
            console.log("1. Đang xin chữ ký upload từ Server...");
            const sigResponse = await lessonApi.getVideoUploadSignature();

            // Bóc tách data (Tùy cấu trúc ApiResponse của bạn)
            const ticket = sigResponse.data?.data || sigResponse.data || sigResponse;

            // Bước 2: Đóng gói hành lý (FormData) đúng chuẩn Cloudinary yêu cầu
            const uploadData = new FormData();
            uploadData.append('file', videoFile);
            uploadData.append('api_key', ticket.api_key);
            uploadData.append('timestamp', ticket.timestamp);
            uploadData.append('signature', ticket.signature);
            uploadData.append('folder', ticket.folder);
            uploadData.append('eager', ticket.eager);
            uploadData.append('eager_async', ticket.eager_async);

            // Bước 3: Đâm thẳng lên Cloudinary bằng axios thuần
            console.log("2. Bắt đầu đẩy MP4 lên Cloudinary...");
            const cloudUrl = `https://api.cloudinary.com/v1_1/${ticket.cloud_name}/video/upload`;

            const cloudResponse = await axios.post(cloudUrl, uploadData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setVideoProgress(percentCompleted);
                }
            });

            // Lấy kết quả Cloudinary trả về
            const cloudinaryData = cloudResponse.data;
            console.log("Upload Cloudinary thành công:", cloudinaryData);

            // Bước 4: Lưu thông tin bản nháp vào Spring Boot
            console.log("3. Đang lưu thông tin bản nháp vào Database...");
            await lessonApi.saveVideoDraft(lesson.id, {
                publicVideoId: cloudinaryData.public_id,
                rawUrl: cloudinaryData.secure_url
            });

            // Bước 5: Cập nhật giao diện (UI) React
            onUpdateLocal(lesson.id, {
                ...lesson,
                videoStatus: 'PROCESSING',
                publicVideoId: cloudinaryData.public_id,
                rawUrl: cloudinaryData.secure_url
            });

            alert("Upload thành công! Video đang được hệ thống chuyển sang HLS (khoảng 5-10 phút).");

            // Dọn dẹp form
            setVideoFile(null);
            setVideoPreviewUrl('');

        } catch (error) {
            console.error("Lỗi upload video:", error);
            // Xử lý báo lỗi chi tiết để dễ debug
            if (error.response?.status === 429) {
                alert("Bạn đã upload quá nhiều lần. Vui lòng thử lại sau 1 giờ!");
            } else {
                alert("Upload thất bại! Vui lòng thử lại.");
            }
        } finally {
            setVideoUploading(false);
            setVideoProgress(0);
        }
    };

    return (
        <div ref={itemRef} className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden mb-3">
            {/* --- HEADER --- */}
            <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-100 transition"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {formData.displayOrder}
                    </span>
                    <span className="font-bold text-slate-700 text-sm">
                        {formData.title || "Bài học mới chưa có tên"}
                        {isNewLesson && <span className="text-red-500 text-xs ml-2 italic">(Chưa lưu)</span>}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                    {lesson.videoStatus === 'READY' && <FaVideo title="Đã có video" className="text-emerald-500" />}
                    {lesson.videoStatus === 'PROCESSING' && <FaSpinner className="text-blue-500 animate-spin" title="Đang xử lý HLS" />}

                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(lesson.id); }}
                        className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-md transition ml-2"
                    >
                        <FaTrash size={12} />
                    </button>
                    {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </div>
            </div>

            {/* --- BODY --- */}
            {expanded && (
                <div className="p-5 bg-white border-t border-slate-100 space-y-6 animate-in fade-in duration-200">

                    {/* KHỐI 1: TEXT FORM */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/60">
                            <h4 className="font-bold text-slate-700 text-sm uppercase m-0">1. Thông tin bài học</h4>
                            <Button size="sm" onClick={handleSaveDetails} disabled={isSavingText} className="flex items-center gap-2 !m-0">
                                {isSavingText ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                {isNewLesson ? 'Lưu tạo mới' : 'Lưu cập nhật'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2">
                                <InputField
                                    label="Tên bài học *"
                                    value={formData.title}
                                    onChange={(e) => handleTextChange('title', e.target.value)}
                                    icon={FaFileAlt}
                                />
                            </div>
                            <div className="md:col-span-1">
                                <InputField
                                    label="Thứ tự hiển thị *"
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) => handleTextChange('displayOrder', e.target.value)}
                                    icon={FaSortNumericDown}
                                />
                            </div>
                        </div>

                        <div className="flex items-center pb-4">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={formData.isPreview}
                                    onChange={(e) => handleTextChange('isPreview', e.target.checked)}
                                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                                />
                                <span className="text-sm font-medium text-slate-700">Cho phép học sinh học thử miễn phí (Preview)</span>
                            </label>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wide block mb-1">Nội dung / Mô tả *</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => handleTextChange('content', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-slate-700 text-sm resize-none"
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    {/* KHỐI 2: UPLOAD & PREVIEW VIDEO */}
                    <div className={`p-4 rounded-xl border ${isNewLesson ? 'border-dashed border-slate-300 bg-slate-50 opacity-60 pointer-events-none' : 'border-blue-100 bg-blue-50/30'}`}>
                        <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">2. Video Bài Giảng</h4>
                        {isNewLesson && <p className="text-xs text-red-500 mb-4 font-semibold">⚠️ Cần "Lưu tạo mới" ở trên để có ID trước khi tải video.</p>}

                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <input
                                type="file"
                                accept="video/mp4,video/webm"
                                onChange={handleSelectVideo}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                disabled={videoUploading || lesson.videoStatus === 'PROCESSING'}
                            />

                            <Button
                                type="button"
                                onClick={handleUploadVideo}
                                disabled={!videoFile || videoUploading || lesson.videoStatus === 'PROCESSING'}
                                className="w-full md:w-auto flex items-center justify-center gap-2 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {videoUploading ? <><FaSpinner className="animate-spin" /> Tải lên...</> : <><FaUpload /> Tải Video Mới Lên</>}
                            </Button>
                        </div>

                        {/* 💥 TRÌNH PHÁT VIDEO (Hỗ trợ cả Local Mp4 và Cloudinary HLS m3u8) */}
                        {displayVideoUrl && (
                            <div className="mt-5">
                                <label className="text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wide block mb-2">
                                    <FaVideo className="inline mr-1 text-blue-500 mb-0.5" /> Bản xem trước Video
                                </label>

                                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-slate-200 shadow-inner group">
                                    {/* THẺ VIDEO KẾT NỐI VỚI HLS.JS */}
                                    <video
                                        ref={videoRef}
                                        // 💥 Đã đổi .endsWith thành .includes cho an toàn
                                        src={displayVideoUrl && !displayVideoUrl.includes('.m3u8') ? displayVideoUrl : undefined}
                                        controls={!videoUploading}
                                        className={`w-full h-full object-contain transition-opacity duration-300 ${videoUploading ? 'opacity-40 blur-[2px]' : 'opacity-100'}`}
                                    />

                                    {/* Hiệu ứng Đang tải */}
                                    {videoUploading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-10 transition-all">
                                            <FaSpinner className="animate-spin text-white text-5xl mb-4 shadow-black drop-shadow-lg" />
                                            <div className="text-white font-black text-xl tracking-wider drop-shadow-md">ĐANG TẢI LÊN... {videoProgress}%</div>
                                            <div className="w-64 bg-white/20 rounded-full h-2 mt-4 overflow-hidden border border-white/10 shadow-inner">
                                                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${videoProgress}%` }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {!videoUploading && lesson.videoStatus === 'PROCESSING' && (
                            <div className="mt-4 text-sm font-bold text-orange-600 flex items-center gap-2 bg-orange-100 p-3 rounded-lg border border-orange-200">
                                <FaSpinner className="animate-spin" /> Đang chuyển mã HLS trên máy chủ. Video sẽ xuất hiện tại đây sau ít phút (Vui lòng tải lại trang).
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// COMPONENT CHÍNH: LESSON LIST
// ==========================================
const LessonList = ({ lessons, onChange, courseId }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);

    const handleAddLesson = () => {
        const hasUnsavedLesson = lessons.some(l => String(l.id).startsWith('temp_'));

        if (hasUnsavedLesson) {
            alert("⚠️ Vui lòng LƯU THÔNG TIN bài học đang soạn hiện tại trước khi thêm bài mới!");
            return;
        }

        const newLesson = {
            id: `temp_${Date.now()}`,
            title: '',
            content: '',
            isPreview: false,
            videoStatus: 'NONE',
            displayOrder: lessons.length + 1
        };
        onChange([...lessons, newLesson]);
    };

    const handleDeleteClick = (id) => {
        setSelectedLessonId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedLessonId) {
            if (String(selectedLessonId).startsWith('temp_')) {
                onChange(lessons.filter(l => l.id !== selectedLessonId));
            } else {
                // Gọi API DELETE
                // await lessonApi.delete(selectedLessonId);
                onChange(lessons.filter(l => l.id !== selectedLessonId));
            }
            setSelectedLessonId(null);
            setIsDeleteModalOpen(false);
        }
    };

    const handleUpdateSingleLesson = (oldId, updatedLesson) => {
        const newLessons = lessons.map(l =>
            l.id === oldId ? updatedLesson : l
        );
        newLessons.sort((a, b) => a.displayOrder - b.displayOrder);
        onChange(newLessons);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700">Danh sách bài học ({lessons.length})</h3>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddLesson}
                    className="!py-1.5 !px-3 !text-sm flex items-center gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                >
                    <FaPlus size={12} /> Thêm bài học mới
                </Button>
            </div>

            <div className="space-y-3">
                {lessons.map((lesson, index) => (
                    <LessonItem
                        key={lesson.id}
                        index={index}
                        lesson={lesson}
                        courseId={courseId}
                        onUpdateLocal={handleUpdateSingleLesson}
                        onDelete={handleDeleteClick}
                    />
                ))}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa bài học này?"
                message="Hành động này sẽ xóa vĩnh viễn nội dung và video của bài học."
                confirmText="Xóa bài học"
                variant="danger"
            />
        </div>
    );
};

export default LessonList;