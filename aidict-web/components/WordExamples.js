import { useState, useEffect } from 'react';

export default function WordExamples({ word }) {
  const [expanded, setExpanded] = useState(false);
  const [examples, setExamples] = useState([]);
  const [isClient, setIsClient] = useState(false);
  
  // 使用useEffect确保此代码只在客户端执行，避免水合不匹配
  useEffect(() => {
    // 标记现在是客户端渲染
    setIsClient(true);
    
    // 生成示例句子
    const exampleSentences = [
      `The ${word} was clearly visible from a distance.`,
      `She explained the concept of ${word} to the students.`,
      `I never understood what ${word} really meant until today.`,
      `The professor's lecture about ${word} was fascinating.`,
      `Can you give me a better example of ${word}?`
    ];
    
    setExamples(exampleSentences);
  }, [word]);
  
  // 如果不是客户端，返回一个占位符以避免水合错误
  if (!isClient) {
    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">例句</h3>
          <button className="text-blue-600 hover:text-blue-800 focus:outline-none text-sm flex items-center">
            显示全部
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <div className="text-gray-500">加载例句中...</div>
      </div>
    );
  }
  
  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-800">例句</h3>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 focus:outline-none text-sm flex items-center"
        >
          {expanded ? '显示更少' : '显示全部'}
          <svg 
            className={`ml-1 w-4 h-4 transition-transform ${expanded ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <ul className="space-y-2">
        {examples.slice(0, expanded ? examples.length : 2).map((example, index) => (
          <li key={index} className="p-3 bg-white rounded border border-gray-200">
            <p className="text-gray-700">"{example}"</p>
          </li>
        ))}
      </ul>
      
      {!expanded && examples.length > 2 && (
        <p className="mt-2 text-sm text-gray-500">
          还有 {examples.length - 2} 个例句
        </p>
      )}
    </div>
  );
}