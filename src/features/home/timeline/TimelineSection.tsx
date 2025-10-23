"use client";

import { motion } from "framer-motion";

const timelineData = [
  {
    year: "2022",
    events: [{ month: "01월", description: "오주건설(주) 토목공사업 등록" }],
  },
  {
    year: "2020",
    events: [
      { month: "12월", description: "오주건설(주) 도장공사업 등록" },
      { month: "03월", description: "오주건설(주) 건물위생관리업 등록" },
    ],
  },
  {
    year: "2018",
    events: [{ month: "02월", description: "오주건설(주) 시설물유지보수업 추가 설립" }],
  },
  {
    year: "2004",
    events: [{ month: "04월", description: "오주건설(주) 포장공사업 법인설립" }],
  },
];

export default function TimelineSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
          >
            Our History
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mt-2 mb-4"
          >
            회사 연혁
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-20 h-1 bg-brand-700 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            오주건설(주)은 2004년 설립 이후 꾸준한 성장을 이어오고 있습니다.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-brand-300" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {timelineData.map((item, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="relative"
                  >
                    <div className="flex items-center">
                      {isLeft ? (
                        <>
                          {/* Left Side - Events */}
                          <div className="flex-1 pr-4 md:pr-8 text-right">
                            <div className="inline-block text-left bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-100">
                              {item.events.map((event, eventIndex) => (
                                <div key={eventIndex} className={eventIndex > 0 ? "mt-4 pt-4 border-t border-gray-200" : ""}>
                                  <h4 className="font-bold text-brand-700 mb-2">{event.month}</h4>
                                  <p className="text-gray-700 text-sm md:text-base">{event.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Center Dot */}
                          <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-brand-700 rounded-full border-4 border-white shadow-lg z-10" />

                          {/* Right Side - Year */}
                          <div className="flex-1 pl-4 md:pl-8">
                            <div className="inline-block bg-brand-700 text-white px-4 md:px-6 py-2 rounded-full font-bold text-sm md:text-base">
                              {item.year}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Left Side - Year */}
                          <div className="flex-1 text-right pr-4 md:pr-8">
                            <div className="inline-block bg-brand-700 text-white px-4 md:px-6 py-2 rounded-full font-bold text-sm md:text-base">
                              {item.year}
                            </div>
                          </div>

                          {/* Center Dot */}
                          <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-brand-700 rounded-full border-4 border-white shadow-lg z-10" />

                          {/* Right Side - Events */}
                          <div className="flex-1 pl-4 md:pl-8">
                            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-100">
                              {item.events.map((event, eventIndex) => (
                                <div key={eventIndex} className={eventIndex > 0 ? "mt-4 pt-4 border-t border-gray-200" : ""}>
                                  <h4 className="font-bold text-brand-700 mb-2">{event.month}</h4>
                                  <p className="text-gray-700 text-sm md:text-base">{event.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
