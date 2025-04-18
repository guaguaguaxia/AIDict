import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getAllFirstLetters, getWordsByFirstLetter } from '../../lib/words';

// 每页显示的单词数量
const PAGE_SIZE = 48;

// 所有可能的英文字母
const ALL_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default function LetterPage({ letter, words, currentPage, totalPages, allFirstLetters }) {
  const router = useRouter();
  const [page, setPage] = useState(currentPage);
  
  // 处理页面切换
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/letter/${letter}?page=${newPage}`);
    }
  };

  // 生成分页按钮
  const renderPagination = () => {
    const pages = [];
    const maxButtons = 5; // 最多显示的按钮数
    
    // 计算显示哪些页码按钮
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // 添加"首页"按钮
    pages.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 mx-1 rounded ${currentPage === 1 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
          : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'}`}
        aria-label="首页"
      >
        &laquo;
      </button>
    );

    // 添加"上一页"按钮
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 mx-1 rounded ${currentPage === 1 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
          : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'}`}
        aria-label="上一页"
      >
        &lsaquo;
      </button>
    );

    // 添加页码按钮
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === i 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'}`}
          aria-label={`第${i}页`}
        >
          {i}
        </button>
      );
    }

    // 添加"下一页"按钮
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
          : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'}`}
        aria-label="下一页"
      >
        &rsaquo;
      </button>
    );

    // 添加"末页"按钮
    pages.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
          : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'}`}
        aria-label="末页"
      >
        &raquo;
      </button>
    );

    return pages;
  };

  return (
    <Layout>
      <Head>
        <title>以 {letter.toUpperCase()} 开头的单词 | AI 英语词典</title>
        <meta name="description" content={`浏览所有以 ${letter.toUpperCase()} 开头的英文单词`} />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* 添加顶部字母导航栏 - 不带红框 */}
        <div className="mb-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">以 {letter.toUpperCase()} 开头的单词</h2>
          <div className="flex flex-wrap">
            {ALL_LETTERS.map((l) => (
              <Link
                key={l}
                href={`/letter/${l}?page=1`}
                className={`px-3 py-2 m-1 rounded-md font-medium transition-colors duration-200 
                  ${l === letter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>

        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">以 {letter.toUpperCase()} 开头的单词</h1>
          </div>
          
          <Link
            href="/"
            className="mt-4 sm:mt-0 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            返回首页
          </Link>
        </div>

        {/* 单词网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {words.map((word) => (
            <Link 
              key={word} 
              href={`/word/${word}`}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 text-center"
            >
              <span className="text-lg font-medium text-gray-800">{word}</span>
            </Link>
          ))}
        </div>

        {/* 分页控件 */}
        {totalPages > 1 && (
          <div className="flex justify-center my-8">
            <div className="inline-flex rounded-md shadow-sm">
              {renderPagination()}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params, query }) {
  try {
    const { letter } = params;
    const page = parseInt(query.page || 1, 10);
    
    // 获取词汇列表
    const wordsByLetter = getWordsByFirstLetter();
    const letterWords = wordsByLetter[letter.toLowerCase()] || [];
    
    // 计算分页信息
    const totalWords = letterWords.length;
    const totalPages = Math.ceil(totalWords / PAGE_SIZE);
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentWords = letterWords.slice(startIndex, endIndex);
    
    // 获取所有首字母
    const allFirstLetters = getAllFirstLetters();
    
    return {
      props: {
        letter: letter.toLowerCase(),
        words: currentWords,
        currentPage: page,
        totalPages,
        allFirstLetters,
      }
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        letter: params.letter.toLowerCase(),
        words: [],
        currentPage: 1,
        totalPages: 1,
        allFirstLetters: ALL_LETTERS,
        error: "加载出错，请重试"
      }
    };
  }
}