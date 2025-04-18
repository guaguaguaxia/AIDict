import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  try {
    // Get all words from the markdown directory
    // const wordsDirectory = path.join(process.cwd(), '..', 'markdown');
    const wordsDirectory = path.join(process.cwd(), '..', 'aidict-web', 'markdown');
    const fileNames = fs.readdirSync(wordsDirectory);
    
    const words = fileNames.map(fileName => fileName.replace(/\.md$/, ''));
    
    // Filter words based on the search query
    const searchResults = words.filter(word => 
      word.toLowerCase().includes(q.toLowerCase())
    );
    
    return res.status(200).json({ results: searchResults });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Failed to search words' });
  }
}