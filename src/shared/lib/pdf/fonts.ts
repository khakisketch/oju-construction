import { Font } from "@react-pdf/renderer";

// Noto Sans KR 폰트 등록
// 로컬 public/fonts 폴더에서 TTF 파일 로드
export const registerFonts = (): void => {
  Font.register({
    family: "NotoSansKR",
    fonts: [
      {
        src: "/fonts/NotoSansKR-Regular.ttf",
        fontWeight: 400,
      },
      {
        src: "/fonts/NotoSansKR-Bold.ttf",
        fontWeight: 700,
      },
    ],
  });
};

// 폰트 등록 실행
registerFonts();
