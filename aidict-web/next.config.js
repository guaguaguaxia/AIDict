/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 确保静态资源路径正确
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  
  // 图片配置
  images: {
    unoptimized: true,
    domains: [],
  },
  
  // 如果你需要静态导出，使用这个配置而不是 next export 命令
  // output: 'export',
}

module.exports = nextConfig