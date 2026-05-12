/** @type {import('next').NextConfig} */
const nextConfig = {
  // 本番ビルド時の型エラーをワーニングにとどめない（CIでエラーにしたい場合はtrueに戻す）
  typescript: { ignoreBuildErrors: false },
  // Vercel Edge 最適化
  poweredByHeader: false,
}

export default nextConfig
