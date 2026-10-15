"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Phone } from "lucide-react";
import { env } from "@/shared/config/env";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h1 className="text-[150px] md:text-[200px] font-black text-brand-100 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              <Search className="w-12 h-12 md:w-16 md:h-16 text-brand-600 mx-auto" />
            </motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            요청하신 페이지가 존재하지 않거나, 이동되었거나, 일시적으로 사용할 수 없습니다.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-700 text-white font-semibold rounded-full hover:bg-brand-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-700 text-brand-700 font-semibold rounded-full hover:bg-brand-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            이전 페이지
          </button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500 mb-4">자주 찾는 페이지</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="text-brand-700 hover:text-brand-800 font-medium transition-colors"
            >
              회사소개
            </Link>
            <Link
              href="/construction"
              className="text-brand-700 hover:text-brand-800 font-medium transition-colors"
            >
              건설사업
            </Link>
            <Link
              href="/portfolio"
              className="text-brand-700 hover:text-brand-800 font-medium transition-colors"
            >
              포트폴리오
            </Link>
            <Link
              href="/#contact"
              className="text-brand-700 hover:text-brand-800 font-medium transition-colors"
            >
              문의하기
            </Link>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <a
            href={`tel:${env.company.phone}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            {env.company.phone}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
