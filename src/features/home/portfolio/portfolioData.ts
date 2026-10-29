export interface PortfolioItem {
  id: string;
  title: string;
  trade?: string;
  location?: string;
  scope?: string;
  clientType?: string;
  client?: string;
  result?: string;
  images?: string[];
  imageBefore?: string;
  imageAfter?: string;
  year?: string;
  duration?: string;
  description?: string;
  /** 미정의/true = 공개. 관리자에서만 설정되고 공개 페이지에서 읽힘. */
  published?: boolean;
  /** 실제 현장 작업 영상 URL (관리자 업로드). 없으면 영상 블록 미렌더. */
  videoUrl?: string;
  /** 영상 포스터 (data URL 또는 업로드 URL). 캡처 실패 시 빈 문자열. */
  videoPoster?: string;
  // Legacy Firestore fields retained for existing records.
  category?: string;
  scale?: string;
  image?: string;
}

export const SAMPLE_PORTFOLIO_ID = "sample-parking";

export const portfolioExample: PortfolioItem = {
  id: SAMPLE_PORTFOLIO_ID,
  title: "아파트 주차장 포장 보수",
  imageBefore: "/images/portfolio/sample-parking-before.webp",
  imageAfter: "/images/portfolio/sample-parking-after.webp",
  description: "디자인 시안용 AI 목업 이미지입니다. 오주건설의 실제 시공 사진이나 실적이 아닙니다.",
};

export const portfolioExampleHeroImage = "/images/portfolio/sample-parking-hero.webp";
