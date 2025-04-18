import '../styles/globals.css';
import '../styles/tailwind.min.css';  // 添加本地Tailwind CSS引用

function MyApp({ Component, pageProps }) {
  return (
    <div className="antialiased text-gray-800">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;