import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import SkipToContent from "@/shared/components/accessibility/SkipToContent";
import MobileCTA from "@/shared/components/ui/MobileCTA";
import { OrganizationJsonLd, LocalBusinessJsonLd } from "@/shared/components/seo/JsonLd";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationJsonLd />
      <LocalBusinessJsonLd />
      <SkipToContent />
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
