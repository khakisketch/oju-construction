import HeroSection from "@/features/home/hero/HeroSection";
import AboutSection from "@/features/home/about/AboutSection";
// import PortfolioSection from "@/features/home/portfolio/PortfolioSection"; // 비활성화
import ConstructionSection from "@/features/home/construction/ConstructionSection";
import ContactSection from "@/features/home/contact/ContactSection";
import CertificationsSection from "@/features/home/certifications/CertificationsSection";
import ProcessSection from "@/features/home/process/ProcessSection";
import TestimonialsSection from "@/features/home/testimonials/TestimonialsSection";
import NewsSection from "@/features/home/news/NewsSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <CertificationsSection />
      <ConstructionSection />
      {/* <PortfolioSection /> — 대표님 요청으로 비활성화. 관리자(/admin/portfolio)에서 데이터 관리 가능. 필요 시 주석 해제 */}
      <ProcessSection />
      <TestimonialsSection />
      <NewsSection />
      <ContactSection />
    </div>
  );
}
