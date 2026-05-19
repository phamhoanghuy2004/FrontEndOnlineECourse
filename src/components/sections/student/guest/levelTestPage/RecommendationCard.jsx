import React from "react";
import { BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

const RecommendationCard = ({ course, onAction }) => {
  const { title, description, level, duration, image, tag } = course;

  const getLevelBadgeStyles = (lvl) => {
    switch (lvl?.toUpperCase()) {
      case "BASIC":
      case "CƠ BẢN":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "MEDIUM":
      case "TRUNG CẤP":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "ADVANCE":
      case "NÂNG CAO":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  const getLevelLabel = (lvl) => {
    switch (lvl?.toUpperCase()) {
      case "BASIC": return "Cơ bản";
      case "MEDIUM": return "Trung cấp";
      case "ADVANCE": return "Nâng cao";
      default: return lvl;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between h-full group hover:shadow-md hover:border-emerald-100/50"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={image || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {tag && (
          <span className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded">
            {tag}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getLevelBadgeStyles(
                level
              )}`}
            >
              {getLevelLabel(level)}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {duration || "8 tuần"}
            </span>
          </div>

          <h3 className="font-extrabold text-gray-900 text-base sm:text-lg group-hover:text-emerald-600 transition-colors line-clamp-1">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-gray-500 font-semibold line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onAction && onAction(course)}
            className="w-full bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-50/50 group/btn"
          >
            <BookOpen className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
            Bắt đầu học ngay
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
