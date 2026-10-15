"use client";

import AboutSection from "@/features/home/about/AboutSection";
import CEOMessage from "@/features/home/about/CEOMessage";
import TimelineSection from "@/features/home/timeline/TimelineSection";

export default function AboutPage() {
  return (
    <div className="pt-20">
      <AboutSection />
      <CEOMessage />
      <TimelineSection />
    </div>
  );
}
