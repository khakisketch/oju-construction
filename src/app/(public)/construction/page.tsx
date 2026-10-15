"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Shield, Sparkles, Handshake } from "lucide-react";

export default function ConstructionPage() {
  const [activeTab, setActiveTab] = useState<"civil" | "paving" | "landscape" | "maintenance">("civil");

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/images/construction/hero-main.jpg)'
            }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 bg-brand-700 rounded-full text-sm font-semibold mb-4"
            >
              종합 건설 솔루션
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            >
              기본에 충실한 건설,<br />
              미래를 짓는 기술
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            >
              20년 이상의 현장 노하우와 스마트 건설 기술의 융합.<br />
              보이지 않는 기초부터 마감까지 완벽함을 추구합니다.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 md:gap-12 text-center border-t border-white/10 pt-8"
            >
              <div>
                <div className="text-3xl md:text-4xl font-bold text-brand-400 mb-1">20<span className="text-xl text-brand-400/80">년</span></div>
                <div className="text-sm text-gray-400 font-medium">현장 경력</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-brand-400 mb-1">0<span className="text-xl text-brand-400/80">건</span></div>
                <div className="text-sm text-gray-400 font-medium">중대재해 발생</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-brand-400 mb-1">100<span className="text-xl text-brand-400/80">%</span></div>
                <div className="text-sm text-gray-400 font-medium">공기 준수율</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Core Values (신뢰 강조) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">우리의 원칙</h2>
            <p className="text-gray-600">고객과의 약속을 지키기 위한 3가지 핵심 가치</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "안전 제일 (Safety First)",
                desc: "모든 공정에서 안전을 최우선으로 합니다. 체계적인 안전 관리 시스템을 통해 무재해 현장을 실현합니다."
              },
              {
                icon: Sparkles,
                title: "품질 경영 (Quality)",
                desc: "타협하지 않는 품질 기준을 적용합니다. 검증된 자재 사용과 정밀 시공으로 하자 없는 결과물을 제공합니다."
              },
              {
                icon: Handshake,
                title: "책임 시공 (Responsibility)",
                desc: "착공부터 준공 후 유지보수까지 끝까지 책임집니다. 고객과의 신뢰를 기업의 가장 큰 자산으로 여깁니다."
              }
            ].map((value, idx) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-brand-700" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Construction Fields Tabs (전문성 강조) */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-brand-700 font-bold text-sm uppercase tracking-wider">Business Areas</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">전문 시공 분야</h2>
            <p className="text-gray-600">토목부터 시설물 유지보수까지 폭넓은 시공 능력</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { id: "civil", label: "토목공사" },
              { id: "paving", label: "포장/토공" },
              { id: "landscape", label: "조경공사" },
              { id: "maintenance", label: "시설물 유지보수" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300
                  ${activeTab === tab.id
                    ? "bg-brand-700 text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100 hover:text-brand-700"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === "civil" && <CivilContent />}
            {activeTab === "paving" && <PavingContent />}
            {activeTab === "landscape" && <LandscapeContent />}
            {activeTab === "maintenance" && <MaintenanceContent />}
          </div>
        </div>
      </section>

      {/* 4. Technical Process (체계성 강조) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">시공 프로세스</h2>
            <p className="text-gray-600">체계적인 공정 관리로 완벽을 기합니다</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
             {/* Connecting Line (Desktop) */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-10">
              {[
                { step: "01", title: "현장 조사", desc: "지반/환경 정밀 분석" },
                { step: "02", title: "공정 계획", desc: "최적 시공법 선정" },
                { step: "03", title: "정밀 시공", desc: "규격 준수 및 품질 관리" },
                { step: "04", title: "준공/인도", desc: "최종 검수 및 사후 관리" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg text-center"
                >
                  <div className="w-12 h-12 bg-brand-700 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-md">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-brand-700 to-brand-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              성공적인 건설 프로젝트의 시작
            </h2>
            <p className="text-lg text-white/90 mb-8">
              오주건설의 전문 기술력과 노하우로 귀하의 프로젝트를 완성해 드립니다.<br className="hidden md:block" />
              지금 바로 전문가와 상의하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="px-8 py-4 bg-white text-brand-700 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                건설 문의하기
              </a>
              <a
                href="tel:070-4260-7307"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/20 transition-all border-2 border-white/30"
              >
                전문가 상담하기
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --- Sub Components for Tabs --- */

function CivilContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-2 gap-8 items-center"
    >
      <div className="space-y-6 order-2 md:order-1">
        <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-brand-700">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">토목공사 (Civil Engineering)</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            국토 개발의 근간이 되는 도로, 교량, 상하수도 등 사회 기반 시설을 시공합니다.
            정밀한 측량과 엄격한 품질 관리를 통해 안전하고 지속 가능한 인프라를 구축합니다.
          </p>
          <ul className="space-y-3">
            {[
              "도로 및 교량 구조물 시공",
              "상하수도 관로 공사",
              "부지 조성 및 옹벽 공사",
              "하천 정비 및 제방 공사"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                <svg className="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="order-1 md:order-2 h-[400px] rounded-2xl overflow-hidden shadow-xl relative group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: 'url(/images/construction/civil.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
           <span className="text-white font-bold text-xl">견고한 기초, 안전한 미래</span>
        </div>
      </div>
    </motion.div>
  );
}

function PavingContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-2 gap-8 items-center"
    >
      <div className="h-[400px] rounded-2xl overflow-hidden shadow-xl relative group">
         <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: 'url(/images/construction/paving.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
           <span className="text-white font-bold text-xl">완벽한 평탄성, 내구성은 기본</span>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-brand-700">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">포장 및 토공 (Paving & Earthwork)</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            아스팔트, 콘크리트 포장부터 기초 토공사까지. 최신 장비와 숙련된 기술인력을 투입하여
            최적의 주행성과 내구성을 갖춘 도로 환경을 제공합니다.
          </p>
          <ul className="space-y-3">
            {[
              "아스팔트/콘크리트 도로 포장",
              "주차장 및 진입로 포장",
              "대규모 절토 및 성토 작업",
              "연약지반 개량 공사"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                <svg className="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function LandscapeContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-2 gap-8 items-center"
    >
      <div className="space-y-6 order-2 md:order-1">
        <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-brand-700">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">조경공사 (Landscape Architecture)</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            자연과 사람이 공존하는 아름다운 공간을 창조합니다.
            식재부터 시설물 설치까지, 환경을 생각하는 친환경 시공으로 공간의 가치를 높입니다.
          </p>
          <ul className="space-y-3">
            {[
              "공원 및 정원 조성",
              "조경 시설물(퍼걸러, 벤치) 설치",
              "수목 식재 및 관리",
              "생태 하천 및 산책로 조성"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                <svg className="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="order-1 md:order-2 h-[400px] rounded-2xl overflow-hidden shadow-xl relative group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: 'url(/images/construction/landscape.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
           <span className="text-white font-bold text-xl">도시의 숨결을 만드는 공간</span>
        </div>
      </div>
    </motion.div>
  );
}

function MaintenanceContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-2 gap-8 items-center"
    >
      <div className="h-[400px] rounded-2xl overflow-hidden shadow-xl relative group">
         <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: 'url(/images/construction/maintenance.jpg)' }}
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
           <span className="text-white font-bold text-xl">지속 가능한 시설 관리</span>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-brand-700">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">시설물 유지보수 (Maintenance)</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            시설물의 수명을 연장하고 안전을 확보하기 위한 전문적인 유지보수 서비스를 제공합니다.
            방수, 도장, 구조물 보강 등 종합적인 관리 솔루션을 제안합니다.
          </p>
          <ul className="space-y-3">
            {[
              "구조물 방수 및 도장 공사",
              "노후 시설물 개보수",
              "안전 진단 및 보강 공사",
              "도로 및 시설물 긴급 복구"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                <svg className="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
