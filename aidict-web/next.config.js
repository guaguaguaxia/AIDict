/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 确保静态资源路径正确
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  
  // 图片配置 - 启用优化
  images: {
    unoptimized: false,
    domains: [],
  },
  
  // 启用生产环境优化
  compiler: {
    // 移除console日志
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 启用压缩
  compress: true,
  
  // 优化字体加载
  optimizeFonts: true,
  
  // 如果你需要静态导出，使用这个配置而不是 next export 命令
  // output: 'export',
}

module.exports = nextConfig