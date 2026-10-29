"use client";

import { motion } from "framer-motion";

const steps = [
  { number: "1", title: "상담 문의", desc: "전화·문의로 공사 내용과\n요청 범위를 확인합니다." },
  { number: "2", title: "현장 방문·실사", desc: "현장 상태와 요청 범위를\n살펴봅니다." },
  {
    number: "3",
    title: "전후 비교 자료·제안서 제공",
    desc: "AI 시뮬레이션으로 시공 후 모습을 비교하고,\n시공 범위와 자재·공법 선택 이유를 설명합니다.",
  },
  {
    number: "4",
    title: "대표회의 설명·의결 대응",
    desc: "제안 내용을 대표회의에 설명하고,\n질의와 의결 절차에 대응합니다.",
  },
  { number: "5", title: "계약·시공", desc: "협의된 범위와 조건에 따라\n계약 후 공사를 진행합니다." },
  { number: "6", title: "준공 확인", desc: "완료된 공사 범위를\n함께 확인합니다." },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold mb-3 text-brand-900 tracking-tight"
          >
            상담부터 준공까지
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="w-12 h-[3px] bg-brand-700 mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto leading-6"
          >
            상담과 현장 실사 후, 전후 비교 제안과 대표회의 설명·의결 대응을 거쳐 계약·시공 및 준공 확인까지 진행합니다.
          </motion.p>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-start justify-center relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex-1 max-w-[160px] text-center relative">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 bg-brand-200 z-0" />
                )}
                {/* Dot */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2.5 text-base font-extrabold transition-colors ${
                    idx === 0 || idx === steps.length - 1
                      ? "bg-brand-700 text-white ring-4 ring-brand-100"
                      : "bg-white text-brand-700 border-[3px] border-brand-700"
                  }`}
                >
                  {step.number}
                </div>
                <div className="text-sm font-bold text-brand-900 mb-1">{step.title}</div>
                <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{step.desc}</div>
              </div>
            ))}
          </div>

          {/* Mobile: Card Stack */}
          <div className="md:hidden grid grid-cols-2 gap-2">
            {steps.map((step, idx) => {
              const isHighlight = idx === 0 || idx === steps.length - 1;
              return (
                <div
                  key={idx}
                  className={`flex min-h-[5.25rem] items-start gap-2 px-2.5 py-2.5 rounded-lg border transition-colors ${
                    isHighlight
                      ? "bg-brand-700 border-brand-700"
                      : "bg-brand-50 border-brand-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-extrabold ${
                      isHighlight
                        ? "bg-white/20 text-white"
                        : "bg-brand-700 text-white"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-[13px] font-bold leading-snug ${isHighlight ? "text-white" : "text-brand-900"}`}>
                      {step.title}
                    </div>
                    <div className={`mt-0.5 text-xs leading-snug ${isHighlight ? "text-brand-200" : "text-gray-600"}`}>
                      {step.desc.replace("\n", " · ")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
