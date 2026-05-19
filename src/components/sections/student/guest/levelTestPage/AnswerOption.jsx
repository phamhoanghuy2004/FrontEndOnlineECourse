import React from "react";
import { motion } from "framer-motion";

const AnswerOption = ({ option, index, isSelected, onClick }) => {
  const letters = ["A", "B", "C", "D"];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer outline-none ${
        isSelected
          ? "border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100/30"
          : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/10 hover:shadow-sm"
      }`}
    >
      {/* Option Key Badge (A, B, C, D) */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base border-2 transition-colors flex-shrink-0 ${
          isSelected
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-gray-300 text-gray-500 group-hover:border-emerald-400 group-hover:text-emerald-600"
        }`}
      >
        {letters[index]}
      </div>

      {/* Option Text */}
      <span
        className={`text-sm sm:text-base font-semibold leading-relaxed ${
          isSelected ? "text-emerald-950 font-bold" : "text-gray-700"
        }`}
      >
        {option}
      </span>

      {/* Keyboard Shortcut Indicator */}
      <div className="ml-auto hidden md:block">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
            isSelected
              ? "border-emerald-300 text-emerald-600 bg-white"
              : "border-gray-200 text-gray-400"
          }`}
        >
          Phím {letters[index]}
        </span>
      </div>
    </motion.button>
  );
};

export default AnswerOption;
