"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { env } from "@/shared/config/env";

const slides = [
  {
    id: 1,
    image: "/images/hero-slide1.jpg",
    title: "미래를 여는 건설",
    subtitle: env.company.name,
    description: "기술로 세우고, 신뢰로 완성합니다",
    cta: {
      text: "회사소개 보기",
      href: "#about",
    },
  },
  {
    id: 2,
    image: "/images/hero-slide2.jpg",
    title: "기술의 정교함",
    subtitle: "신뢰의 견고함",
    description: "우리의 기술로 세운 건물은 오래도록 당신의 미래를 지킵니다",
    cta: {
      text: "사업분야 보기",
      href: "#services",
    },
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden pt-16">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
              priority={currentSlide === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center text-center text-white">
            <div className="container mx-auto px-4 max-w-5xl">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="mb-6"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 leading-tight tracking-tight">
                  {slides[currentSlide].title}
                </h1>
                <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 bg-clip-text text-transparent">
                  {slides[currentSlide].subtitle}
                </div>
              </motion.div>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="text-lg md:text-xl lg:text-2xl mb-10 text-gray-100 font-light tracking-wide max-w-3xl mx-auto"
              >
                {slides[currentSlide].description}
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              >
                <Link
                  href={slides[currentSlide].cta.href}
                  className="group inline-flex items-center gap-3 bg-brand-700 hover:bg-brand-800 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="text-lg">{slides[currentSlide].cta.text}</span>
                  <span className="text-xl transform group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/90">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm font-medium tracking-wider">SCROLL</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
