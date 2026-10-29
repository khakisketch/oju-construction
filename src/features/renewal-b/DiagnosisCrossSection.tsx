/**
 * 아파트 외부공간 배수·포장 단면 개념도.
 * 실제 설계도가 아니라, 일반적인 실패 원인을 설명하기 위한 authored SVG다.
 * 수치와 공법은 현장 조건·설계 기준에 따라 달라질 수 있다.
 *
 * 도면의 정서: 지반과 배수 구조가 주인공. 물이 표면에서 출발해
 * 포장 → 다짐층 → 투수 배수층 → 유공관 → 집수정 → 관로로 이동하는
 * 하나의 경로 위에 5개의 고장 지점을 얹는다.
 */

import styles from "./renewalB.module.css";

export type SectionFailureId = "slope" | "clog" | "pipe" | "compaction" | "joint";

interface FailureMark {
  number: string;
  x: number;
  y: number;
  label: string;
}

const W = 960;
const H = 560;

/** 실제 표면(포장 상단) */
const SURFACE_Y = 176;
/** 포장 표층 아스팔트 */
const LAYER_TOP = 186;
/** 다짐층 3단 */
const LIFT = [{ y: 186, h: 26 }, { y: 212, h: 26 }, { y: 238, h: 26 }];
const LIFT_FILL = ["#D6C9B4", "#CBBBA4", "#B8A88E"];
/** 노상(원지반) */
const SUBGRADE_Y = 264;
/** 투수 배수층(자갈) */
const DRAIN_Y = 330;
const DRAIN_H = 56;
/** 유공관 중심선 */
const PIPE_Y = 356;
/** 집수정 */
const BASIN_X = 700;
const BASIN_W = 74;
/** 원지반 깊은 곳 */
const BEDROCK_Y = 386;
const BEDROCK_H = 34;

/** 물의 이동 경로 (도면 하단 흐름도) */
const FLOW = [
  "포장 표면",
  "다짐층",
  "투수 배수층",
  "유공관",
  "집수정",
  "관로 · 배출",
];

const MARKS: Record<SectionFailureId, FailureMark> = {
  slope: { number: "01", x: 385, y: 166, label: "구배 부족" },
  clog: { number: "02", x: BASIN_X + BASIN_W / 2, y: 162, label: "배수구 막힘" },
  pipe: { number: "03", x: 862, y: 356, label: "관로 역구배" },
  compaction: { number: "04", x: 560, y: 166, label: "다짐 부족" },
  joint: { number: "05", x: 200, y: 166, label: "줄눈 벌어짐" },
};

const ORDER: SectionFailureId[] = ["slope", "clog", "pipe", "compaction", "joint"];

export default function DiagnosisCrossSection({
  prefix = "dg",
  activeId,
  variant = "failure",
}: {
  prefix?: string;
  /** 현재 선택된 고장 지점. 해당 지점만 강조하고 물의 경로를 설명한다. */
  activeId?: SectionFailureId | null;
  /** failure = 고장 지점이 드러난 단면, correct = 기준을 만족하는 단면. */
  variant?: "failure" | "correct";
}) {
  const p = prefix;
  const ok = variant === "correct";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`${p}-title ${p}-desc`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={`${p}-title`}>아파트 외부공간 배수 단면 개념도</title>
      <desc id={`${p}-desc`}>
        주차장 포장의 단면. 표면에서 빗물이 고이고, 포장 표층과 다짐층을 지나
        투수 배수층의 유공관으로 흘러 집수정과 관로로 배출되는 구조를 보여준다.
        다섯 지점 — 구배 부족, 배수구 막힘, 관로 역구배, 다짐 부족, 줄눈 벌어짐 —
        이 물이 막히는 위치로 표시되어 있다.
      </desc>

      <defs>
        <pattern id={`${p}-grid`} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0 L0 0 0 32" fill="none" stroke="#E2E8F0" strokeWidth="0.6" />
        </pattern>
        <pattern id={`${p}-soil`} width="13" height="13" patternUnits="userSpaceOnUse">
          <path d="M-2 2 L2 -2 M0 13 L13 0 M11 15 L15 11" stroke="#8B7355" strokeWidth="0.8" opacity="0.45" />
        </pattern>
        <pattern id={`${p}-gravel`} width="15" height="15" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.3" fill="#8B7355" opacity="0.5" />
          <circle cx="11" cy="10" r="1" fill="#8B7355" opacity="0.4" />
          <circle cx="12" cy="2" r="0.9" fill="#8B7355" opacity="0.35" />
        </pattern>
        <pattern id={`${p}-void`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 H10" stroke="#EA580C" strokeWidth="2.4" opacity="0.55" />
        </pattern>
        <marker id={`${p}-arrow`} viewBox="0 0 8 8" refX="6.4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 Z" fill="#3B82F6" />
        </marker>
        <marker id={`${p}-arrow-orange`} viewBox="0 0 8 8" refX="6.4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 Z" fill="#EA580C" />
        </marker>
        <marker id={`${p}-arrow-navy`} viewBox="0 0 8 8" refX="6.4" refY="4" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 Z" fill="#0E2F64" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#F8FAFC" />
      <rect width={W} height={H} fill={`url(#${p}-grid)`} opacity="0.55" />

      {/* ---------- title block ---------- */}
      <g fontFamily="'Noto Sans KR', sans-serif">
        <text x="24" y="28" fill="#0E2F64" fontSize="13" fontWeight="800">
          {ok ? "아파트 외부공간 · 기준 단면 A-A" : "아파트 외부공간 · 배수 단면 A-A"}
        </text>
        <text x="24" y="45" fill="#64748B" fontSize="9" letterSpacing="1.2">
          {ok ? "PAVEMENT DRAINAGE SECTION · PROPER CONSTRUCTION" : "PAVEMENT DRAINAGE SECTION · CONCEPT"}
        </text>
        <line x1="24" y1="56" x2="252" y2="56" stroke="#0E2F64" strokeWidth="1.4" />
      </g>

      {/* ---------- legend ---------- */}
      <g fontFamily="'Noto Sans KR', sans-serif" fontSize="10.5" fill="#334155">
        <rect x="646" y="14" width="290" height="54" fill="#FFFFFF" stroke="#CBD5E1" />
        <circle cx="664" cy="32" r="5" fill="#3B82F6" />
        <text x="676" y="36">{ok ? "물 · 흐르는 물" : "물 · 고인 물"}</text>
        {ok ? (
          <>
            <line x1="764" y1="32" x2="780" y2="32" stroke="#0E2F64" strokeWidth="2" />
            <text x="786" y="36">구배 확보</text>
          </>
        ) : (
          <>
            <circle cx="764" cy="32" r="5" fill="#EA580C" />
            <text x="776" y="36">고장 지점</text>
          </>
        )}
        <line x1="664" y1="54" x2="680" y2="54" stroke="#3B82F6" strokeWidth="2.4" />
        <text x="686" y="58">배수 경로</text>
        {!ok && (
          <>
            <rect x="768" y="49" width="16" height="10" fill={`url(#${p}-void)`} stroke="#EA580C" strokeWidth="0.8" />
            <text x="790" y="58">다짐 부족 구간</text>
          </>
        )}
      </g>

      {/* ---------- rainfall ---------- */}
      <g>
        {[300, 390, 520].map((x) => (
          <line
            key={x}
            x1={x}
            y1="112"
            x2={x}
            y2={x === 390 ? 152 : 146}
            stroke="#3B82F6"
            strokeWidth="2.2"
            markerEnd={`url(#${p}-arrow)`}
            opacity="0.8"
          />
        ))}
        <text x="248" y="116" fill="#64748B" fontSize="10.5" fontFamily="'Noto Sans KR', sans-serif">
          빗물
        </text>
      </g>

      {/* ---------- 설계 구배선 ---------- */}
      <g>
        <line
          x1="540"
          y1="148"
          x2="928"
          y2="170"
          stroke={ok ? "#0E2F64" : "#EA580C"}
          strokeWidth={ok ? "1.8" : "1.6"}
          strokeDasharray={ok ? undefined : "8 5"}
          markerEnd={ok ? `url(#${p}-arrow-navy)` : `url(#${p}-arrow-orange)`}
        />
        <line
          x1="540"
          y1="148"
          x2="540"
          y2="172"
          stroke={ok ? "#0E2F64" : "#EA580C"}
          strokeWidth="1"
          strokeDasharray={ok ? undefined : "3 3"}
        />
        <text
          x="586"
          y="134"
          fill={ok ? "#0E2F64" : "#EA580C"}
          fontSize="10.5"
          fontWeight="700"
          fontFamily="'Noto Sans KR', sans-serif"
        >
          {ok ? "구배 1.5~2% 확보 — 물이 배수구로 흘러갑니다" : "설계 구배 1.5~2% — 이 경사로 내려가야 배수됨"}
        </text>
      </g>

      {/* ---------- ground: 층 구성 ---------- */}
      <g>
        {/* 노상 */}
        <rect x="30" y={SUBGRADE_Y} width="900" height={BEDROCK_Y - SUBGRADE_Y} fill="#B8A88E" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="30" y={SUBGRADE_Y} width="900" height={BEDROCK_Y - SUBGRADE_Y} fill={`url(#${p}-soil)`} />
        {/* 원지반 */}
        <rect x="30" y={BEDROCK_Y} width="900" height={BEDROCK_H} fill="#A9997F" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="30" y={BEDROCK_Y} width="900" height={BEDROCK_H} fill={`url(#${p}-soil)`} opacity="0.8" />

        {/* 다짐층 3단 */}
        {LIFT.map((lift, i) => (
          <g key={lift.y}>
            <rect
              x="30"
              y={lift.y}
              width="900"
              height={lift.h}
              fill={LIFT_FILL[i]}
              stroke="#94A3B8"
              strokeWidth="0.7"
            />
            <line x1="30" y1={lift.y + lift.h} x2="930" y2={lift.y + lift.h} stroke="#94A3B8" strokeWidth="0.7" strokeDasharray="5 4" />
          </g>
        ))}

        {/* 투수 배수층(자갈) */}
        <rect x="30" y={DRAIN_Y} width="900" height={DRAIN_H} fill="#D6C9B4" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="30" y={DRAIN_Y} width="900" height={DRAIN_H} fill={`url(#${p}-gravel)`} />

        {/* 포장 표층 */}
        <rect x="30" y={SURFACE_Y} width="900" height={LAYER_TOP - SURFACE_Y} fill="#334155" />
      </g>

      {/* ---------- layer labels ---------- */}
      <g fontFamily="'Noto Sans KR', sans-serif" fontSize="11" fill="#0E2F64" fontWeight="700">
        <text x="38" y={SURFACE_Y - 6}>포장 표층</text>
        <line x1="96" y1={SURFACE_Y - 10} x2="96" y2={SURFACE_Y} stroke="#0E2F64" strokeWidth="0.8" />
        <text x="38" y="212">다짐층</text>
        <text x="38" y="228" fill="#64748B" fontSize="9.5" fontWeight="500">
          층당 20~30cm · 다짐도 95%
        </text>
        <line x1="90" y1="206" x2="90" y2="196" stroke="#0E2F64" strokeWidth="0.8" />
        <text x="38" y="292">노상 (원지반)</text>
        <line x1="108" y1="288" x2="108" y2={SUBGRADE_Y + 4} stroke="#0E2F64" strokeWidth="0.8" />
        <text x="38" y="412">원지반</text>
        <text x="38" y="366">유공관</text>
        <line x1="78" y1="362" x2="150" y2={PIPE_Y} stroke="#0E2F64" strokeWidth="0.8" />
        <text x="392" y={DRAIN_Y - 8}>투수 배수층 (자갈)</text>
        <line x1="470" y1={DRAIN_Y - 12} x2="470" y2={DRAIN_Y + 2} stroke="#0E2F64" strokeWidth="0.8" />
      </g>

      {/* ---------- 물: 고인 물 + 침투 + 배수 경로 ---------- */}
      <g>
        {/* 고인 물 (구배 부족) */}
        {!ok && <path d="M296 176 Q385 152 474 176 Z" fill="#3B82F6" opacity="0.82" />}
        {!ok && <path d="M314 174 Q385 162 456 174" fill="none" stroke="#DBEAFE" strokeWidth="1.4" opacity="0.95" />}

        {/* 줄눈으로 침투 */}
        {!ok && (
          <path
            d="M200 176 L200 330"
            stroke="#3B82F6"
            strokeWidth="2.4"
            strokeDasharray="7 6"
            markerEnd={`url(#${p}-arrow)`}
            opacity="0.85"
          />
        )}
        {/* 균열로 침투 */}
        {!ok && (
          <path
            d="M556 178 L552 214 L560 240 L554 268"
            stroke="#3B82F6"
            strokeWidth="2.2"
            strokeDasharray="6 5"
            markerEnd={`url(#${p}-arrow)`}
            opacity="0.85"
          />
        )}
        {/* 투수 배수층을 따라 이동 */}
        <path
          d="M206 356 L686 358"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeDasharray={ok ? undefined : "10 7"}
          markerEnd={`url(#${p}-arrow)`}
          opacity={ok ? 0.9 : 0.8}
        />
      </g>

      {/* ---------- 줄눈 (05) ---------- */}
      <g>
        <rect
          x={ok ? 198.5 : 197}
          y={SURFACE_Y}
          width={ok ? "3" : "6"}
          height={SUBGRADE_Y - SURFACE_Y}
          fill={ok ? "#64748B" : "#1E293B"}
        />
        {!ok && (
          <>
            <line x1="197" y1={SURFACE_Y} x2="197" y2={SUBGRADE_Y} stroke="#EA580C" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="203" y1={SURFACE_Y} x2="203" y2={SUBGRADE_Y} stroke="#EA580C" strokeWidth="1" strokeDasharray="4 3" />
          </>
        )}
      </g>

      {/* ---------- 균열 + 부등침하 (04) ---------- */}
      {!ok && (
        <g>
          <path d="M556 178 L552 214 L560 240 L554 268" fill="none" stroke="#EA580C" strokeWidth="2.6" />
          <path d="M500 176 Q560 170 620 176" fill="none" stroke="#334155" strokeWidth="2" />
          <path d="M500 176 Q560 186 620 176 L620 181 Q560 191 500 181 Z" fill="#1E293B" opacity="0.55" />
          <rect x="500" y="186" width="120" height="78" fill={`url(#${p}-void)`} opacity="0.5" />
        </g>
      )}

      {/* ---------- 유공관 ---------- */}
      <g>
        <path d={`M150 ${PIPE_Y} L${BASIN_X - 6} ${PIPE_Y}`} fill="none" stroke="#475569" strokeWidth="26" strokeLinecap="round" />
        <path d={`M150 ${PIPE_Y} L${BASIN_X - 6} ${PIPE_Y}`} fill="none" stroke="#F8FAFC" strokeWidth="16" strokeLinecap="round" />
        {[180, 236, 292, 348, 404, 460, 516, 572, 628, 668].map((x) => (
          <circle key={x} cx={x} cy={PIPE_Y - 8} r="2.6" fill="#475569" />
        ))}
        {[180, 236, 292, 348, 404, 460, 516, 572, 628, 668].map((x) => (
          <circle key={`b${x}`} cx={x} cy={PIPE_Y + 8} r="2.6" fill="#475569" />
        ))}
        <path
          d={`M158 ${PIPE_Y} L${BASIN_X - 16} ${PIPE_Y}`}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="6"
          strokeLinecap="round"
          opacity={ok ? 0.9 : 0.75}
        />
      </g>

      {/* ---------- 집수정 (02) ---------- */}
      <g>
        <rect x={BASIN_X} y={SURFACE_Y} width={BASIN_W} height={BEDROCK_Y - SURFACE_Y} fill="#FFFFFF" stroke="#0E2F64" strokeWidth="1.6" />
        {/* 그레이트 */}
        <rect x={BASIN_X} y={SURFACE_Y} width={BASIN_W} height={12} fill="#475569" stroke="#0E2F64" strokeWidth="1" />
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1={BASIN_X + 8 + i * 11}
            y1={SURFACE_Y + 2}
            x2={BASIN_X + 8 + i * 11}
            y2={SURFACE_Y + 10}
            stroke="#CBD5E1"
            strokeWidth="1.6"
          />
        ))}
        {/* 낙엽 · 토사 */}
        {!ok && (
          <>
            <circle cx={BASIN_X + 16} cy={SURFACE_Y + 5} r="4.2" fill="#65A30D" opacity="0.9" />
            <circle cx={BASIN_X + 30} cy={SURFACE_Y + 8} r="3.4" fill="#A16207" opacity="0.9" />
            <circle cx={BASIN_X + 44} cy={SURFACE_Y + 4} r="4" fill="#65A30D" opacity="0.8" />
          </>
        )}
        {/* 집수정 안의 물 */}
        <rect
          x={BASIN_X + 4}
          y={ok ? 350 : 290}
          width={BASIN_W - 8}
          height={BEDROCK_Y - (ok ? 350 : 290)}
          fill="#3B82F6"
          opacity={ok ? 0.45 : 0.55}
        />
        <path
          d={`M${BASIN_X + 6} ${ok ? 356 : 296} Q${BASIN_X + 22} ${ok ? 348 : 288} ${BASIN_X + 38} ${ok ? 356 : 296} T${BASIN_X + 68} ${ok ? 356 : 296}`}
          fill="none"
          stroke="#DBEAFE"
          strokeWidth="1.6"
        />
        <text x={BASIN_X - 96} y={SURFACE_Y + 4} fill="#0E2F64" fontSize="11" fontWeight="700" fontFamily="'Noto Sans KR', sans-serif">
          집수정
        </text>
        <line x1={BASIN_X - 34} y1={SURFACE_Y} x2={BASIN_X} y2={SURFACE_Y} stroke="#0E2F64" strokeWidth="0.8" />
      </g>

      {/* ---------- 관로 (03) ---------- */}
      <g>
        <path
          d={`M${BASIN_X + BASIN_W - 8} ${PIPE_Y} L${ok ? 912 : 930} ${ok ? 386 : 340}`}
          fill="none"
          stroke="#475569"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          d={`M${BASIN_X + BASIN_W - 8} ${PIPE_Y} L${ok ? 912 : 930} ${ok ? 386 : 340}`}
          fill="none"
          stroke="#F8FAFC"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* 물이 고여 멈춘 지점 */}
        <path
          d={`M${BASIN_X + BASIN_W - 4} ${PIPE_Y - 2} L${ok ? 906 : 862} ${ok ? 384 : 346}`}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.8"
          markerEnd={ok ? `url(#${p}-arrow)` : undefined}
        />
        {!ok && (
          <>
            <line x1="856" y1="328" x2="872" y2="356" stroke="#EA580C" strokeWidth="3" />
            <line x1="872" y1="328" x2="856" y2="356" stroke="#EA580C" strokeWidth="3" />
          </>
        )}
        <text x="792" y={PIPE_Y - 26} fill="#0E2F64" fontSize="11" fontWeight="700" fontFamily="'Noto Sans KR', sans-serif">
          관로
        </text>
        <line x1="814" y1={PIPE_Y - 22} x2={ok ? 836 : 836} y2={ok ? PIPE_Y + 6 : PIPE_Y - 6} stroke="#0E2F64" strokeWidth="0.8" />
        {!ok && (
          <text x="742" y="392" fill="#EA580C" fontSize="10.5" fontWeight="700" fontFamily="'Noto Sans KR', sans-serif">
            역구배 · 흐름 정체
          </text>
        )}
      </g>

      {/* ---------- 활성 고장 지점 강조 ---------- */}
      {activeId && (
        <g>
          {activeId === "slope" && (
            <path d="M292 176 Q385 148 478 176" fill="none" stroke="#EA580C" strokeWidth="2.4" strokeDasharray="7 5" />
          )}
          {activeId === "clog" && (
            <rect x={BASIN_X - 4} y={SURFACE_Y - 6} width={BASIN_W + 8} height="24" fill="none" stroke="#EA580C" strokeWidth="2.4" />
          )}
          {activeId === "pipe" && (
            <path d={`M${BASIN_X + BASIN_W} 384 L930 316`} fill="none" stroke="#EA580C" strokeWidth="2" strokeDasharray="6 4" />
          )}
          {activeId === "compaction" && (
            <rect x="496" y="184" width="128" height="82" fill="none" stroke="#EA580C" strokeWidth="2.2" />
          )}
          {activeId === "joint" && (
            <rect x="188" y={SURFACE_Y - 6} width="24" height="76" fill="none" stroke="#EA580C" strokeWidth="2.4" />
          )}
        </g>
      )}

      {/* ---------- 고장 지점 번호 ---------- */}
      <g fontFamily="'Noto Sans KR', sans-serif" fontSize="12" fontWeight="800" textAnchor="middle">
        {!ok &&
          ORDER.map((id) => {
            const mark = MARKS[id];
            const active = activeId === id;
            return (
              <g key={id}>
                {active && (
                  <circle cx={mark.x} cy={mark.y} r="18" fill="#EA580C" className={styles.sectionPulse} />
                )}
                <circle
                  cx={mark.x}
                  cy={mark.y}
                  r={active ? 15 : 12}
                  fill={active ? "#EA580C" : "#0E2F64"}
                  stroke="#FFFFFF"
                  strokeWidth="2.4"
                />
                <text x={mark.x} y={mark.y + 4} fill="#FFFFFF">
                  {mark.number}
                </text>
              </g>
            );
          })}
      </g>

      {/* ---------- 물의 이동 경로 흐름도 ---------- */}
      <g>
        <line x1="30" y1="428" x2="930" y2="428" stroke="#E2E8F0" strokeWidth="1" />
        <text x="30" y="456" fill="#0E2F64" fontSize="11.5" fontWeight="800" fontFamily="'Noto Sans KR', sans-serif">
          물의 이동 경로
        </text>
        <text x="930" y="456" textAnchor="end" fill="#64748B" fontSize="10" fontFamily="'Noto Sans KR', sans-serif">
          {ok ? "물이 끊기지 않고 배출됩니다" : "01~05 중 하나가 막히면 물이 고입니다"}
        </text>
        <g fontFamily="'Noto Sans KR', sans-serif" fontSize="12.5" fill="#334155">
          {FLOW.map((label, i) => (
            <g key={label}>
              {i > 0 && (
                <text x={30 + i * 152} y="504" fill="#0E2F64" fontWeight="800">
                  ›
                </text>
              )}
              <text x={54 + i * 152} y="504" fontWeight="600">
                {label}
              </text>
            </g>
          ))}
        </g>
      </g>

      {/* ---------- footer ---------- */}
      <g fontFamily="'Noto Sans KR', sans-serif" fontSize="9.5" fill="#94A3B8">
        <text x="24" y={H - 12}>
          SECTION A-A · NOT TO SCALE · {ok ? "PROPER CONSTRUCTION" : "GENERAL CAUSES ONLY"}
        </text>
        <text x={W - 24} y={H - 12} textAnchor="end">OJU / APT EXTERIOR</text>
      </g>
    </svg>
  );
}
