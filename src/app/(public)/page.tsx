import HeroSection from "@/features/home/hero/HeroSection";
import PortfolioSection from "@/features/home/portfolio/PortfolioSection";
import FieldProblemsSection from "@/features/home/problems/FieldProblemsSection";
import NewsSection from "@/features/home/news/NewsSection";
import ContactSection from "@/features/home/contact/ContactSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <PortfolioSection view="home" />
      <FieldProblemsSection />
      <ContactSection />
      <NewsSection />
    </div>
  );
}
