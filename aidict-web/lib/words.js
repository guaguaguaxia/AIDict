import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import yaml from 'js-yaml'; // Add YAML parser

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
  'TOFEL': '托福考试词汇',
  'CET4_core': '大学英语四级核心词汇'

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

  // 尝试多个可能的路径
  const possiblePaths = [
    path.join(process.cwd(), 'markdown'),
    path.join(process.cwd(), '..', 'markdown'),
    path.join(process.cwd(), 'aidict-web', 'markdown'),
    path.join(process.cwd(), 'public', 'markdown')
  ];
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      console.log(`找到markdown目录: ${testPath}`);
      return testPath;
    }
  }
  
  console.warn(`警告: 无法找到markdown目录，尝试了以下路径: ${possiblePaths.join(', ')}`);
  return '';
};

// 获取wordtxt目录路径
const getWordTxtDirectory = () => {
  if (typeof window !== 'undefined') return ''; // 客户端返回空字符串
  
  const fs = getFs();
  if (!fs) return '';
  
  // 尝试多个可能的路径
  const possiblePaths = [
    path.join(process.cwd(), 'wordtxt'),
    path.join(process.cwd(), '..', 'wordtxt'),
    path.join(process.cwd(), 'aidict-web', 'wordtxt'),
    path.join(process.cwd(), 'public', 'wordtxt')
  ];
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      console.log(`找到wordtxt目录: ${testPath}`);
      return testPath;
    }
  }
  
  console.warn(`警告: 无法找到wordtxt目录，尝试了以下路径: ${possiblePaths.join(', ')}`);
  return '';
};

// 获取markdown_yml文件夹路径
const getWordYamlDirectory = () => {
  if (typeof window !== 'undefined') return ''; // 客户端返回空字符串
  
  const fs = getFs();
  if (!fs) return '';

  // 尝试多个可能的路径
  const possiblePaths = [
    path.join(process.cwd(), 'markdown_yml'),
    path.join(process.cwd(), '..', 'markdown_yml'),
    path.join(process.cwd(), 'aidict-web', 'markdown_yml'),
    path.join(process.cwd(), 'public', 'markdown_yml')
  ];
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      console.log(`找到YAML目录: ${testPath}`);
      return testPath;
    }
  }
  
  console.warn(`警告: 无法找到YAML目录，尝试了以下路径: ${possiblePaths.join(', ')}`);
  // 最后一次尝试，返回一个可能存在的路径
  return path.join(process.cwd(), 'markdown_yml');
};

// 从all_word.txt文件中获取所有单词
const getAllWordsFromFile = () => {
  if (typeof window !== 'undefined') return []; // 客户端返回空数组
  
  const fs = getFs();
  if (!fs) return [];
  
  // 尝试多个可能的路径
  const possiblePaths = [
    path.join(process.cwd(), 'all_word.txt'),
    path.join(process.cwd(), '..', 'all_word.txt'),
    path.join(process.cwd(), 'aidict-web', 'all_word.txt'),
    path.join(process.cwd(), 'public', 'all_word.txt')
  ];
  
  let wordListPath = null;
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      wordListPath = testPath;
      console.log(`找到单词列表文件: ${testPath}`);
      break;
    }
  }
  
  if (!wordListPath) {
    console.warn(`警告: 无法找到单词列表文件，尝试了以下路径: ${possiblePaths.join(', ')}`);
    return [];
  }
  
  try {
    const fileContents = fs.readFileSync(wordListPath, 'utf8');
    return fileContents.split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);
  } catch (error) {
    console.error(`读取单词列表文件出错:`, error);
    return [];
  }
};

// 从YAML文件获取单个字母的所有单词
const getWordsFromYamlByLetter = (letter) => {
  if (typeof window !== 'undefined') return []; // 客户端返回空数组
  
  const fs = getFs();
  if (!fs) return [];
  
  const yamlDirectory = getWordYamlDirectory();
  if (!fs.existsSync(yamlDirectory)) {
    console.warn(`警告: YAML目录 ${yamlDirectory} 不存在`);
    return [];
  }
  
  const letterPath = path.join(yamlDirectory, `${letter}.yml`);
  if (!fs.existsSync(letterPath)) {
    console.warn(`警告: 字母YAML文件 ${letterPath} 不存在`);
    return [];
  }
  
  const fileContents = fs.readFileSync(letterPath, 'utf8');
  try {
    const data = yaml.load(fileContents);
    if (Array.isArray(data)) {
      return data.map(item => item.word);
    }
    return [];
  } catch (e) {
    console.error(`解析YAML文件 ${letterPath} 时出错:`, e);
    return [];
  }
};

export function getAllWordIds() {
  // 使用all_word.txt获取所有单词ID
  const allWords = getAllWordsFromFile();
  
  return allWords.map(word => ({
    params: {
      word
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
    // 使用all_word.txt获取所有单词
    const allWords = getAllWordsFromFile();
    
    wordsCache = allWords.sort();
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
  if (!fs) {
    console.error('无法获取文件系统模块');
    return {
      word,
      contentHtml: `<p>加载中...</p>`,
      title: word,
      loading: true
    };
  }
  
  // 记录当前环境信息
  console.log(`处理单词: ${word}，当前工作目录: ${process.cwd()}`);
  console.log(`Vercel 环境: ${!!process.env.VERCEL}`);
  
  // 获取单词首字母
  const firstLetter = word.charAt(0).toLowerCase();
  
  // 获取YAML文件路径
  const yamlDirectory = getWordYamlDirectory();
  console.log(`YAML目录路径: ${yamlDirectory}`);
  const yamlPath = path.join(yamlDirectory, `${firstLetter}.yml`);
  console.log(`尝试读取文件: ${yamlPath}`);
  
  // 检查YAML文件是否存在
  if (!fs.existsSync(yamlPath)) {
    console.error(`文件不存在: ${yamlPath}`);
    
    // 如果YAML文件不存在，尝试使用老的markdown文件
    const wordsDirectory = getWordsDirectory();
    const markdownPath = path.join(wordsDirectory, `${word}.md`);
    
    if (fs.existsSync(markdownPath)) {
      console.log(`找到markdown文件，尝试使用: ${markdownPath}`);
      try {
        const fileContents = fs.readFileSync(markdownPath, 'utf8');
        
        // 使用gray-matter解析markdown文件的元数据部分
        const matter = (await import('gray-matter')).default;
        const matterResult = matter(fileContents);
        
        // 使用remark将markdown转换为HTML字符串
        const processedContent = await remark()
          .use(html)
          .process(matterResult.content);
        const contentHtml = processedContent.toString();
        
        return {
          word,
          contentHtml,
          title: word,
          ...matterResult.data
        };
      } catch (error) {
        console.error(`读取markdown文件出错:`, error);
      }
    }
    
    return {
      word,
      contentHtml: `<p>抱歉，${word} 的内容暂不可用。无法找到数据文件。</p>`,
      title: word,
      notFound: true
    };
  }
  
  try {
    // 读取并解析YAML文件
    console.log(`开始读取YAML文件: ${yamlPath}`);
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    console.log(`YAML文件读取成功，长度: ${fileContents.length}字节`);
    
    // 解析YAML数据
    console.log('开始解析YAML数据...');
    const data = yaml.load(fileContents);
    console.log(`YAML解析结果是数组: ${Array.isArray(data)}, 长度: ${Array.isArray(data) ? data.length : 0}`);
    
    // 在YAML数据中查找对应的单词
    if (Array.isArray(data)) {
      const wordData = data.find(item => item.word && item.word.toLowerCase() === word.toLowerCase());
      
      if (wordData) {
        console.log(`在YAML中找到单词 ${word} 的数据`);
        // 我们已经有了Markdown内容，直接使用
        const contentMarkdown = wordData.content || '';
        
        // 使用remark将Markdown转换为HTML
        const processedContent = await remark()
          .use(html)
          .process(contentMarkdown);
        const contentHtml = processedContent.toString();
        
        return {
          word,
          contentHtml,
          title: word
        };
      } else {
        console.error(`在YAML数据中未找到单词 ${word}`);
      }
    } else {
      console.error(`YAML数据不是数组格式`);
    }
    
    // 如果在YAML中没有找到单词数据
    return {
      word,
      contentHtml: `<p>抱歉，${word} 的内容暂不可用。在数据中未找到该单词。</p>`,
      title: word,
      notFound: true
    };
  } catch (error) {
    console.error(`解析 ${word} 的YAML数据时出错:`, error);
    return {
      word,
      contentHtml: `<p>解析数据时出错: ${error.message}</p>`,
      title: word,
      error: true
    };
  }
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