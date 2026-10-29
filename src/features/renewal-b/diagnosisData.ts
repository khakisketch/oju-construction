export type DiagnosisId = "slope" | "clog" | "pipe" | "compaction" | "joint";

export interface DiagnosisPoint {
  id: DiagnosisId;
  number: string;
  title: string;
  short: string;
  symptom: string;
  /** 단면 위에서 한 줄로 읽히는 고장 지점 설명. */
  note: string;
  causes: string[];
  result: string;
  solution: string[];
  /** 같은 자리 사진 위의 표시 위치. 단위 %. */
  photoMarker: { x: number; y: number };
  /** 근거 사진. 지점별 단면·현장 증거. */
  evidence: { src: string; alt: string; position?: string };
}

export const DIAGNOSIS_POINTS: DiagnosisPoint[] = [
  {
    id: "slope",
    number: "01",
    title: "구배 부족",
    short: "물이 고이는 가장 흔한 원인",
    symptom: "비 온 뒤 주차장에 물이 24시간 이상 고입니다.",
    note: "구배가 없으면 물이 갈 곳을 못 찾는다",
    causes: [
      "포장 구배가 설계 기준(통상 1.5~2%)보다 낮게 시공됨",
      "배수구가 실제 저점이 아닌 곳에 배치됨",
      "준공 후 침하로 국부적인 저점이 생김",
    ],
    result:
      "물이 포장 아래로 스며들어 동결융해·이끼·악취를 만들고, 아스팔트와 줄눈을 먼저 망가뜨립니다.",
    solution: [
      "최소 1.5~2% 구배를 확보하고 저점에 배수구를 배치",
      "시공 전·후 물 테스트로 흐름을 확인",
      "침하 구간은 그라우팅·재포장으로 구배를 복구",
    ],
    photoMarker: { x: 38, y: 42 },
    evidence: {
      src: "/images/renewal/symptom-water.webp",
      alt: "주차선 사이 물웅덩이 예시 이미지",
      position: "50% 28%",
    },
  },
  {
    id: "clog",
    number: "02",
    title: "배수구 막힘",
    short: "배수구는 있는데 물이 안 빠짐",
    symptom: "배수구 주변에 낙엽·토사가 쌓이고, 비가 오면 물이 넘칩니다.",
    note: "낙엽·토사가 배수구 유효 면적을 막는다",
    causes: [
      "그레이트 유효 면적이 작거나 막힘",
      "낙엽·토사·공사 잔재 유입",
      "준공 후 청소·유지관리 부재",
    ],
    result:
      "집중호우 시 역류해 주차장이 침수되고, 넘친 물이 포장 하부를 침식합니다.",
    solution: [
      "유입 차단 필터와 그레이트 교체",
      "우기 전·후 정기 청소 계획 수립",
      "집수정 용량과 유입 구배 재검토",
    ],
    photoMarker: { x: 80, y: 42 },
    evidence: {
      src: "/images/renewal/symptom-drain.webp",
      alt: "낙엽으로 막힌 배수구 예시 이미지",
    },
  },
  {
    id: "pipe",
    number: "03",
    title: "관로 역구배·파손",
    short: "물이 빠지지 않고 악취가 올라옴",
    symptom: "배수구는 있는데 물이 빠지지 않고, 여름철 악취가 올라옵니다.",
    note: "관로가 올라가면 집수정까지 물이 차오른다",
    causes: [
      "관로 구배 부족 또는 역구배",
      "이음부 어긋남·파손",
      "토사·뿌리 유입으로 단면 축소",
    ],
    result:
      "관 내에 물이 상시 고이고, 동절기 동결 파손과 지반 침식으로 이어집니다.",
    solution: [
      "관로 구배와 이음부를 검측",
      "CCTV 조사 후 세척·보수",
      "손상 구간은 관로 교체 또는 라이닝",
    ],
    photoMarker: { x: 60, y: 48 },
    evidence: {
      src: "/images/renewal/section-ok.webp",
      alt: "자갈층에 묻힌 유공관 예시 이미지",
    },
  },
  {
    id: "compaction",
    number: "04",
    title: "지반 다짐 부족",
    short: "포장이 꺼지고 단차가 생김",
    symptom: "포장이 꺼지고, 맨홀·입구 주변에 단차가 생깁니다.",
    note: "다짐이 부족하면 층이 갈라지고 꺼진다",
    causes: [
      "되메우기 층 두께가 과다",
      "다짐도가 설계 기준에 미달",
      "연약지반·지하수 처리 미흡",
    ],
    result:
      "부등침하로 포장이 갈라지고, 배수 구배가 역전되어 물이 고입니다.",
    solution: [
      "층당 20~30cm 이내로 나눠 다짐",
      "다짐도 95% 이상을 현장에서 확인",
      "연약지반은 치환·지반개량으로 보강",
    ],
    photoMarker: { x: 70, y: 63 },
    evidence: {
      src: "/images/renewal/section-layers.webp",
      alt: "아스팔트와 자갈·토사층이 보이는 포장 단면 예시 이미지",
    },
  },
  {
    id: "joint",
    number: "05",
    title: "줄눈·이음부",
    short: "틈으로 물이 들어가는 시작점",
    symptom: "포장 줄눈이 벌어지고, 그 틈으로 물이 스며듭니다.",
    note: "줄눈 틈으로 물이 바로 밑으로 내려간다",
    causes: [
      "줄눈 간격·깊이 부족",
      "실링재 열화·탈락",
      "시공 이음부 처리 미흡",
    ],
    result:
      "물이 하부로 침투해 지지력을 떨어뜨리고, 균열·패임으로 확대됩니다.",
    solution: [
      "줄눈 간격·깊이 기준 준수",
      "노후 실링재 제거 후 재시공",
      "이음부 다짐과 접합 상태 확인",
    ],
    photoMarker: { x: 46, y: 51 },
    evidence: {
      src: "/images/renewal/symptom-crack.webp",
      alt: "갈라지고 잡초가 난 포장 줄눈 예시 이미지",
    },
  },
];

export const DIAGNOSIS_GROUPS = [
  {
    id: "water",
    title: "비 온 뒤 물이 고인다",
    desc: "구배·배수구·관로 중 어디에서 막혔는지부터 확인합니다.",
    target: "slope" as DiagnosisId,
  },
  {
    id: "crack",
    title: "보도블럭이 꺼지고 들뜬다",
    desc: "밑이 비거나 다짐이 부족하면 블록이 주저앉습니다.",
    target: "compaction" as DiagnosisId,
  },
  {
    id: "smell",
    title: "배수구에서 냄새·이끼가 생긴다",
    desc: "고인 물과 관로 역구배가 원인인 경우가 많습니다.",
    target: "pipe" as DiagnosisId,
  },
  {
    id: "leak",
    title: "지하주차장 천장에서 물이 샌다",
    desc: "균열과 방수층 파손은 위에서 아래로 이어집니다.",
    target: "pipe" as DiagnosisId,
  },
];
