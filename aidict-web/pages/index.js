import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getAllFirstLetters, getWordsByFirstLetter, getFeaturedWords, getAllCategories } from '../lib/words';

export default function Home({ firstLetters, wordsByLetter, featuredWords, categories }) {
  const [activeLetter, setActiveLetter] = useState(firstLetters[0] || 'a');
  
  return (
    <Layout>
      <Head>
        <title>AI 英语词典 - 彻底理解一个英文单词</title>
        <meta name="description" content="一个由人工智能提供详细单词解释的英语词典" />
        {/* 使用书本emoji作为favicon */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>"
        />
      </Head>

      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-10 shadow-sm">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            AI 英语词典
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            由 AI 生成的英文单词的详细解释，探索每一个英文单词的含义边界
          </p>
          <div className="flex justify-center items-center space-x-2">
            <a href="https://github.com/guaguaguaxia/AIDict" target="_blank" rel="noopener noreferrer" 
              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Star on GitHub
            </a>
            <div className="text-gray-600">⭐ 支持我们的开源项目!</div>
          </div>
        </section>

        {/* 浏览方式选择 */}
        <section className="mb-10">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/categories" className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <div>
                <span className="font-medium">按词汇分类浏览</span>
                <p className="text-xs mt-1 text-blue-100">四六级、高中、托福等分类</p>
              </div>
            </Link>
            
            <div className="bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200">
              <div className="font-medium mb-1">按字母浏览</div>
              <div className="flex flex-wrap justify-center gap-1">
                {firstLetters.slice(0, 10).map((letter) => (
                  <Link key={letter} href={`/letter/${letter}`} className="w-6 h-6 flex items-center justify-center bg-white bg-opacity-20 rounded-full text-xs hover:bg-opacity-30 transition-colors">
                    {letter.toUpperCase()}
                  </Link>
                ))}
                <span className="text-xs flex items-center">...</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
            <div className="flex justify-center flex-wrap">
              {firstLetters.map((letter) => (
                <Link
                  key={letter}
                  href={`/letter/${letter}`}
                  className={`px-3 py-2 m-1 rounded-md font-medium text-lg transition-colors duration-200 
                    bg-gray-100 text-gray-700 hover:bg-gray-200`}
                >
                  {letter.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 词汇分类预览 */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">词汇分类</h2>

          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((category) => (
              <Link key={category.id} href={`/category/${category.id}?page=1`}>
                <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 h-full">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 精选词汇 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">精选词汇</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredWords.map((word) => (
              <Link key={word} href={`/word/${word}`} className="block">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 capitalize mb-2">{word}</h3>
                  
                  <div className="mt-3 flex justify-end">
                    <span className="text-blue-600 text-sm">查看详情 →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const firstLetters = getAllFirstLetters();
  const wordsByLetter = getWordsByFirstLetter();
  const featuredWords = getFeaturedWords();
  const categories = getAllCategories();

  return {
    props: {
      firstLetters,
      wordsByLetter,
      featuredWords,
      categories,
    },
  };
}