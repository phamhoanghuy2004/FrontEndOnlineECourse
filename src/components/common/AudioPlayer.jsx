import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';

const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audio.currentTime = percentage * duration;
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="flex items-center gap-4">
        {/* Play Button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center text-white shadow-md transition-all flex-shrink-0"
        >
          {isPlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm ml-0.5" />}
        </button>

        {/* Progress Bar & Time */}
        <div className="flex-1 space-y-1">
          <div
            onClick={handleSeek}
            className="w-full h-1.5 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
          >
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <FaVolumeUp className="text-blue-600 text-lg flex-shrink-0" />
      </div>
    </div>
  );
};

export default AudioPlayer;
