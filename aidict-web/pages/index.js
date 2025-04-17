import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getAllFirstLetters, getWordsByFirstLetter, getFeaturedWords } from '../lib/words';

export default function Home({ firstLetters, wordsByLetter, featuredWords }) {
  const [activeLetter, setActiveLetter] = useState(firstLetters[0] || 'a');
  
  return (
    <Layout>
      <Head>
        <title>AI 英语词典 - 用人工智能学习英语</title>
        <meta name="description" content="一个由人工智能提供详细单词解释的英语词典" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-10 shadow-sm">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            AI 英语词典
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            探索英语单词的详细解释，包括例句、文化背景和由人工智能提供的深度讲解
          </p>
        </section>

        {/* 字母选择导航 */}
        <section className="mb-10">
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

        {/* 精选词汇 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">精选词汇</h2>
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

  return {
    props: {
      firstLetters,
      wordsByLetter,
      featuredWords,
    },
  };
}