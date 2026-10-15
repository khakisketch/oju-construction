"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RefreshCw, AlertTriangle, Phone } from "lucide-react";
import { env } from "@/shared/config/env";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (필요시 외부 서비스로 전송)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-16 h-16 md:w-20 md:h-20 text-red-500" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            오류가 발생했습니다
          </h1>
          <p className="text-gray-600 mb-2 max-w-md mx-auto">
            페이지를 불러오는 중 문제가 발생했습니다.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            잠시 후 다시 시도해 주세요. 문제가 지속되면 고객센터로 문의해 주세요.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-700 text-white font-semibold rounded-full hover:bg-brand-800 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-700 text-brand-700 font-semibold rounded-full hover:bg-brand-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
        </motion.div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-gray-100 rounded-lg text-left"
          >
            <p className="text-xs text-gray-500 mb-2">개발 모드 에러 정보:</p>
            <code className="text-xs text-red-600 break-all">
              {error.message}
            </code>
            {error.digest && (
              <p className="text-xs text-gray-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </motion.div>
        )}

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500 mb-4">
            문제가 계속되면 연락해 주세요
          </p>
          <a
            href={`tel:${env.company.phone}`}
            className="inline-flex items-center gap-2 text-brand-700 hover:text-brand-800 font-medium transition-colors"
          >
            <Phone className="w-4 h-4" />
            {env.company.phone}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
