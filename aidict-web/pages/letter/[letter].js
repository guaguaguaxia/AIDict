import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getAllFirstLetters, getWordsByFirstLetter } from '../../lib/words';

export default function LetterPage({ letter, words }) {
  return (
    <Layout>
      <Head>
        <title>以 '{letter.toUpperCase()}' 开头的单词 | AI 英语词典</title>
        <meta name="description" content={`浏览所有以字母 ${letter.toUpperCase()} 开头的英语单词`} />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            以 '{letter.toUpperCase()}' 开头的单词
          </h1>
          <div className="flex flex-wrap gap-2">
            {Array.from('abcdefghijklmnopqrstuvwxyz').map((l) => (
              <Link 
                key={l} 
                href={`/letter/${l}`}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium 
                  ${l === letter 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {words.map((word) => (
              <Link 
                key={word} 
                href={`/word/${word}`}
                className="px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-gray-800 hover:text-blue-700 transition-colors flex items-center justify-between capitalize"
              >
                <span>{word}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            ))}
          </div>

          {words.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">没有找到以 '{letter.toUpperCase()}' 开头的单词。</p>
              <Link 
                href="/"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                返回首页
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            浏览我们全面的词汇集合，提升您的词汇量。
          </p>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const letters = getAllFirstLetters();
  const paths = letters.map((letter) => ({
    params: { letter },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { letter } = params;
  const wordsByLetter = getWordsByFirstLetter();
  const words = wordsByLetter[letter] || [];

  return {
    props: {
      letter,
      words,
    },
  };
}