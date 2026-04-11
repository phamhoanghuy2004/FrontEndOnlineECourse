import { FaFlag } from "react-icons/fa";

// 💥 Nhận thêm props: flaggedQuestions và onToggleFlag
const SingleQuestionBlock = ({ question, type, userAnswers, flaggedQuestions, onSelect, onToggleFlag, isSubmitted }) => {
    const optionsLabel = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    const isFlagged = flaggedQuestions && flaggedQuestions[question.id];

    return (
        // 💥 CHỐNG COPY: Thêm class select-none vào thẻ div ngoài cùng
        <div id={`question-${question.id}`} className="flex flex-col gap-4 select-none relative group">
            <div className="flex gap-3">
                <div className="flex flex-col items-center gap-2">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 font-bold rounded-full text-sm">
                        {question.displayNum || question.id.toString().slice(-2)}
                    </span>
                    
                    {/* 💥 NÚT ĐÁNH DẤU XEM LẠI */}
                    <button 
                        onClick={() => onToggleFlag(question.id)}
                        disabled={isSubmitted}
                        className={`p-1.5 rounded transition-all ${isFlagged ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-400 hover:bg-red-50'} ${isSubmitted ? 'cursor-not-allowed opacity-50' : ''}`}
                        title="Đánh dấu để xem lại sau"
                    >
                        <FaFlag size={14} />
                    </button>
                </div>

                <div className="flex-1 pt-1">
                    
                    {/* Hiển thị Image & Audio & Text */}
                    {question.imageUrl && <div className="mb-4 max-w-md rounded-lg overflow-hidden border border-gray-200 pointer-events-none"><img src={question.imageUrl} alt="Question" className="w-full h-auto" /></div>}
                    {question.audioUrl && <div className="mb-4 bg-gray-100 p-2 rounded-full w-fit"><audio controls className="h-8 w-64"><source src={question.audioUrl} type="audio/mpeg" /></audio></div>}
                    {question.content && <p className="font-medium text-gray-800 mb-3 text-lg">{question.content}</p>}
                    
                    <div className="space-y-2">
                        {question.answers && question.answers.map((answer, idx) => {
                            const label = optionsLabel[idx] || (idx + 1).toString();
                            const isSelected = userAnswers[question.id] === answer.id;

                            return (
                                <label 
                                    key={answer.id} 
                                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-gray-50 
                                        ${isSelected ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200'} 
                                        ${isSubmitted ? 'cursor-default pointer-events-none opacity-90' : ''}
                                    `}
                                >
                                    {/* 💥 Khi isSubmitted = true, radio này sẽ bị disabled, không cho người dùng thay đổi kết quả */}
                                    <input 
                                        type="radio" 
                                        name={question.id} 
                                        className="hidden" 
                                        disabled={isSubmitted} 
                                        checked={isSelected} 
                                        onChange={() => onSelect(question.id, answer.id)} 
                                    />
                                    
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors 
                                        ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-gray-500'}
                                    `}>
                                        {label}
                                    </div>
                                    
                                    <span className="text-sm md:text-base text-gray-700">{answer.content}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleQuestionBlock;