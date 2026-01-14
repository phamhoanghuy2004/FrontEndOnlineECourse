import { motion } from 'framer-motion';
import { FaClock, FaHeadphones, FaBook } from 'react-icons/fa';
import AudioPlayer from '../../common/AudioPlayer';

const LevelTestQuiz = ({
  currentSection,
  currentQuestionIndex,
  currentQuestion,
  totalQuestionNumber,
  timeLeft,
  answers,
  onAnswerSelect,
  onNextQuestion,
  onPrevQuestion,
  isLastQuestion
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 sticky top-24 z-40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                currentSection === 'listening' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {currentSection === 'listening' ? (
                  <FaHeadphones className="text-blue-600 text-xl" />
                ) : (
                  <FaBook className="text-green-600 text-xl" />
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500 font-medium">
                  {currentSection === 'listening' ? 'Phần Listening' : 'Phần Reading'}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  Câu {totalQuestionNumber} / 20
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaClock className={`text-xl ${timeLeft < 300 ? 'text-red-500' : 'text-primary'}`} />
              <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-gray-900'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${(totalQuestionNumber / 20) * 100}%` }}
            ></div>
          </div>
        </div>

        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Audio Player for Listening Section */}
          {currentSection === 'listening' && currentQuestion.audio && (
            <AudioPlayer audioUrl={currentQuestion.audio} />
          )}

          <div className="mb-8">
            {currentSection === 'reading' && currentQuestion.passage && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border-l-4 border-primary">
                <p className="text-gray-700 leading-relaxed italic">
                  "{currentQuestion.passage}"
                </p>
              </div>
            )}
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswerSelect(currentQuestion.id, index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion.id] === index
                    ? 'border-primary bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                    answers[currentQuestion.id] === index
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-700 font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onPrevQuestion}
              disabled={currentSection === 'listening' && currentQuestionIndex === 0}
              className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Câu trước
            </button>
            
            <button
              onClick={onNextQuestion}
              disabled={answers[currentQuestion.id] === undefined}
              className="px-6 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
            >
              {isLastQuestion ? 'Nộp bài' : 'Câu tiếp →'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LevelTestQuiz;
