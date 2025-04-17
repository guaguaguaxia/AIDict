import { useState } from 'react';

export default function Flashcard({ word }) {
  const [flipped, setFlipped] = useState(false);
  
  // Generate a brief definition for the flashcard
  // In a real application, this would come from an API or database
  const generateDefinition = (word) => {
    return {
      partOfSpeech: '名词',
      definition: `"${word}" 这个词指的是一个物体、概念或想法，在各种语境中具有意义和重要性。`,
      example: `让我在这个语境中解释"${word}"的含义。`
    };
  };
  
  const wordInfo = generateDefinition(word);
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">单词卡片</h3>
      
      <div 
        className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform duration-700 transform ${flipped ? 'scale-[1.02]' : ''}`} 
        onClick={() => setFlipped(!flipped)}
        style={{ 
          perspective: '1000px',
          height: '220px'
        }}
      >
        <div 
          className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front of card */}
          <div 
            className="absolute w-full h-full flex flex-col items-center justify-center p-8 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <h4 className="text-3xl font-bold text-blue-700 capitalize mb-4">{word}</h4>
            <p className="text-gray-500 text-center">点击查看定义</p>
            <div className="absolute bottom-3 right-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
          </div>
          
          {/* Back of card */}
          <div 
            className="absolute w-full h-full flex flex-col justify-center p-8 bg-blue-50 backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mb-3">
                {wordInfo.partOfSpeech}
              </span>
              <p className="text-gray-800 mb-4">{wordInfo.definition}</p>
              <p className="text-gray-600 italic text-sm">"{wordInfo.example}"</p>
            </div>
            <div className="absolute bottom-3 right-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-500 mt-3">
        点击卡片翻转
      </p>
    </div>
  );
}