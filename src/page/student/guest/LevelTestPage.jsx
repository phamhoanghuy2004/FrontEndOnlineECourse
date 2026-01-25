import { useState, useEffect, useCallback } from 'react';
import LevelTestLanding from '../../../components/sections/student/guest/levelTestPage/LevelTestLanding';
import LevelTestQuiz from '../../../components/sections/student/guest/levelTestPage/LevelTestQuiz';
import LevelTestResult from '../../../components/sections/student/guest/levelTestPage/LevelTestResult';
import { mockQuestions } from '../../../data/levelTestData';

const LevelTestPage = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [currentSection, setCurrentSection] = useState('listening');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1200);
  const [score, setScore] = useState({ correct: 0, total: 20 });

  const handleSubmitTest = useCallback(() => {
    let correct = 0;
    const allQuestions = [...mockQuestions.listening, ...mockQuestions.reading];
    
    allQuestions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correct++;
      }
    });

    setScore({ correct, total: 20 });
    setTestCompleted(true);
  }, [answers]);

  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, testCompleted, timeLeft, handleSubmitTest]);

  const handleStartTest = () => {
    setTestStarted(true);
    setCurrentSection('listening');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(1200);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const getCurrentQuestion = () => {
    if (currentSection === 'listening') {
      return mockQuestions.listening[currentQuestionIndex];
    } else {
      return mockQuestions.reading[currentQuestionIndex];
    }
  };

  const getTotalQuestionNumber = () => {
    if (currentSection === 'listening') {
      return currentQuestionIndex + 1;
    } else {
      return 10 + currentQuestionIndex + 1;
    }
  };

  const handleNextQuestion = () => {
    if (currentSection === 'listening') {
      if (currentQuestionIndex < 9) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Chuyển sang phần Reading
        setCurrentSection('reading');
        setCurrentQuestionIndex(0);
      }
    } else {
      // Đang ở phần Reading
      if (currentQuestionIndex < 9) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Hết câu hỏi, nộp bài
        handleSubmitTest();
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentSection === 'listening') {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    } else {
      // Đang ở phần Reading
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else {
        // Quay lại câu cuối của Listening
        setCurrentSection('listening');
        setCurrentQuestionIndex(9);
      }
    }
  };

  const handleRetakeTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentSection('listening');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(1200);
  };

  const currentQuestion = getCurrentQuestion();
  const totalQuestionNumber = getTotalQuestionNumber();
  const isLastQuestion = totalQuestionNumber === 20;

  // Landing Page
  if (!testStarted) {
    return <LevelTestLanding onStartTest={handleStartTest} />;
  }

  // Test Result Page
  if (testCompleted) {
    return <LevelTestResult score={score} onRetakeTest={handleRetakeTest} />;
  }

  // Test Page
  return (
    <LevelTestQuiz
      currentSection={currentSection}
      currentQuestionIndex={currentQuestionIndex}
      currentQuestion={currentQuestion}
      totalQuestionNumber={totalQuestionNumber}
      timeLeft={timeLeft}
      answers={answers}
      onAnswerSelect={handleAnswerSelect}
      onNextQuestion={handleNextQuestion}
      onPrevQuestion={handlePrevQuestion}
      isLastQuestion={isLastQuestion}
    />
  );
};

export default LevelTestPage;