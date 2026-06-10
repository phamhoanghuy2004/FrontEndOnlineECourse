import React from "react";
import { BookOpen } from "lucide-react";

const ReadingQuestion = ({ question, children }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: Passage (Scrollable) */}
      <div className="lg:col-span-7 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Tài liệu đọc (Reading Passage)
          </span>
        </div>
        
        <div className="w-full bg-gray-50 border border-gray-200/50 rounded-2xl p-5 sm:p-6 shadow-inner overflow-y-auto lg:max-h-[480px] min-h-[180px] leading-relaxed text-gray-700 text-sm sm:text-base scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {question.passage.split("\n").map((paragraph, index) => (
            <p key={index} className={index > 0 ? "mt-4" : ""} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Sticky Question + Options */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-snug">
            {question.question}
          </h2>
        </div>

        <div className="w-full space-y-3">{children}</div>
      </div>

    </div>
  );
};

export default ReadingQuestion;
