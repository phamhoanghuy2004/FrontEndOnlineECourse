const SingleQuestionBlock = ({ question, type, userAnswers, onSelect, isSubmitted }) => {
    const optionsLabel = ['A', 'B', 'C', 'D'];
    return (
        <div id={`question-${question.id}`} className="flex flex-col gap-4">
            <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 font-bold rounded-full text-sm">{question.id.replace(/\D/g, '')}</span>
                <div className="flex-1 pt-1">
                    {question.image && <div className="mb-4 max-w-md rounded-lg overflow-hidden border border-gray-200"><img src={question.image} alt="Question" className="w-full h-auto" /></div>}
                    {question.audio && <div className="mb-4 bg-gray-100 p-2 rounded-full w-fit"><audio controls className="h-8 w-64"><source src={question.audio} type="audio/mpeg" /></audio></div>}
                    {question.text && <p className="font-medium text-gray-800 mb-3 text-lg">{question.text}</p>}
                    <div className="space-y-2">
                        {question.options.map((opt, idx) => {
                            const label = optionsLabel[idx];
                            const isSelected = userAnswers[question.id] === label;
                            let resultClass = "";
                            if (isSubmitted) {
                                if (question.correctAnswer === label) resultClass = "bg-green-100 border-green-500 text-green-700";
                                else if (isSelected && question.correctAnswer !== label) resultClass = "bg-red-50 border-red-500 text-red-700";
                            }
                            return (
                                <label key={idx} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-gray-50 ${isSelected && !isSubmitted ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200'} ${resultClass}`}>
                                    <input type="radio" name={question.id} className="hidden" disabled={isSubmitted} checked={isSelected} onChange={() => onSelect(question.id, label)} />
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-gray-500'} ${isSubmitted && question.correctAnswer === label ? '!bg-green-600 !border-green-600 !text-white' : ''} ${isSubmitted && isSelected && question.correctAnswer !== label ? '!bg-red-500 !border-red-500 !text-white' : ''}`}>{label}</div>
                                    <span className="text-sm md:text-base">{opt}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleQuestionBlock;