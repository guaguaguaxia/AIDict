import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getAllFirstLetters, getWordsByFirstLetter } from '../lib/words';

export default function Home({ firstLetters, wordsByLetter }) {
  const [activeLetter, setActiveLetter] = useState(firstLetters[0] || 'a');
  const [featuredWords, setFeaturedWords] = useState([]);
  
  useEffect(() => {
    // Choose 5 random words from the active letter category to feature
    if (wordsByLetter[activeLetter]) {
      const shuffled = [...wordsByLetter[activeLetter]].sort(() => 0.5 - Math.random());
      setFeaturedWords(shuffled.slice(0, 5));
    }
  }, [activeLetter, wordsByLetter]);

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

        {/* Alphabet Navigation */}
        <section className="mb-10">
          <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
            <div className="flex justify-center flex-wrap">
              {firstLetters.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setActiveLetter(letter)}
                  className={`px-3 py-2 m-1 rounded-md font-medium text-lg transition-colors duration-200 
                    ${activeLetter === letter 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                  }
                >
                  {letter.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Words */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">精选单词</h2>
            <Link 
              href={`/letter/${activeLetter}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              查看所有 {wordsByLetter[activeLetter] ? wordsByLetter[activeLetter].length : 0} 个单词 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredWords.map((word) => (
              <Link key={word} href={`/word/${word}`} className="block">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 capitalize mb-2">{word}</h3>
                  <p className="text-gray-600">点击查看此单词的详细解释...</p>
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

  return {
    props: {
      firstLetters,
      wordsByLetter,
    },
  };
}