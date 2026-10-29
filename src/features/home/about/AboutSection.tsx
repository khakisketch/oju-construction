"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BUSINESS_AREA_LIST } from "@/shared/config/businessAreas";

export default function AboutSection() {
  return (
    <section id="about" className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-5 md:grid-cols-2 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative hidden md:block"
          >
            <div className="flex h-96 items-center justify-center">
              <div className="absolute h-72 w-72 rounded-full border-2 border-dashed border-brand-200 opacity-60" />
              <div className="absolute h-80 w-80 rounded-full border border-brand-100 opacity-40" />
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white shadow-lg">
                <Image
                  src="/images/ojuconstruction-logo.png"
                  alt="오주건설(주) 로고"
                  width={200}
                  height={200}
                  className="h-[140px] w-[140px] object-contain"
                />
              </div>
              <div className="absolute right-8 top-6 h-3 w-3 rounded-full bg-brand-300 opacity-50" />
              <div className="absolute right-4 top-12 h-2 w-2 rounded-full bg-brand-200 opacity-40" />
              <div className="absolute bottom-16 left-6 h-2.5 w-2.5 rounded-full bg-brand-300 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="mb-4 max-w-3xl text-2xl font-bold leading-snug">
              오주건설(주)은 신뢰를 기반으로 한 토목 종합 건설기업입니다
            </h3>
            <div className="w-12 h-[3px] bg-brand-700 mb-4" />
            <div className="max-w-prose space-y-3 text-[15px] leading-6 text-gray-600">
              <p>
                저희 오주건설(주)는 전문건설 면허를 보유하고 있으며,
                {BUSINESS_AREA_LIST} 분야의 공사를 진행합니다.
              </p>
              <p>
                2004년 법인설립 이후 다수의 관공서, 산업단지, 군부대 등 다양한 시설물의
                사업 분야별 공사를 진행하며, 축적된 노하우와 우수한 인재들의
                경험을 바탕으로 업계의 리더로 자리매김하고자 끊임없이 노력하고 있습니다.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
