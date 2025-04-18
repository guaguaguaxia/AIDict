import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// 缓存
let wordsCache = null;
let wordsByLetterCache = null;
let firstLettersCache = null;
let featuredWordsCache = null;
let categoryWordsCache = {};
let allCategoriesCache = null;

// 分类映射：英文名称到中文显示名称
const categoryDisplayNames = {
  'CET4': '大学英语四级词汇',
  'CET6': '大学英语六级词汇',
  'HIGH_SCHOOL': '高中英语词汇',
  'MIDDLE_SCHOOL': '初中英语词汇',
  'POSTGRADUATE': '研究生英语词汇',
  'SAT': 'SAT考试词汇',
  'TOFEL': '托福考试词汇'
};

// 安全地获取fs模块，仅在服务器端执行
const getFs = () => {
  if (typeof window === 'undefined') {
    try {
      // 动态导入
      return require('fs');
    } catch (e) {
      console.error('无法导入fs模块:', e);
      return null;
    }
  }
  return null; // 客户端环境返回null
};

// 获取markdown文件夹路径
const getWordsDirectory = () => {
  if (typeof window !== 'undefined') return ''; // 客户端返回空字符串
  
  const fs = getFs();
  if (!fs) return '';

  const internalPath = path.join(process.cwd(), 'markdown');
  if (fs.existsSync(internalPath)) {
    return internalPath;
  }
  
  return path.join(process.cwd(), '..', 'markdown');
};

// 获取wordtxt目录路径
const getWordTxtDirectory = () => {
  if (typeof window !== 'undefined') return '';
  return path.join(process.cwd(), 'wordtxt');
};

export function getAllWordIds() {
  const fs = getFs();
  if (!fs) return [];
  
  const wordsDirectory = getWordsDirectory();
  const fileNames = fs.readdirSync(wordsDirectory);
  
  return fileNames.map(fileName => ({
    params: {
      word: fileName.replace(/\.md$/, '')
    }
  }));
}

export function getAllWords() {
  // Return cached result if available
  if (wordsCache !== null) {
    return wordsCache;
  }

  // Only execute this on the server
  if (typeof window === 'undefined') {
    const fs = getFs();
    if (!fs) return [];
    
    const wordsDirectory = getWordsDirectory();
    
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
  if (wordsByLetterCache !== null) return wordsByLetterCache;

  const allWords = getAllWords();
  const wordsByLetter = {};
  
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
  if (firstLettersCache !== null) return firstLettersCache;
  
  const allWords = getAllWords();
  const letters = new Set();
  
  allWords.forEach(word => {
    letters.add(word.charAt(0).toLowerCase());
  });
  
  firstLettersCache = Array.from(letters).sort();
  return firstLettersCache;
}

export async function getWordData(word) {
  const fs = getFs();
  if (!fs) return {
    word,
    contentHtml: `<p>加载中...</p>`,
    title: word,
    loading: true
  };
  
  const wordsDirectory = getWordsDirectory();
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

// 获取随机词汇列表
export function getFeaturedWords() {
  // Remove caching to ensure words change on each refresh
  const allWords = getAllWords();
  
  // 过滤出字母数量大于7的词汇
  const longWords = allWords.filter(word => word.length > 7);
  
  // 如果没有足够的长单词，就返回所有可用的长单词
  if (longWords.length <= 15) {
    return longWords;
  }
  
  // 随机打乱数组并选择前15个
  const shuffled = [...longWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 15);
}

// Client-safe search function
export function searchWords(query) {
  return []; // 通过API实现搜索功能
}

// 获取所有可用的词汇分类
export function getAllCategories() {
  if (allCategoriesCache !== null) return allCategoriesCache;

  if (typeof window === 'undefined') {
    const fs = getFs();
    if (!fs) return [];
    
    const wordTxtDirectory = getWordTxtDirectory();
    
    // 如果目录不存在，返回空数组避免错误
    if (!fs.existsSync(wordTxtDirectory)) {
      console.warn(`警告: 词汇分类目录 ${wordTxtDirectory} 不存在`);
      return [];
    }
    
    const fileNames = fs.readdirSync(wordTxtDirectory);
    allCategoriesCache = fileNames.map(fileName => {
      // Remove ".txt" from file name to get category
      const category = fileName.replace(/\.txt$/, '');
      return {
        id: category,
        name: categoryDisplayNames[category] || category
      };
    });
    return allCategoriesCache;
  }

  return []; // 客户端返回空数组
}

// 根据分类获取单词列表
export function getWordsByCategory(category) {
  if (categoryWordsCache[category]) return categoryWordsCache[category];

  if (typeof window === 'undefined') {
    const fs = getFs();
    if (!fs) return [];
    
    const wordTxtDirectory = getWordTxtDirectory();
    const categoryPath = path.join(wordTxtDirectory, `${category}.txt`);
    
    // 如果文件不存在，返回空数组避免错误
    if (!fs.existsSync(categoryPath)) {
      console.warn(`警告: 词汇分类文件 ${categoryPath} 不存在`);
      return [];
    }
    
    const fileContents = fs.readFileSync(categoryPath, 'utf8');
    const words = fileContents.split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);
    
    categoryWordsCache[category] = words;
    return words;
  }

  return []; // 客户端返回空数组
}

// 获取带分页的分类词汇
export function getPaginatedWordsByCategory(category, page = 1, pageSize = 24) {
  const allWords = getWordsByCategory(category);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    words: allWords.slice(startIndex, endIndex),
    totalWords: allWords.length,
    totalPages: Math.ceil(allWords.length / pageSize)
  };
}

// 检查单词是否存在于特定分类中
export function isWordInCategory(word, category) {
  const categoryWords = getWordsByCategory(category);
  return categoryWords.includes(word);
}

// 获取单词所属的所有分类
export function getCategoriesForWord(word) {
  const allCategories = getAllCategories();
  return allCategories
    .filter(category => isWordInCategory(word, category.id))
    .map(category => category.id);
}

// 获取所有分类的单词数量统计
export function getCategoryWordCounts() {
  const allCategories = getAllCategories();
  const counts = {};
  
  allCategories.forEach(category => {
    const words = getWordsByCategory(category.id);
    counts[category.id] = words.length;
  });
  
  return counts;
}