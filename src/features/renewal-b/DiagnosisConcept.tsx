import { useId } from "react";
import type { SymptomId } from "./symptomCases";
import styles from "./RenewalBDesign.module.css";

function CheckMarker({ x, y, number }: { x: number; y: number; number: 1 | 2 }) {
  return (
    <g aria-hidden="true">
      <circle cx={x} cy={y} r="26" fill="#fff" opacity=".8" />
      <circle cx={x} cy={y} r="21" fill="#174b80" stroke="#fff" strokeWidth="3" />
      <text x={x} y={y + 8} textAnchor="middle" fill="#fff" fontSize="23" fontWeight="700">{number}</text>
    </g>
  );
}

/** Illustrative check locations only, not a construction detail or standard. */
export default function DiagnosisConcept({ symptom }: { symptom: SymptomId }) {
  const id = useId().replace(/:/g, "");
  const descriptions: Record<SymptomId, string> = {
    water: "물이 고인 포장 표면과 배수구 주변을 확인하는 위치를 표시한 개념도입니다.",
    pavers: "들뜬 보도블럭과 포장 하부를 확인하는 위치를 표시한 개념도입니다.",
    drain: "이물질이 쌓인 배수구와 집수 공간을 확인하는 위치를 표시한 개념도입니다.",
    leak: "천장의 누수 흔적과 그 위쪽 공간을 확인하는 위치를 표시한 개념도입니다.",
  };

  return (
    <svg className={styles.sectionGraphic} viewBox="0 0 680 350" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>증상별 확인 위치 개념도</title>
      <desc id={`${id}-desc`}>{descriptions[symptom]} 번호는 확인 항목과 연결됩니다. 실제 설계도가 아닙니다.</desc>
      <defs>
        <pattern id={`${id}-ground`} width="17" height="17" patternUnits="userSpaceOnUse">
          <path d="M0 17 17 0" stroke="#7e9294" strokeWidth="1" opacity=".27" />
        </pattern>
      </defs>
      <rect width="680" height="350" rx="12" fill="#eaf1f6" />

      {symptom === "water" && (
        <g>
          <path d="M35 149 C125 148 135 166 218 166 S344 145 434 145 H645 V197 H35Z" fill="#52687b" />
          <path d="M35 197 H645 V246 H35Z" fill="#d5d1c4" />
          <path d="M35 246 H645 V315 H35Z" fill="#bdc5bf" />
          <path d="M35 246 H645 V315 H35Z" fill={`url(#${id}-ground)`} />
          <path d="M95 150 Q172 132 248 149 L265 160 Q188 169 112 160Z" fill="#77b7d9" />
          <path d="M122 152 Q175 143 220 151" fill="none" stroke="#d3effc" strokeWidth="3" strokeLinecap="round" />
          <path d="M480 148 H566 V279 H480Z" fill="#e7eff4" stroke="#6e8798" strokeWidth="3" />
          <path d="M472 143 H574 V154 H472Z" fill="#314d64" />
          <path d="M486 144 V153 M501 144 V153 M516 144 V153 M531 144 V153 M546 144 V153 M561 144 V153" stroke="#dceaf2" strokeWidth="3" />
          <path d="M483 251 H563 V276 H483Z" fill="#acd6ea" />
          <path d="M567 235 H645 M567 265 H645" fill="none" stroke="#7890a0" strokeWidth="10" />
          <CheckMarker x={175} y={109} number={1} />
          <CheckMarker x={526} y={108} number={2} />
        </g>
      )}

      {symptom === "pavers" && (
        <g>
          <path d="M35 155 H645 V202 H35Z" fill="#9a9c93" />
          <path d="M35 202 H645 V251 H35Z" fill="#d6d0c0" />
          <path d="M35 251 H645 V315 H35Z" fill="#bfc6bd" />
          <path d="M35 251 H645 V315 H35Z" fill={`url(#${id}-ground)`} />
          <g fill="#87949a" stroke="#687b84" strokeWidth="3">
            <path d="M35 121 H143 V154 H35Z" /><path d="M146 121 H254 V154 H146Z" />
            <path d="M258 129 365 137 363 170 257 162Z" />
            <path d="M367 137 472 128 475 161 369 170Z" />
            <path d="M478 121 H563 V154 H478Z" /><path d="M567 121 H645 V154 H567Z" />
          </g>
          <path d="M256 198 Q341 218 424 198" fill="none" stroke="#a9a798" strokeWidth="3" strokeDasharray="7 7" />
          <path d="M235 112 249 100 M460 109 473 97" fill="none" stroke="#6d96ad" strokeWidth="3" strokeLinecap="round" />
          <CheckMarker x={342} y={98} number={1} />
          <CheckMarker x={345} y={242} number={2} />
        </g>
      )}

      {symptom === "drain" && (
        <g>
          <path d="M35 148 H645 V196 H35Z" fill="#52687b" />
          <path d="M35 196 H645 V244 H35Z" fill="#d4d1c3" />
          <path d="M35 244 H645 V315 H35Z" fill="#bfc7c0" />
          <path d="M35 244 H645 V315 H35Z" fill={`url(#${id}-ground)`} />
          <path d="M267 149 H413 V294 H267Z" fill="#edf4f7" stroke="#728b9b" strokeWidth="4" />
          <path d="M271 255 H409 V290 H271Z" fill="#acd6ea" />
          <path d="M255 142 H425 V155 H255Z" fill="#314d64" />
          <path d="M271 143 V154 M290 143 V154 M309 143 V154 M328 143 V154 M347 143 V154 M366 143 V154 M385 143 V154 M404 143 V154" stroke="#dceaf2" strokeWidth="3" />
          <path d="M414 229 H645 M414 264 H645" fill="none" stroke="#7890a0" strokeWidth="12" />
          <path d="M285 132 Q297 110 313 130 Q300 143 285 132Z M338 133 Q351 108 368 128 Q355 143 338 133Z M389 134 Q399 115 412 132 Q400 143 389 134Z" fill="#a99473" />
          <path d="M292 131 305 129 M346 131 359 127 M394 133 406 131" stroke="#f2e9d8" strokeWidth="2" />
          <CheckMarker x={332} y={91} number={1} />
          <CheckMarker x={452} y={222} number={2} />
        </g>
      )}

      {symptom === "leak" && (
        <g>
          <path d="M35 92 H645 V140 H35Z" fill="#b5c7c7" />
          <path d="M35 140 H645 V201 H35Z" fill="#929fa9" />
          <path d="M35 201 H645 V224 H35Z" fill="#cbd3d7" />
          <path d="M310 231 C303 242 299 248 299 255 A11 11 0 0 0 321 255 C321 248 317 242 310 231Z" fill="#62a9d2" />
          <path d="M365 242 C359 251 356 257 356 262 A9 9 0 0 0 374 262 C374 257 371 251 365 242Z" fill="#94c8e1" />
          <path d="M184 229 Q258 214 321 228 T460 226" fill="none" stroke="#9aadb9" strokeWidth="7" opacity=".55" strokeLinecap="round" />
          <path d="M84 92 V75 H596 V92" fill="none" stroke="#8ba8b4" strokeWidth="3" strokeDasharray="8 8" />
          <CheckMarker x={405} y={257} number={1} />
          <CheckMarker x={339} y={91} number={2} />
        </g>
      )}
    </svg>
  );
}
