"use client";

import { motion } from "framer-motion";

const certifications = [
  {
    number: "01",
    title: "전문건설업 면허 6종",
    subtitle: "국토교통부 등록",
    description: "토목 · 지반조성포장 · 조경 · 방수 · 도장 · 시설유지관리",
  },
  {
    number: "02",
    title: "안전관리 체계",
    subtitle: "산업안전보건 준수",
    description: "현장 안전관리 계획 수립 및 이행",
  },
  {
    number: "03",
    title: "품질관리 인증",
    subtitle: "건설기술진흥법 기반",
    description: "시공 품질 관리 및 하자 관리 체계 운영",
  },
  {
    number: "04",
    title: "건설공제조합 가입",
    subtitle: "이행보증 및 하자보증",
    description: "공사 이행 · 하자 · 선급금 보증 체계 구축",
  },
  {
    number: "05",
    title: "전문 기술인력 보유",
    subtitle: "건설기술인 등록",
    description: "토목기사 · 산업기사 등 자격 보유 인력 운영",
  },
  {
    number: "06",
    title: "기업 신용평가",
    subtitle: "경영 안정성 확보",
    description: "건전한 재무구조 기반 신뢰성 있는 사업 수행",
  },
];

export default function CertificationsSection() {
  return (
    <section id="certifications" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-500 font-semibold text-sm uppercase tracking-widest"
          >
            Certifications
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold mt-2 mb-4 text-brand-900 tracking-tight"
          >
            인증 및 자격
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="w-12 h-[3px] bg-brand-700 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-lg mx-auto"
          >
            면허 · 안전 · 품질 · 인력 등 다방면의 역량을 갖춘 종합건설 전문기업입니다.
          </motion.p>
        </div>

        {/* Blueprint Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-brand-200 overflow-hidden bg-brand-200 gap-px"
        >
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="bg-white p-8 md:p-9 relative group hover:bg-brand-50 transition-colors duration-300"
            >
              {/* Green dot */}
              <div className="absolute top-6 right-6 w-2 h-2 bg-green-500 rounded-full" />

              {/* Number */}
              <div className="text-5xl font-black text-brand-100 leading-none mb-3 select-none group-hover:text-brand-200 transition-colors">
                {cert.number}
              </div>

              {/* Content */}
              <h3 className="text-[17px] font-bold text-brand-900 mb-1">
                {cert.title}
              </h3>
              <p className="text-xs font-semibold text-brand-500 mb-2.5">
                {cert.subtitle}
              </p>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                {cert.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
