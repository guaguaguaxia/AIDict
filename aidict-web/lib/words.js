import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

// We'll only import fs when running on the server
let fs;
let wordsCache = null;
let wordsByLetterCache = null;
let firstLettersCache = null;

// Check if we're running on the server side
if (typeof window === 'undefined') {
  fs = require('fs');
  // Define wordsDirectory only on server
  const wordsDirectory = path.join(process.cwd(), '..', 'markdown');
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
  const wordsDirectory = path.join(process.cwd(), '..', 'markdown');
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
    const wordsDirectory = path.join(process.cwd(), '..', 'markdown');
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
  const wordsDirectory = path.join(process.cwd(), '..', 'markdown');
  const fullPath = path.join(wordsDirectory, `${word}.md`);
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

// Client-safe search function
export function searchWords(query) {
  // We'll make the actual search happen in the API route
  return [];
}