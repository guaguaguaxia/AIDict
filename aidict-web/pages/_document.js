import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        {/* 使用本地字体文件替代Google Fonts */}
        <link rel="stylesheet" href="/styles/fontsgoogleapis" />
        
        {/* 移除Google字体链接 */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" /> */}
        
        {/* 移除不需要的DNS预获取 */}
        {/* <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" /> */}
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JNM2YM78NT"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JNM2YM78NT');
            `
          }}
        />
      </Head>
      <body className="bg-gray-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}