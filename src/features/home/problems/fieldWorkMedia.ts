import type { FieldProblemId } from "./fieldProblems";

export interface FieldWorkDemo {
  problemId: FieldProblemId;
  /** 자사 현장이 아닌 시안용 참고 영상·포스터. 실제 증빙으로 사용하지 않습니다. */
  videoSrc: string;
  posterSrc: string;
  durationLabel: string;
  caption: string;
  credit: string;
  steps: Array<{ title: string; detail: string }>;
}

/**
 * Pexels 라이선스(https://www.pexels.com/license/) 확인 자료.
 * 무료 상업용 웹사이트 사용·수정 가능, 표기 의무 없음, 지지·보증 암시 금지.
 * 런타임 외부 CDN을 쓰지 않고 아래 파일을 자체 호스팅합니다.
 *
 * 포장: Tom Shamberger, "Asphalt paver laying asphalt on road"
 * https://www.pexels.com/video/asphalt-paver-laying-asphalt-on-road-9836134/
 * 원본 CDN https://videos.pexels.com/video-files/9836134/9836134-hd_1920_1080_30fps.mp4
 * (산악 도로 아스팔트 포장 장면. 아파트 현장·오주건설 시공이 아님)
 * → 포장 정리: Tom Shamberger, "Road asphalt laying process in suburban neighborhood"
 * https://www.pexels.com/video/road-asphalt-laying-process-in-suburban-neighborhood-35402377/
 * 원본 CDN https://videos.pexels.com/video-files/35402377/14999429_1280_720_30fps.mp4
 * (주거지 도로 포장면 절삭·정리 장면. 메타데이터는 포장으로 표기하나
 * 실제 영상은 매끈한 신규 포장이 아닌 정리 작업이며,
 * 아파트 현장·오주건설 시공이 아님)
 *
 * 토목·보수: K, "Construction workers are working on a street"
 * https://www.pexels.com/video/construction-workers-are-working-on-a-street-19559835/
 * 원본 CDN https://videos.pexels.com/video-files/19559835/19559835-hd_1280_720_24fps.mp4
 * (도로 포장 파쇄·정리 장면. 배수관 시공 장면이 아님)
 */
export const FIELD_WORK_DEMOS: FieldWorkDemo[] = [
  {
    problemId: "paving",
    videoSrc: "/media/field-work/paving-preparation-demo.mp4",
    posterSrc: "/media/field-work/paving-preparation-poster.webp",
    durationLabel: "약 11초",
    caption: "포장면 정리 작업",
    credit: "영상: Pexels · Tom Shamberger",
    steps: [
      { title: "파손 구간 확인", detail: "파손·균열 구간 확인" },
      { title: "기존 포장면 정리", detail: "기존 포장면 정리" },
      { title: "포장 보수·마감", detail: "포장 보수·마감" },
    ],
  },
  {
    problemId: "drainage",
    videoSrc: "/media/field-work/civil-demo.mp4",
    posterSrc: "/media/field-work/civil-poster.webp",
    durationLabel: "약 20초",
    caption: "도로 보수 작업 참고 영상",
    credit: "영상: Pexels · K",
    steps: [
      { title: "현장 확인", detail: "배수 상태·구간 확인" },
      { title: "시공 작업", detail: "파손 구간 보수·정비" },
      { title: "마무리 확인", detail: "통수·마무리 확인" },
    ],
  },
];

/** 시안용 참고 표시. 데모 영상과 일반적인 작업 순서 예시에 적용됩니다. */
export const DEMO_NOTICE = "시안용 참고 영상 · 실제 오주건설 현장이 아닙니다";
export const STEPS_NOTE = "일반적인 작업 순서 예시입니다";
/** 영상 출처 펼침에 쓰는 라이선스 한 줄. 귀속 의무는 없으나 출처를 밝힌다. */
export const SOURCE_LICENSE_NOTE =
  "Pexels 라이선스 · 무료 상업용 사용 및 수정 가능";

export function getFieldWorkDemo(problemId: FieldProblemId): FieldWorkDemo {
  const demo = FIELD_WORK_DEMOS.find((entry) => entry.problemId === problemId);
  if (!demo) throw new Error(`Unknown field problem: ${problemId}`);
  return demo;
}
