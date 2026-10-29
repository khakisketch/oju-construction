"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import DiagnosisConcept from "./DiagnosisConcept";
import {
  getSymptom,
  symptomFromHash,
  SYMPTOM_CASES,
  SYMPTOM_SELECTION_EVENT,
  type SymptomId,
} from "./symptomCases";
import styles from "./RenewalBDesign.module.css";

function announceSelection(id: SymptomId) {
  window.dispatchEvent(new CustomEvent(SYMPTOM_SELECTION_EVENT, { detail: getSymptom(id).formValue }));
}

export default function DiagnosisExplorer() {
  const [activeId, setActiveId] = useState<SymptomId>("water");

  useEffect(() => {
    const applyHash = (focusHeading = false) => {
      const selected = symptomFromHash(window.location.hash);
      if (!selected) return;
      setActiveId(selected);
      announceSelection(selected);
      if (focusHeading) document.getElementById("diagnosis-heading")?.focus({ preventScroll: true });
    };
    applyHash();
    const onHashChange = () => applyHash(true);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const choose = (id: SymptomId) => {
    setActiveId(id);
    window.history.replaceState(window.history.state, "", `#cross-section/${id}`);
    announceSelection(id);
  };

  const active = getSymptom(activeId);

  return (
    <>
      <div className={styles.choices} role="group" aria-label="증상 선택">
        {SYMPTOM_CASES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.choice}
            aria-pressed={item.id === activeId}
            onClick={() => choose(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.diagnosisLayout}>
        <div className={styles.visualPanel}>
          <div className={styles.visualTop}>
            <strong>{active.label} · 확인 지점</strong>
            <span>설명용 개념도</span>
          </div>
          <DiagnosisConcept symptom={activeId} />
          <p className={styles.graphicNote}>
            번호는 확인 항목과 연결됩니다. 실제 설계도나 시공 기준이 아닙니다.
          </p>
        </div>
        <div className={styles.detailPanel} aria-live="polite">
          <h3 className={styles.detailTitle}>{active.label}</h3>
          <p className={styles.detailDescription}>{active.description}</p>
          <p className={styles.detailLabel}>현장에서 살펴볼 항목</p>
          <ol className={styles.checks}>
            {active.checks.map((item, index) => (
              <li key={item}>
                <span className={styles.checkNumber} aria-hidden="true">{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <a href="#diagnosis-request" className={styles.textLink} onClick={() => announceSelection(activeId)}>
            이 증상으로 문의하기 <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
      <p className={styles.diagnosisNote}>
        가능한 점검 항목의 예시입니다. 원인과 공법은 현장 조건 및 전문가 검토에 따라 결정됩니다.
      </p>
    </>
  );
}
