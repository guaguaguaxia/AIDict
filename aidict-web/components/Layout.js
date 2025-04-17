import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-white text-2xl md:text-3xl font-bold flex items-center">
                <span className="mr-2">📚</span>
                <span>AI 英语词典</span>
              </Link>
              <button className="md:hidden text-white focus:outline-none" onClick={() => {}}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
            </div>
            
            <div className="mt-4 md:mt-0 md:w-1/2">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索单词..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-5 py-2.5 rounded-full bg-white bg-opacity-90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md placeholder-gray-500 text-gray-800"
                  />
                  <button 
                    type="submit" 
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-blue-800 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </div>
                {isSearchFocused && suggestions.length > 0 && (
                  <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto z-10">
                    <ul>
                      {suggestions.map((suggestion) => (
                        <li 
                          key={suggestion} 
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800"
                          onClick={() => {
                            setSearchTerm(suggestion);
                            router.push(`/word/${suggestion}`);
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-6 md:mb-0">© {new Date().getFullYear()} AI 英语词典 - 用人工智能学习英语</p>
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 items-center">
              <Link href="/about" className="text-blue-300 hover:text-white">关于我们</Link>
              <a href="#" className="text-blue-300 hover:text-white">联系我们</a>
              <a href="#" className="text-blue-300 hover:text-white">隐私政策</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}