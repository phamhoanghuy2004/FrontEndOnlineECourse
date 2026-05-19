import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressHeader from "../../../../components/sections/student/guest/levelTestPage/ProgressHeader";
import QuestionCard from "../../../../components/sections/student/guest/levelTestPage/QuestionCard";
import AnswerOption from "../../../../components/sections/student/guest/levelTestPage/AnswerOption";
import AdaptiveLoading from "../../../../components/sections/student/guest/levelTestPage/AdaptiveLoading";
import { placementTestData } from "../../../../data/placementTestData";
import { ArrowRight } from "lucide-react";

const SKILLS = ["Grammar", "Vocabulary", "Reading", "Listening"];

const AdaptiveTestPage = ({ onFinish, onCancel }) => {
  // Navigation states
  const [activeSkillIdx, setActiveSkillIdx] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(3);
  const [questionIndexInSkill, setQuestionIndexInSkill] = useState(0);
  const [totalAnswersCount, setTotalAnswersCount] = useState(0);

  // Tracking questions used to prevent duplicates
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);

  // Active question state
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  // Session stats
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(480); // 8 minutes
  const [showPersonalizingOverlay, setShowPersonalizingOverlay] = useState(false);
  const [finishedSkillsLevels, setFinishedSkillsLevels] = useState({
    Grammar: 3,
    Vocabulary: 3,
    Reading: 3,
    Listening: 3
  });

  const currentSkill = SKILLS[activeSkillIdx];

  // Helper: Retrieve next unused question at a given skill + level
  const getNextUnusedQuestion = useCallback((skill, level, usedIds) => {
    const list = placementTestData[skill]?.[level] || [];
    const available = list.filter((q) => !usedIds.includes(q.id));
    return available[0] || list[0] || null;
  }, []);

  // Initialize first question
  useEffect(() => {
    const q = getNextUnusedQuestion(currentSkill, currentLevel, usedQuestionIds);
    setCurrentQuestion(q);
    setSelectedOption(null);
  }, [activeSkillIdx, currentLevel, currentSkill, getNextUnusedQuestion, usedQuestionIds]);

  // Timer countdown
  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      onFinish(finishedSkillsLevels);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeftSeconds, onFinish, finishedSkillsLevels]);

  const handleNext = useCallback(() => {
    if (selectedOption === null || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correct;
    let nextLevel = currentLevel;

    if (isCorrect) {
      nextLevel = Math.min(5, currentLevel + 1);
    } else {
      nextLevel = currentLevel - 1;
    }

    const updatedUsedIds = [...usedQuestionIds, currentQuestion.id];
    setUsedQuestionIds(updatedUsedIds);

    const nextQIndexInSkill = questionIndexInSkill + 1;
    const newTotalAnswersCount = totalAnswersCount + 1;
    setTotalAnswersCount(newTotalAnswersCount);

    const isBranchFinished = nextLevel === 0 || nextQIndexInSkill >= 5;

    if (isBranchFinished) {
      let finalLevel = 1;
      if (nextLevel > 0) {
        finalLevel = isCorrect ? currentLevel : Math.max(1, currentLevel - 1);
      }

      const updatedFinishedLevels = {
        ...finishedSkillsLevels,
        [currentSkill]: finalLevel
      };
      setFinishedSkillsLevels(updatedFinishedLevels);

      if (activeSkillIdx < SKILLS.length - 1) {
        setShowPersonalizingOverlay(true);
        setTimeout(() => {
          setActiveSkillIdx((prev) => prev + 1);
          setCurrentLevel(3);
          setQuestionIndexInSkill(0);
          setShowPersonalizingOverlay(false);
        }, 1500);
      } else {
        onFinish(updatedFinishedLevels);
      }
    } else {
      setCurrentLevel(nextLevel);
      setQuestionIndexInSkill(nextQIndexInSkill);
    }
  }, [
    selectedOption,
    currentQuestion,
    currentLevel,
    usedQuestionIds,
    questionIndexInSkill,
    totalAnswersCount,
    finishedSkillsLevels,
    currentSkill,
    activeSkillIdx,
    onFinish
  ]);

  // Keyboard accessibility listeners (A, B, C, D to choose, Enter to continue)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showPersonalizingOverlay) return;
      
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
  }, [selectedOption, handleNext, showPersonalizingOverlay]);

  const minutesLeft = Math.ceil(timeLeftSeconds / 60);

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
        <QuestionCard question={currentQuestion} currentSkill={currentSkill}>
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt, idx) => (
              <AnswerOption
                key={idx}
                option={opt}
                index={idx}
                isSelected={selectedOption === idx}
                onClick={() => setSelectedOption(idx)}
              />
            ))}
          </div>
        </QuestionCard>

        <div className="flex justify-end mt-6">
          <motion.button
            type="button"
            onClick={handleNext}
            disabled={selectedOption === null}
            whileHover={selectedOption !== null ? { scale: 1.02 } : {}}
            whileTap={selectedOption !== null ? { scale: 0.98 } : {}}
            className={`px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all ${
              selectedOption === null
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200/50"
            }`}
          >
            Tiếp tục
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </main>
    </div>
  );
};

export default AdaptiveTestPage;
