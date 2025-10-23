"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const services = [
  {
    id: 1,
    title: "토목공사",
    subtitle: "Civil",
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3L2 9v11h20V9l-10-6zm0 2.3l7 4.2v8.5h-3v-6H8v6H5v-8.5l7-4.2zM10 16v2h4v-2h-4z"/>
      </svg>
    ),
    color: "from-blue-500 to-blue-700"
  },
  {
    id: 2,
    title: "지반·포장",
    subtitle: "Ground",
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z"/>
      </svg>
    ),
    color: "from-amber-500 to-amber-700"
  },
  {
    id: 3,
    title: "조경·시설",
    subtitle: "Landscape",
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>
      </svg>
    ),
    color: "from-green-500 to-green-700"
  },
  {
    id: 4,
    title: "방수·도장",
    subtitle: "Coating",
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    color: "from-indigo-500 to-indigo-700"
  },
  {
    id: 5,
    title: "스마트건설",
    subtitle: "Smart Tech",
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2zm0 3.16l5.5 13.63-5.5-2.43-5.5 2.43L12 5.16z"/>
      </svg>
    ),
    color: "from-cyan-500 to-cyan-700"
  },
  {
    id: 6,
    title: "시설 유지보수",
    subtitle: "Maintenance",
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
      </svg>
    ),
    color: "from-orange-500 to-orange-700"
  },
];

export default function ServicesSection() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  return (
    <section id="services" className="py-16 md:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-700 font-semibold text-sm uppercase tracking-wide"
          >
            Our Business
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mt-2"
          >
            사업분야
          </motion.h2>
        </div>

        {/* Orbital Services Design */}
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="relative aspect-square max-w-[800px] mx-auto">
            {/* Central Logo/Company */}
            <div className="absolute top-1/2 left-1/2 z-30" style={{ transform: 'translate(-50%, -50%)' }}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="relative w-52 h-52 md:w-72 md:h-72 bg-gradient-to-br from-brand-700 to-brand-900 rounded-full shadow-2xl flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>
                  <div className="absolute inset-4 border-2 border-white/20 rounded-full"></div>
                  <div className="text-center z-10 px-4">
                    <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    <h3 className="text-2xl md:text-4xl font-black text-white mb-1 tracking-tight">오주건설(주)</h3>
                    <div className="w-12 h-0.5 bg-white/50 mx-auto mb-1"></div>
                    <p className="text-xs md:text-sm text-white/90 font-medium tracking-wide">토목 종합건설사</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Orbital Ring */}
            <div className="absolute inset-0">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 border-2 border-dashed border-gray-300/50 rounded-full"
              />
            </div>

            {/* Rotating Services Container */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {/* Connecting Lines Layer (below services) */}
              {services.map((service, index) => {
                const angle = (index / services.length) * 360;
                const radius = 42;
                const centerX = 50;
                const centerY = 50;
                const endX = 50 + radius * Math.cos((angle - 90) * Math.PI / 180);
                const endY = 50 + radius * Math.sin((angle - 90) * Math.PI / 180);

                return (
                  <svg
                    key={`line-${service.id}`}
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '100%', height: '100%' }}
                  >
                    <line
                      x1={`${centerX}%`}
                      y1={`${centerY}%`}
                      x2={`${endX}%`}
                      y2={`${endY}%`}
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`transition-all duration-300 ${
                        hoveredService === service.id ? 'opacity-40' : 'opacity-15'
                      } text-gray-400`}
                    />
                  </svg>
                );
              })}

              {/* Orbiting Service Items */}
              {services.map((service, index) => {
                const angle = (index / services.length) * 360;
                const radius = 42; // percentage from center (closer to center)
                const x = 50 + radius * Math.cos((angle - 90) * Math.PI / 180);
                const y = 50 + radius * Math.sin((angle - 90) * Math.PI / 180);

                return (
                  <div
                    key={service.id}
                    style={{
                      position: 'absolute',
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="cursor-pointer z-20"
                  >
                    {/* Counter-rotation wrapper to keep content upright */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 60,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        onMouseEnter={() => setHoveredService(service.id)}
                        onMouseLeave={() => setHoveredService(null)}
                        className={`
                          relative group
                          transition-all duration-300
                          ${hoveredService === service.id ? 'scale-110' : 'scale-100'}
                        `}
                      >
                        {/* Service Circle */}
                        <div className={`
                          relative
                          w-32 h-32 md:w-44 md:h-44
                          bg-gradient-to-br ${service.color}
                          rounded-full
                          shadow-xl
                          flex flex-col items-center justify-center
                          transition-all duration-300
                          border-4 border-white
                          ${hoveredService === service.id ? 'shadow-2xl ring-4 ring-white/30' : ''}
                        `}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                          <div className="text-white mb-2 z-10 scale-110">{service.icon}</div>
                          <div className="text-sm md:text-base font-bold text-white text-center px-3 leading-tight z-10">
                            {service.title}
                          </div>
                          <div className="text-xs md:text-sm text-white/80 mt-0.5 z-10">
                            {service.subtitle}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Bottom Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            토목 종합건설사로서 전통적인 토목공사부터 첨단 스마트건설 기술까지,
            <br className="hidden md:block" />
            풍부한 경험과 혁신적인 기술로 고객의 성공적인 프로젝트를 완성합니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
