import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import FilterBar from '../../components/common/FilterBar';
import { 
    FaArrowLeft, FaHeadphones, FaImage, FaCheckCircle, FaTimesCircle, 
    FaCloudUploadAlt, FaChevronDown, FaChevronUp, FaFilter, FaInfoCircle, FaFileAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [activeFilter, setActiveFilter] = useState('Tất cả');
    const [qSearchTerm, setQSearchTerm] = useState('');
    const [uploading, setUploading] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const filterLabels = ['Tất cả', 'Thiếu Audio', 'Thiếu Ảnh', 'Câu đơn', 'Câu nhóm'];

    useEffect(() => {
        fetchTest();
    }, [id]);

    const fetchTest = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const response = await adminApi.getAdminTest(id);
            setTest(response.data);
        } catch (error) {
            toast.error("Lỗi khi tải chi tiết bài thi");
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const toggleSection = (idx) => {
        if (expandedSections.includes(idx)) {
            setExpandedSections(expandedSections.filter(i => i !== idx));
        } else {
            setExpandedSections([...expandedSections, idx]);
        }
    };

    const handleMediaUpload = async (targetId, type, file) => {
        if (!file) return;
        
        const uploadKey = `${targetId}-${type}`;
        setUploading(uploadKey);
        
        try {
            if (type === 'q-audio') await adminApi.uploadQuestionAudio(targetId, file);
            else if (type === 'q-image') await adminApi.uploadQuestionImage(targetId, file);
            else if (type === 'g-audio') await adminApi.uploadGroupAudio(targetId, file);
            else if (type === 'g-image') await adminApi.uploadGroupImage(targetId, file);
            
            toast.success("Tải lên thành công!");
            // Perform a silent fetch to update URLs without full page spinner
            fetchTest(true);
        } catch (error) {
            toast.error("Lỗi khi tải lên file");
        } finally {
            setUploading(null);
        }
    };

    const isTestReady = () => {
        if (!test) return false;
        for (const section of test.sections) {
            const partNum = section.orderIndex;
            if (partNum <= 4) {
                for (const q of (section.questions || [])) {
                    if (!q.groupId && !q.audioUrl) return false;
                }
                for (const g of (section.questionGroups || [])) {
                    if (!g.sharedAudioUrl) return false;
                }
            }
        }
        return true;
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold">Đang tải dữ liệu bài thi...</p>
        </div>
    );

    if (!test) return (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
            <FaInfoCircle size={48} className="mx-auto text-red-100 mb-4" />
            <p className="text-red-500 font-bold">Không tìm thấy bài thi</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col gap-6 sticky top-0 bg-[#f1f5f9]/90 backdrop-blur-xl z-30 py-6 -mt-6 border-b border-slate-200/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(-1)}
                            className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:border-emerald-100 transition-all"
                        >
                            <FaArrowLeft />
                        </motion.button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{test.title}</h2>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${isTestReady() ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {isTestReady() ? <><FaCheckCircle /> READY</> : <><FaInfoCircle /> INCOMPLETE</>}
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Quản lý nội dung bài thi</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <input 
                            type="text"
                            placeholder="Tìm nội dung câu hỏi..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium"
                            value={qSearchTerm}
                            onChange={(e) => setQSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <FaFilter size={12} />
                        </div>
                    </div>
                </div>
                
                <FilterBar 
                    filters={filterLabels}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    showLabels={false}
                    compact={true}
                />
            </div>

            {/* Sections */}
            <div className="space-y-8">
                {test.sections.map((section) => {
                    const isExpanded = expandedSections.includes(section.orderIndex);
                    const partNum = section.orderIndex;
                    
                    const standaloneQuestions = (section.questions || []).filter(q => !q.groupId);
                    
                    // Apply Search & Active Filter logic
                    const filterFn = (q) => {
                        const matchesSearch = q.content?.toLowerCase().includes(qSearchTerm.toLowerCase());
                        if (!matchesSearch) return false;

                        if (activeFilter === 'Thiếu Audio') return partNum <= 2 ? !q.audioUrl : false;
                        if (activeFilter === 'Thiếu Ảnh') return partNum === 1 ? !q.imageUrl : false;
                        if (activeFilter === 'Câu đơn') return true;
                        if (activeFilter === 'Câu nhóm') return false;
                        return true;
                    };

                    const groupFilterFn = (g) => {
                        const matchesSearch = g.sharedContent?.toLowerCase().includes(qSearchTerm.toLowerCase()) || 
                                            g.questions?.some(q => q.content?.toLowerCase().includes(qSearchTerm.toLowerCase()));
                        if (!matchesSearch) return false;

                        if (activeFilter === 'Thiếu Audio') return (partNum === 3 || partNum === 4) ? !g.sharedAudioUrl : false;
                        if (activeFilter === 'Thiếu Ảnh') return (partNum === 3 || partNum === 4) ? !g.sharedImageUrl : false;
                        if (activeFilter === 'Câu đơn') return false;
                        if (activeFilter === 'Câu nhóm') return true;
                        return true;
                    };

                    const filteredQuestions = standaloneQuestions.filter(filterFn);
                    const filteredGroups = (section.questionGroups || []).filter(groupFilterFn);

                    if ((qSearchTerm || activeFilter !== 'Tất cả') && filteredQuestions.length === 0 && filteredGroups.length === 0) return null;

                    return (
                        <motion.div 
                            layout
                            key={section.id} 
                            className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-shadow duration-500"
                        >
                            <div 
                                onClick={() => toggleSection(partNum)}
                                className={`p-8 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-emerald-600 text-white rounded-[20px] flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-100">
                                        P{partNum}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-800 text-xl tracking-tight">{section.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                <FaFileAlt size={10} /> {standaloneQuestions.length} câu đơn
                                            </span>
                                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                <FaCheckCircle size={10} /> {section.questionGroups?.length || 0} nhóm
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-8 pb-10 pt-4 border-t border-slate-100/50 space-y-10">
                                            {/* Standalone Questions */}
                                            {filteredQuestions.length > 0 && (
                                                <div className="space-y-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-px flex-grow bg-slate-100" />
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Standalone Questions</h4>
                                                        <div className="h-px flex-grow bg-slate-100" />
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {filteredQuestions.map(q => (
                                                            <QuestionCard 
                                                                key={q.id} 
                                                                question={q} 
                                                                part={partNum} 
                                                                onUpload={handleMediaUpload}
                                                                uploading={uploading}
                                                                onPreviewImage={setSelectedImage}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Question Groups */}
                                            {filteredGroups.length > 0 && (
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-px flex-grow bg-slate-100" />
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Question Groups</h4>
                                                        <div className="h-px flex-grow bg-slate-100" />
                                                    </div>
                                                    {filteredGroups.map(g => (
                                                        <div key={g.id} className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-100 hover:bg-slate-50 transition-colors duration-300">
                                                            <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
                                                                <div className="space-y-3 flex-grow">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] font-black bg-emerald-600 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Group {g.importCode}</span>
                                                                        <span className="text-[10px] font-black bg-white text-slate-400 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">{g.questions?.length} câu hỏi</span>
                                                                    </div>
                                                                    <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                                        <p className="text-sm text-slate-600 font-medium leading-relaxed" title={g.sharedContent}>
                                                                            {g.sharedContent || <span className="italic text-slate-300">(No shared content/passage)</span>}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-3 shrink-0">
                                                                    {(partNum === 3 || partNum === 4) && (
                                                                        <>
                                                                            <MediaUploadButton 
                                                                                label="Audio" 
                                                                                icon={<FaHeadphones />} 
                                                                                url={g.sharedAudioUrl}
                                                                                isAudio
                                                                                onUpload={(file) => handleMediaUpload(g.id, 'g-audio', file)}
                                                                                uploading={uploading === `${g.id}-g-audio`}
                                                                            />
                                                                            <MediaUploadButton 
                                                                                label="Image" 
                                                                                icon={<FaImage />} 
                                                                                url={g.sharedImageUrl}
                                                                                onUpload={(file) => handleMediaUpload(g.id, 'g-image', file)}
                                                                                uploading={uploading === `${g.id}-g-image`}
                                                                                onPreviewImage={setSelectedImage}
                                                                            />
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-4 pl-6 border-l-2 border-emerald-100 ml-4">
                                                                {g.questions?.map(q => (
                                                                    <QuestionCard 
                                                                        key={q.id} 
                                                                        question={q} 
                                                                        isInsideGroup 
                                                                        part={partNum}
                                                                        onUpload={handleMediaUpload}
                                                                        uploading={uploading}
                                                                        onPreviewImage={setSelectedImage}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-2xl" />
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all backdrop-blur-md"
                            >
                                <FaTimesCircle />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const QuestionCard = ({ question, isInsideGroup, part, onUpload, uploading, onPreviewImage }) => {
    return (
        <motion.div 
            whileHover={{ x: 4 }}
            className={`bg-white rounded-2xl p-5 border border-slate-100 flex items-center justify-between group hover:border-emerald-200 hover:shadow-md transition-all ${isInsideGroup ? 'shadow-sm' : ''}`}
        >
            <div className="flex items-center gap-5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    {question.orderIndex}
                </div>
                <div className="space-y-1.5 flex-grow">
                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{question.content}</p>
                    <div className="flex gap-2">
                        {question.answers?.map((ans, idx) => (
                            <div key={ans.id} className={`text-[10px] px-2 py-1 rounded-lg border font-black transition-all ${ans.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-2 ml-4">
                {part === 1 && (
                    <>
                        <MediaUploadButton 
                            icon={<FaHeadphones />} 
                            url={question.audioUrl}
                            isAudio
                            compact
                            onUpload={(file) => onUpload(question.id, 'q-audio', file)}
                            uploading={uploading === `${question.id}-q-audio`}
                        />
                        <MediaUploadButton 
                            icon={<FaImage />} 
                            url={question.imageUrl}
                            compact
                            onUpload={(file) => onUpload(question.id, 'q-image', file)}
                            uploading={uploading === `${question.id}-q-image`}
                            onPreviewImage={onPreviewImage}
                        />
                    </>
                )}

                {part === 2 && (
                    <MediaUploadButton 
                        icon={<FaHeadphones />} 
                        url={question.audioUrl}
                        isAudio
                        compact
                        onUpload={(file) => onUpload(question.id, 'q-audio', file)}
                        uploading={uploading === `${question.id}-q-audio`}
                    />
                )}
            </div>
        </motion.div>
    );
};

const MediaUploadButton = ({ label, icon, url, isAudio, compact, onUpload, uploading, onPreviewImage }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showPlayer, setShowPlayer] = useState(false);
    const audioRef = React.useRef(null);

    const toggleAudio = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!showPlayer) {
            setShowPlayer(true);
            return;
        }
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex items-center gap-1.5">
            {/* Preview Section */}
            {url && (
                <div className="flex items-center gap-1">
                    {isAudio ? (
                        <div className="flex items-center bg-emerald-50 rounded-2xl overflow-hidden transition-all duration-300">
                            <button 
                                onClick={toggleAudio}
                                className={`w-9 h-9 flex items-center justify-center transition-all ${isPlaying ? 'bg-emerald-600 text-white' : 'text-emerald-600 hover:bg-emerald-100'}`}
                                title={isPlaying ? "Dừng" : "Nghe thử"}
                            >
                                {isPlaying ? <div className="w-3 h-3 bg-white rounded-sm" /> : <FaHeadphones size={14} />}
                            </button>
                            
                            <AnimatePresence>
                                {showPlayer && (
                                    <motion.div 
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 140, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="flex items-center gap-2 px-3 overflow-hidden"
                                    >
                                        <input 
                                            type="range"
                                            min="0"
                                            max={duration || 0}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="w-full h-1 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                        />
                                        <span className="text-[9px] font-bold text-emerald-700 whitespace-nowrap w-8">
                                            {formatTime(currentTime)}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <audio 
                                ref={audioRef} 
                                src={url} 
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onEnded={() => setIsPlaying(false)}
                                className="hidden" 
                            />
                        </div>
                    ) : (
                        <button 
                            onClick={() => onPreviewImage(url)}
                            className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all"
                            title="Xem ảnh"
                        >
                            <FaImage size={14} />
                        </button>
                    )}
                </div>
            )}

            {/* Upload Button */}
            <div className="relative group/btn">
                <input 
                    type="file" 
                    accept={isAudio ? "audio/*" : "image/*"} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    onChange={(e) => onUpload(e.target.files[0])}
                    disabled={uploading}
                />
                <button className={`flex items-center gap-2 rounded-2xl transition-all border font-black shadow-sm ${compact ? 'p-2.5' : 'px-5 py-2.5 text-xs'} ${
                    url 
                    ? 'bg-white border-emerald-100 text-emerald-600' 
                    : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:shadow-emerald-50'
                }`}>
                    {uploading ? (
                        <div className="w-4 h-4 border-2 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    ) : (
                        <>
                            {!compact && (url ? "Thay đổi" : label)}
                            {compact && (url ? <FaCloudUploadAlt size={14} /> : icon)}
                            {!compact && <FaCloudUploadAlt size={14} className="ml-0.5" />}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdminTestDetailPage;
