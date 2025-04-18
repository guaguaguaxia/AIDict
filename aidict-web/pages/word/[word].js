import Head from 'next/head';
import Layout from '../../components/Layout';
import Pronunciation from '../../components/Pronunciation';
import WordExamples from '../../components/WordExamples';
import RelatedWords from '../../components/RelatedWords';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import FloatingBackButton from '../../components/FloatingBackButton';
import { getAllWordIds, getWordData } from '../../lib/words';

export default function Word({ wordData }) {
  return (
    <Layout>
      <Head>
        <title>{wordData.word} | AI 英语词典</title>
        <meta name="description" content={`${wordData.word} 单词的详细解释`} />
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* 添加面包屑导航 */}
        <BreadcrumbNav word={wordData.word} />
        
        <div className="mb-6 flex items-center justify-between flex-wrap">
          <div className="flex items-center mb-3 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 capitalize mr-4">
              {wordData.word}
            </h1>
            <Pronunciation word={wordData.word} />
          </div>
          
          {/* 删除了分享和收藏按钮 */}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: wordData.contentHtml }} />
          
          {/* Add example sentences component */}
          <WordExamples word={wordData.word} />
          
          {/* Add related words component */}
          <RelatedWords word={wordData.word} />
        </div>

        <div className="flex justify-between items-center py-4 border-t border-gray-200">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            返回
          </button>
        </div>

        {/* 添加悬浮返回按钮 */}
        <FloatingBackButton />
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const wordData = await getWordData(params.word);
  return {
    props: {
      wordData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllWordIds();
  return {
    paths,
    fallback: false,
  };
}