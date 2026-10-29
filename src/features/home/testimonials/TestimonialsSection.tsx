import Image from "next/image";
import homeStyles from "../HomeSections.module.css";

// 예시 이미지: 실제 오주건설 시공 사진 수령 후 이 배열의 src·alt·설명을 교체합니다.
// 특정 현장, 제조사, 성능 수치나 인증을 의미하지 않습니다.
const constructionMethods = [
  {
    name: "포장 · 균열 보수",
    description: "아스콘 덧씌우기 · 부분 보수",
    imageSrc: "/images/renewal/symptom-crack.webp",
    imageAlt: "포장 표면의 균열을 표현한 AI 예시 이미지",
    imageBadge: "AI 예시",
  },
  {
    name: "방수 · 도장",
    description: "바탕 상태에 맞춘 방수·도장",
    imageSrc: "/images/construction/waterproofing.webp",
    imageAlt: "롤러로 방수재를 도포하는 작업 예시",
    imageBadge: "예시",
  },
  {
    name: "배수 · 보행로 정비",
    description: "배수시설 · 경계석·보도블록 정비",
    imageSrc: "/images/renewal/symptom-pavers.webp",
    imageAlt: "보도블럭의 들뜸을 표현한 AI 예시 이미지",
    imageBadge: "AI 예시",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="construction-methods"
      aria-labelledby="construction-methods-heading"
      className="bg-white py-8 md:py-12"
    >
      <div className="container mx-auto px-4 md:px-6">
        <header data-home-section-heading className={homeStyles.header}>
          <h2
            id="construction-methods-heading"
            className={homeStyles.title}
          >
            시공 공법 · 자재
          </h2>
          <p className={homeStyles.description}>
            현장 상태에 맞춰 공법과 자재를 제안합니다.
          </p>
        </header>

        <ul className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {constructionMethods.map((method) => (
            <li key={method.name} className="min-w-0">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-200">
                <Image
                  src={method.imageSrc}
                  alt={method.imageAlt}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="border-b border-gray-200 pb-5 pt-4">
                <h3 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xl font-semibold leading-7 text-brand-800">
                  {method.name}
                  <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold leading-5 text-gray-700">
                    {method.imageBadge}
                  </span>
                </h3>
                <p className="mt-1 text-base leading-7 text-gray-600">
                  {method.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
