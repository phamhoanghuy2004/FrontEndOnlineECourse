import React from "react";
import { BookOpen, Headphones, PenTool, Award } from "lucide-react";

const SkillCard = ({ skill, level, feedback }) => {
  const getSkillConfig = (skillName) => {
    switch (skillName) {
      case "Grammar":
        return {
          title: "Ngữ pháp (Grammar)",
          icon: <PenTool className="w-5 h-5 text-indigo-600" />,
          colorClass: "bg-indigo-50 border-indigo-100",
          badgeClass: "bg-indigo-100 text-indigo-700"
        };
      case "Vocabulary":
        return {
          title: "Từ vựng (Vocabulary)",
          icon: <Award className="w-5 h-5 text-amber-600" />,
          colorClass: "bg-amber-50 border-amber-100",
          badgeClass: "bg-amber-100 text-amber-700"
        };
      case "Reading":
        return {
          title: "Đọc hiểu (Reading)",
          icon: <BookOpen className="w-5 h-5 text-sky-600" />,
          colorClass: "bg-sky-50 border-sky-100",
          badgeClass: "bg-sky-100 text-sky-700"
        };
      case "Listening":
        return {
          title: "Nghe hiểu (Listening)",
          icon: <Headphones className="w-5 h-5 text-emerald-600" />,
          colorClass: "bg-emerald-50 border-emerald-100",
          badgeClass: "bg-emerald-100 text-emerald-700"
        };
      default:
        return {
          title: skillName,
          icon: <Award className="w-5 h-5 text-gray-600" />,
          colorClass: "bg-gray-50 border-gray-100",
          badgeClass: "bg-gray-100 text-gray-700"
        };
    }
  };

  const config = getSkillConfig(skill);

  return (
    <div className={`p-5 rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between gap-4 relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-1.5 h-full ${
        skill === "Grammar" ? "bg-indigo-500" :
        skill === "Vocabulary" ? "bg-amber-500" :
        skill === "Reading" ? "bg-sky-500" : "bg-emerald-500"
      }`}></div>

      <div>
        <div className="flex items-center justify-between gap-2 pl-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${config.colorClass}`}>
              {config.icon}
            </div>
            <h4 className="font-bold text-gray-800 text-sm sm:text-base">
              {config.title}
            </h4>
          </div>
          
          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${config.badgeClass}`}>
            Cấp độ {level}
          </span>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed pl-2">
          {feedback || "Năng lực của bạn đang ở mức khá tốt. Hãy tiếp tục luyện tập để đạt mức cao hơn!"}
        </p>
      </div>

      <div className="flex gap-1 mt-2 pl-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full ${
              idx < level
                ? skill === "Grammar" ? "bg-indigo-500" :
                  skill === "Vocabulary" ? "bg-amber-500" :
                  skill === "Reading" ? "bg-sky-500" : "bg-emerald-500"
                : "bg-gray-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillCard;
