// 현장 문제 → 실제 시공사례 연결 계약.
// URL 검사만으로 실제 촬영 여부를 증명할 수 없으므로, 문제→실제 사례 연결은
// 반드시 업체 검토를 거쳐 지정합니다. 코드는 알려진 예시·스톡 경로와
// 누락 필드만 걸러내고, 실제 업체 사진·내용·결과와 매핑 ID가 들어오기
// 전까지 portfolioId는 null이며, 이 경우 홈에는 시안용 참고 영상과
// 시공실적 허브 연결만 노출됩니다.

export type FieldProblemId = "paving" | "drainage";

export interface FieldProblem {
  id: FieldProblemId;
  question: string;
  scopeLabel: string;
  /** 분야 선택 칩에 쓰는 짧은 표기. 접근성 이름은 scopeLabel을 쓴다. */
  shortLabel: string;
  scopeDescription: string;
  consultLabel: string;
  /** 실제 portfolio 문서를 확인한 뒤 여기에 문서 ID를 연결합니다. 별도 관리자 매핑 UI는 없습니다. */
  portfolioId: string | null;
}

export const FIELD_PROBLEMS: FieldProblem[] = [
  {
    id: "paving",
    question: "주차장·진입로가 갈라지고 패였나요?",
    scopeLabel: "주차장·진입로 포장",
    shortLabel: "포장",
    scopeDescription: "파손 구간 보수와 포장 정비 범위를 살펴봅니다.",
    consultLabel: "포장 공사 상담하기",
    portfolioId: null,
  },
  {
    id: "drainage",
    question: "부지나 배수시설 정비가 필요하신가요?",
    scopeLabel: "토목·배수 정비",
    shortLabel: "토목·배수",
    scopeDescription: "부지 조성과 배수로·집수정 정비 범위를 살펴봅니다.",
    consultLabel: "토목·배수 정비 상담하기",
    portfolioId: null,
  },
];

/** 홈에 대표로 보여주는 1개 현장 문제. 탭 선택기 없이 고정 노출합니다. */
export const FEATURED_FIELD_PROBLEM_ID: FieldProblemId = "paving";

export function getFieldProblem(id: FieldProblemId): FieldProblem {
  const problem = FIELD_PROBLEMS.find((entry) => entry.id === id);
  if (!problem) throw new Error(`Unknown field problem: ${id}`);
  return problem;
}

/** portfolioData의 SAMPLE_PORTFOLIO_ID와 동일하게 유지합니다. */
export const SAMPLE_PORTFOLIO_ID = "sample-parking";

/** 실제 시공 증빙으로 쓸 수 없는 예시·스톡 이미지 경로 조각. */
/* "/images/portfolio/project"는 스톡 복사본 project1..4(.jpg/.webp)를 가리킵니다. */
const BLOCKED_IMAGE_FRAGMENTS = [
  "sample-parking",
  "/images/portfolio/project",
  "/images/methods/",
  "/images/construction/",
  "media/field-work",
  "unsplash.com",
];

export interface CaseSourceFields {
  id?: unknown;
  title?: unknown;
  trade?: unknown;
  scope?: unknown;
  scale?: unknown;
  description?: unknown;
  images?: unknown;
  image?: unknown;
  imageBefore?: unknown;
  imageAfter?: unknown;
  /** 발주처 유형 (예: 아파트 관리단, 공공기관) */
  clientType?: unknown;
  /** 확인된 결과 (실제로 확인된 내용만) */
  result?: unknown;
  /** 미정의/true = 공개. false는 홈 대표 사례 연결에서 제외. */
  published?: unknown;
}

export interface LinkedCaseRecord {
  id: string;
  title: string;
  image: string;
  excerpt: string;
  clientType?: string;
  result?: string;
}

export type CaseResolution = Record<string, LinkedCaseRecord | null>;

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isBlockedCaseImage(src: string): boolean {
  const normalized = src.trim().toLowerCase();
  if (!normalized) return true;
  return BLOCKED_IMAGE_FRAGMENTS.some((fragment) =>
    normalized.includes(fragment),
  );
}

/** 실제 기록의 대표 썸네일. 예시·스톡 경로는 제외되며 없으면 null. */
export function getCaseImage(source: CaseSourceFields): string | null {
  const rawImages = Array.isArray(source.images)
    ? source.images.filter(
        (entry): entry is string => typeof entry === "string",
      )
    : [];
  const candidates = [
    asText(source.imageAfter),
    ...rawImages.map((entry) => entry.trim()),
    asText(source.image),
    asText(source.imageBefore),
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (!isBlockedCaseImage(candidate)) return candidate;
  }
  return null;
}

export function getCaseExcerpt(
  source: CaseSourceFields,
  maxLength = 120,
): string {
  const raw =
    asText(source.scope) || asText(source.scale) || asText(source.description);
  if (!raw) return "";
  const singleLine = raw.replace(/\s+/g, " ");
  if (singleLine.length <= maxLength) return singleLine;
  return `${singleLine.slice(0, maxLength).trimEnd()}…`;
}

/**
 * Firestore 문서를 홈 문제 연결용 실제 기록으로 변환합니다.
 * docId는 문서 ID 그대로 사용하고 data 내부 id는 무시합니다.
 * 제목·실사진·범위/설명 중 하나라도 실제 자료가 아니면 null(상담 대체).
 */
export function toLinkedCaseRecord(
  docId: string,
  data: CaseSourceFields | null | undefined,
): LinkedCaseRecord | null {
  if (!docId || docId === SAMPLE_PORTFOLIO_ID) return null;
  if (!data) return null;
  if (data.published === false) return null;
  if (asText(data.id) === SAMPLE_PORTFOLIO_ID) return null;
  const title = asText(data.title);
  if (!title) return null;
  const image = getCaseImage(data);
  if (!image) return null;
  const excerpt = getCaseExcerpt(data);
  if (!excerpt) return null;
  const clientType = asText(data.clientType);
  const result = asText(data.result);
  return {
    id: docId,
    title,
    image,
    excerpt,
    ...(clientType ? { clientType } : {}),
    ...(result ? { result } : {}),
  };
}

export function getCaseDetailHref(id: string): string {
  return `/portfolio/detail?id=${encodeURIComponent(id)}`;
}

export function hasCuratedCaseIds(
  problems: FieldProblem[] = FIELD_PROBLEMS,
): boolean {
  return problems.some((problem) => Boolean(problem.portfolioId));
}
