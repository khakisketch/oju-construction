import Link from "next/link";
import { ArrowRight, FolderKanban, ClipboardCheck, MessagesSquare } from "lucide-react";
import { BUSINESS_AREA_SUMMARY } from "@/shared/config/businessAreas";

const materials = [
  {
    title: "면허·등록 자료",
    description: `면허 6종(${BUSINESS_AREA_SUMMARY}) 자료를 안내합니다.`,
    status: "준비 중",
    icon: ClipboardCheck,
  },
  {
    title: "공종별 시공실적",
    description: "등록된 현장별 공종과 범위를 확인합니다.",
    href: "/portfolio",
    action: "실적 살펴보기",
    icon: FolderKanban,
  },
  {
    title: "입찰·협력 문의",
    description: "현장 검토와 입찰 참여를 문의합니다.",
    href: "/#contact",
    action: "문의하기",
    icon: MessagesSquare,
  },
];

export default function ProcurementSection() {
  return (
    <section id="review" className="bg-white py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-brand-900 md:text-4xl">업체 검토자료</h2>
            <p className="mt-2.5 leading-6 text-gray-600">
              발주 검토에 필요한 회사 정보와 문의 경로를 한곳에서 확인하세요.
            </p>
          </div>

          <ul className="divide-y divide-gray-200 border-y border-gray-200">
            {materials.map((material) => {
              const Icon = material.icon;
              const content = (
                <>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-gray-900">{material.title}</span>
                    <span className="mt-0.5 block text-base leading-6 text-gray-600">{material.description}</span>
                  </span>
                  {material.href ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700">
                      {material.action}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full border border-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-600">
                      {material.status}
                    </span>
                  )}
                </>
              );

              return (
                <li key={material.title}>
                  {material.href ? (
                    <Link
                      href={material.href}
                      className="group flex min-h-16 items-center gap-3 py-2.5 outline-none transition-colors hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-700 sm:gap-4 sm:px-2"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex min-h-16 items-center gap-3 py-2.5 sm:gap-4 sm:px-2">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
