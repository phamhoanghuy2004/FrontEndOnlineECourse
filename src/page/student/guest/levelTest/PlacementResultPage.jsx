import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BarChart from "../../../../components/sections/student/guest/levelTestPage/BarChart";
import SkillCard from "../../../../components/sections/student/guest/levelTestPage/SkillCard";
import RecommendationCard from "../../../../components/sections/student/guest/levelTestPage/RecommendationCard";
import { RefreshCw, Award, Sparkles, BookOpen } from "lucide-react";
import ToeicBasic from "../../../../assets/ToeicBasic.png";
import ToeicAdvanced from "../../../../assets/ToeicAdvanced.png";
import courseRecommendApi from "../../../../api/courseRecommendApi";

const PlacementResultPage = ({ scores, onRetake, onSelectCourse }) => {
  const [insightData, setInsightData] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await courseRecommendApi.getSkillInsights();
        setInsightData(res.data);
      } catch (err) {
        console.error("Lỗi khi tải thông tin đánh giá:", err);
      }
    };
    fetchInsights();
  }, []);

  const getFeedback = (skill, level) => {
    if (skill === "Grammar") {
      switch (level) {
        case 1:
        case 2:
          return "Cần củng cố các thì cơ bản và danh/động từ chính.";
        case 3:
          return "Bạn đã nắm nền tảng ngữ pháp cơ bản nhưng vẫn cần cải thiện Relative Clauses (Mệnh đề quan hệ).";
        case 4:
        case 5:
          return "Ngữ pháp vững chắc. Nên tập trung vào cấu trúc đảo ngữ nâng cao và câu điều kiện hỗn hợp.";
        default:
          return "";
      }
    } else if (skill === "Vocabulary") {
      switch (level) {
        case 1:
        case 2:
          return "Cần cải thiện từ vựng Business TOEIC về chủ đề văn phòng, giao dịch.";
        case 3:
          return "Từ vựng ở mức khá. Hãy trau dồi các collocations thương mại và từ đa nghĩa.";
        case 4:
        case 5:
          return "Vốn từ phong phú. Tập trung học từ vựng học thuật phức tạp và thành ngữ thường gặp.";
        default:
          return "";
      }
    } else if (skill === "Reading") {
      switch (level) {
        case 1:
        case 2:
          return "Cần luyện đọc hiểu quảng cáo ngắn và email công việc đơn giản.";
        case 3:
          return "Đọc hiểu tốt các đoạn văn ngắn, cần cải thiện tốc độ đọc hiểu ở Part 7.";
        case 4:
        case 5:
          return "Kỹ năng đọc xuất sắc. Tiếp tục tối ưu hóa thời gian phân bổ cho các bài đọc kép/ba.";
        default:
          return "";
      }
    } else if (skill === "Listening") {
      switch (level) {
        case 1:
        case 2:
          return "Cần luyện nghe các đoạn hội thoại ngắn Part 2 và nhận biết bẫy đồng âm.";
        case 3:
          return "Nghe tốt hội thoại ngắn, cần nâng cao kỹ năng nghe hiểu bài nói dài Part 4.";
        case 4:
        case 5:
          return "Khả năng nghe tuyệt vời. Tập trung nghe các giọng bản xứ khác nhau (Anh, Úc, Mỹ).";
        default:
          return "";
      }
    }
    return "Năng lực ổn định, tiếp tục phát huy.";
  };



  const recommendedCourses = [
    {
      id: "rec_1",
      title: "TOEIC Foundation Grammar",
      description: "Lấy lại căn bản ngữ pháp trọng tâm để sẵn sàng cho TOEIC 450+.",
      level: "BASIC",
      duration: "6 tuần",
      image: ToeicBasic,
      tag: "Ngữ pháp"
    },
    {
      id: "rec_2",
      title: "Business Vocabulary",
      description: "Tập trung từ vựng chuyên ngành thương mại, tài chính thường gặp trong đề thi.",
      level: "MEDIUM",
      duration: "8 tuần",
      image: ToeicAdvanced,
      tag: "Từ vựng"
    },
    {
      id: "rec_3",
      title: "TOEIC Listening Intensive",
      description: "Rèn luyện nghe hiểu chuyên sâu các phần Part 1-4, nâng cao phản xạ nghe.",
      level: "MEDIUM",
      duration: "10 tuần",
      image: ToeicAdvanced,
      tag: "Nghe hiểu"
    }
  ];

  const fallbackSkills = [
    { tagName: "Nghe hiểu (Listening)", score: (scores.Listening || 3) * 20, masteryLevel: `Cấp độ ${scores.Listening || 3}` },
    { tagName: "Đọc hiểu (Reading)", score: (scores.Reading || 3) * 20, masteryLevel: `Cấp độ ${scores.Reading || 3}` },
    { tagName: "Từ vựng (Vocabulary)", score: (scores.Vocabulary || 3) * 20, masteryLevel: `Cấp độ ${scores.Vocabulary || 3}` },
    { tagName: "Ngữ pháp (Grammar)", score: (scores.Grammar || 3) * 20, masteryLevel: `Cấp độ ${scores.Grammar || 3}` }
  ];

  const chartSkills = insightData?.skills || fallbackSkills;

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 pt-24 select-none">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Results Page Header */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500 animate-spin" />
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Kết quả đánh giá
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              Báo cáo năng lực cá nhân hóa
            </h1>
            <p className="text-sm text-gray-500 font-semibold max-w-xl">
              Lộ trình học tập của bạn đã được thiết kế tinh chỉnh dựa trên kết quả kiểm tra thích ứng vừa qua.
            </p>
          </div>

          <button
            onClick={onRetake}
            className="flex items-center gap-2 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/20 text-gray-600 hover:text-emerald-700 font-bold px-5 py-3 rounded-2xl transition-all cursor-pointer bg-white text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Đánh giá lại
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Chart Panel */}
          <div className="lg:col-span-5 space-y-4 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 px-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="font-extrabold text-gray-800 text-base sm:text-lg">
                Biểu đồ cột năng lực
              </h2>
            </div>
            <BarChart skills={chartSkills} />
            {insightData?.motivationalRemark && (
              <div className="mt-6 p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 border border-emerald-100 rounded-3xl shadow-sm relative overflow-hidden">
                {/* Decorative radial glows */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>

                {/* Bọc toàn bộ bằng flex-col để chia dòng */}
                <div className="flex flex-col gap-3">

                  {/* DÒNG 1: Icon và Tiêu đề nằm ngang (Căn giữa theo trục Y) */}
                  <div className="flex items-center gap-3">
                    {/* Thu nhỏ icon lại một chút để cân xứng với text-xs của tiêu đề */}
                    <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl text-white shadow-sm shadow-emerald-200/50">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest mt-0.5">
                      ĐÁNH GIÁ CHUYÊN SÂU TỪ HỆ THỐNG AI
                    </h4>
                  </div>

                  {/* DÒNG 2: Nội dung nhận xét - Thêm text-justify để căn đều 2 bên */}
                  <p className="text-slate-800 text-sm sm:text-base font-bold leading-relaxed italic text-justify">
                    "{insightData.motivationalRemark}"
                  </p>

                </div>
              </div>
            )}
          </div>

          {/* Detailed Skill Breakdown */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">

              <div className="space-y-1">
                <h2 className="font-extrabold text-gray-900 text-lg">
                  Chi tiết điểm kỹ năng
                </h2>
                <p className="text-xs text-gray-400 font-bold">
                  Nhận xét chi tiết từ hệ thống học tập AI dành riêng cho bạn
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(scores).map((skill) => (
                  <SkillCard
                    key={skill}
                    skill={skill}
                    level={scores[skill]}
                    feedback={getFeedback(skill, scores[skill])}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* Personalized Recommendations Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Khóa học đề xuất cho bạn
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <RecommendationCard
                key={course.id}
                course={course}
                onAction={(c) => onSelectCourse && onSelectCourse(c)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlacementResultPage;
