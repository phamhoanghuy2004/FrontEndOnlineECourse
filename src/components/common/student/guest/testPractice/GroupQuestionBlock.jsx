import SingleQuestionBlock from "./SingleQuestionBlock";
import { FaPlay } from "react-icons/fa";

const GroupQuestionBlock = ({ group, type, userAnswers, onSelect, isSubmitted }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-8 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="lg:w-1/2 bg-gray-50/50 p-5 rounded-xl border border-gray-200 h-fit">
                {group.audio && <div className="mb-4"><div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-500 uppercase tracking-wide"><FaPlay size={10} /> Audio đoạn hội thoại</div><audio controls className="w-full h-10 rounded-lg"><source src={group.audio} type="audio/mpeg" /></audio></div>}
                {group.passageContent && <div className="prose prose-sm text-gray-700 bg-white p-4 rounded-lg shadow-sm border border-gray-100">{group.passageTitle && <h4 className="font-bold mb-2">{group.passageTitle}</h4>}<div dangerouslySetInnerHTML={{ __html: group.passageContent }}></div></div>}
                {isSubmitted && group.script && <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200 whitespace-pre-line"><strong>Transcript:</strong><br />{group.script}</div>}
            </div>
            <div className="lg:w-1/2 space-y-8">
                {group.questions.map((question) => <SingleQuestionBlock key={question.id} question={question} type={type} userAnswers={userAnswers} onSelect={onSelect} isSubmitted={isSubmitted} />)}
            </div>
        </div>
    );
};

export default GroupQuestionBlock;