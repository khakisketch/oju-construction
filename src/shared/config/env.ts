export const env = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  },
  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || "오주건설(주)",
    nameShort: "오주건설(주)",
    nameEn: "Oju Construction",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ojuec.co.kr",
  },
  company: {
    name: "오주건설(주)",
    nameKo: "오주건설(주)",
    nameEn: "OJUCONSTRUCTION",
    fullName: "오주건설 주식회사",
    foundedYear: 2004,
    ceo: "이자영",
    phone: "043-265-6010",
    email: "thdgjs6560@hanmail.net",
    address: "충청북도 청주시 상당구 용암북로160번길 20, 2층 201호",
    description: "오주건설(주)은 건설 분야의 전문성과 기술력을 바탕으로 고객 여러분께 최고의 서비스를 제공합니다. 2004년 설립 이후 다양한 분야에서 신뢰와 기술로 성장해 왔습니다.",
    businessNumber: "217-81-16716",
  },
} as const;
