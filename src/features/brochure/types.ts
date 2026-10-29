export interface HistoryEvent {
  year: string;
  events: string[];
}

export interface CoreValue {
  title: string;
  description: string;
  icon?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  imageUrl?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  period: string;
  description: string;
  imageUrl?: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  position: string;
  department: string;
  level: number; // 1: CEO, 2: 임원, 3: 팀장, 4: 팀원
}

export interface BusinessArea {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export interface DesignBrochureFile {
  url: string;
  fileName: string;
  sizeBytes: number;
  version?: string;
  uploadedAt: string;
}

export type CoverStyle = "geometric" | "gradient" | "lines" | "photo";

export interface BrochureData {
  // 표지 설정
  coverStyle: CoverStyle;
  tagline: string;

  // 기본 정보
  history: HistoryEvent[];
  vision: string;
  mission: string;
  coreValues: CoreValue[];
  certifications: Certification[];

  // 추가 콘텐츠
  portfolios: PortfolioItem[];
  organization: OrganizationMember[];
  businessAreas: BusinessArea[];

  // QR코드 설정
  websiteUrl: string;

  // 선택 디자인 PDF (공개 가능)
  designPdf?: DesignBrochureFile | null;
  useDesignPdf?: boolean;

  // Canva 편집 URL은 company-documents-private/brochure에만 저장합니다.
  canvaEditUrl?: string;

  updatedAt?: Date;
}

export const defaultBrochureData: BrochureData = {
  coverStyle: "geometric",
  tagline: "기술의 정교함, 신뢰의 견고함",

  history: [
    { year: "2022", events: ["01월 오주건설(주) 토목공사업 등록"] },
    {
      year: "2020",
      events: [
        "12월 오주건설(주) 도장공사업 등록",
        "03월 오주건설(주) 건물위생관리업 등록",
      ],
    },
    { year: "2018", events: ["02월 오주건설(주) 시설물유지보수업 추가 설립"] },
    { year: "2004", events: ["04월 오주건설(주) 포장공사업 법인설립"] },
  ],
  vision: "최고의 기술력으로 고객의 가치를 높이는 기업",
  mission: "안전하고 신뢰할 수 있는 건설 서비스 제공",
  coreValues: [
    { title: "신뢰", description: "고객과의 약속을 지키는 기업", icon: "shield" },
    { title: "기술", description: "최신 기술로 품질을 높이는 기업", icon: "cog" },
    { title: "안전", description: "안전을 최우선으로 하는 기업", icon: "hard-hat" },
  ],
  certifications: [],

  portfolios: [],
  organization: [],
  businessAreas: [
    { id: "1", title: "토목공사", description: "도로, 교량, 터널 등 사회기반시설 건설", icon: "building-2" },
    { id: "2", title: "건축공사", description: "주거, 상업, 산업시설 건축", icon: "home" },
    { id: "3", title: "조경공사", description: "공원, 녹지, 조경시설 조성", icon: "trees" },
    { id: "4", title: "방수공사", description: "건물 방수 및 누수 보수", icon: "droplets" },
  ],

  websiteUrl: "",
  designPdf: null,
  useDesignPdf: false,
  canvaEditUrl: "",
};
