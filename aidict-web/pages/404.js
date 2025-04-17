import Link from 'next/link';
import Layout from '../components/Layout';

export default function Custom404() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-8">404 - 页面未找到</h1>
        <p className="text-xl text-gray-600 mb-8">
          抱歉，您请求的页面不存在或已被移动。
        </p>
        <Link 
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </Layout>
  );
}