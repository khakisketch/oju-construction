"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Home,
  Target,
  Eye,
  Award,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building2,
  Shield,
  Star,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { BrochureData, defaultBrochureData } from "@/features/brochure/types";
import dynamic from "next/dynamic";

const BrochureDownloadButton = dynamic(
  () => import("@/features/brochure/components/BrochureDownloadButton"),
  { ssr: false }
);

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

// Hero Section with parallax effect
const HeroSection = ({ companyName }: { companyName: string }) => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Animated background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </div>

    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative z-10 text-center px-6 max-w-5xl mx-auto"
    >
      {/* Badge */}
      <motion.div variants={fadeInUp} className="mb-8">
        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20">
          <Sparkles className="w-4 h-4 text-orange-400" />
          신뢰와 기술의 건설 파트너
        </span>
      </motion.div>

      {/* Company Name */}
      <motion.h1
        variants={fadeInUp}
        className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight"
      >
        <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
          {companyName}
        </span>
      </motion.h1>

      {/* Decorative line */}
      <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-500" />
        <div className="w-3 h-3 bg-orange-500 rotate-45" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-500" />
      </motion.div>

      {/* Subtitle */}
      <motion.h2
        variants={fadeInUp}
        className="text-2xl md:text-4xl font-light text-white/90 mb-4"
      >
        회사소개서
      </motion.h2>

      {/* Tagline */}
      <motion.p
        variants={fadeInUp}
        className="text-lg md:text-xl text-blue-200/80 mb-12 max-w-2xl mx-auto leading-relaxed"
      >
        기술의 정교함으로 완성하고, 신뢰의 견고함으로 지켜갑니다
      </motion.p>

      {/* Stats */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto"
      >
        {[
          { value: "20+", label: "년 경력", icon: Calendar },
          { value: "200+", label: "프로젝트", icon: Building2 },
          { value: "100%", label: "고객 만족", icon: Star },
        ].map((stat, index) => (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <stat.icon className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-blue-200/70">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>

    {/* Scroll indicator */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <div className="flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs tracking-widest uppercase">스크롤</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </motion.div>
  </section>
);

// Vision & Mission Section
const VisionMissionSection = ({ data }: { data: BrochureData }) => (
  <section className="py-24 md:py-32 bg-white relative overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-50 to-transparent" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      {/* Section Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="text-center mb-16 md:mb-20"
      >
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-px bg-orange-500" />
          <span className="text-orange-600 font-semibold text-sm tracking-wider uppercase">
            Vision & Mission
          </span>
          <div className="w-8 h-px bg-orange-500" />
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
        >
          비전 & 미션
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
          우리가 나아가는 방향과 존재의 이유
        </motion.p>
      </motion.div>

      {/* Vision & Mission Cards */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="grid md:grid-cols-2 gap-8 mb-16"
      >
        {/* Vision Card */}
        <motion.div
          variants={fadeInUp}
          className="group relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 md:p-10 text-white overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">비전 (Vision)</h3>
            <p className="text-lg text-blue-100 leading-relaxed">
              {data.vision || "최고의 기술력으로 고객의 가치를 높이는 기업"}
            </p>
          </div>
        </motion.div>

        {/* Mission Card */}
        <motion.div
          variants={fadeInUp}
          className="group relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 md:p-10 text-white overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">미션 (Mission)</h3>
            <p className="text-lg text-orange-100 leading-relaxed">
              {data.mission || "안전하고 신뢰할 수 있는 건설 서비스 제공"}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Core Values */}
      {data.coreValues.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h3 variants={fadeInUp} className="text-2xl font-bold text-slate-900 text-center mb-10">
            핵심 가치
          </motion.h3>
          <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.coreValues.slice(0, 4).map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-slate-50 hover:bg-slate-100 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mb-4 text-white group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-slate-900 mb-2">{value.title}</h4>
                <p className="text-sm text-slate-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  </section>
);

// History Section
const HistorySection = ({ data }: { data: BrochureData }) => {
  const sortedHistory = [...data.history].sort(
    (a, b) => parseInt(b.year) - parseInt(a.year)
  );

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-orange-500" />
            <span className="text-orange-400 font-semibold text-sm tracking-wider uppercase">
              History
            </span>
            <div className="w-8 h-px bg-orange-500" />
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            회사 연혁
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
            성장과 발전의 발자취
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="relative max-w-4xl mx-auto"
        >
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-blue-500 to-orange-500" />

          {sortedHistory.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`relative flex items-start gap-8 mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Year bubble */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30 z-10">
                {item.year.slice(-2)}
              </div>

              {/* Content */}
              <div className={`flex-1 ml-28 md:ml-0 ${index % 2 === 0 ? "md:pr-24 md:text-right" : "md:pl-24"}`}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="text-2xl font-bold text-orange-400 mb-3">{item.year}</div>
                  <ul className="space-y-2">
                    {item.events.map((event, eventIndex) => (
                      <li key={eventIndex} className="text-slate-300 flex items-start gap-2">
                        <span className="text-orange-400 mt-1.5">•</span>
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Certifications Section
const CertificationsSection = ({ data }: { data: BrochureData }) => (
  <section className="py-24 md:py-32 bg-white relative overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-50 to-transparent" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      {/* Section Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="text-center mb-16 md:mb-20"
      >
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-px bg-orange-500" />
          <span className="text-orange-600 font-semibold text-sm tracking-wider uppercase">
            Certifications
          </span>
          <div className="w-8 h-px bg-orange-500" />
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
        >
          인증서 & 자격증
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
          신뢰를 증명하는 공인된 자격
        </motion.p>
      </motion.div>

      {/* Certifications Grid */}
      {data.certifications.length > 0 ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.certifications.map((cert, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mb-4 text-white group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <Award className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                {cert.name}
              </h3>
              <p className="text-slate-600 text-sm mb-3">{cert.issuer}</p>

              {/* Date badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {cert.date}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center py-16"
        >
          <Shield className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-400 text-lg">등록된 인증서가 없습니다</p>
        </motion.div>
      )}
    </div>
  </section>
);

// Contact Section
const ContactSection = ({
  companyName,
  companyInfo,
}: {
  companyName: string;
  companyInfo: { address: string; phone: string; email: string; fax: string };
}) => (
  <section className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
    {/* Background elements */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
    </div>

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="text-center"
      >
        {/* Company name */}
        <motion.h2
          variants={fadeInUp}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
        >
          {companyName}
        </motion.h2>

        {/* Decorative line */}
        <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-500" />
          <div className="w-3 h-3 bg-orange-500 rotate-45" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-500" />
        </motion.div>

        {/* Contact Info */}
        <motion.div
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16"
        >
          {[
            { icon: MapPin, label: "주소", value: companyInfo.address },
            { icon: Phone, label: "전화", value: companyInfo.phone },
            { icon: Mail, label: "이메일", value: companyInfo.email },
            { icon: Phone, label: "팩스", value: companyInfo.fax },
          ].filter(item => item.value).map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500/20 rounded-xl mb-4">
                <item.icon className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-sm text-blue-200/70 mb-1">{item.label}</div>
              <div className="text-white font-medium">{item.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeInUp}>
          <p className="text-2xl md:text-3xl text-blue-200/90 font-light mb-2">
            함께 성장하는 파트너가 되겠습니다
          </p>
          <p className="text-orange-400 font-semibold text-lg">
            기술의 정교함, 신뢰의 견고함
          </p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default function BrochurePage() {
  const [data, setData] = useState<BrochureData>(defaultBrochureData);
  const [companyInfo, setCompanyInfo] = useState({
    name: "오주건설(주)",
    address: "",
    phone: "",
    email: "",
    fax: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T | null> => {
        return Promise.race([
          promise,
          new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))
        ]);
      };

      try {
        const brochureDoc = await withTimeout(
          getDoc(doc(db, "company-documents", "brochure")),
          5000
        );
        if (brochureDoc?.exists()) {
          setData({ ...defaultBrochureData, ...brochureDoc.data() } as BrochureData);
        }

        const settingsDoc = await withTimeout(
          getDoc(doc(db, "settings", "general")),
          5000
        );
        if (settingsDoc?.exists()) {
          const settings = settingsDoc.data();
          if (settings.companyInfo) {
            setCompanyInfo({
              name: settings.companyInfo.name || "오주건설(주)",
              address: settings.companyInfo.address || "",
              phone: settings.companyInfo.phone || "",
              email: settings.companyInfo.email || "",
              fax: settings.companyInfo.fax || "",
            });
          }
        }
      } catch {
        // Use default data when Firebase is offline
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-slate-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 md:mx-6 mt-4 md:mt-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/5 border border-white/50">
            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                <Home className="w-5 h-5" />
                <span className="hidden md:inline">홈으로</span>
              </Link>

              <h1 className="text-lg font-bold text-slate-900">{companyInfo.name}</h1>

              <BrochureDownloadButton
                data={data}
                companyName={companyInfo.name}
                companyInfo={{
                  address: companyInfo.address,
                  phone: companyInfo.phone,
                  email: companyInfo.email,
                  fax: companyInfo.fax,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection companyName={companyInfo.name} />
        <VisionMissionSection data={data} />
        <HistorySection data={data} />
        <CertificationsSection data={data} />
        <ContactSection companyName={companyInfo.name} companyInfo={companyInfo} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
