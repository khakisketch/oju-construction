export type SymptomId = "water" | "pavers" | "drain" | "leak";

export interface SymptomCase {
  id: SymptomId;
  cardTitle: string;
  label: string;
  formValue: string;
  image: string;
  imageAlt: string;
  description: string;
  checks: [string, string];
}

/** Illustrative situations, not an assessment of any specific site. */
export const SYMPTOM_CASES: SymptomCase[] = [
  {
    id: "water",
    cardTitle: "비 온 뒤 물이 고인다",
    label: "물 고임",
    formValue: "물 고임",
    image: "/images/renewal/symptom-water.webp",
    imageAlt: "물이 고인 주차장 AI 예시 이미지",
    description: "물이 머무는 위치와 배수되는 방향부터 확인합니다.",
    checks: ["포장 표면의 기울기와 낮은 지점", "배수구와 관로의 상태"],
  },
  {
    id: "pavers",
    cardTitle: "보도블럭이 꺼지고 들뜬다",
    label: "보도블럭 꺼짐",
    formValue: "보도블럭 꺼짐",
    image: "/images/renewal/symptom-pavers.webp",
    imageAlt: "꺼지고 들뜬 보도블럭 AI 예시 이미지",
    description: "블록과 주변 지반의 높이 차이를 살펴봅니다.",
    checks: ["블록의 들뜸과 단차가 생긴 위치", "포장 하부와 주변 지반의 상태"],
  },
  {
    id: "drain",
    cardTitle: "배수구가 막히고 냄새가 난다",
    label: "배수구 막힘·냄새",
    formValue: "배수구 막힘·냄새",
    image: "/images/renewal/symptom-drain.webp",
    imageAlt: "낙엽이 쌓인 배수구 AI 예시 이미지",
    description: "배수구 주변과 물이 빠지는 상태를 함께 확인합니다.",
    checks: ["낙엽·토사 등 배수구 주변의 막힘", "집수 공간과 연결된 관로의 상태"],
  },
  {
    id: "leak",
    cardTitle: "지하주차장 천장에서 물이 샌다",
    label: "지하주차장 누수",
    formValue: "지하 누수",
    image: "/images/renewal/symptom-leak.webp",
    imageAlt: "지하주차장 천장의 누수 AI 예시 이미지",
    description: "물이 새는 위치와 주변의 흔적을 먼저 살펴봅니다.",
    checks: ["천장 얼룩과 누수 위치", "상부 공간과 방수·배수 상태"],
  },
];

export const SYMPTOM_SELECTION_EVENT = "oju:diagnosis-selection";

/** Keep the earlier candidate's symptom links usable after the redesign. */
const HASH_ALIASES: Record<string, SymptomId> = {
  water: "water", slope: "water",
  pavers: "pavers", compaction: "pavers", joint: "pavers",
  drain: "drain", clog: "drain", pipe: "drain",
  leak: "leak",
};

export function symptomFromHash(hash: string): SymptomId | null {
  const match = hash.match(/^#cross-section\/([a-z]+)$/);
  return match ? HASH_ALIASES[match[1]] ?? null : null;
}

export function getSymptom(id: SymptomId): SymptomCase {
  return SYMPTOM_CASES.find((item) => item.id === id) ?? SYMPTOM_CASES[0];
}
