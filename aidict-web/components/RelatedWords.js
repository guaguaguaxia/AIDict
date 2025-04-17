import Link from 'next/link';

export default function RelatedWords({ word }) {
  // These would normally be fetched from an API or database
  // For now, we'll generate some mock related terms
  const generateRelatedWords = (baseWord) => {
    // Common prefixes and suffixes to generate "related" words
    const prefixes = ['re', 'un', 'in', 'dis', 'over', 'under', 'pre', 'post'];
    const suffixes = ['ing', 'ed', 'ly', 'ment', 'ness', 'able', 'ful', 'less'];
    const synonyms = [
      'example', 'term', 'expression', 'phrase', 'concept', 
      'idea', 'notion', 'theory', 'method', 'approach'
    ];
    
    const related = [];
    
    // Add a prefix version
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    related.push(randomPrefix + baseWord);
    
    // Add a suffix version
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    related.push(baseWord + randomSuffix);
    
    // Add some "synonyms"
    const shuffled = [...synonyms].sort(() => 0.5 - Math.random());
    related.push(...shuffled.slice(0, 3));
    
    return related.slice(0, 5); // Limit to 5 related words
  };
  
  const relatedWords = generateRelatedWords(word);

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