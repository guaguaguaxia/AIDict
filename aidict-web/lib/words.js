import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// We'll only import fs when running on the server
let fs;
let wordsCache = null;
let wordsByLetterCache = null;
let firstLettersCache = null;

// 缓存精选词汇
let featuredWordsCache = null;

// 修复：直接使用项目内部的markdown文件夹
const getWordsDirectory = () => {
  // 首先尝试使用项目内的markdown文件夹
  const internalPath = path.join(process.cwd(), 'markdown');
  if (fs && fs.existsSync(internalPath)) {
    return internalPath;
  }
  
  // 如果内部路径不存在，可以尝试备用路径
  // 在Vercel上，应该只会使用内部路径
  const externalPath = path.join(process.cwd(), '..', 'markdown');
  return externalPath;
};

// Check if we're running on the server side
if (typeof window === 'undefined') {
  fs = require('fs');
  // 不再在这里定义wordsDirectory
} else {
  // We'll use a different approach for the client side
  console.log('Running on client side');
}

// Helper function to ensure we're on the server
const ensureServer = () => {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be called on the server side');
  }
  return require('fs');
};

export function getAllWordIds() {
  const fs = ensureServer();
  const wordsDirectory = getWordsDirectory(); // 使用新的获取路径方法
  const fileNames = fs.readdirSync(wordsDirectory);
  return fileNames.map(fileName => {
    return {
      params: {
        word: fileName.replace(/\.md$/, '')
      }
    };
  });
}

export function getAllWords() {
  // Return cached result if available
  if (wordsCache !== null) {
    return wordsCache;
  }

  // Only execute this on the server
  if (typeof window === 'undefined') {
    const fs = require('fs');
    const wordsDirectory = getWordsDirectory(); // 使用新的获取路径方法
    
    // 如果目录不存在，返回空数组避免错误
    if (!fs.existsSync(wordsDirectory)) {
      console.warn(`警告: 单词目录 ${wordsDirectory} 不存在`);
      return [];
    }
    
    const fileNames = fs.readdirSync(wordsDirectory);
    wordsCache = fileNames.map(fileName => {
      // Remove ".md" from file name to get id
      const word = fileName.replace(/\.md$/, '');
      return word;
    }).sort();
    return wordsCache;
  }

  // Return empty array on client (this should be replaced with proper data from API)
  return [];
}

export function getWordsByFirstLetter() {
  // Return cached result if available
  if (wordsByLetterCache !== null) {
    return wordsByLetterCache;
  }

  const allWords = getAllWords();
  const wordsByLetter = {};
  
  // Group words by their first letter
  allWords.forEach(word => {
    const firstLetter = word.charAt(0).toLowerCase();
    if (!wordsByLetter[firstLetter]) {
      wordsByLetter[firstLetter] = [];
    }
    wordsByLetter[firstLetter].push(word);
  });
  
  wordsByLetterCache = wordsByLetter;
  return wordsByLetter;
}

export function getAllFirstLetters() {
  // Return cached result if available
  if (firstLettersCache !== null) {
    return firstLettersCache;
  }
  
  const allWords = getAllWords();
  const letters = new Set();
  
  allWords.forEach(word => {
    letters.add(word.charAt(0).toLowerCase());
  });
  
  firstLettersCache = Array.from(letters).sort();
  return firstLettersCache;
}

export async function getWordData(word) {
  const fs = ensureServer();
  const wordsDirectory = getWordsDirectory(); // 使用新的获取路径方法
  const fullPath = path.join(wordsDirectory, `${word}.md`);
  
  // 文件不存在时提供友好提示
  if (!fs.existsSync(fullPath)) {
    return {
      word,
      contentHtml: `<p>抱歉，${word} 的内容暂不可用。</p>`,
      title: word,
      notFound: true
    };
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the word metadata section
  const matter = (await import('gray-matter')).default;
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the word
  return {
    word,
    contentHtml,
    ...matterResult.data
  };
}

// 获取精选词汇列表
export function getFeaturedWords() {
  // 如果已有缓存，直接返回
  if (featuredWordsCache !== null) {
    return featuredWordsCache;
  }
  
  const allWords = getAllWords();
  
  // 这里可以根据不同的策略来选择精选词汇
  // 示例策略：选择一些常用且有教育价值的词汇
  const importantWords = [
    'academic', 'accomplish', 'generosity', 'obligation', 'prejudice', 
    'oppression', 'tolerance', 'individualism', 'enthusiasm', 'equivalent',
    'recognition', 'empathy', 'impact', 'inspire', 'leadership',
    'correspondent', 'perspective', 'settlement', 'strategy' 
  ];
  
  // 过滤出实际存在的词汇
  featuredWordsCache = importantWords.filter(word => allWords.includes(word));
  
  // 如果精选词汇太少，从所有单词中随机添加一些
  if (featuredWordsCache.length < 12) {
    const additionalCount = 12 - featuredWordsCache.length;
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    const additionalWords = shuffled.slice(0, additionalCount);
    
    featuredWordsCache = [...featuredWordsCache, ...additionalWords];
  }
  
  return featuredWordsCache;
}

// Client-safe search function
export function searchWords(query) {
  // We'll make the actual search happen in the API route
  return [];
}