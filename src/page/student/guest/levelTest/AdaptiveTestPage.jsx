import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressHeader from "../../../../components/sections/student/guest/levelTestPage/ProgressHeader";
import QuestionCard from "../../../../components/sections/student/guest/levelTestPage/QuestionCard";
import AnswerOption from "../../../../components/sections/student/guest/levelTestPage/AnswerOption";
import AdaptiveLoading from "../../../../components/sections/student/guest/levelTestPage/AdaptiveLoading";
import { placementTestApi } from "../../../../api/placementTestApi";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const mapSkill = (skillType) => {
  if (!skillType) return "Grammar";
  const upper = skillType.toUpperCase();
  if (upper.includes("GRAMMAR")) return "Grammar";
  if (upper.includes("VOCABULARY") || upper.includes("VOCAB")) return "Vocabulary";
  if (upper.includes("READING") || upper.includes("READ")) return "Reading";
  if (upper.includes("LISTENING") || upper.includes("LISTEN")) return "Listening";
  return skillType;
};

const AdaptiveTestPage = ({ onFinish, onCancel }) => {
  // Navigation states
  const [totalAnswersCount, setTotalAnswersCount] = useState(0);

  // Active question states
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  // Loading and flow states
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPersonalizingOverlay, setShowPersonalizingOverlay] = useState(false);
<<<<<<< HEAD

=======

>>>>>>> origin/main
  // Local score/level tracking as a robust fallback
  const [skillLevels, setSkillLevels] = useState({
    Grammar: 3,
    Vocabulary: 3,
    Reading: 3,
    Listening: 3
  });

  // Session stats
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(480); // 8 minutes

  // Map backend question response to our frontend expected structure
  const mapBackendQuestionToFrontend = useCallback((bq) => {
    if (!bq) return null;

    let options = [];
    let answerIds = [];

    if (bq.answers && Array.isArray(bq.answers)) {
      options = bq.answers.map(a => a.content || a);
      answerIds = bq.answers.map(a => a.id);
    } else if (bq.options && Array.isArray(bq.options)) {
      options = bq.options.map(o => o.content || o);
      answerIds = bq.options.map(o => o.id || o);
    }

    return {
      id: bq.id,
      skill: mapSkill(bq.skillType || bq.skill),
      level: bq.level || bq.difficulty || 3,
      question: bq.content || bq.question || "",
      options: options,
      answerIds: answerIds,
      audio: bq.audioUrl || bq.audio || "",
      passage: bq.sharedContent || bq.passage || "",
      transcript: bq.transcript || "",
      originalAnswers: bq.answers || []
    };
  }, []);

  // 1. Initial mounting: Call startTest API
  useEffect(() => {
    let isMounted = true;

    const initTest = async () => {
      try {
        setInitialLoading(true);
        const res = await placementTestApi.startTest();
        const nextStep = res.data;

        if (isMounted) {
          if (nextStep.isFinished || !nextStep.nextQuestion) {
            // Already finished
            const finalScores = nextStep.scores || nextStep.skillLevels || nextStep.results || skillLevels;
            onFinish(finalScores);
          } else {
            const mappedQ = mapBackendQuestionToFrontend(nextStep.nextQuestion);
            setCurrentQuestion(mappedQ);
            setSelectedOption(null);
            setTotalAnswersCount(0);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Lỗi khi bắt đầu bài thi:", err);
          toast.error(err.message || "Không thể kết nối đến máy chủ để bắt đầu bài thi!");
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    initTest();

    return () => {
      isMounted = false;
    };
  }, [onFinish, mapBackendQuestionToFrontend]);

  // Keep track of skill levels as they are presented
  useEffect(() => {
    if (currentQuestion) {
      setSkillLevels(prev => ({
        ...prev,
        [currentQuestion.skill]: currentQuestion.level
      }));
    }
  }, [currentQuestion]);

  // 2. Timer countdown
  useEffect(() => {
    if (initialLoading) return;
    if (timeLeftSeconds <= 0) {
      onFinish(skillLevels);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeftSeconds, initialLoading, onFinish, skillLevels]);

  // 3. Submit option and fetch next question
  const handleNext = useCallback(async () => {
    if (selectedOption === null || !currentQuestion || isSubmitting) return;

    // Retrieve the actual selected answer's ID
    const selectedAnswerId = currentQuestion.answerIds[selectedOption] || null;

    try {
      setIsSubmitting(true);
      const res = await placementTestApi.submitAnswer(currentQuestion.id, selectedAnswerId);
      const nextStep = res.data;

      if (nextStep.isFinished || !nextStep.nextQuestion) {
        const finalScores = nextStep.scores || nextStep.skillLevels || nextStep.results || skillLevels;
        onFinish(finalScores);
      } else {
        const mappedNextQ = mapBackendQuestionToFrontend(nextStep.nextQuestion);
<<<<<<< HEAD

=======

>>>>>>> origin/main
        // Show AI personalizing animation when transitioning to a new skill
        const skillChanged = mappedNextQ.skill !== currentQuestion.skill;

        if (skillChanged) {
          setShowPersonalizingOverlay(true);
          setTimeout(() => {
            setCurrentQuestion(mappedNextQ);
            setSelectedOption(null);
            setTotalAnswersCount(prev => prev + 1);
            setShowPersonalizingOverlay(false);
          }, 1500);
        } else {
          setCurrentQuestion(mappedNextQ);
          setSelectedOption(null);
          setTotalAnswersCount(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error("Lỗi khi nộp câu trả lời:", err);
      toast.error(err.message || "Có lỗi xảy ra khi nộp bài!");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedOption, currentQuestion, isSubmitting, skillLevels, onFinish, mapBackendQuestionToFrontend]);

  // Keyboard accessibility listeners (A, B, C, D to choose, Enter to continue)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showPersonalizingOverlay || isSubmitting || initialLoading) return;
<<<<<<< HEAD

=======

>>>>>>> origin/main
      const key = e.key.toUpperCase();
      if (key === "A") setSelectedOption(0);
      if (key === "B") setSelectedOption(1);
      if (key === "C") setSelectedOption(2);
      if (key === "D") setSelectedOption(3);

      if (e.key === "Enter" && selectedOption !== null) {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOption, handleNext, showPersonalizingOverlay, isSubmitting, initialLoading]);

  const minutesLeft = Math.ceil(timeLeftSeconds / 60);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-emerald-600">
        <Loader2 className="animate-spin text-5xl mb-4 text-emerald-500" />
        <span className="font-bold text-lg text-gray-600">Đang tải câu hỏi từ hệ thống AI...</span>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between pb-12">
      <AnimatePresence>
        {showPersonalizingOverlay && <AdaptiveLoading />}
      </AnimatePresence>

      <ProgressHeader
        currentQuestion={totalAnswersCount + 1}
        totalQuestions={20}
        timeLeft={minutesLeft}
        onExit={onCancel}
      />

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 mt-8 flex-1 flex flex-col justify-center">
        <QuestionCard question={currentQuestion} currentSkill={currentQuestion.skill}>
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt, idx) => (
              <AnswerOption
                key={idx}
                option={opt}
                index={idx}
                isSelected={selectedOption === idx}
                onClick={() => !isSubmitting && setSelectedOption(idx)}
              />
            ))}
          </div>
        </QuestionCard>

        <div className="flex justify-end mt-6">
          <motion.button
            type="button"
            onClick={handleNext}
            disabled={selectedOption === null || isSubmitting}
            whileHover={selectedOption !== null && !isSubmitting ? { scale: 1.02 } : {}}
            whileTap={selectedOption !== null && !isSubmitting ? { scale: 0.98 } : {}}
<<<<<<< HEAD
            className={`px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all ${selectedOption === null || isSubmitting
=======
            className={`px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all ${
              selectedOption === null || isSubmitting
>>>>>>> origin/main
              ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200/50"
              }`}
          >
            {isSubmitting ? (
              <>
                Đang xử lý...
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                Tiếp tục
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </main>
    </div>
  );
};

export default AdaptiveTestPage;