"use client";

import { useState } from "react";
import styles from "./renewalB.module.css";

const items = [
  "비 온 뒤 주차장에 물이 24시간 이상 고인다.",
  "배수구 주변에 낙엽·토사가 자주 쌓인다.",
  "보도블럭이 꺼지거나 들떠 있다.",
  "지하주차장 천장에서 물이 새거나 얼룩이 있다.",
  "맨홀·입구·경계석 주변에 단차가 생긴다.",
  "여름철 배수구 주변에서 냄새·이끼·모기가 늘었다.",
];

/** 체크 항목 → 진단 폼 증상 옵션 매핑 */
const itemSymptoms = [
  "물 고임",
  "배수구 막힘·냄새",
  "보도블럭 꺼짐",
  "지하 누수",
  "포장 균열·침하",
  "배수구 막힘·냄새",
];

export const CHECKLIST_SYMPTOM_EVENT = "oju:checklist-symptom";

function majoritySymptom(checked: boolean[]): string | null {
  const votes = new Map<string, number>();
  checked.forEach((value, index) => {
    if (!value) return;
    const symptom = itemSymptoms[index];
    votes.set(symptom, (votes.get(symptom) ?? 0) + 1);
  });
  let best: string | null = null;
  let bestCount = 0;
  votes.forEach((voteCount, symptom) => {
    if (voteCount > bestCount) {
      best = symptom;
      bestCount = voteCount;
    }
  });
  return best;
}

export default function DiagnosisChecklist() {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const count = checked.filter(Boolean).length;

  const result =
    count === 0
      ? "아직 눈에 띄는 증상이 없습니다. 그래도 우기 전 배수구 청소와 물 테스트를 권장합니다."
      : count <= 2
        ? "경미한 징후가 있습니다. 배수구 청소와 구배를 먼저 확인하세요."
        : "현장 진단이 필요한 상태입니다. 단면 조사와 배수 테스트를 권장합니다.";

  return (
    <div>
      <div className={styles.checklist}>
        {items.map((item, index) => (
          <label key={item} className={styles.checkItem}>
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={() => {
                const next = checked.map((value, itemIndex) =>
                  itemIndex === index ? !value : value,
                );
                setChecked(next);
                // 렌더 사이클 밖에서 전달해야 React 경고를 피할 수 있다.
                const voted = majoritySymptom(next);
                if (voted) {
                  queueMicrotask(() => {
                    window.dispatchEvent(
                      new CustomEvent(CHECKLIST_SYMPTOM_EVENT, { detail: voted }),
                    );
                  });
                }
              }}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
      <div className={styles.checkResult} aria-live="polite">
        <span className={styles.checkResultStrong}>{count}개</span> 체크됨. {result}
      </div>
    </div>
  );
}
