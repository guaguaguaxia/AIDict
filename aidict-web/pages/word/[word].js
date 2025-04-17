import Head from 'next/head';
import Layout from '../../components/Layout';
import Pronunciation from '../../components/Pronunciation';
import WordExamples from '../../components/WordExamples';
import RelatedWords from '../../components/RelatedWords';
import WordQuiz from '../../components/WordQuiz';
import Flashcard from '../../components/Flashcard';
import { getAllWordIds, getWordData } from '../../lib/words';

export default function Word({ wordData }) {
  return (
    <Layout>
      <Head>
        <title>{wordData.word} | AI 英语词典</title>
        <meta name="description" content={`${wordData.word} 单词的详细解释`} />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap">
          <div className="flex items-center mb-3 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 capitalize mr-4">
              {wordData.word}
            </h1>
            <Pronunciation word={wordData.word} />
          </div>
          
          <div className="flex space-x-2">
            <button className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
            </button>
            <button className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: wordData.contentHtml }} />
          
          {/* Add example sentences component */}
          <WordExamples word={wordData.word} />
          
          {/* Add related words component */}
          <RelatedWords word={wordData.word} />
        </div>

        {/* Learning tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add flashcard component */}
          <div>
            <Flashcard word={wordData.word} />
          </div>
          
          {/* Add interactive quiz component */}
          <div>
            <WordQuiz word={wordData.word} />
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 my-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">想学习更多？</h2>
          <p className="text-gray-700 mb-4">
            使用我们的学习资源扩展你的词汇量
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="#" className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors">
              练习题
            </a>
            <a href="#" className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors">
              单词卡片
            </a>
            <a href="#" className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors">
              测试自己
            </a>
          </div>
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
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllWordIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const wordData = await getWordData(params.word);
  return {
    props: {
      wordData,
    },
  };
}