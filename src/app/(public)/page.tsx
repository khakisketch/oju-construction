import HeroSection from "@/features/home/hero/HeroSection";
import AboutSection from "@/features/home/about/AboutSection";
import CEOMessage from "@/features/home/about/CEOMessage";
import ServicesSection from "@/features/home/services/ServicesSection";
import TimelineSection from "@/features/home/timeline/TimelineSection";
import PortfolioSection from "@/features/home/portfolio/PortfolioSection";
import ConstructionSection from "@/features/home/construction/ConstructionSection";
import SoftwareSection from "@/features/home/software/SoftwareSection";
import DroneSection from "@/features/home/drone/DroneSection";
import ContactSection from "@/features/home/contact/ContactSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <ConstructionSection />
      <SoftwareSection />
      <DroneSection />
      <CEOMessage />
      <TimelineSection />
      <ContactSection />
    </div>
  );
}
