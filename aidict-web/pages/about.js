import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About | AI Dictionary</title>
        <meta name="description" content="Learn about the AI Dictionary project and its features" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About AI Dictionary</h1>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            AI Dictionary is dedicated to making English language learning more accessible, comprehensive, and engaging. 
            We combine detailed word explanations with AI-powered insights to help learners understand not just the 
            definition of words, but also their usage, cultural context, and practical applications.
          </p>

          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-5 rounded-lg">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-blue-800 mb-1">Comprehensive Definitions</h3>
                  <p className="text-gray-600">Detailed explanations of words with multiple meanings, usage contexts, and examples.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-7.07m-1.414-1.415a9 9 0 000 12.728"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-blue-800 mb-1">Audio Pronunciation</h3>
                  <p className="text-gray-600">Listen to the correct pronunciation of each word to improve speaking skills.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-blue-800 mb-1">Interactive Learning</h3>
                  <p className="text-gray-600">Engage with flashcards, quizzes, and exercises to reinforce vocabulary learning.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-blue-800 mb-1">AI-Powered Insights</h3>
                  <p className="text-gray-600">Advanced AI technology provides deeper linguistic insights and contextual understanding.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-blue-800 mb-4">How to Use</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center text-indigo-700 font-semibold mr-3 mt-0.5">1</div>
              <p className="text-gray-700 flex-1"><strong>Browse by Letter:</strong> Use the alphabetical navigation on the homepage to browse words starting with a specific letter.</p>
            </div>
            <div className="flex items-start">
              <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center text-indigo-700 font-semibold mr-3 mt-0.5">2</div>
              <p className="text-gray-700 flex-1"><strong>Search for Words:</strong> Use the search bar at the top to quickly find specific words.</p>
            </div>
            <div className="flex items-start">
              <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center text-indigo-700 font-semibold mr-3 mt-0.5">3</div>
              <p className="text-gray-700 flex-1"><strong>Explore Definitions:</strong> Click on any word to see its detailed explanation, examples, and usage.</p>
            </div>
            <div className="flex items-start">
              <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center text-indigo-700 font-semibold mr-3 mt-0.5">4</div>
              <p className="text-gray-700 flex-1"><strong>Practice and Test:</strong> Use the interactive features like flashcards and quizzes to test your knowledge and improve retention.</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Our Technology</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            AI Dictionary is built using modern web technologies including Next.js and Tailwind CSS. Our content is 
            enhanced with AI-generated explanations that provide comprehensive insights into each word's meaning, 
            etymology, usage patterns, and cultural significance. We continuously update our database to ensure 
            that definitions remain relevant and accurate.
          </p>
        </div>

        <div className="bg-indigo-50 rounded-xl p-6 text-center mb-8">
          <h2 className="text-xl font-semibold text-indigo-800 mb-3">Ready to expand your vocabulary?</h2>
          <p className="text-gray-700 mb-5 max-w-2xl mx-auto">
            Explore thousands of words with detailed explanations, examples, and interactive learning tools.
          </p>
          <Link 
            href="/"
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start Exploring Words
          </Link>
        </div>

        <div className="flex justify-center py-4">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 inline-flex items-center transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Homepage
          </Link>
        </div>
      </div>
    </Layout>
  );
}