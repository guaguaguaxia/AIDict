import { getFeaturedWords } from '../../lib/words';

export default function handler(req, res) {
  try {
    // Get random words using the same function we use for server-side rendering
    const randomWords = getFeaturedWords();
    
    // Return the random words as JSON
    res.status(200).json(randomWords);
  } catch (error) {
    console.error('Error fetching random words:', error);
    res.status(500).json({ error: 'Failed to fetch random words' });
  }
}