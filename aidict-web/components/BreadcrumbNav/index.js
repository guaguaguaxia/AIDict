import { useRouter } from 'next/router';
import Link from 'next/link';

export default function BreadcrumbNav({ word }) {
  const router = useRouter();
  const { query, asPath } = router;
  
  // 确定来源页面类型
  const getReferrer = () => {
    // 如果URL中包含 from=letter 参数和letter参数，表示来自字母列表页
    if (query.from === 'letter' && query.letter) {
      return {
        type: 'letter',
        text: `${query.letter.toUpperCase()}字母列表`,
        url: `/letter/${query.letter}`,
      };
    }
    
    // 如果URL中包含 from=search 参数和 q 参数，表示来自搜索结果页
    else if (query.from === 'search' && query.q) {
      return {
        type: 'search',
        text: `搜索结果`,
        url: `/search?q=${encodeURIComponent(query.q)}`,
      };
    }
    
    // 如果URL中包含 from=category 参数和 category参数，表示来自词汇分类页
    else if (query.from === 'category' && query.categoryName && query.categoryId) {
      return {
        type: 'category',
        text: query.categoryName,
        url: `/category/${query.categoryId}`,
      };
    }
    
    // 默认返回首页
    return {
      type: 'home',
      text: '首页',
      url: '/',
    };
  };
  
  const referrer = getReferrer();
  
  return (
    <nav className="flex mb-4 text-sm" aria-label="面包屑导航">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link href="/" className="inline-flex items-center text-gray-700 hover:text-blue-600">
            <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            首页
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
            <Link href={referrer.url} className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">
              {referrer.text}
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
            <span className="ml-1 text-gray-500 md:ml-2 font-medium">{word}</span>
          </div>
        </li>
      </ol>
    </nav>
  );
}