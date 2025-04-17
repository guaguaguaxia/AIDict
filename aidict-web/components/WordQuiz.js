import { useState, useEffect } from 'react';

export default function WordQuiz({ word }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Generate simple quiz questions based on the word
  useEffect(() => {
    if (word) {
      // In a real application, these would be fetched from an API
      const generatedQuestions = [
        {
          question: `"${word}" 这个单词最常用作什么词性？`,
          options: ['名词', '动词', '形容词', '副词'],
          correctAnswer: '名词' // This would be dynamic in a real app
        },
        {
          question: `选择正确使用 "${word}" 的句子:`,
          options: [
            `她${word}了这种情况。`,
            `这个${word}对房间里的每个人都很明显。`,
            `他们${word}地解决了这个问题。`,
            `我${word}我们应该重新考虑我们的选择。`
          ],
          correctAnswer: `这个${word}对房间里的每个人都很明显。` // This would be dynamic
        },
        {
          question: `下列哪个词的意思与 "${word}" 最接近？`,
          options: ['概念', '例子', '想法', '理论'],
          correctAnswer: '概念' // This would be dynamic
        }
      ];

      setQuestions(generatedQuestions);
    }
  }, [word]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedOption(null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedOption(null);
  };

  if (!quizStarted) {
    return (
      <div className="mt-8 bg-indigo-50 rounded-xl p-6 text-center">
        <h3 className="text-xl font-semibold text-indigo-800 mb-3">测试你的知识</h3>
        <p className="text-gray-700 mb-4">
          参加一个简短的测验，测试你对单词 "{word}" 的理解。
        </p>
        <button
          onClick={handleStartQuiz}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          开始测验
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="mt-8 bg-indigo-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-indigo-800 mb-3">测验完成！</h3>
        <p className="text-gray-700 mb-2">
          你的得分是 {score} / {questions.length}。
        </p>
        {score === questions.length ? (
          <p className="text-green-600 mb-4">满分！太棒了！</p>
        ) : score >= questions.length / 2 ? (
          <p className="text-blue-600 mb-4">干得不错！继续学习以提高成绩。</p>
        ) : (
          <p className="text-orange-600 mb-4">你可能需要再复习一下这个单词。</p>
        )}
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleRestartQuiz}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            重新测验
          </button>
          <button
            onClick={() => setQuizStarted(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            关闭测验
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="mt-8 bg-indigo-50 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-indigo-800">
          问题 {currentQuestionIndex + 1} / {questions.length}
        </h3>
        <span className="text-gray-600 text-sm">
          得分: {score}/{currentQuestionIndex}
        </span>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <p className="text-gray-800 mb-4">{currentQuestion?.question}</p>

        <div className="space-y-2">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`w-full text-left px-4 py-3 rounded-md border transition-colors ${
                selectedOption === option
                  ? 'bg-indigo-100 border-indigo-300'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setQuizStarted(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={selectedOption === null}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === questions.length - 1 ? '完成' : '下一题'}
        </button>
      </div>
    </div>
  );
}