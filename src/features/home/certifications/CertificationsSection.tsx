import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BUSINESS_AREA_SUMMARY } from "@/shared/config/businessAreas";

const reviewItems = [
  {
    title: "전문건설업 면허 6종",
    detail: `국토교통부 등록 · ${BUSINESS_AREA_SUMMARY}`,
  },
  {
    title: "안전관리 체계 · 품질관리 인증",
    detail: "산업안전보건 준수 · 현장 안전관리 계획 수립 및 이행 · 건설기술진흥법 기반 시공 품질 관리 및 하자 관리 체계 운영",
  },
  {
    title: "건설공제조합 가입",
    detail: "이행보증 및 하자보증 · 공사 이행 · 하자 · 선급금 보증 체계 구축",
  },
  {
    title: "전문 기술인력 보유 · 기업 신용평가",
    detail: "건설기술인 등록 · 토목기사 · 산업기사 등 자격 보유 인력 운영 · 경영 안정성 확보 · 건전한 재무구조 기반 신뢰성 있는 사업 수행",
  },
];

export default function CertificationsSection() {
  return (
    <section id="certifications" className="bg-gradient-to-b from-gray-50 to-white py-8 md:py-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6 text-center md:mb-7">
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-700">Certifications</span>
          <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-brand-900 md:text-3xl">인증 및 자격</h2>
          <div className="mx-auto mb-4 mt-3 h-[3px] w-12 bg-brand-700" aria-hidden="true" />
          <p className="mx-auto max-w-lg text-base leading-relaxed text-gray-600">
            면허 · 안전 · 품질 · 인력 등 다방면의 역량을 갖춘 종합건설 전문기업입니다.
          </p>
        </div>

        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-x-4 gap-y-3 border-y border-gray-200 sm:gap-x-8 md:gap-x-10 md:gap-y-4">
          {reviewItems.map((item) => (
            <li key={item.title} className="min-w-0 border-t border-gray-200 py-3">
              <h3 className="text-sm font-bold leading-5 text-brand-900">{item.title}</h3>
              <p className="mt-1 text-[15px] leading-6 text-gray-600">{item.detail}</p>
            </li>
          ))}
        </ul>

        <div className="mt-5 text-center">
          <Link
            href="/#review"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 transition-colors hover:text-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-4"
          >
            검토자료 안내 <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
