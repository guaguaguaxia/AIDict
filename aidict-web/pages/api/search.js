import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  try {
    // Try to find all_word.txt in different directories
    let wordListPath = path.join(process.cwd(), 'all_word.txt');
    if (!fs.existsSync(wordListPath)) {
      wordListPath = path.join(process.cwd(), '..', 'all_word.txt');
    }
    if (!fs.existsSync(wordListPath)) {
      wordListPath = path.join(process.cwd(), 'aidict-web', 'all_word.txt');
    }
    
    if (!fs.existsSync(wordListPath)) {
      return res.status(500).json({ error: 'Word list file not found' });
    }
    
    // Read all words from the file
    const fileContents = fs.readFileSync(wordListPath, 'utf8');
    const words = fileContents.split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0);
    
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