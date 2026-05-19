import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, Eye, EyeOff } from "lucide-react";

const ListeningQuestion = ({ question, children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Re-initialize audio when question changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setShowTranscript(false);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [question.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [question.id]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.log("Audio play error: ", err));
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audio.currentTime = percentage * duration;
  };

  // Waveform bars simulation
  const barCount = 32;
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className="space-y-6">
      <audio ref={audioRef} src={question.audio} key={question.id} />

      {/* Audio Player Container */}
      <div className="bg-gradient-to-br from-indigo-50/60 to-emerald-50/40 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-sm relative overflow-hidden">
        
        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-200/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Main Large Play Button */}
          <motion.button
            type="button"
            onClick={togglePlay}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer ${
              isPlaying
                ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-red-200/50"
                : "bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 shadow-emerald-200/50"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-1" />
            )}
          </motion.button>

          {/* Waveform Visualization and Controls */}
          <div className="flex-1 w-full space-y-3">
            
            {/* Waveform Animation */}
            <div className="h-12 flex items-center justify-between gap-[2px] sm:gap-[3px] px-2 overflow-hidden select-none">
              {bars.map((index) => {
                const baseHeight = Math.sin((index / barCount) * Math.PI) * 80 + 10;
                const randomOffset = Math.random() * 15;
                const finalHeight = Math.max(10, Math.min(100, baseHeight + randomOffset));

                return (
                  <motion.div
                    key={index}
                    className={`flex-1 rounded-full ${
                      isPlaying
                        ? "bg-gradient-to-t from-emerald-400 to-indigo-500"
                        : "bg-gray-300"
                    }`}
                    style={{ height: `${finalHeight}%`, minHeight: "4px" }}
                    animate={
                      isPlaying
                        ? {
                            scaleY: [1, 1.3, 0.7, 1],
                            opacity: [0.7, 1, 0.8, 0.7]
                          }
                        : { scaleY: 1, opacity: 0.6 }
                    }
                    transition={{
                      duration: 1.2 + (index % 4) * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: (index % 5) * 0.05
                    }}
                  />
                );
              })}
            </div>

            {/* Progress Slider */}
            <div className="space-y-1">
              <div
                onClick={handleSeek}
                className="w-full h-2 bg-gray-200/80 rounded-full cursor-pointer overflow-hidden transition-colors hover:bg-gray-300 relative group"
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-full transition-all duration-100"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                ></div>
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-600 rounded-full scale-0 group-hover:scale-100 transition-transform pointer-events-none shadow" style={{ left: `calc(${(currentTime / duration) * 100 || 0}% - 6px)` }}></div>
              </div>

              <div className="flex justify-between text-xs font-bold text-gray-500 select-none">
                <span>{formatTime(currentTime)}</span>
                <div className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Script Section */}
        {question.transcript && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-start">
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm"
            >
              {showTranscript ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  Ẩn bản dịch (Transcript)
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Hiển thị bản dịch (Transcript)
                </>
              )}
            </button>

            <AnimatePresence>
              {showTranscript && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden w-full"
                >
                  <div className="mt-3 p-4 bg-white/70 rounded-xl text-sm text-gray-600 leading-relaxed italic border border-gray-100">
                    {question.transcript}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Question Context Area */}
      <div className="space-y-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Listening Question
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
            {question.question}
          </h2>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default ListeningQuestion;
