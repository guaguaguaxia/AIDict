import { useState, useRef } from 'react';

export default function Pronunciation({ word }) {
  const [isPlayingUS, setIsPlayingUS] = useState(false);
  const [isPlayingUK, setIsPlayingUK] = useState(false);
  const audioRefUS = useRef(null);
  const audioRefUK = useRef(null);
  
  // 有道词典API URL构建
  const getYoudaoAudioUrl = (type, word) => {
    return `https://dict.youdao.com/dictvoice?type=${type}&audio=${encodeURIComponent(word)}`;
  };

  // 美式发音
  const handlePlayUSPronunciation = () => {
    if (audioRefUS.current) {
      setIsPlayingUS(true);
      audioRefUS.current.play();
    }
  };
  
  // 英式发音
  const handlePlayUKPronunciation = () => {
    if (audioRefUK.current) {
      setIsPlayingUK(true);
      audioRefUK.current.play();
    }
  };
  
  // 音频播放结束事件处理
  const handleAudioEnded = (type) => {
    if (type === 'us') {
      setIsPlayingUS(false);
    } else {
      setIsPlayingUK(false);
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRefUS}
        src={getYoudaoAudioUrl(0, word)}
        onEnded={() => handleAudioEnded('us')}
        onError={() => setIsPlayingUS(false)}
      />
      <audio
        ref={audioRefUK}
        src={getYoudaoAudioUrl(1, word)}
        onEnded={() => handleAudioEnded('uk')}
        onError={() => setIsPlayingUK(false)}
      />
      
      {/* 美式发音按钮 */}
      <button 
        onClick={handlePlayUSPronunciation}
        disabled={isPlayingUS}
        className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70"
        aria-label={`美式发音 ${word}`}
      >
        {isPlayingUS ? (
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
            <span>美音</span>
          </>
        )}
      </button>
      
      {/* 英式发音按钮 */}
      <button 
        onClick={handlePlayUKPronunciation}
        disabled={isPlayingUK}
        className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-full transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-70"
        aria-label={`英式发音 ${word}`}
      >
        {isPlayingUK ? (
          <>
            <span className="mr-1.5">
              <span className="flex space-x-1">
                <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></span>
                <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse delay-75"></span>
                <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse delay-150"></span>
              </span>
            </span>
            <span>播放中...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M12 9.342a3 3 0 010 5.316M18.364 5.636a9 9 0 010 12.728"></path>
            </svg>
            <span>英音</span>
          </>
        )}
      </button>
    </div>
  );
}