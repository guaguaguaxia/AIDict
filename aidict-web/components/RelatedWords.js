import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RelatedWords({ word }) {
  const [relatedWords, setRelatedWords] = useState([]);
  const [isClient, setIsClient] = useState(false);
  
  // 生成相关单词的函数
  const generateRelatedWords = (baseWord) => {
    // Common prefixes and suffixes to generate "related" words
    const prefixes = ['re', 'un', 'in', 'dis', 'over', 'under', 'pre', 'post'];
    const suffixes = ['ing', 'ed', 'ly', 'ment', 'ness', 'able', 'ful', 'less'];
    const synonyms = [
      'example', 'term', 'expression', 'phrase', 'concept', 
      'idea', 'notion', 'theory', 'method', 'approach'
    ];
    
    const related = [];
    
    // 为了避免水合错误，使用确定性算法而非随机算法
    // 使用单词的第一个字符的字符码来确定选择哪个前缀和后缀
    const charCode = baseWord.charCodeAt(0) || 0;
    const prefixIndex = charCode % prefixes.length;
    const suffixIndex = (charCode + 1) % suffixes.length;
    
    related.push(prefixes[prefixIndex] + baseWord);
    related.push(baseWord + suffixes[suffixIndex]);
    
    // 选择固定的同义词，而不是随机打乱
    const synStart = charCode % (synonyms.length - 3);
    related.push(...synonyms.slice(synStart, synStart + 3));
    
    return related.slice(0, 5); // 限制为5个相关单词
  };
  
  // 使用useEffect确保此代码只在客户端执行，避免水合不匹配
  useEffect(() => {
    setIsClient(true);
    setRelatedWords(generateRelatedWords(word));
  }, [word]);
  
  // 如果不是客户端，返回一个占位符以避免水合错误
  if (!isClient) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">相关单词</h3>
        <div className="text-gray-500">加载相关单词中...</div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">相关单词</h3>
      
      <div className="flex flex-wrap gap-2">
        {relatedWords.map((relWord, index) => (
          <Link 
            key={index} 
            href={`/word/${relWord}`}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 
              rounded-md transition-colors text-sm border border-indigo-100"
          >
            {relWord}
          </Link>
        ))}
      </div>
      
      <p className="mt-3 text-sm text-gray-500">
        点击任意单词查看其含义和解释
      </p>
    </div>
  );
}