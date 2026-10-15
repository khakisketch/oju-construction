"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  const FOUNDED_YEAR = 2004;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - FOUNDED_YEAR;

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 왼쪽: 이미지 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:block relative"
          >
            <div className="flex items-center justify-center h-96">
              {/* 장식 링 */}
              <div className="absolute w-72 h-72 rounded-full border-2 border-dashed border-brand-200 opacity-60" />
              <div className="absolute w-80 h-80 rounded-full border border-brand-100 opacity-40" />

              {/* 로고 프레임 */}
              <div className="relative w-56 h-56 rounded-full bg-gradient-to-br from-brand-50 to-white border-2 border-brand-200 shadow-lg flex items-center justify-center">
                <Image
                  src="/images/ojuconstruction-logo.png"
                  alt="오주건설(주) 로고"
                  width={200}
                  height={200}
                  className="w-[140px] h-[140px] object-contain"
                />
              </div>

              {/* 코너 장식 도트 */}
              <div className="absolute top-6 right-8 w-3 h-3 rounded-full bg-brand-300 opacity-50" />
              <div className="absolute top-12 right-4 w-2 h-2 rounded-full bg-brand-200 opacity-40" />
              <div className="absolute bottom-16 left-6 w-2.5 h-2.5 rounded-full bg-brand-300 opacity-50" />
            </div>
          </motion.div>

          {/* 오른쪽: 내용 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              오주건설(주)은 신뢰를 기반으로 한 토목 종합 건설기업입니다
            </h3>
            <div className="w-16 h-1 bg-brand-700 mb-6" />
            <div className="space-y-4 text-gray-600">
              <p>
                저희 오주건설(주)는 전문건설 면허를 보유하고 있으며, 토목공사 및 시설물
                유지보수를 전문으로 하는 종합건설회사입니다.
              </p>
              <p>
                2004년 법인설립 이후 다수의 관공서, 산업단지, 군부대 등 다양한 시설물의
                토목공사 및 유지보수공사를 진행하며, 축적된 노하우와 우수한 인재들의
                경험을 바탕으로 업계의 리더로 자리매김하고자 끊임없이 노력하고 있습니다.
              </p>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-brand-700">{yearsOfExperience}+</div>
                <div className="text-sm text-gray-600 mt-2">년 업력</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-brand-700">6</div>
                <div className="text-sm text-gray-600 mt-2">전문 면허</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-brand-700">200+</div>
                <div className="text-sm text-gray-600 mt-2">완료 프로젝트</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-brand-700">50+</div>
                <div className="text-sm text-gray-600 mt-2">전문 인력</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
