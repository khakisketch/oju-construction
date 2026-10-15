"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* 로고 애니메이션 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto bg-brand-700 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">OJU</span>
          </div>
        </motion.div>

        {/* 로딩 바 */}
        <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-brand-700 rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* 텍스트 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-500 text-sm"
        >
          로딩 중...
        </motion.p>
      </div>
    </div>
  );
}
