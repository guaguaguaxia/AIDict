import { useState } from 'react';

export default function Pronunciation({ word }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // This would normally use a real API to get pronunciation
  // For now, we'll simulate with the Web Speech API
  const handlePlayPronunciation = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };
  
  return (
    <button 
      onClick={handlePlayPronunciation}
      disabled={isPlaying}
      className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
      aria-label={`发音 ${word}`}
    >
      {isPlaying ? (
        <>
          <span className="mr-1.5">
            <span className="flex space-x-1">
              <span className="w-1 h-4 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="w-1 h-4 bg-blue-500 rounded-full animate-pulse delay-75"></span>
              <span className="w-1 h-4 bg-blue-500 rounded-full animate-pulse delay-150"></span>
            </span>
          </span>
          <span>播放中...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M12 9.342a3 3 0 010 5.316M18.364 5.636a9 9 0 010 12.728"></path>
          </svg>
          <span>发音</span>
        </>
      )}
    </button>
  );
}