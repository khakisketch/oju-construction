/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Firebase Hosting(public: "out")에 정적 배포하므로 static export 사용
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // dev 서버와 프로덕션 빌드가 같은 산출물 디렉터리를 공유하면
  // 동시 실행 시 빌드 결과가 깨지므로 dev 전용 디렉터리를 분리한다.
  // (build는 기본 .next를 사용해 out/ 으로 정상 export)
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // 모노레포/홈 디렉터리 lockfile로 인한 workspace root 오판 방지
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
}

module.exports = nextConfig;
