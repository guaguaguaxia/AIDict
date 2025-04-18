import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getAllCategories, getPaginatedWordsByCategory } from '../../lib/words';

export default function CategoryPage({ category, categoryName, paginatedWords, currentPage, totalPages }) {
  const router = useRouter();
  const [page, setPage] = useState(currentPage);

  // 处理页面切换
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/category/${category}?page=${newPage}`);
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
        <title>{categoryName} | AI 英语词典</title>
        <meta name="description" content={`浏览 ${categoryName} 的英语单词列表`} />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{categoryName}</h1>
            <p className="text-gray-600">
              第 {currentPage} 页，共 {totalPages} 页，总共 {paginatedWords.totalWords} 个单词
            </p>
          </div>
          
          <Link
            href="/categories"
            className="mt-4 sm:mt-0 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            返回词汇分类
          </Link>
        </div>

        {/* 单词网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {paginatedWords.words.map((word) => (
            <Link 
              key={word} 
              href={`/word/${word}?from=category&categoryId=${category}&categoryName=${encodeURIComponent(categoryName)}`}
              prefetch={false}
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
  const { category } = params;
  const page = parseInt(query.page || 1, 10);
  
  // 获取分类名称
  const allCategories = getAllCategories();
  const categoryInfo = allCategories.find(cat => cat.id === category);
  
  if (!categoryInfo) {
    return {
      notFound: true
    };
  }
  
  // 获取带分页的单词列表
  const paginatedWords = getPaginatedWordsByCategory(category, page);
  
  return {
    props: {
      category,
      categoryName: categoryInfo.name,
      paginatedWords,
      currentPage: page,
      totalPages: paginatedWords.totalPages
    }
  };
}