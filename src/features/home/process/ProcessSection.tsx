"use client";

import { motion } from "framer-motion";

const steps = [
  { number: "1", title: "문의 · 상담", desc: "요구사항 파악\n초기 상담" },
  { number: "2", title: "현장 답사", desc: "현장 실측\n조건 분석" },
  { number: "3", title: "견적 · 설계", desc: "상세 견적서\n공법 제안" },
  { number: "4", title: "계약 · 착공", desc: "계약 체결\n공사 착수" },
  { number: "5", title: "시공 · 관리", desc: "품질 · 안전\n공정 관리" },
  { number: "6", title: "준공 · A/S", desc: "준공 검수\n2년 하자보수" },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-500 font-semibold text-sm uppercase tracking-widest"
          >
            Work Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold mt-2 mb-4 text-brand-900 tracking-tight"
          >
            시공 프로세스
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
            체계적인 공정 관리로 처음부터 끝까지 신뢰할 수 있는 시공을 약속합니다.
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
                  <div className="absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 bg-brand-200 z-0" />
                )}
                {/* Dot */}
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3.5 text-lg font-extrabold transition-colors ${
                    idx === 0 || idx === steps.length - 1
                      ? "bg-brand-700 text-white ring-4 ring-brand-100"
                      : "bg-white text-brand-700 border-[3px] border-brand-700"
                  }`}
                >
                  {step.number}
                </div>
                <div className="text-sm font-bold text-brand-900 mb-1">{step.title}</div>
                <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">{step.desc}</div>
              </div>
            ))}
          </div>

          {/* Mobile: Card Stack */}
          <div className="md:hidden flex flex-col gap-2.5">
            {steps.map((step, idx) => {
              const isHighlight = idx === 0 || idx === steps.length - 1;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3.5 px-4 py-4 rounded-xl border transition-colors ${
                    isHighlight
                      ? "bg-brand-700 border-brand-700"
                      : "bg-brand-50 border-brand-100"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 text-sm font-extrabold ${
                      isHighlight
                        ? "bg-white/20 text-white"
                        : "bg-brand-700 text-white"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className={`text-[14px] font-bold ${isHighlight ? "text-white" : "text-brand-900"}`}>
                      {step.title}
                    </div>
                    <div className={`text-[11px] ${isHighlight ? "text-brand-200" : "text-gray-400"}`}>
                      {step.desc.replace("\n", " · ")}
                    </div>
                  </div>
                  <div className={`text-sm flex-shrink-0 ${isHighlight ? "text-white/40" : "text-brand-300"}`}>
                    {idx === steps.length - 1 ? "✓" : "›"}
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
