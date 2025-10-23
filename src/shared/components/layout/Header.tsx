"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { env } from "@/shared/config/env";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3 flex-shrink-0 group">
          <Image
            src="/images/ojuconstruction-logo.png"
            alt={`${env.company.name} 로고`}
            width={45}
            height={45}
            priority
            className="h-auto w-auto max-h-[40px] md:max-h-[45px]"
          />
          <div className="flex flex-col">
            <span className={`text-lg md:text-xl font-bold transition-colors ${
              isScrolled
                ? "text-gray-900 group-hover:text-brand-700"
                : "text-white group-hover:text-brand-300"
            }`}>
              {env.company.name}
            </span>
            <span className={`text-xs -mt-1 transition-colors ${
              isScrolled ? "text-gray-500" : "text-white/80"
            }`}>{env.site.nameEn}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex items-center space-x-1">
            <li>
              <Link
                href="#about"
                className={`px-4 py-2 text-[15px] font-medium transition-colors duration-200 relative group ${
                  isScrolled
                    ? "text-gray-700 hover:text-brand-700"
                    : "text-white hover:text-brand-300"
                }`}
              >
                회사소개
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled ? "bg-brand-700" : "bg-white"
                }`}></span>
              </Link>
            </li>
            <li>
              <Link
                href="#services"
                className={`px-4 py-2 text-[15px] font-medium transition-colors duration-200 relative group ${
                  isScrolled
                    ? "text-gray-700 hover:text-brand-700"
                    : "text-white hover:text-brand-300"
                }`}
              >
                사업분야
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled ? "bg-brand-700" : "bg-white"
                }`}></span>
              </Link>
            </li>
            <li>
              <Link
                href="/software"
                className={`px-4 py-2 text-[15px] font-medium transition-colors duration-200 relative group ${
                  isScrolled
                    ? "text-gray-700 hover:text-brand-700"
                    : "text-white hover:text-brand-300"
                }`}
              >
                소프트웨어
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled ? "bg-brand-700" : "bg-white"
                }`}></span>
              </Link>
            </li>
            <li>
              <Link
                href="/drone"
                className={`px-4 py-2 text-[15px] font-medium transition-colors duration-200 relative group ${
                  isScrolled
                    ? "text-gray-700 hover:text-brand-700"
                    : "text-white hover:text-brand-300"
                }`}
              >
                드론촬영
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled ? "bg-brand-700" : "bg-white"
                }`}></span>
              </Link>
            </li>
            <li>
              <Link
                href="#portfolio"
                className={`px-4 py-2 text-[15px] font-medium transition-colors duration-200 relative group ${
                  isScrolled
                    ? "text-gray-700 hover:text-brand-700"
                    : "text-white hover:text-brand-300"
                }`}
              >
                시공실적
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isScrolled ? "bg-brand-700" : "bg-white"
                }`}></span>
              </Link>
            </li>
            <li className="ml-2">
              <Link
                href="#contact"
                className={`inline-block px-5 py-2 text-[15px] font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 ${
                  isScrolled
                    ? "text-white bg-brand-700 hover:bg-brand-800"
                    : "text-brand-700 bg-white hover:bg-gray-50"
                }`}
              >
                문의하기
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden relative z-10 w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 열기"
        >
          <div className="flex flex-col space-y-1.5">
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className={`block w-5 h-0.5 transition-all ${
                isScrolled ? "bg-gray-800" : "bg-white"
              }`}
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className={`block w-5 h-0.5 transition-all ${
                isScrolled ? "bg-gray-800" : "bg-white"
              }`}
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className={`block w-5 h-0.5 transition-all ${
                isScrolled ? "bg-gray-800" : "bg-white"
              }`}
            />
          </div>
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100"
            >
              <ul className="px-4 py-3 space-y-1">
                <li>
                  <Link
                    href="#about"
                    className="block px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    회사소개
                  </Link>
                </li>
                <li>
                  <Link
                    href="#services"
                    className="block px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    사업분야
                  </Link>
                </li>
                <li>
                  <Link
                    href="/software"
                    className="block px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    소프트웨어
                  </Link>
                </li>
                <li>
                  <Link
                    href="/drone"
                    className="block px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    드론촬영
                  </Link>
                </li>
                <li>
                  <Link
                    href="#portfolio"
                    className="block px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    시공실적
                  </Link>
                </li>
                <li className="pt-2">
                  <Link
                    href="#contact"
                    className="block text-center px-4 py-2.5 text-[15px] font-semibold text-white bg-brand-700 rounded-lg hover:bg-brand-800 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    문의하기
                  </Link>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
