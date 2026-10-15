"use client";

import { motion } from "framer-motion";
import Image from "next/image";


// 공공기관 + 대기업/협력사 (아파트 관리 제외)
const publicPartners = [
  { name: "청주시청" },
  { name: "한국도로공사", logo: "/images/partners/ex.webp" },
  { name: "세종시 개발공사" },
  { name: "충청북도청" },
  { name: "대전광역시" },
  { name: "한국토지주택공사", logo: "/images/partners/lh_footer.svg" },
  { name: "충북도시공사" },
  { name: "한국수자원공사", logo: "/images/partners/kwater.gif" },
  { name: "국방부" },
  { name: "충북산업단지공단" },
];

const corporatePartners = [
  { name: "삼성물산", logo: "/images/partners/samsung.svg" },
  { name: "현대건설" },
  { name: "대림산업" },
  { name: "포스코건설" },
  { name: "SK에코플랜트" },
  { name: "GS건설" },
  { name: "충북건설협회" },
  { name: "대우건설" },
];


interface MarqueeRowProps {
  items: { name: string; logo?: string }[];
  direction: "left" | "right";
  speed?: number;
}

function MarqueeRow({ items, direction, speed = 30 }: MarqueeRowProps) {
  const duplicated = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden py-2">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10" />

      <div
        className={`flex items-center gap-10 md:gap-16 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {duplicated.map((partner, idx) => (
          <div key={idx} className="flex-shrink-0">
            {partner.logo ? (
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={40}
                className="h-9 w-auto object-contain opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                unoptimized
              />
            ) : (
              <span className="text-base font-semibold text-gray-300 whitespace-nowrap hover:text-brand-700 transition-colors duration-300">
                {partner.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="partners" className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
          >
            Our Partners
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mt-2 mb-4"
          >
            주요 협력기관
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="w-20 h-1 bg-brand-700 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            공공기관부터 아파트 관리단까지, 다양한 발주처와 함께 성장하고 있습니다.
          </motion.p>
        </div>
      </div>

      {/* Marquee Rows */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="space-y-3 mb-16"
      >
        <MarqueeRow items={publicPartners} direction="right" speed={40} />
        <MarqueeRow items={corporatePartners} direction="left" speed={38} />
      </motion.div>

    </section>
  );
}
