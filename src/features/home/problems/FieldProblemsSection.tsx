"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/shared/config/env";
import {
  FEATURED_FIELD_PROBLEM_ID,
  FIELD_PROBLEMS,
  toLinkedCaseRecord,
  type CaseResolution,
} from "./fieldProblems";
import { FieldWorkShowcase } from "./FieldWorkShowcase";

export default function FieldProblemsSection() {
  const [cases, setCases] = useState<CaseResolution>({});

  useEffect(() => {
    const featured = FIELD_PROBLEMS.find(
      (problem) => problem.id === FEATURED_FIELD_PROBLEM_ID,
    );
    if (!featured?.portfolioId || !isFirebaseConfigured) return;

    let isMounted = true;
    void (async () => {
      try {
        const snapshot = await getDoc(
          doc(db, "portfolio", featured.portfolioId as string),
        );
        if (!isMounted) return;
        setCases({
          [featured.id]: snapshot.exists()
            ? toLinkedCaseRecord(snapshot.id, snapshot.data())
            : null,
        });
      } catch {
        if (isMounted) setCases({ [featured.id]: null });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="construction"
      aria-labelledby="field-problems-heading"
      className="scroll-mt-24 bg-[#f9fafb] py-8 md:py-12"
    >
      <div className="container mx-auto px-4 md:px-6">
        <FieldWorkShowcase cases={cases} />
      </div>
    </section>
  );
}
