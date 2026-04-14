import { FaFlag, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const SingleQuestionBlock = ({ question, type, userAnswers, flaggedQuestions, onSelect, onToggleFlag, isSubmitted, isReviewMode }) => {
    const optionsLabel = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    const isFlagged = flaggedQuestions && flaggedQuestions[question.id];
    
    // Lấy đáp án user đã chọn (Bắt an toàn cả dạng số lẫn chuỗi)
    const selectedAnswerId = userAnswers?.[question.id] || userAnswers?.[question.id?.toString()];

    return (
        <div id={`question-${question.id}`} className={`flex flex-col gap-4 relative group ${!isReviewMode ? 'select-none' : ''}`}>
            <div className="flex gap-3">
                <div className="flex flex-col items-center gap-2">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 font-bold rounded-full text-sm">
                        {question.displayNum || question.id.toString().slice(-2)}
                    </span>
                    
                    {/* Ẩn nút Flag nếu đang ở chế độ xem lại */}
                    {!isReviewMode && (
                        <button 
                            onClick={() => onToggleFlag(question.id)}
                            disabled={isSubmitted}
                            className={`p-1.5 rounded transition-all ${isFlagged ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-400 hover:bg-red-50'} ${isSubmitted ? 'cursor-not-allowed opacity-50' : ''}`}
                            title="Đánh dấu để xem lại sau"
                        >
                            <FaFlag size={14} />
                        </button>
                    )}
                </div>

                <div className="flex-1 pt-1">
                    
                    {/* Nội dung câu hỏi */}
                    {question.imageUrl && <div className="mb-4 max-w-md rounded-lg overflow-hidden border border-gray-200 pointer-events-none"><img src={question.imageUrl} alt="Question" className="w-full h-auto" /></div>}
                    {question.audioUrl && <div className="mb-4 bg-gray-100 p-2 rounded-full w-fit"><audio controls className="h-8 w-64"><source src={question.audioUrl} type="audio/mpeg" /></audio></div>}
                    {question.content && <p className="font-medium text-gray-800 mb-3 text-lg">{question.content}</p>}
                    
                    {/* Render Đáp án */}
                    <div className="space-y-2">
                        {question.answers && question.answers.map((answer, idx) => {
                            const label = optionsLabel[idx] || (idx + 1).toString();
                            
                            // 💥 CHỐNG LỖI SO SÁNH: Ép tất cả về String để so sánh an toàn 100%
                            const isSelected = selectedAnswerId?.toString() === answer.id?.toString();
                            
                            // 💥 CHỐNG LỖI JACKSON: Bắt cả isCorrect và correct
                            const isTrueAnswer = answer.isCorrect === true || answer.correct === true;

                            let btnClass = 'border-gray-200 hover:bg-gray-50 bg-white';
                            let icon = null;

                            if (isReviewMode) {
                                if (isTrueAnswer) {
                                    // Đáp án ĐÚNG (Luôn tô xanh)
                                    btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500';
                                    icon = <FaCheckCircle className="text-emerald-500" />;
                                } else if (isSelected && !isTrueAnswer) {
                                    // Đáp án SAI mà User lỡ chọn (Tô Đỏ)
                                    btnClass = 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500';
                                    icon = <FaTimesCircle className="text-red-500" />;
                                } else {
                                    // Mấy câu còn lại làm mờ đi
                                    btnClass = 'border-gray-100 bg-gray-50 opacity-60 text-gray-400';
                                }
                            } else {
                                // Logic lúc làm bài
                                if (isSelected) {
                                    btnClass = 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500';
                                }
                            }

                            // Chặn tương tác nếu đã nộp hoặc đang review
                            const isDisabled = isSubmitted || isReviewMode;

                            return (
                                <label 
                                    key={answer.id} 
                                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all 
                                        ${btnClass} 
                                        ${isDisabled ? 'cursor-default' : 'cursor-pointer'}
                                    `}
                                >
                                    <input 
                                        type="radio" 
                                        name={`q-${question.id}`} 
                                        className="hidden" 
                                        disabled={isDisabled} 
                                        checked={isSelected} 
                                        onChange={() => !isDisabled && onSelect(question.id, answer.id)} 
                                    />
                                    
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors 
                                        ${isSelected && !isReviewMode ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                                        ${isReviewMode && isTrueAnswer ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                                        ${isReviewMode && isSelected && !isTrueAnswer ? 'bg-red-500 border-red-500 text-white' : ''}
                                        ${!isSelected && !isReviewMode ? 'bg-white border-gray-300 text-gray-500' : ''}
                                        ${isReviewMode && !isTrueAnswer && !isSelected ? 'bg-gray-100 border-gray-200 text-gray-400' : ''}
                                    `}>
                                        {label}
                                    </div>
                                    
                                    <span className="text-sm md:text-base flex-1">{answer.content}</span>
                                    {icon && <span className="flex-shrink-0 mt-0.5">{icon}</span>}
                                </label>
                            );
                        })}
                    </div>

                    {/* 💥 KHU VỰC GIẢI THÍCH CHI TIẾT */}
                    {isReviewMode && question.explanation && (
                        <div className="mt-4 p-4 bg-blue-50/70 border border-blue-100 rounded-xl">
                            <h4 className="text-blue-800 font-extrabold text-[13px] uppercase tracking-wide mb-2 flex items-center gap-2">
                                💡 Giải thích chi tiết
                            </h4>
                            <div 
                                className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: question.explanation }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleQuestionBlock;