import { useState, useEffect, useRef } from 'react';
import {
    FaTrash, FaVideo, FaFileAlt, FaPlus,
    FaChevronDown, FaChevronUp, FaUpload, FaSave, FaSpinner,
    FaSortNumericDown, FaPaperclip, FaFilePdf, FaFileWord
} from 'react-icons/fa';
import Hls from 'hls.js';
import Button from '../Button';
import ConfirmationModal from '../ConfirmationModal';
import InputField from '../InputField';
import lessonApi from '../../../api/lessonApi';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// ==========================================
// COMPONENT CON: QUẢN LÝ TỪNG BÀI HỌC
// ==========================================
const LessonItem = ({ index, lesson, courseId, onUpdateLocal, onDelete }) => {
    const isNewLesson = String(lesson.id).startsWith('temp_');
    const [expanded, setExpanded] = useState(isNewLesson);
    const itemRef = useRef(null);
    const videoRef = useRef(null);
    const stompClientRef = useRef(null);

    // --- STATES ---
    const [formData, setFormData] = useState({
        title: lesson.title || '',
        content: lesson.content || '',
        isPreview: lesson.isPreview || false,
        displayOrder: lesson.displayOrder !== undefined ? lesson.displayOrder : index
    });

    const [isSavingText, setIsSavingText] = useState(false);

    // Video States
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
    const [videoUploading, setVideoUploading] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);

    // 💥 MỚI: Document States
    const [docFile, setDocFile] = useState(null);
    const [docTitle, setDocTitle] = useState('');
    const [isDocUploading, setIsDocUploading] = useState(false);

    const [isFetchingDocs, setIsFetchingDocs] = useState(false);

    const [hasFetchedDocs, setHasFetchedDocs] = useState(false);

    const displayVideoUrl = videoPreviewUrl || lesson.hlsUrl;

    // 💥 GỌI API LẤY DANH SÁCH DOCUMENT KHI MOUNT BÀI HỌC
    useEffect(() => {
        const fetchDocuments = async () => {
            // Chỉ fetch khi: 
            // 1. Bài học đang mở (expanded)
            // 2. Chưa từng fetch (hasFetchedDocs = false)
            // 3. Không phải bài học mới tạo (isNewLesson = false)
            if (expanded && !hasFetchedDocs && !isNewLesson) {
                setIsFetchingDocs(true);
                try {
                    const response = await lessonApi.getDocuments(lesson.id);
                    // Nhận mảng tài liệu từ BE trả về
                    const fetchedDocs = response.data?.data || response.data || [];

                    // Cập nhật mảng vừa lấy được vào Local State của Form
                    onUpdateLocal(lesson.id, {
                        ...lesson,
                        documents: fetchedDocs
                    });

                    // 💥 Đánh dấu là đã fetch xong, lần sau mở lại không cần gọi API nữa
                    setHasFetchedDocs(true);

                } catch (error) {
                    console.error(`Lỗi tải danh sách tài liệu cho bài học ${lesson.id}:`, error);
                    onUpdateLocal(lesson.id, { ...lesson, documents: [] });
                } finally {
                    setIsFetchingDocs(false);
                }
            }
        };

        fetchDocuments();
    }, [expanded, hasFetchedDocs, isNewLesson, lesson.id]);

    // --- LOGIC HLS & SCROLL & WEBSOCKET --- 
    // (Giữ nguyên toàn bộ logic cũ cực xịn của bạn)
    useEffect(() => {
        if (expanded && itemRef.current && isNewLesson) {
            setTimeout(() => { itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
        }
    }, [expanded, isNewLesson]);

    useEffect(() => {
        let hls;
        if (expanded && displayVideoUrl && displayVideoUrl.includes('.m3u8') && videoRef.current) {
            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(displayVideoUrl);
                hls.attachMedia(videoRef.current);
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data.fatal) console.error('HLS Error:', data);
                });
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = displayVideoUrl;
            }
        }
        return () => { if (hls) hls.destroy(); };
    }, [displayVideoUrl, expanded]);

    useEffect(() => {
        return () => { if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl); };
    }, [videoPreviewUrl]);

    useEffect(() => {
        if (!isNewLesson && lesson.videoStatus === 'PROCESSING') {
            const socket = new SockJS('http://localhost:8080/ws');
            const client = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                onConnect: () => {
                    client.subscribe(`/topic/lessons/${lesson.id}`, (message) => {
                        const payload = JSON.parse(message.body);
                        if (payload.status === 'READY') {
                            onUpdateLocal(lesson.id, {
                                ...lesson,
                                videoStatus: 'READY',
                                hlsUrl: payload.hlsUrl,
                                durationSeconds: payload.durationSeconds
                            });
                            alert(`Nấu video thành công cho bài học: ${lesson.title}`);
                            client.deactivate();
                        }
                    });
                }
            });
            client.activate();
            stompClientRef.current = client;
        }
        return () => { if (stompClientRef.current) stompClientRef.current.deactivate(); };
    }, [lesson.id, lesson.videoStatus, isNewLesson]);


    // --- HANDLERS TEXT & VIDEO ---
    const handleTextChange = (field, value) => { setFormData(prev => ({ ...prev, [field]: value })); };

    const handleSaveDetails = async () => {
        setIsSavingText(true);
        try {
            const payload = { ...formData, courseId, displayOrder: Number(formData.displayOrder) };
            let savedLesson;

            if (isNewLesson) {
                const response = await lessonApi.create(payload);
                savedLesson = response.data?.data || response.data || response;
                alert("Tạo bài học mới thành công!");
            } else {
                const response = await lessonApi.update(lesson.id, payload);
                savedLesson = response.data?.data || response.data || response;
                alert("Cập nhật thông tin bài học thành công!");
            }
            if (savedLesson) onUpdateLocal(lesson.id, savedLesson);
        } catch (error) {
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

        const currentLessonId = lesson.id;
        setVideoUploading(true);
        setVideoProgress(0);

        try {
            const sigResponse = await lessonApi.getVideoUploadSignature(currentLessonId);
            const ticket = sigResponse.data?.data || sigResponse.data || sigResponse;

            const apiKey = ticket.apiKey || ticket.api_key;
            const cloudName = ticket.cloudName || ticket.cloud_name;

            // Do BE không có @JsonProperty nên nó trả về camelCase
            const publicId = ticket.publicId;
            const notificationUrl = ticket.notificationUrl;

            // 💥 1. LẤY THÊM 2 TRƯỜNG EAGER TỪ BACKEND TRẢ VỀ
            const eager = ticket.eager;
            const eagerAsync = ticket.eagerAsync !== undefined ? ticket.eagerAsync : ticket.eager_async;

            if (!cloudName || !apiKey || !publicId || !notificationUrl || !eager) {
                throw new Error("Dữ liệu chữ ký từ Server bị thiếu! Vui lòng kiểm tra lại Backend.");
            }

            const uploadData = new FormData();
            uploadData.append('file', videoFile);
            uploadData.append('api_key', apiKey);
            uploadData.append('timestamp', ticket.timestamp);
            uploadData.append('signature', ticket.signature);
            uploadData.append('folder', ticket.folder);
            uploadData.append('public_id', publicId);
            uploadData.append('notification_url', notificationUrl);

            // 💥 2. NHÉT NÓ VÀO FORMDATA ĐỂ CLOUDINARY KIỂM TRA CHỮ KÝ CHUẨN XÁC
            uploadData.append('eager', eager);
            uploadData.append('eager_async', eagerAsync);

            console.log(`2. Bắt đầu đẩy MP4 lên Cloudinary (Cloud Name: ${cloudName})...`);

            const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
            const cloudResponse = await axios.post(cloudUrl, uploadData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setVideoProgress(percentCompleted);
                }
            });

            const cloudinaryData = cloudResponse.data;
            await lessonApi.saveVideoDraft(currentLessonId, {
                publicVideoId: cloudinaryData.public_id,
                rawUrl: cloudinaryData.secure_url
            });

            onUpdateLocal(currentLessonId, {
                ...lesson,
                videoStatus: 'PROCESSING',
                publicVideoId: cloudinaryData.public_id,
                rawUrl: cloudinaryData.secure_url
            });

            alert("Upload thành công! Video đang được chuyển sang HLS.");
            setVideoFile(null);
            setVideoPreviewUrl('');
        } catch (error) {
            alert(`Upload thất bại! ${error.message}`);
        } finally {
            setVideoUploading(false);
            setVideoProgress(0);
        }
    };

    // 💥 HANDLERS DOCUMENT (PDF/Word)
    const handleSelectDoc = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocFile(file);
            // Tự động điền tên tài liệu bằng tên file nếu User lười chưa nhập
            if (!docTitle) setDocTitle(file.name.split('.')[0]);
        }
    };

    const handleUploadDocument = async () => {
        if (!docFile || !docTitle.trim()) return alert("Vui lòng nhập tên và chọn file tài liệu!");
        if (isNewLesson) return alert("Vui lòng Lưu bài học (để tạo ID) trước khi tải tài liệu!");

        setIsDocUploading(true);
        try {
            const formData = new FormData();
            formData.append('title', docTitle);
            formData.append('file', docFile);

            const response = await lessonApi.uploadDocument(lesson.id, formData);
            const newDoc = response.data?.data || response.data;

            // 💥 Nối tài liệu mới vào cuối mảng documents hiện tại
            onUpdateLocal(lesson.id, {
                ...lesson,
                documents: [...(lesson.documents || []), newDoc]
            });

            alert("Tải lên tài liệu thành công!");
            setDocFile(null);
            setDocTitle('');
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi tải lên tài liệu!");
        } finally {
            setIsDocUploading(false);
        }
    };

    const handleDeleteDocument = async (documentId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;

        try {
            await lessonApi.deleteDocument(documentId);

            // 💥 Lọc bỏ tài liệu đã xóa khỏi State
            onUpdateLocal(lesson.id, {
                ...lesson,
                documents: (lesson.documents || []).filter(d => d.id !== documentId)
            });
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi khi xóa tài liệu!");
        }
    };

    return (
        <div ref={itemRef} className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden mb-3">
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-100 transition" onClick={() => setExpanded(!expanded)}>
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
                    {lesson.documents?.length > 0 && <span className="text-xs bg-indigo-100 text-indigo-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><FaPaperclip size={10} /> {lesson.documents.length}</span>}
                    {lesson.videoStatus === 'READY' && <FaVideo title="Đã có video" className="text-emerald-500 ml-1" />}
                    {lesson.videoStatus === 'PROCESSING' && <FaSpinner className="text-blue-500 animate-spin ml-1" title="Đang xử lý HLS" />}

                    <button onClick={(e) => { e.stopPropagation(); onDelete(lesson.id); }} className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-md transition ml-2">
                        <FaTrash size={12} />
                    </button>
                    {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </div>
            </div>

            {/* --- BODY --- */}
            {expanded && (
                <div className="p-5 bg-white border-t border-slate-100 space-y-6 animate-in fade-in duration-200">

                    {/* KHỐI 1: TEXT FORM (Giữ nguyên) */}
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
                                <InputField label="Tên bài học *" value={formData.title} onChange={(e) => handleTextChange('title', e.target.value)} icon={FaFileAlt} />
                            </div>
                            <div className="md:col-span-1">
                                <InputField label="Thứ tự hiển thị *" type="number" value={formData.displayOrder} onChange={(e) => handleTextChange('displayOrder', e.target.value)} icon={FaSortNumericDown} />
                            </div>
                        </div>

                        <div className="flex items-center pb-4">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" checked={formData.isPreview} onChange={(e) => handleTextChange('isPreview', e.target.checked)} className="w-4 h-4 text-emerald-600 rounded cursor-pointer" />
                                <span className="text-sm font-medium text-slate-700">Cho phép học sinh học thử miễn phí (Preview)</span>
                            </label>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wide block mb-1">Nội dung / Mô tả *</label>
                            <textarea value={formData.content} onChange={(e) => handleTextChange('content', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-slate-700 text-sm resize-none" rows="3"></textarea>
                        </div>
                    </div>

                    {/* KHỐI 2: VIDEO (Giữ nguyên) */}
                    <div className={`p-4 rounded-xl border ${isNewLesson ? 'border-dashed border-slate-300 bg-slate-50 opacity-60 pointer-events-none' : 'border-blue-100 bg-blue-50/30'}`}>
                        <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">2. Video Bài Giảng</h4>
                        {isNewLesson && <p className="text-xs text-red-500 mb-4 font-semibold">⚠️ Cần "Lưu tạo mới" ở trên để có ID trước khi tải video.</p>}

                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <input type="file" accept="video/mp4,video/webm" onChange={handleSelectVideo} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" disabled={videoUploading || lesson.videoStatus === 'PROCESSING'} />
                            <Button type="button" onClick={handleUploadVideo} disabled={!videoFile || videoUploading || lesson.videoStatus === 'PROCESSING'} className="w-full md:w-auto flex items-center justify-center gap-2 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white">
                                {videoUploading ? <><FaSpinner className="animate-spin" /> Tải lên...</> : <><FaUpload /> Tải Video</>}
                            </Button>
                        </div>

                        {displayVideoUrl && (
                            <div className="mt-5">
                                <label className="text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wide block mb-2"><FaVideo className="inline mr-1 text-blue-500 mb-0.5" /> Bản xem trước Video</label>
                                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-slate-200 shadow-inner group">
                                    <video ref={videoRef} src={displayVideoUrl && !displayVideoUrl.includes('.m3u8') ? displayVideoUrl : undefined} controls={!videoUploading} className={`w-full h-full object-contain transition-opacity duration-300 ${videoUploading ? 'opacity-40 blur-[2px]' : 'opacity-100'}`} />
                                    {videoUploading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-10 transition-all">
                                            <FaSpinner className="animate-spin text-white text-5xl mb-4" />
                                            <div className="text-white font-black text-xl drop-shadow-md">ĐANG TẢI LÊN... {videoProgress}%</div>
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

                    {/* 💥 KHỐI 3: QUẢN LÝ TÀI LIỆU (PDF/WORD) */}
                    <div className={`p-4 rounded-xl border ${isNewLesson ? 'border-dashed border-slate-300 bg-slate-50 opacity-60 pointer-events-none' : 'border-indigo-100 bg-indigo-50/30'}`}>
                        <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">3. Tài liệu đính kèm</h4>
                        {isNewLesson && <p className="text-xs text-red-500 mb-4 font-semibold">⚠️ Cần "Lưu tạo mới" ở trên để có ID trước khi tải tài liệu.</p>}

                        {/* Form Upload Tài liệu */}
                        <div className="flex flex-col md:flex-row gap-3 mb-5 items-end">
                            <div className="flex-1 w-full">
                                <InputField
                                    label="Tên tài liệu *"
                                    value={docTitle}
                                    onChange={(e) => setDocTitle(e.target.value)}
                                    placeholder="VD: Slide bài giảng, Bài tập..."
                                    icon={FaFileAlt}
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wide block mb-1">File (PDF/Word) *</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleSelectDoc}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 bg-white border border-slate-200 rounded-lg h-[42px]"
                                    disabled={isDocUploading}
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={handleUploadDocument}
                                disabled={!docFile || !docTitle.trim() || isDocUploading || isNewLesson}
                                className="w-full md:w-auto flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white !py-2.5 h-[42px]"
                            >
                                {isDocUploading ? <FaSpinner className="animate-spin" /> : <FaUpload />} Tải lên
                            </Button>
                        </div>

                        {/* Danh sách Tài liệu đã up */}
                        {isFetchingDocs ? (
                            <div className="flex justify-center items-center py-6 text-indigo-500 text-sm font-bold bg-white border border-dashed border-indigo-200 rounded-lg">
                                <FaSpinner className="animate-spin mr-2 text-lg" /> Đang tải danh sách tài liệu...
                            </div>
                        ) : lesson.documents && lesson.documents.length > 0 ? (
                            <div className="space-y-2">
                                <h5 className="text-xs font-bold text-slate-500 uppercase">Danh sách đã tải lên ({lesson.documents.length})</h5>
                                {lesson.documents.map(doc => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${doc.fileType === 'WORD' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                                {doc.fileType === 'WORD' ? <FaFileWord size={14} /> : <FaFilePdf size={14} />}
                                            </div>
                                            <div>
                                                <a
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    download={doc.title}
                                                    className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors block"
                                                >
                                                    {doc.title}
                                                </a>
                                                <span className="text-[10px] text-slate-400 uppercase font-semibold">{doc.fileType || 'DOCUMENT'}</span>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => handleDeleteDocument(doc.id)}
                                            className="!p-2 !bg-red-50 !text-red-500 hover:!bg-red-500 hover:!text-white rounded-md transition-colors"
                                            title="Xóa tài liệu"
                                        >
                                            <FaTrash size={12} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-4 bg-white border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
                                Chưa có tài liệu nào đính kèm.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// COMPONENT CHÍNH: LESSON LIST (Giữ nguyên của bạn)
// ==========================================
const LessonList = ({ lessons, onChange, courseId }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleAddLesson = () => {
        const hasUnsavedLesson = lessons.some(l => String(l.id).startsWith('temp_'));
        if (hasUnsavedLesson) {
            alert("⚠️ Vui lòng LƯU THÔNG TIN bài học đang soạn hiện tại trước khi thêm bài mới!");
            return;
        }

        const newLesson = { id: `temp_${Date.now()}`, title: '', content: '', isPreview: false, videoStatus: 'NONE', displayOrder: lessons.length + 1, documents: [] };
        onChange([...lessons, newLesson]);
    };

    const handleDeleteClick = (id) => { setSelectedLessonId(id); setIsDeleteModalOpen(true); };

    const handleConfirmDelete = async () => {
        if (selectedLessonId) {
            setIsDeleting(true);
            try {
                if (String(selectedLessonId).startsWith('temp_')) {
                    onChange(lessons.filter(l => l.id !== selectedLessonId));
                } else {
                    // Gọi API DELETE LESSON (Nếu có)
                    // await lessonApi.delete(selectedLessonId);
                    onChange(lessons.filter(l => l.id !== selectedLessonId));
                }
                setSelectedLessonId(null);
                setIsDeleteModalOpen(false);
            } catch (error) {
                console.error("Lỗi khi xóa bài học:", error);
                alert("Không thể xóa bài học.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleUpdateSingleLesson = (oldId, updatedLesson) => {
        const newLessons = lessons.map(l => l.id === oldId ? updatedLesson : l);
        newLessons.sort((a, b) => a.displayOrder - b.displayOrder);
        onChange(newLessons);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700">Danh sách bài học ({lessons.length})</h3>
                <Button type="button" variant="secondary" onClick={handleAddLesson} className="!py-1.5 !px-3 !text-sm flex items-center gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <FaPlus size={12} /> Thêm bài học mới
                </Button>
            </div>
            <div className="space-y-3">
                {lessons.map((lesson, index) => (
                    <LessonItem key={lesson.id} index={index} lesson={lesson} courseId={courseId} onUpdateLocal={handleUpdateSingleLesson} onDelete={handleDeleteClick} />
                ))}
            </div>
            <ConfirmationModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)} 
                onConfirm={handleConfirmDelete} 
                title="Xóa bài học này?" 
                message="Hành động này sẽ xóa vĩnh viễn nội dung và video của bài học." 
                confirmText="Xóa bài học" 
                variant="danger" 
                isLoading={isDeleting}
            />
        </div>
    );
};

export default LessonList;