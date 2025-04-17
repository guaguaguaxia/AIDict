import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getAllCategories, getCategoryWordCounts } from '../lib/words';

export default function Categories({ categories, wordCounts }) {
  return (
    <Layout>
      <Head>
        <title>词汇分类 | AI 英语词典</title>
        <meta name="description" content="按照不同分类浏览英语词汇" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">词汇分类</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}?page=1`}>
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h2>
                  <p className="text-gray-600">{wordCounts[category.id] || 0} 个单词</p>
                </div>
                <div className="text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const categories = getAllCategories();
  const wordCounts = getCategoryWordCounts();
  
  return {
    props: {
      categories,
      wordCounts
    }
  };
}