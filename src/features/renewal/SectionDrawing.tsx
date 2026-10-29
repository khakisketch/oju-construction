import styles from "./renewal.module.css";

/**
 * 아파트 단지 외부공간 단면 개념도.
 * 실제 도면이 아니라 오주건설의 시공 범위를 설명하는 개념도다.
 * 사진 자산이 없는 초기 단계에서도 "무엇을 하는 회사인가"를
 * 한 장으로 보여주기 위해 authored SVG로 그린다.
 */
export default function SectionDrawing() {
  return (
    <svg
      viewBox="0 0 880 560"
      role="img"
      aria-labelledby="section-drawing-title section-drawing-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="section-drawing-title">
        아파트 단지 외부공간 단면 개념도
      </title>
      <desc id="section-drawing-desc">
        건축물, 지반, 배수관, 포장층, 조경, 가로등과 벤치가 한 단면에 놓여
        있고, 오주건설의 시공 범위가 부대토목·배수·포장·조경·시설물 다섯
        구간에 걸쳐 있음을 보여준다.
      </desc>

      <defs>
        <pattern id="sd-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#D8D2C6" strokeWidth="0.6" />
        </pattern>
        <pattern id="sd-soil" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M-2 2 L2 -2 M0 10 L10 0 M8 12 L12 8" stroke="#8A7A63" strokeWidth="0.8" opacity="0.55" />
        </pattern>
        <pattern id="sd-base" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M-2 2 L2 -2 M0 8 L8 0 M6 10 L10 6" stroke="#8C7F6B" strokeWidth="0.7" opacity="0.45" />
        </pattern>
        <pattern id="sd-gravel" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.1" fill="#8C7F6B" opacity="0.55" />
          <circle cx="9" cy="8" r="0.9" fill="#8C7F6B" opacity="0.45" />
        </pattern>
        <pattern id="sd-concrete" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 14 L14 0" stroke="#B9B2A5" strokeWidth="0.7" opacity="0.55" />
        </pattern>
        <marker id="sd-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 Z" fill="#2C4652" />
        </marker>
        <marker id="sd-tick" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M4 0 L4 8" stroke="#1E2328" strokeWidth="1" />
        </marker>
      </defs>

      {/* paper + grid */}
      <rect width="880" height="560" fill="#FCFBF8" />
      <rect width="880" height="560" fill="url(#sd-grid)" />
      <rect x="1" y="1" width="878" height="558" fill="none" stroke="#1E2328" strokeWidth="1.5" />

      {/* sky tint above grade */}
      <rect x="2" y="2" width="876" height="328" fill="#F7F4EE" opacity="0.7" />

      {/* title block */}
      <g className={styles.drawLabel}>
        <text x="28" y="34" fill="#1E2328" fontSize="12" fontWeight="700" letterSpacing="1.6" fontFamily="var(--font-archivo), Archivo, sans-serif">
          OJU / APT EXTERIOR
        </text>
        <text x="28" y="52" fill="#646A6D" fontSize="9" letterSpacing="1.4" fontFamily="var(--font-archivo), Archivo, sans-serif">
          SECTION A-A · CONCEPT DRAWING · NOT TO SCALE
        </text>
      </g>

      {/* scope legend */}
      <g className={styles.drawLabel}>
        <rect x="648" y="22" width="204" height="128" fill="#FCFBF8" stroke="#CFC8BA" />
        <text x="662" y="42" fill="#646A6D" fontSize="8" letterSpacing="1.4" fontFamily="var(--font-archivo), Archivo, sans-serif">
          OJU SCOPE
        </text>
        <g fontSize="11" fontFamily="'Noto Sans KR', sans-serif" fill="#1E2328">
          <rect x="662" y="54" width="8" height="8" fill="#8A7A63" />
          <text x="678" y="62">01 부대토목 · 지반</text>
          <rect x="662" y="72" width="8" height="8" fill="#2C4652" />
          <text x="678" y="80">02 배수 · 상하수도</text>
          <rect x="662" y="90" width="8" height="8" fill="#3A3F44" />
          <text x="678" y="98">03 포장</text>
          <rect x="662" y="108" width="8" height="8" fill="#5E7A5A" />
          <text x="678" y="116">04 조경</text>
          <rect x="662" y="126" width="8" height="8" fill="#D9552A" />
          <text x="678" y="134">05 시설물</text>
        </g>
      </g>

      {/* building */}
      <g className={styles.drawLayer}>
        <rect x="62" y="132" width="168" height="198" fill="#FCFBF8" stroke="#1E2328" strokeWidth="1.6" />
        <line x1="62" y1="182" x2="230" y2="182" stroke="#1E2328" strokeWidth="1" />
        <line x1="62" y1="232" x2="230" y2="232" stroke="#1E2328" strokeWidth="1" />
        <line x1="62" y1="282" x2="230" y2="282" stroke="#1E2328" strokeWidth="1" />
        <line x1="118" y1="132" x2="118" y2="330" stroke="#1E2328" strokeWidth="0.8" opacity="0.5" />
        <line x1="174" y1="132" x2="174" y2="330" stroke="#1E2328" strokeWidth="0.8" opacity="0.5" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={80 + col * 54}
              y={148 + row * 50}
              width="28"
              height="24"
              fill="#E8E6E1"
              stroke="#1E2328"
              strokeWidth="0.8"
            />
          )),
        )}
        <line x1="52" y1="330" x2="240" y2="330" stroke="#1E2328" strokeWidth="2.4" />
        <rect x="52" y="330" width="188" height="36" fill="#D6CFC2" stroke="#1E2328" strokeWidth="1.2" />
        <rect x="52" y="330" width="188" height="36" fill="url(#sd-concrete)" opacity="0.5" />
        <line x1="52" y1="348" x2="240" y2="348" stroke="#1E2328" strokeWidth="0.8" opacity="0.7" />
        <text x="64" y="120" fill="#1E2328" fontSize="11" letterSpacing="1.2" fontFamily="var(--font-archivo), Archivo, sans-serif">
          BUILDING
        </text>
        <line x1="64" y1="124" x2="64" y2="132" stroke="#1E2328" strokeWidth="0.8" />
      </g>

      {/* grade line */}
      <line
        className={styles.drawLine}
        x1="20"
        y1="330"
        x2="860"
        y2="330"
        stroke="#1E2328"
        strokeWidth="2"
      />

      {/* paving layers */}
      <g className={styles.drawLayer}>
        <rect x="240" y="330" width="380" height="9" fill="#3A3F44" />
        <rect x="240" y="339" width="380" height="16" fill="#C9BFAE" stroke="#1E2328" strokeWidth="0.6" />
        <rect x="240" y="355" width="380" height="18" fill="#AFA491" stroke="#1E2328" strokeWidth="0.6" />
        <rect x="240" y="339" width="380" height="16" fill="url(#sd-base)" />
        <rect x="240" y="355" width="380" height="18" fill="url(#sd-gravel)" />
        <line x1="260" y1="334.5" x2="600" y2="334.5" stroke="#D9552A" strokeWidth="1.4" strokeDasharray="8 6" />
        <rect x="620" y="330" width="12" height="30" fill="#D8D2C6" stroke="#1E2328" strokeWidth="1" />
        <text x="248" y="318" fill="#1E2328" fontSize="11" letterSpacing="1.2" fontFamily="var(--font-archivo), Archivo, sans-serif">
          PAVEMENT
        </text>
        <line x1="248" y1="322" x2="248" y2="330" stroke="#1E2328" strokeWidth="0.8" />
      </g>

      {/* planting */}
      <g className={styles.drawLayer}>
        <rect x="632" y="330" width="218" height="30" fill="#8A7A63" stroke="#1E2328" strokeWidth="0.8" />
        <rect x="632" y="330" width="218" height="30" fill="url(#sd-soil)" />
        <line x1="722" y1="330" x2="722" y2="278" stroke="#5B4A36" strokeWidth="5" />
        <path d="M722 300 C 700 290, 690 268, 700 248 C 710 230, 730 230, 740 246 C 752 264, 744 286, 722 300 Z" fill="#5E7A5A" stroke="#1E2328" strokeWidth="1.2" />
        <path d="M706 272 C 694 262, 696 244, 710 238 C 724 232, 736 244, 734 258" fill="none" stroke="#1E2328" strokeWidth="0.8" opacity="0.6" />
        {[650, 668, 686, 748, 766, 784].map((x, i) => (
          <circle key={x} cx={x} cy={318 - (i % 2) * 4} r={7 - (i % 3)} fill="#7C9274" stroke="#1E2328" strokeWidth="0.7" />
        ))}
        <line x1="794" y1="314" x2="826" y2="314" stroke="#1E2328" strokeWidth="2" />
        <line x1="800" y1="314" x2="800" y2="324" stroke="#1E2328" strokeWidth="1.5" />
        <line x1="820" y1="314" x2="820" y2="324" stroke="#1E2328" strokeWidth="1.5" />
        <line x1="838" y1="330" x2="838" y2="220" stroke="#1E2328" strokeWidth="2" />
        <path d="M838 220 L 854 226 L 838 232" fill="#D9552A" stroke="#1E2328" strokeWidth="1" />
        <text x="642" y="380" fill="#1E2328" fontSize="11" letterSpacing="1.2" fontFamily="var(--font-archivo), Archivo, sans-serif">
          PLANTING / FURNITURE
        </text>
        <line x1="642" y1="384" x2="642" y2="360" stroke="#1E2328" strokeWidth="0.8" />
      </g>

      {/* drainage */}
      <g className={styles.drawLayer}>
        <rect x="292" y="392" width="308" height="52" fill="#D6CFC2" stroke="#1E2328" strokeWidth="1" />
        <rect x="292" y="392" width="308" height="52" fill="url(#sd-gravel)" />
        <circle cx="446" cy="418" r="21" fill="#FCFBF8" stroke="#2C4652" strokeWidth="3.4" />
        <circle cx="446" cy="418" r="12" fill="#FCFBF8" stroke="#2C4652" strokeWidth="1.6" />
        <path d="M300 372 C 340 372, 370 392, 426 414" fill="none" stroke="#2C4652" strokeWidth="1.4" strokeDasharray="5 4" markerEnd="url(#sd-arrow)" />
        <path d="M592 372 C 552 372, 522 392, 466 414" fill="none" stroke="#2C4652" strokeWidth="1.4" strokeDasharray="5 4" markerEnd="url(#sd-arrow)" />
        <text x="300" y="470" fill="#1E2328" fontSize="11" letterSpacing="1.2" fontFamily="var(--font-archivo), Archivo, sans-serif">
          DRAINAGE
        </text>
        <line x1="300" y1="458" x2="300" y2="444" stroke="#1E2328" strokeWidth="0.8" />
      </g>

      {/* main labels */}
      <g className={styles.drawLabel} fontFamily="'Noto Sans KR', sans-serif" fontSize="18" fontWeight="700" fill="#1E2328">
        <g>
          <rect x="64" y="392" width="10" height="10" fill="#8A7A63" />
          <text x="82" y="402">지반</text>
          <path d="M92 386 L92 352 L120 352" fill="none" stroke="#1E2328" strokeWidth="0.9" />
        </g>
        <g>
          <rect x="520" y="480" width="10" height="10" fill="#2C4652" />
          <text x="538" y="490">배수</text>
          <path d="M530 474 L530 430 L468 430" fill="none" stroke="#1E2328" strokeWidth="0.9" />
        </g>
        <g>
          <rect x="458" y="286" width="10" height="10" fill="#3A3F44" />
          <text x="476" y="296">포장</text>
          <path d="M468 300 L468 330" fill="none" stroke="#1E2328" strokeWidth="0.9" />
        </g>
        <g>
          <rect x="648" y="190" width="10" height="10" fill="#5E7A5A" />
          <text x="666" y="200">조경</text>
          <path d="M660 204 L660 230 L700 230" fill="none" stroke="#1E2328" strokeWidth="0.9" />
        </g>
        <g>
          <rect x="760" y="182" width="10" height="10" fill="#D9552A" />
          <text x="778" y="192">시설물</text>
          <path d="M770 196 L770 225 L838 225" fill="none" stroke="#1E2328" strokeWidth="0.9" />
        </g>
      </g>

      {/* dimensions */}
      <g className={styles.drawLabel} stroke="#1E2328" strokeWidth="0.8" fill="#646A6D" fontFamily="var(--font-archivo), Archivo, sans-serif" fontSize="9" letterSpacing="0.6">
        <line x1="240" y1="84" x2="620" y2="84" markerStart="url(#sd-tick)" markerEnd="url(#sd-tick)" />
        <text x="430" y="78" textAnchor="middle" stroke="none">SITE ROAD · 380</text>
        <line x1="30" y1="132" x2="30" y2="330" markerStart="url(#sd-tick)" markerEnd="url(#sd-tick)" />
        <text x="22" y="236" textAnchor="middle" transform="rotate(-90 22 236)" stroke="none">BUILDING</text>
        <line x1="62" y1="532" x2="846" y2="532" markerStart="url(#sd-tick)" markerEnd="url(#sd-tick)" />
        <text x="454" y="548" textAnchor="middle" stroke="none">APARTMENT EXTERIOR · OJU CONSTRUCTION SCOPE</text>
      </g>

      {/* scale bar */}
      <g className={styles.drawLabel}>
        <rect x="62" y="506" width="40" height="5" fill="#1E2328" />
        <rect x="102" y="506" width="40" height="5" fill="#FCFBF8" stroke="#1E2328" strokeWidth="0.6" />
        <rect x="142" y="506" width="40" height="5" fill="#1E2328" />
        <text x="62" y="500" fill="#646A6D" fontSize="8" fontFamily="var(--font-archivo), Archivo, sans-serif">0</text>
        <text x="176" y="500" fill="#646A6D" fontSize="8" fontFamily="var(--font-archivo), Archivo, sans-serif">10m</text>
      </g>

      {/* title block bottom right */}
      <g className={styles.drawLabel}>
        <rect x="648" y="472" width="204" height="46" fill="#FCFBF8" stroke="#1E2328" strokeWidth="1" />
        <text x="660" y="490" fill="#1E2328" fontSize="9" fontWeight="700" letterSpacing="1.2" fontFamily="var(--font-archivo), Archivo, sans-serif">
          OJU CONSTRUCTION
        </text>
        <text x="660" y="505" fill="#646A6D" fontSize="8" letterSpacing="0.8" fontFamily="var(--font-archivo), Archivo, sans-serif">
          APT EXTERIOR / SECTION A-A / 2026
        </text>
      </g>
    </svg>
  );
}
