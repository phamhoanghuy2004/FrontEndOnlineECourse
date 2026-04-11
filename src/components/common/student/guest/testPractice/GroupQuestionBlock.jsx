import SingleQuestionBlock from "./SingleQuestionBlock";
import { FaPlay } from "react-icons/fa";

// 💥 ĐÃ THÊM: Nhận 2 props flaggedQuestions và onToggleFlag từ cha truyền xuống
const GroupQuestionBlock = ({ group, type, userAnswers, flaggedQuestions, onSelect, onToggleFlag, isSubmitted }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-8 border-b border-gray-100 last:border-0 last:pb-0">
            {/* Box Hiển thị Nội dung Nhóm (Âm thanh / Đoạn văn) */}
            {/* 💥 CHỐNG COPY: Thêm select-none vào khối này để không bôi đen được đoạn văn */}
            <div className="lg:w-1/2 bg-gray-50/50 p-5 rounded-xl border border-gray-200 h-fit select-none">
                
                {group.audioUrl && (
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-500 uppercase tracking-wide">
                            <FaPlay size={10} /> Audio bài nghe
                        </div>
                        <audio controls className="w-full h-10 rounded-lg">
                            <source src={group.audioUrl} type="audio/mpeg" />
                        </audio>
                    </div>
                )}
                
                {group.imageUrl && (
                    // 💥 CHỐNG LƯU ẢNH: Thêm pointer-events-none để cấm click chuột phải tải ảnh về
                    <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 pointer-events-none">
                        <img src={group.imageUrl} alt="Group Reference" className="w-full h-auto" />
                    </div>
                )}

                {group.content && (
                    <div className="prose prose-sm text-gray-700 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        {group.title && <h4 className="font-bold mb-2">{group.title}</h4>}
                        <div dangerouslySetInnerHTML={{ __html: group.content }}></div>
                    </div>
                )}
            </div>

            {/* Cột hiển thị Câu hỏi thuộc Nhóm */}
            <div className="lg:w-1/2 space-y-8">
                {group.questions && group.questions.map((question) => (
                    <SingleQuestionBlock 
                        key={question.id} 
                        question={question} 
                        type={type} 
                        userAnswers={userAnswers} 
                        flaggedQuestions={flaggedQuestions} // 💥 Truyền xuống SingleQuestionBlock
                        onSelect={onSelect} 
                        onToggleFlag={onToggleFlag}         // 💥 Truyền xuống SingleQuestionBlock
                        isSubmitted={isSubmitted} 
                    />
                ))}
            </div>
        </div>
    );
};

export default GroupQuestionBlock;