"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    processing: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const q = collection(db, "contacts");
      const snapshot = await getDocs(q);
      
      let newCount = 0;
      let processingCount = 0;
      let completedCount = 0;

      snapshot.forEach((doc) => {
        const status = doc.data().status;
        if (status === "new") newCount++;
        else if (status === "processing") processingCount++;
        else if (status === "completed") completedCount++;
      });

      setStats({
        total: snapshot.size,
        new: newCount,
        processing: processingCount,
        completed: completedCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500">오늘의 현황을 확인하세요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="text-gray-500 text-sm mb-1">총 문의</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}건</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-brand-100 bg-brand-50/30"
        >
          <div className="text-brand-600 text-sm mb-1 font-medium">신규 문의 (New)</div>
          <div className="text-3xl font-bold text-brand-700">{stats.new}건</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100 bg-yellow-50/30"
        >
          <div className="text-yellow-600 text-sm mb-1 font-medium">처리중 (Processing)</div>
          <div className="text-3xl font-bold text-yellow-700">{stats.processing}건</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-green-100 bg-green-50/30"
        >
          <div className="text-green-600 text-sm mb-1 font-medium">완료 (Completed)</div>
          <div className="text-3xl font-bold text-green-700">{stats.completed}건</div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">바로가기</h3>
          <div className="space-y-3">
            <Link href="/admin/contacts" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group">
              <span className="font-medium text-gray-700">문의 관리 바로가기</span>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/admin/news" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group">
              <span className="font-medium text-gray-700">뉴스/공지 관리</span>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/admin/settings" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group">
              <span className="font-medium text-gray-700">사이트 설정</span>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">시스템 상태</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Firebase 연결</span>
              <span className="text-green-600 font-bold text-sm bg-green-100 px-3 py-1 rounded-full">정상</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">최근 배포</span>
              <span className="text-gray-900 font-medium">2025.12.03</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}