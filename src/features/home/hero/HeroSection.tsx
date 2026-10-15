"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/home/hero-slide1.webp"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        {/* Blueprint grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 leading-tight tracking-tight">
              기술의 정교함
            </h1>
            <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white/90 drop-shadow-lg">
              신뢰의 견고함
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl mb-10 text-gray-100 font-light tracking-wide max-w-3xl mx-auto"
          >
            6개 전문면허 보유 · 200+ 프로젝트 완료 · 무재해 운영
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-3 bg-brand-700 hover:bg-brand-800 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="text-lg">무료 견적 상담</span>
              <span className="text-xl transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-3 bg-transparent border-2 border-white/70 hover:border-white hover:bg-white/10 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-lg">시공실적 보기</span>
              <span className="text-xl transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
