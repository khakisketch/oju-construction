export interface NewsItem {
  id: string;
  category: "announcement" | "news" | "award";
  title: string;
  summary: string;
  content: string;
  isNew: boolean;
  createdAt: any;
}

// 안내성 기본 항목만 표시하며, 실제 Firestore 소식이 있으면 해당 데이터가 우선합니다.
export const newsFallbackItems: NewsItem[] = [
  {
    id: "fallback-inquiry-guide",
    category: "announcement",
    title: "공사 상담 문의 안내",
    summary: "공사 상담은 전화 또는 홈페이지의 문의하기를 이용해 주세요.",
    content:
      "공사 문의는 전화 상담 또는 홈페이지 문의하기에서 접수할 수 있습니다. 홈페이지에서는 문의 종류와 공사 분야를 선택하고, 필요한 경우 현장 유형과 문의 내용을 함께 남겨 주세요.",
    createdAt: new Date("2026-10-16T09:00:00+09:00"),
    isNew: true,
  },
  {
    id: "fallback-holiday-guide",
    category: "announcement",
    title: "2026년 성탄절 상담 안내",
    summary: "12월 25일(금)은 공휴일입니다. 문의는 홈페이지 양식으로 남겨 주세요.",
    content:
      "2026년 12월 25일(금)은 공휴일입니다. 공휴일에는 상담 확인이 늦어질 수 있으니 홈페이지 문의 양식을 이용해 주세요.",
    createdAt: new Date("2026-10-02T09:00:00+09:00"),
    isNew: false,
  },
  {
    id: "fallback-trade-guide",
    category: "announcement",
    title: "문의 분야 선택 안내",
    summary: "문의 목적과 공사 분야를 선택해 주세요. 잘 모르는 경우 기타·미정을 선택할 수 있습니다.",
    content:
      "문의 작성 시 문의 목적과 공사 분야를 선택해 주세요. 공사 분야가 정해지지 않았다면 기타·미정을 선택하고 내용을 남겨 주셔도 됩니다.",
    createdAt: new Date("2026-09-26T09:00:00+09:00"),
    isNew: false,
  },
  {
    id: "fallback-site-guide",
    category: "announcement",
    title: "현장 정보 작성 안내",
    summary: "현장 유형은 선택 항목이며, 추가 설명은 문의 내용에 적어 주세요.",
    content:
      "현장 유형은 선택 항목입니다. 상담에 필요한 추가 정보가 있다면 문의 내용 입력란에 함께 적어 주세요.",
    createdAt: new Date("2026-09-18T09:00:00+09:00"),
    isNew: false,
  },
];
