"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function DronePage() {
  const [activeEquipment, setActiveEquipment] = useState<"mavic" | "phantom" | "inspire">("phantom");
  const [visiblePhotos, setVisiblePhotos] = useState(9);
  const [activePricingPlan, setActivePricingPlan] = useState<"basic" | "professional" | "surveying">("professional");

  // Set initial visible photos based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Mobile
        setVisiblePhotos(3);
      } else if (window.innerWidth < 1024) {
        // Tablet
        setVisiblePhotos(6);
      } else {
        // Desktop
        setVisiblePhotos(9);
      }
    };

    // Set initial value
    handleResize();

    // Listen to window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const equipment = [
    {
      id: "phantom",
      name: "DJI Phantom 4 RTK",
      type: "정밀 측량 전용",
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
      specs: [
        { label: "수평 정확도", value: "1cm + 1ppm (RTK)" },
        { label: "수직 정확도", value: "1.5cm + 1ppm (RTK)" },
        { label: "센서", value: "1인치 CMOS, 20MP" },
        { label: "비행 시간", value: "최대 30분" },
        { label: "RTK 모듈", value: "내장 (cm급 정밀도)" }
      ],
      applications: ["지형 측량", "토공량 산출", "정사영상 제작", "3D 모델링"]
    },
    {
      id: "mavic",
      name: "DJI Mavic 3 Enterprise",
      type: "시설물 점검",
      image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
      specs: [
        { label: "카메라", value: "4/3 CMOS, 20MP" },
        { label: "줌", value: "56배 하이브리드 줌" },
        { label: "비행 시간", value: "최대 45분" },
        { label: "RTK 모듈", value: "옵션 (cm급 정밀도)" },
        { label: "특수 기능", value: "열화상 카메라 옵션" }
      ],
      applications: ["시설물 점검", "안전 점검", "열화상 분석", "고해상도 촬영"]
    },
    {
      id: "inspire",
      name: "DJI Inspire 3",
      type: "고품질 영상 촬영",
      image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80",
      specs: [
        { label: "카메라", value: "Full-Frame 8K" },
        { label: "영상", value: "8K RAW, Apple ProRes" },
        { label: "짐벌", value: "3축 기계식 짐벌" },
        { label: "비행 시간", value: "최대 28분" },
        { label: "장애물 감지", value: "360° 전방향" }
      ],
      applications: ["홍보 영상 제작", "대규모 현장 촬영", "항공 사진 촬영", "시네마틱 영상"]
    }
  ];

  const photographySolutions = [
    {
      title: "홍보 영상 제작",
      icon: "🎬",
      description: "기업, 시설, 관광지 등의 홍보를 위한 전문 항공 영상을 제작합니다",
      features: ["4K/8K 고화질", "시네마틱 연출", "편집 및 색보정", "BGM & 자막"],
      startingPrice: "50만원~"
    },
    {
      title: "부동산 촬영",
      icon: "🏢",
      description: "건물, 토지, 단지 등 부동산 매물의 가치를 극대화하는 항공 촬영",
      features: ["다각도 촬영", "파노라마 뷰", "주변 환경 소개", "빠른 납품"],
      startingPrice: "30만원~"
    },
    {
      title: "이벤트 기록",
      icon: "🎉",
      description: "행사, 축제, 건설 기공식 등 특별한 순간을 항공에서 기록합니다",
      features: ["실시간 라이브뷰", "다양한 앵글", "하이라이트 편집", "당일 납품 가능"],
      startingPrice: "80만원~"
    },
    {
      title: "기업 콘텐츠",
      icon: "📱",
      description: "SNS, 유튜브, 홈페이지용 임팩트 있는 항공 콘텐츠를 제작합니다",
      features: ["SNS 최적화", "숏폼 제작", "정기 촬영 계약", "컨설팅 제공"],
      startingPrice: "견적 문의"
    }
  ];

  const surveyingSolutions = [
    {
      title: "지형 측량 및 3D 모델링",
      icon: "🗺️",
      description: "RTK 기술로 cm급 정밀도의 지형 데이터를 수집하고 3D 모델을 생성합니다",
      deliverables: ["정사영상 (Orthomosaic)", "3D Point Cloud", "DSM/DTM", "등고선 도면"],
      accuracy: "±1~2.5cm"
    },
    {
      title: "토공량 측정 및 분석",
      icon: "📐",
      description: "절성토량을 정확하게 계산하고 공사 진행에 따른 변화를 분석합니다",
      deliverables: ["토공량 계산서", "단면도", "체적 분석 리포트", "진도율 비교"],
      accuracy: "±1% 이내"
    },
    {
      title: "정밀 시설물 점검",
      icon: "🔍",
      description: "접근이 어려운 시설물을 안전하게 점검하고 상태를 분석합니다",
      deliverables: ["고해상도 이미지", "열화상 분석", "균열 탐지", "점검 보고서"],
      accuracy: "mm급 균열"
    }
  ];

  const dronePhotos = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80",
      title: "도시 야경 촬영",
      category: "홍보영상",
      location: "서울 강남구"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&q=80",
      title: "산업 현장 항공촬영",
      category: "산업촬영",
      location: "경기 화성"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
      title: "건설 현장 기록",
      category: "건설기록",
      location: "인천 송도"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
      title: "부동산 단지 촬영",
      category: "부동산",
      location: "경기 판교"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80",
      title: "공장 전경 촬영",
      category: "산업촬영",
      location: "충남 아산"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80",
      title: "자연 경관 촬영",
      category: "관광촬영",
      location: "강원 속초"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      title: "산악 지형 측량",
      category: "측량",
      location: "경북 울진"
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
      title: "농업 단지 촬영",
      category: "농업",
      location: "전남 나주"
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      title: "해안 항만 촬영",
      category: "항만",
      location: "부산 감천"
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      title: "산림 지대 측량",
      category: "측량",
      location: "강원 평창"
    },
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
      title: "도로 건설 현장",
      category: "건설기록",
      location: "경기 용인"
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
      title: "리조트 단지 촬영",
      category: "관광촬영",
      location: "제주 서귀포"
    },
    {
      id: 13,
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
      title: "호수 주변 경관",
      category: "관광촬영",
      location: "충북 청주"
    },
    {
      id: 14,
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
      title: "산업단지 전경",
      category: "산업촬영",
      location: "경기 평택"
    },
    {
      id: 15,
      image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",
      title: "태양광 발전소",
      category: "에너지",
      location: "전북 군산"
    }
  ];

  return (
    <div>
      {/* Page Header - 간결한 서브페이지 스타일 */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=1600&q=80)'
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
              드론 항공 촬영 및 측량
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              전문 드론 촬영 & 측량 서비스
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-8"
            >
              홍보 영상부터 정밀 측량까지 원스톱 솔루션<br />
              DJI Enterprise 공인 파트너 · 국토교통부 인증 조종자
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm"
            >
              <div>
                <div className="text-2xl font-bold text-brand-400">8K</div>
                <div className="text-gray-400">초고화질 영상</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-400">±1cm</div>
                <div className="text-gray-400">RTK 정밀도</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-400">20+년</div>
                <div className="text-gray-400">건설 경력</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-400">전국</div>
                <div className="text-gray-400">출장 가능</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Equipment Section - DJI 장비 */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">보유 장비</h2>
            <p className="text-gray-600">프로젝트 특성에 맞는 최적의 DJI 장비</p>
          </div>

          {/* Equipment Tabs */}
          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            {equipment.map((eq) => (
              <button
                key={eq.id}
                onClick={() => setActiveEquipment(eq.id as any)}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                  activeEquipment === eq.id
                    ? "bg-brand-700 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
              >
                {eq.name.split(" ")[1]} {eq.name.split(" ")[2]}
              </button>
            ))}
          </div>

          {/* Equipment Details */}
          {equipment.filter(eq => eq.id === activeEquipment).map((eq) => (
            <motion.div
              key={eq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative aspect-[4/3] md:aspect-auto">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${eq.image})` }}
                />
                <div className="absolute top-4 left-4 bg-brand-700 text-white px-4 py-2 rounded-lg font-bold text-sm">
                  {eq.type}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-1">{eq.name}</h3>
                <p className="text-gray-600 mb-6 text-sm">{eq.type}</p>

                <div className="space-y-3 mb-6">
                  {eq.specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-700">{spec.label}</span>
                      <span className="text-sm font-bold text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-3 text-gray-700">활용 분야</h4>
                  <div className="flex flex-wrap gap-2">
                    {eq.applications.map((app, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Drone Photography Gallery - 촬영 포트폴리오 갤러리 */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">촬영 포트폴리오</h2>
            <p className="text-gray-600">다양한 프로젝트에서 담아낸 드론 항공 촬영 작품들</p>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto">
            {dronePhotos.slice(0, visiblePhotos).map((photo, idx) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="break-inside-avoid mb-6"
              >
                <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${photo.image})` }}
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="inline-block px-3 py-1 bg-brand-700 text-white text-xs font-bold rounded-full mb-3">
                          {photo.category}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{photo.title}</h3>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {photo.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {visiblePhotos < dronePhotos.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <button
                onClick={() => {
                  const increment = window.innerWidth < 768 ? 3 : 6;
                  setVisiblePhotos(prev => Math.min(prev + increment, dronePhotos.length));
                }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-md hover:shadow-lg border border-gray-200"
              >
                <span>더 많은 포트폴리오 보기</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <p className="mt-3 text-sm text-gray-500">
                {visiblePhotos} / {dronePhotos.length}개 표시 중
              </p>
            </motion.div>
          )}

          {/* All Photos Loaded Message */}
          {visiblePhotos >= dronePhotos.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center"
            >
              <div className="inline-block px-6 py-3 bg-brand-50 text-brand-700 rounded-lg">
                <p className="font-semibold">모든 포트폴리오를 확인하셨습니다</p>
                <p className="text-sm mt-1">더 많은 작품이 궁금하시다면 문의해주세요</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pricing Section - 촬영 서비스 패키지 */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">촬영 서비스 패키지</h2>
            <p className="text-gray-600">단순 촬영부터 전문 측량까지</p>
          </div>

          {/* Mobile/Tablet Package Selector */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="inline-flex gap-2 p-1.5 bg-gray-100 rounded-xl">
              <button
                onClick={() => setActivePricingPlan("basic")}
                className={`px-5 py-3 rounded-lg font-bold text-sm transition-all ${
                  activePricingPlan === "basic"
                    ? "bg-white text-brand-700 shadow-md"
                    : "text-gray-500 hover:text-brand-700"
                }`}
              >
                기본 촬영
              </button>
              <button
                onClick={() => setActivePricingPlan("professional")}
                className={`px-5 py-3 rounded-lg font-bold text-sm transition-all ${
                  activePricingPlan === "professional"
                    ? "bg-white text-brand-700 shadow-md"
                    : "text-gray-500 hover:text-brand-700"
                }`}
              >
                정밀 현장 촬영
              </button>
              <button
                onClick={() => setActivePricingPlan("surveying")}
                className={`px-5 py-3 rounded-lg font-bold text-sm transition-all ${
                  activePricingPlan === "surveying"
                    ? "bg-white text-brand-700 shadow-md"
                    : "text-gray-500 hover:text-brand-700"
                }`}
              >
                정밀 측량
              </button>
            </div>
          </div>

          {/* Desktop: Show all packages */}
          <div className="hidden lg:grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Basic Photography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">기본 촬영</h3>
                <div className="text-3xl font-bold text-brand-700 mb-2">500,000원~</div>
                <p className="text-sm text-gray-600">홍보용 항공 사진/영상</p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "4K 고화질 영상 촬영",
                  "원본 영상 및 편집본 제공",
                  "촬영 시간: 1~2시간",
                  "기본 색보정 포함",
                  "10km 이내 출장 무료"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-5 h-5 text-brand-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition-all"
              >
                문의하기
              </a>
            </motion.div>

            {/* Professional Photography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all border-2 border-brand-700"
            >
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 bg-brand-700 text-white text-xs font-bold rounded-full mb-3">
                  POPULAR
                </div>
                <h3 className="text-xl font-bold mb-2">정밀 현장 촬영</h3>
                <div className="text-3xl font-bold text-brand-700 mb-2">1,500,000원~</div>
                <p className="text-sm text-gray-600">고품질 항공 촬영 및 기록</p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "8K 초고화질 영상 촬영",
                  "정사영상(Orthomosaic) 제공",
                  "타임랩스 영상 제작",
                  "고해상도 이미지 제공",
                  "전국 출장 가능",
                  "전문 편집 및 보정"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-5 h-5 text-brand-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="block w-full text-center px-6 py-3 bg-brand-700 text-white font-bold rounded-lg hover:bg-brand-800 transition-all"
              >
                문의하기
              </a>
            </motion.div>

            {/* Surveying Package */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 shadow-md hover:shadow-xl transition-all text-white"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">정밀 측량</h3>
                <div className="text-3xl font-bold text-brand-400 mb-2">견적 문의</div>
                <p className="text-sm text-gray-400">RTK 기반 cm급 측량</p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "RTK 정밀 측량 (±1cm)",
                  "3D Point Cloud 생성",
                  "DSM/DTM 제작",
                  "토공량 계산서",
                  "CAD 도면 변환",
                  "측량 성과 검수서",
                  "전문 측량 소프트웨어 처리"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-5 h-5 text-brand-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="block w-full text-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/20 transition-all border border-white/30"
              >
                견적 문의
              </a>
            </motion.div>
          </div>

          {/* Mobile/Tablet: Show selected package only */}
          <div className="lg:hidden">
            {[
              {
                id: "basic",
                name: "기본 촬영",
                price: "500,000원~",
                description: "홍보용 항공 사진/영상",
                features: [
                  "4K 고화질 영상 촬영",
                  "원본 영상 및 편집본 제공",
                  "촬영 시간: 1~2시간",
                  "기본 색보정 포함",
                  "10km 이내 출장 무료"
                ],
                buttonText: "문의하기",
                buttonClass: "bg-gray-100 text-gray-900 hover:bg-gray-200"
              },
              {
                id: "professional",
                name: "정밀 현장 촬영",
                price: "1,500,000원~",
                description: "고품질 항공 촬영 및 기록",
                badge: "POPULAR",
                features: [
                  "8K 초고화질 영상 촬영",
                  "정사영상(Orthomosaic) 제공",
                  "타임랩스 영상 제작",
                  "고해상도 이미지 제공",
                  "전국 출장 가능",
                  "전문 편집 및 보정"
                ],
                buttonText: "문의하기",
                buttonClass: "bg-brand-700 text-white hover:bg-brand-800",
                hasBorder: true
              },
              {
                id: "surveying",
                name: "정밀 측량",
                price: "견적 문의",
                description: "RTK 기반 cm급 측량",
                features: [
                  "RTK 정밀 측량 (±1cm)",
                  "3D Point Cloud 생성",
                  "DSM/DTM 제작",
                  "토공량 계산서",
                  "CAD 도면 변환",
                  "측량 성과 검수서",
                  "전문 측량 소프트웨어 처리"
                ],
                buttonText: "견적 문의",
                buttonClass: "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30",
                isDark: true
              }
            ].filter(pkg => pkg.id === activePricingPlan).map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-xl p-8 shadow-md ${
                  pkg.isDark
                    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
                    : "bg-white"
                } ${pkg.hasBorder ? "border-2 border-brand-700" : ""}`}
              >
                <div className="text-center mb-6">
                  {pkg.badge && (
                    <div className="inline-block px-3 py-1 bg-brand-700 text-white text-xs font-bold rounded-full mb-3">
                      {pkg.badge}
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <div className={`text-3xl font-bold mb-2 ${pkg.isDark ? "text-brand-400" : "text-brand-700"}`}>
                    {pkg.price}
                  </div>
                  <p className={`text-sm ${pkg.isDark ? "text-gray-400" : "text-gray-600"}`}>{pkg.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {pkg.features.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 ${pkg.isDark ? "text-brand-400" : "text-brand-700"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={pkg.isDark ? "text-gray-300" : "text-gray-700"}>{item}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="#contact"
                  className={`block w-full text-center px-6 py-3 font-bold rounded-lg transition-all ${pkg.buttonClass}`}
                >
                  {pkg.buttonText}
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center text-sm text-gray-600"
          >
            <p>* 정확한 비용은 현장 규모, 촬영 난이도, 후처리 작업량에 따라 달라질 수 있습니다.</p>
            <p className="mt-1">* 정밀 측량의 경우 현장 상담 후 맞춤 견적을 제공해드립니다.</p>
          </motion.div>
        </div>
      </section>

      {/* ========== COMPARISON OPTION 1: 수평 바 차트 스타일 ========== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">왜 드론 측량인가?</h2>
            <p className="text-gray-600">데이터로 증명하는 압도적 효율성</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              { metric: "비용 효율", traditional: 100, drone: 30, save: "70% 절감", icon: "💰", color: "bg-emerald-600" },
              { metric: "작업 시간", traditional: 100, drone: 30, save: "70% 단축", icon: "⏱️", color: "bg-blue-600" },
              { metric: "필요 인력", traditional: 100, drone: 25, save: "75% 절감", icon: "👥", color: "bg-purple-600" },
              { metric: "정확도", traditional: 10, drone: 100, save: "10배 향상", icon: "🎯", color: "bg-orange-600", reverse: true }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900">{item.metric}</h3>
                  </div>
                  <div className="px-4 py-2 bg-brand-700 text-white rounded-lg font-bold text-sm">
                    {item.save}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Traditional Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">기존 측량</span>
                      <span className="text-sm font-bold text-gray-900">{item.traditional}%</span>
                    </div>
                    <div className="h-10 bg-gray-200 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.traditional}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.15 + 0.3 }}
                        className="h-full bg-gray-400 flex items-center px-4"
                      >
                        <span className="text-white font-bold text-sm">기존</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Drone Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">드론 측량</span>
                      <span className="text-sm font-bold text-brand-700">{item.drone}%</span>
                    </div>
                    <div className="h-10 bg-gray-200 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.drone}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.15 + 0.5 }}
                        className={`h-full ${item.color} flex items-center px-4`}
                      >
                        <span className="text-white font-bold text-sm">드론</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMPARISON OPTION 2: 아이콘 + 체크리스트 ========== */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">왜 드론 측량인가?</h2>
            <p className="text-white/80">기존 방식과 비교불가한 혁신</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Traditional */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10"
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">📏</div>
                  <h3 className="text-2xl font-bold mb-2">기존 측량</h3>
                  <p className="text-white/60 text-sm">전통적인 방식</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "높은 비용", icon: "❌" },
                    { label: "긴 작업 시간 (10일)", icon: "❌" },
                    { label: "많은 인력 (8명)", icon: "❌" },
                    { label: "낮은 정확도 (±10cm)", icon: "❌" },
                    { label: "위험한 작업 환경", icon: "❌" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/70">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right: Drone */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-brand-700 rounded-xl p-8 shadow-2xl"
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🚁</div>
                  <h3 className="text-2xl font-bold mb-2">드론 측량</h3>
                  <p className="text-brand-200 text-sm">혁신적인 솔루션</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "70% 비용 절감", value: "50~70%" },
                    { label: "빠른 작업 (3일)", value: "70% 단축" },
                    { label: "최소 인력 (2명)", value: "75% 절감" },
                    { label: "높은 정확도 (±1cm)", value: "10배" },
                    { label: "안전한 원격 작업", value: "100%" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">✅</span>
                        <span className="font-semibold">{item.label}</span>
                      </div>
                      <span className="text-brand-200 font-bold text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COMPARISON OPTION 3: 타임라인 전/후 비교 ========== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">왜 드론 측량인가?</h2>
            <p className="text-gray-600">작업 흐름으로 보는 효율성 차이</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Before: Traditional */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                    BEFORE
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">기존 측량</h3>
                    <p className="text-sm text-gray-600">전통적인 작업 방식</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { day: "1-2일", task: "현장 답사 및 측량 계획", team: "8명" },
                    { day: "3-5일", task: "지상 측량 작업", team: "8명" },
                    { day: "6-8일", task: "데이터 수집 및 정리", team: "4명" },
                    { day: "9-10일", task: "도면 작성", team: "2명" }
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-lg p-4 border-l-4 border-gray-400"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900">{step.day}</span>
                        <span className="text-sm text-gray-600">👥 {step.team}</span>
                      </div>
                      <p className="text-gray-700">{step.task}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-200 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">총 10일</div>
                  <div className="text-sm text-gray-600 mt-1">평균 소요 기간</div>
                </div>
              </div>

              {/* After: Drone */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold">
                    AFTER
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-700">드론 측량</h3>
                    <p className="text-sm text-gray-600">혁신적인 작업 방식</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { day: "1일", task: "현장 답사 및 비행 계획", team: "2명" },
                    { day: "2일", task: "드론 자동 비행 촬영", team: "2명" },
                    { day: "3일", task: "AI 데이터 처리 및 도면", team: "1명" }
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      className="bg-white rounded-lg p-4 border-l-4 border-brand-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-brand-700">{step.day}</span>
                        <span className="text-sm text-gray-600">👥 {step.team}</span>
                      </div>
                      <p className="text-gray-700">{step.task}</p>
                    </motion.div>
                  ))}
                  <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                    <span className="text-sm">작업 완료 ✓</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-brand-700 text-white rounded-lg text-center">
                  <div className="text-2xl font-bold">총 3일</div>
                  <div className="text-sm text-brand-200 mt-1">70% 시간 단축</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COMPARISON OPTION 4: 그리드 비포/애프터 카드 ========== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">왜 드론 측량인가?</h2>
            <p className="text-gray-600">측정 가능한 성과 차이</p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "비용",
                before: "100만원",
                after: "30만원",
                save: "70만원 절감",
                icon: "💰",
                percent: "70%"
              },
              {
                title: "시간",
                before: "10일",
                after: "3일",
                save: "7일 단축",
                icon: "⏱️",
                percent: "70%"
              },
              {
                title: "인력",
                before: "8명",
                after: "2명",
                save: "6명 절감",
                icon: "👥",
                percent: "75%"
              },
              {
                title: "정확도",
                before: "±10cm",
                after: "±1cm",
                save: "10배 향상",
                icon: "🎯",
                percent: "1000%"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
              >
                {/* Icon Header */}
                <div className="bg-gradient-to-r from-brand-600 to-brand-800 p-4 text-center">
                  <div className="text-5xl mb-2">{item.icon}</div>
                  <h3 className="text-white font-bold">{item.title}</h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">BEFORE</span>
                      <span className="text-lg font-bold text-gray-900">{item.before}</span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded" />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-brand-700 font-bold">AFTER</span>
                      <span className="text-lg font-bold text-brand-700">{item.after}</span>
                    </div>
                    <div className="h-1 bg-brand-700 rounded" />
                  </div>

                  <div className="text-center pt-4 border-t border-gray-100">
                    <div className="text-emerald-600 font-bold text-sm">↓ {item.save}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMPARISON OPTION 5: 인포그래픽 스타일 (대형 통계) ========== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">왜 드론 측량인가?</h2>
            <p className="text-gray-600">숫자가 말해주는 명확한 이유</p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Main Stats */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { number: "70", unit: "%", label: "비용 & 시간 절감", desc: "평균 절감율" },
                { number: "75", unit: "%", label: "인력 절감", desc: "8명 → 2명" },
                { number: "10", unit: "배", label: "정확도 향상", desc: "±10cm → ±1cm" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, type: "spring" }}
                  className="bg-white rounded-2xl p-8 shadow-xl text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                    className="text-8xl font-black text-brand-700 mb-2"
                  >
                    {stat.number}
                    <span className="text-5xl">{stat.unit}</span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{stat.label}</h3>
                  <p className="text-gray-600">{stat.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center p-6 bg-gray-100 rounded-xl">
                  <div className="text-6xl mb-4">📏</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">기존 측량</h3>
                  <div className="space-y-2 text-left max-w-xs mx-auto">
                    <div className="flex justify-between">
                      <span className="text-gray-600">비용</span>
                      <span className="font-bold">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">시간</span>
                      <span className="font-bold">10일</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">인력</span>
                      <span className="font-bold">8명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">정확도</span>
                      <span className="font-bold">±10cm</span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-brand-700 to-brand-900 text-white rounded-xl">
                  <div className="text-6xl mb-4">🚁</div>
                  <h3 className="text-2xl font-bold mb-4">드론 측량</h3>
                  <div className="space-y-2 text-left max-w-xs mx-auto">
                    <div className="flex justify-between">
                      <span className="text-brand-200">비용</span>
                      <span className="font-bold text-brand-400">30% ↓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-200">시간</span>
                      <span className="font-bold text-brand-400">3일 ↓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-200">인력</span>
                      <span className="font-bold text-brand-400">2명 ↓</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-200">정확도</span>
                      <span className="font-bold text-brand-400">±1cm ↑</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== OPTION 1: 산업별 적용 분야 (아이콘 그리드) ========== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">다양한 산업 분야 적용</h2>
            <p className="text-gray-600">건설부터 농업까지, 전문 드론 솔루션</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {[
              { icon: "🏗️", label: "건설 현장", description: "토공량/진도관리" },
              { icon: "🏢", label: "부동산", description: "항공 촬영" },
              { icon: "🌾", label: "농업", description: "작황 분석" },
              { icon: "⚡", label: "에너지", description: "태양광 점검" },
              { icon: "🌉", label: "시설물", description: "안전 점검" },
              { icon: "🏞️", label: "환경", description: "생태 조사" }
            ].map((industry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-brand-700 hover:shadow-lg transition-all text-center cursor-pointer group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{industry.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{industry.label}</h3>
                <p className="text-xs text-gray-600">{industry.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-700 text-white font-bold rounded-lg hover:bg-brand-800 transition-all"
            >
              <span>분야별 맞춤 상담</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ========== OPTION 2: 프로젝트 실적 통계 (숫자 카운터) ========== */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-brand-700 to-brand-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">검증된 전문성</h2>
            <p className="text-white/80">숫자로 증명하는 드론 서비스 경험</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                number: "500",
                suffix: "+",
                label: "완료 프로젝트",
                description: "누적 촬영/측량",
                icon: "📊"
              },
              {
                number: "150",
                suffix: "+",
                label: "기업 고객",
                description: "건설사/지자체",
                icon: "🏢"
              },
              {
                number: "20",
                suffix: "년",
                label: "건설 경력",
                description: "현장 전문성",
                icon: "⭐"
              },
              {
                number: "99",
                suffix: "%",
                label: "고객 만족도",
                description: "재의뢰율",
                icon: "💯"
              }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  className="text-5xl md:text-6xl font-bold mb-2"
                >
                  {stat.number}
                  <span className="text-brand-400">{stat.suffix}</span>
                </motion.div>
                <h3 className="text-lg font-bold mb-1">{stat.label}</h3>
                <p className="text-sm text-white/70">{stat.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <p className="text-white/90">
                <span className="font-bold text-brand-400">DJI Enterprise 공인 파트너</span> ·
                <span className="font-bold text-brand-400"> 국토교통부 인증 조종자</span> ·
                <span className="font-bold text-brand-400"> 측량 전문 소프트웨어 활용</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== OPTION 3: 고객 후기 (카드 리뷰) ========== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">고객 후기</h2>
            <p className="text-gray-600">현장에서 검증된 전문 서비스</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                company: "현대건설 인천지사",
                name: "이 OO 차장",
                rating: 5,
                comment: "토공량 산출이 정확하고 빠릅니다. 기존 방식 대비 시간과 비용이 크게 절감되어 매우 만족합니다. 정기적으로 이용하고 있습니다.",
                project: "아파트 건설 현장 측량",
                badge: "건설사"
              },
              {
                company: "서울시 도시재생과",
                name: "김 OO 팀장",
                rating: 5,
                comment: "복잡한 지형도 정확하게 측량해주셔서 업무에 큰 도움이 되었습니다. 데이터 품질과 납품 속도 모두 우수했습니다.",
                project: "도시재생 지역 측량",
                badge: "공공기관"
              },
              {
                company: "중앙부동산개발",
                name: "박 OO 대표",
                rating: 5,
                comment: "부동산 홍보 영상이 기대 이상이었습니다. 촬영부터 편집까지 전문적이고 퀄리티가 뛰어나 매물 홍보에 큰 효과를 보았습니다.",
                project: "상업용 부동산 촬영",
                badge: "부동산"
              }
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-4 leading-relaxed">"{review.comment}"</p>

                {/* Project */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">프로젝트:</span> {review.project}
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.company}</p>
                  </div>
                  <div className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold">
                    {review.badge}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <p className="text-sm text-gray-600">
              * 고객 정보 보호를 위해 일부 내용은 비공개 처리되었습니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Section - 측량 진행 프로세스 */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">측량 진행 프로세스</h2>
            <p className="text-gray-600">체계적인 5단계 워크플로우</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "현장 상담 및 견적",
                  description: "프로젝트 규모, 측량 목적, 요구사항을 파악하고 최적의 솔루션과 견적을 제안합니다.",
                  duration: "1~2일",
                  details: ["현장 답사", "측량 범위 확정", "견적서 발송", "계약 체결"]
                },
                {
                  step: "02",
                  title: "비행 계획 수립",
                  description: "측량 지역의 비행 계획을 수립하고 필요한 승인 절차를 진행합니다.",
                  duration: "1일",
                  details: ["비행 경로 설계", "고도 및 속도 설정", "비행 승인 신청", "안전 계획 수립"]
                },
                {
                  step: "03",
                  title: "드론 촬영 및 데이터 수집",
                  description: "RTK 드론을 활용하여 현장 촬영을 진행하고 정밀 측량 데이터를 수집합니다.",
                  duration: "1~3일",
                  details: ["장비 점검 및 캘리브레이션", "자동 비행 촬영", "RTK 보정 데이터 수집", "현장 데이터 검증"]
                },
                {
                  step: "04",
                  title: "데이터 처리 및 분석",
                  description: "수집된 데이터를 전문 소프트웨어로 처리하여 정사영상, 3D 모델, 측량 도면을 생성합니다.",
                  duration: "3~5일",
                  details: ["이미지 정합 및 보정", "3D Point Cloud 생성", "DSM/DTM 제작", "토공량 계산"]
                },
                {
                  step: "05",
                  title: "최종 결과물 납품",
                  description: "요청하신 형식의 측량 데이터와 분석 리포트를 납품하고 활용 방법을 안내합니다.",
                  duration: "1일",
                  details: ["데이터 검수", "다양한 포맷 제공", "활용 가이드", "A/S 지원"]
                }
              ].map((process, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className="flex gap-6">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-lg">
                        {process.step}
                      </div>
                      {idx < 4 && (
                        <div className="w-0.5 h-full bg-brand-200 mx-auto mt-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold">{process.title}</h3>
                          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                            {process.duration}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4">{process.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {process.details.map((detail, i) => (
                            <span key={i} className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total Duration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 text-center bg-gradient-to-r from-brand-700 to-brand-900 text-white rounded-lg p-6"
            >
              <div className="text-sm mb-2">평균 소요 기간</div>
              <div className="text-3xl font-bold">7~12일</div>
              <div className="text-sm text-brand-200 mt-2">프로젝트 규모에 따라 조정 가능</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">자주 묻는 질문</h2>
            <p className="text-gray-600">드론 측량에 대해 궁금하신 점을 확인하세요</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: "드론 측량 비용은 얼마나 하나요?",
                answer: "프로젝트 규모와 요구사항에 따라 다릅니다. 단순 촬영은 50만원부터 시작하며, 정밀 RTK 측량은 현장 면적, 정밀도 요구사항, 후처리 작업량에 따라 견적이 산정됩니다. 무료 현장 상담을 통해 정확한 견적을 받아보실 수 있습니다."
              },
              {
                question: "측량 데이터는 언제 받을 수 있나요?",
                answer: "촬영 후 평균 3~5일 내에 정사영상, 3D 모델, DSM/DTM 등의 데이터를 제공해드립니다. 단순 촬영의 경우 당일 또는 익일 원본 데이터를 전달하며, 긴급한 경우 별도 협의 가능합니다."
              },
              {
                question: "악천후에도 측량이 가능한가요?",
                answer: "드론 비행은 기상 조건에 영향을 받습니다. 강풍(초속 10m 이상), 강우, 강설 시에는 안전을 위해 촬영을 연기합니다. 날씨 변화에 따라 촬영 일정을 유연하게 조정하며, 기상 상황은 사전에 공유해드립니다."
              },
              {
                question: "RTK와 일반 드론 측량의 차이는 무엇인가요?",
                answer: "RTK(Real-Time Kinematic) 기술은 위성 신호 보정을 통해 cm급(±1~2.5cm) 정밀도를 제공합니다. 일반 드론은 ±50cm 오차 범위를 가지는 반면, RTK 드론은 별도 지상기준점(GCP) 설치 없이도 높은 정확도를 보장하여 작업 시간과 비용을 크게 절감합니다."
              },
              {
                question: "측량 결과물은 어떤 형식으로 제공되나요?",
                answer: "정사영상(GeoTIFF, JPG), 3D Point Cloud(LAS, LAZ), DSM/DTM(GeoTIFF, DXF), CAD 도면(DWG, DXF) 등 다양한 형식으로 제공 가능합니다. 고객의 활용 목적에 맞는 최적의 포맷을 제안해드립니다."
              },
              {
                question: "드론 촬영 허가는 어떻게 받나요?",
                answer: "비행 승인이 필요한 지역(관제권, 비행금지구역 등)의 경우 저희가 국토교통부 및 관련 기관에 비행 승인을 대행해드립니다. 일반적으로 승인에는 3~7일 정도 소요되므로 사전 일정 조율이 필요합니다."
              },
              {
                question: "전국 어디든 출장이 가능한가요?",
                answer: "네, 전국 어디든 출장 가능합니다. 경기도 안산에 본사가 있으며, 프로젝트 규모와 거리에 따라 출장비가 별도로 산정될 수 있습니다. 10km 이내는 기본 출장비에 포함됩니다."
              }
            ].map((faq, idx) => (
              <motion.details
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-bold text-gray-900 pr-4">{faq.question}</h3>
                  <svg
                    className="w-5 h-5 text-brand-700 flex-shrink-0 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.details>
            ))}
          </div>

        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-brand-700 to-brand-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              드론 촬영/측량이 필요하신가요?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              홍보 영상부터 정밀 측량까지, 프로젝트에 최적화된 솔루션을 제공합니다
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="px-8 py-4 bg-white text-brand-700 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                무료 견적 문의
              </a>
              <a
                href="tel:010-0000-0000"
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
