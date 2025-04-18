import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (q) {
      // Use the server API route for searching
      setIsLoading(true);
      setNoResults(false);
      setError(null);
      
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('搜索失败');
          }
          return response.json();
        })
        .then(data => {
          setResults(data.results);
          setIsLoading(false);
          setNoResults(data.results.length === 0);
        })
        .catch(err => {
          console.error('搜索出错:', err);
          setError('搜索失败。请稍后再试。');
          setIsLoading(false);
        });
    }
  }, [q]);

  return (
    <Layout>
      <Head>
        <title>{q ? `"${q}" 的搜索结果` : '搜索'} | AI 英语词典</title>
        <meta name="description" content="在 AI 英语词典中搜索单词" />
      </Head>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {q ? `"${q}" 的搜索结果` : '搜索结果'}
        </h1>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">搜索中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        ) : noResults ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mt-4">未找到结果</h2>
            <p className="text-gray-500 mt-2">
              我们找不到与 "{q}" 匹配的单词。
            </p>
            <div className="mt-6">
              <Link 
                href="/"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                返回首页
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600">
              找到 {results.length} 个{results.length === 1 ? '结果' : '结果'} 匹配 "{q}"
            </p>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {results.map((word) => (
                  <li key={word} className="hover:bg-blue-50 transition-colors">
                    <Link 
                      href={`/word/${word}?from=search&q=${encodeURIComponent(q)}`}
                      className="block px-6 py-4 flex items-center justify-between"
                    >
                      <div>
                        <h2 className="text-lg font-medium text-gray-800 capitalize">{word}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                          点击查看详细解释
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="mt-8">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 inline-flex items-center transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            返回首页
          </Link>
        </div>
      </div>
    </Layout>
  );
}