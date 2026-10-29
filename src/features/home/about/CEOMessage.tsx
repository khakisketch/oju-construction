"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BUSINESS_AREA_LIST } from "@/shared/config/businessAreas";

export default function CEOMessage() {
  return (
    <section id="ceo" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
          >
            CEO Message
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mt-2"
          >
            대표 인사말
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-20 h-1 bg-brand-700 mx-auto mt-4"
          />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
            {/* 왼쪽: 이미지 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden md:block md:col-span-2"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/about/ceo.webp"
                  alt="오주건설(주) CEO"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* 오른쪽: 내용 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-3"
            >
              {/* 인용부호 장식 */}
              <div className="mb-6">
                <svg className="w-12 h-12 text-brand-700/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                </svg>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed text-gray-900">
                토목 종합건설 전문기업,<br />
                <span className="text-brand-700">오주건설(주)</span>입니다
              </h3>

              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  안녕하세요. 저희 오주건설(주)는 전문건설 면허를 보유하고 있으며,
                  {BUSINESS_AREA_LIST} 분야의 공사를 진행합니다.
                </p>
                <p>
                  2004년 법인설립 이후 다수의 관공서, 산업단지, 군부대 등 다양한 시설물의
                  사업 분야별 공사를 진행하며, 축적된 노하우와 우수한 인재들의
                  경험을 바탕으로 업계의 리더로 자리매김하고자 끊임없이 노력하고 있습니다.
                </p>
                <p>
                  앞으로도 지속적인 기술 개발과 고객 만족을 최우선으로, 신개념 건축문화를
                  창조하는 동종업계의 중심 기업으로 도약하겠습니다.
                </p>
              </div>

              {/* 서명 */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">감사합니다</p>
                    <p className="text-2xl font-bold text-gray-900">이자영</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">대표이사</p>
                    <p className="text-base font-semibold text-gray-700">오주건설(주)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
