import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ListeningQuestion from "./ListeningQuestion";
import ReadingQuestion from "./ReadingQuestion";

const QuestionCard = ({ question, currentSkill, children }) => {
  const getSkillColor = (skill) => {
    switch (skill) {
      case "Grammar":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Vocabulary":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Reading":
        return "bg-sky-50 text-sky-700 border-sky-100";
      case "Listening":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const isReading = currentSkill === "Reading" && question.passage;
  const isListening = currentSkill === "Listening" && question.audio;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="w-full bg-white rounded-3xl border border-gray-100 shadow-md shadow-gray-100/50 p-6 sm:p-8 md:p-10"
      >
        {/* Section Skill Badge */}
        <div className="flex justify-between items-center mb-6">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getSkillColor(
              currentSkill
            )}`}
          >
            {currentSkill}
          </span>
          <span className="text-xs font-semibold text-gray-400">
            Độ khó: Level {question.level}
          </span>
        </div>

        {/* Dynamic rendering based on type */}
        {isListening ? (
          <ListeningQuestion question={question}>{children}</ListeningQuestion>
        ) : isReading ? (
          <ReadingQuestion question={question}>{children}</ReadingQuestion>
        ) : (
          /* Standard Question Layout (Grammar / Vocabulary) */
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Chọn câu trả lời chính xác nhất để hoàn thành câu sau:
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                {question.question}
              </h2>
            </div>

            <div className="space-y-3">{children}</div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionCard;
