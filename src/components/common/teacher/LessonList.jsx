import { useState, useEffect, useRef } from 'react';
import {
    FaTrash, FaVideo, FaFileAlt, FaPlus,
    FaChevronDown, FaChevronUp, FaUpload, FaSave, FaSpinner,
    FaSortNumericDown, FaPaperclip, FaFilePdf, FaFileWord, FaBookOpen
} from 'react-icons/fa';
import Hls from 'hls.js';
import Button from '../Button';
import ConfirmationModal from '../ConfirmationModal';
import InputField from '../InputField';
import lessonApi from '../../../api/lessonApi';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import testApi from '../../../api/testApi';
import AddTestSetModal from './AddTestSetModal';
import TestSetDetailModal from './TestSetDetailModal';

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
    const [testSet, setTestSet] = useState(null);
    const [isFetchingTestSet, setIsFetchingTestSet] = useState(false);
    const [isAddTestSetOpen, setIsAddTestSetOpen] = useState(false);
    const [isTestSetDetailOpen, setIsTestSetDetailOpen] = useState(false);

    const displayVideoUrl = videoPreviewUrl || lesson.hlsUrl;

    // 💥 GỌI API LẤY DANH SÁCH DOCUMENT KHI MOUNT BÀI HỌC
    useEffect(() => {
        const fetchDocuments = async () => {
            if (expanded && !hasFetchedDocs && !isNewLesson) {
                setIsFetchingDocs(true);
                try {
                    const response = await lessonApi.getDocuments(lesson.id);
                    const fetchedDocs = response.data?.data || response.data || [];
                    onUpdateLocal(lesson.id, {
                        ...lesson,
                        documents: fetchedDocs
                    });
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

    // 💥 GỌI API LẤY TESTSET KHI MOUNT BÀI HỌC
    useEffect(() => {
        const fetchTestSet = async () => {
            if (expanded && !testSet && !isNewLesson) {
                setIsFetchingTestSet(true);
                try {
                    const response = await testApi.getTestSetByLessonId(lesson.id);
                    setTestSet(response.data?.data || response.data);
                } catch (error) {
                    if (error.response?.status !== 404) {
                        console.error(`Lỗi tải TestSet cho bài học ${lesson.id}:`, error);
                    }
                } finally {
                    setIsFetchingTestSet(false);
                }
            }
        };

        fetchTestSet();
    }, [expanded, testSet, isNewLesson, lesson.id]);

    // --- LOGIC HLS & SCROLL & WEBSOCKET --- 
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
            alert(error.response?.data?.message || "Lỗi khi lưu thông tin bài học!");
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
        if (!videoFile || isNewLesson) return alert("Vui lòng Lưu thông tin trước khi tải video!");
        setVideoUploading(true);
        try {
            const sigResponse = await lessonApi.getVideoUploadSignature(lesson.id);
            const ticket = sigResponse.data?.data || sigResponse.data;
            const uploadData = new FormData();
            uploadData.append('file', videoFile);
            uploadData.append('api_key', ticket.apiKey || ticket.api_key);
            uploadData.append('timestamp', ticket.timestamp);
            uploadData.append('signature', ticket.signature);
            uploadData.append('folder', ticket.folder);
            uploadData.append('public_id', ticket.publicId);
            uploadData.append('notification_url', ticket.notificationUrl);
            uploadData.append('eager', ticket.eager);
            uploadData.append('eager_async', ticket.eagerAsync);

            const cloudUrl = `https://api.cloudinary.com/v1_1/${ticket.cloudName || ticket.cloud_name}/video/upload`;
            const cloudResponse = await axios.post(cloudUrl, uploadData, {
                onUploadProgress: (p) => setVideoProgress(Math.round((p.loaded * 100) / p.total))
            });

            const cloudinaryData = cloudResponse.data;
            await lessonApi.saveVideoDraft(lesson.id, {
                publicVideoId: cloudinaryData.public_id,
                rawUrl: cloudinaryData.secure_url
            });

            onUpdateLocal(lesson.id, {
                ...lesson,
                videoStatus: 'PROCESSING',
                publicVideoId: cloudinaryData.public_id,
                rawUrl: cloudinaryData.secure_url
            });
            alert("Upload video thành công!");
        } catch (error) {
            alert(`Upload thất bại! ${error.message}`);
        } finally {
            setVideoUploading(false);
            setVideoProgress(0);
        }
    };

    // 💥 HANDLERS DOCUMENT
    const handleSelectDoc = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocFile(file);
            if (!docTitle) setDocTitle(file.name.split('.')[0]);
        }
    };

    const handleUploadDocument = async () => {
        if (!docFile || !docTitle.trim() || isNewLesson) return alert("Vui lòng nhập tên và chọn file!");
        setIsDocUploading(true);
        try {
            const formData = new FormData();
            formData.append('title', docTitle);
            formData.append('file', docFile);
            const response = await lessonApi.uploadDocument(lesson.id, formData);
            const newDoc = response.data?.data || response.data;
            onUpdateLocal(lesson.id, {
                ...lesson,
                documents: [...(lesson.documents || []), newDoc]
            });
            alert("Tải lên tài liệu thành công!");
            setDocFile(null); setDocTitle('');
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi tải lên tài liệu!");
        } finally {
            setIsDocUploading(false);
        }
    };

    const handleDeleteDocument = async (did) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;
        try {
            await lessonApi.deleteDocument(did);
            onUpdateLocal(lesson.id, {
                ...lesson,
                documents: (lesson.documents || []).filter(d => d.id !== did)
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
                    {testSet && <span className="text-xs bg-emerald-100 text-emerald-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><FaBookOpen size={10} /> {testSet.title}</span>}
                    {lesson.videoStatus === 'READY' && <FaVideo title="Đã có video" className="text-emerald-500 ml-1" />}
                    {lesson.videoStatus === 'PROCESSING' && <FaSpinner className="text-blue-500 animate-spin ml-1" title="Đang xử lý HLS" />}

                    <button type = "button" onClick={(e) => { e.stopPropagation(); onDelete(lesson.id); }} className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-md transition ml-2">
                        <FaTrash size={12} />
                    </button>
                    {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </div>
            </div>

            {/* --- BODY --- */}
            {expanded && (
                <div className="p-5 bg-white border-t border-slate-100 space-y-6">

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

                    {/* KHỐI 2: VIDEO */}
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
                    </div>

                    {/* KHỐI 3: TÀI LIỆU */}
                    <div className={`p-4 rounded-xl border ${isNewLesson ? 'border-dashed border-slate-300 bg-slate-50 opacity-60 pointer-events-none' : 'border-indigo-100 bg-indigo-50/30'}`}>
                        <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">3. Tài liệu đính kèm</h4>
                        <div className="flex flex-col md:flex-row gap-3 mb-5 items-end">
                            <div className="flex-1 w-full">
                                <InputField label="Tên tài liệu *" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="VD: Slide bài giảng..." icon={FaFileAlt} />
                            </div>
                            <div className="flex-1 w-full">
                                <input type="file" accept=".pdf,.doc,.docx" onChange={handleSelectDoc} className="block w-full text-sm text-slate-500 file:bg-indigo-50 file:text-indigo-700 bg-white border border-slate-200 rounded-lg h-[42px]" disabled={isDocUploading} />
                            </div>
                            <Button type="button" onClick={handleUploadDocument} disabled={!docFile || !docTitle.trim() || isDocUploading || isNewLesson} className="w-full md:w-auto flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white h-[42px]">
                                {isDocUploading ? <FaSpinner className="animate-spin" /> : <FaUpload />} Tải lên
                            </Button>
                        </div>

                        {lesson.documents?.map(doc => (
                            <div 
                                key={doc.id} 
                                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg mb-2 hover:border-indigo-400 hover:shadow-sm transition-all cursor-pointer group/doc"
                                onClick={() => window.open(doc.fileUrl, '_blank')}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${doc.fileType === 'WORD' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                        {doc.fileType === 'WORD' ? <FaFileWord size={14} /> : <FaFilePdf size={14} />}
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 group-hover/doc:text-indigo-600 transition-colors">{doc.title}</span>
                                </div>
                                <Button 
                                    type="button" 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.id); }} 
                                    className="!p-2 !bg-red-50 !text-red-500 hover:!bg-red-500 hover:!text-white rounded-md transition-colors"
                                >
                                    <FaTrash size={12} />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* KHỐI 4: BÀI TẬP (CLICABLE UI) */}
                    <div className={`p-4 rounded-xl border ${isNewLesson ? 'border-dashed border-slate-300 bg-slate-50 opacity-60 pointer-events-none' : 'border-emerald-100 bg-emerald-50/30'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-slate-700 text-sm uppercase">4. Bài Tập & Kiểm Tra</h4>
                            {!testSet && (
                                <Button size="sm" onClick={() => setIsAddTestSetOpen(true)} variant='primary'><FaPlus /> Thêm TestSet</Button>
                            )}
                        </div>

                        {isFetchingTestSet ? (
                            <div className="flex justify-center items-center py-4 text-emerald-500 text-sm font-bold bg-white border border-dashed border-emerald-200 rounded-lg">
                                <FaSpinner className="animate-spin mr-2" /> Đang kiểm tra...
                            </div>
                        ) : testSet ? (
                            <div 
                                onClick={() => setIsTestSetDetailOpen(true)}
                                className="bg-white p-4 border border-emerald-100 rounded-xl relative group cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-sm group-hover:bg-emerald-100 transition-colors">
                                        <FaBookOpen size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h5 className="font-bold text-slate-800 text-base leading-tight mb-1 group-hover:text-emerald-600 transition-colors">{testSet.title}</h5>
                                            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Nhấn để quản lý</span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium mb-1">{testSet.year} • {testSet.isPublic ? "Công khai" : "Riêng tư"}</p>
                                        <p className="text-[13px] text-slate-600 line-clamp-2">{testSet.description}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-6 bg-white border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
                                Bài học này chưa có bộ câu hỏi ôn tập.
                            </div>
                        )}
                    </div>

                    {/* Modals */}
                    <AddTestSetModal
                        isOpen={isAddTestSetOpen}
                        onClose={() => setIsAddTestSetOpen(false)}
                        lessonId={lesson.id}
                        onSuccess={(newTs) => { setTestSet(newTs); setIsAddTestSetOpen(false); }}
                    />
                    <TestSetDetailModal
                        isOpen={isTestSetDetailOpen}
                        onClose={() => setIsTestSetDetailOpen(false)}
                        testSet={testSet}
                    />
                </div>
            )}
        </div>
    );
};

const LessonList = ({ lessons, onChange, courseId }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleAddLesson = () => {
        const hasUnsavedLesson = lessons.some(l => String(l.id).startsWith('temp_'));
        if (hasUnsavedLesson) return alert("Vui lòng lưu bài mới trước!");
        onChange([...lessons, { id: `temp_${Date.now()}`, title: '', content: '', isPreview: false, videoStatus: 'NONE', displayOrder: lessons.length + 1, documents: [] }]);
    };

    const handleDeleteClick = (id) => { setSelectedLessonId(id); setIsDeleteModalOpen(true); };

    const handleConfirmDelete = async () => {
        if (selectedLessonId) {
            setIsDeleting(true);
            try {
                // Nếu không phải là bài học tạm (đã lưu DB) thì gọi API xóa
                if (!String(selectedLessonId).startsWith('temp_')) {
                    await lessonApi.delete(selectedLessonId);
                }
                onChange(lessons.filter(l => l.id !== selectedLessonId));
                setIsDeleteModalOpen(false);
            } catch (error) { 
                alert(error.response?.data?.message || "Lỗi khi xóa bài học."); 
            }
            finally { setIsDeleting(false); }
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
                onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={handleConfirmDelete} 
                title="Xóa bài học này?" 
                message="Hành động này sẽ xóa vĩnh viễn nội dung và video." 
                isLoading={isDeleting}
            />
        </div>
    );
};

export default LessonList;