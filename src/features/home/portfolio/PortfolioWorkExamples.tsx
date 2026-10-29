"use client";

import { useRef, type SyntheticEvent } from "react";
import {
  DEMO_NOTICE,
  FIELD_WORK_DEMOS,
  SOURCE_LICENSE_NOTE,
} from "../problems/fieldWorkMedia";
import { FieldWorkVideo } from "../problems/FieldWorkVideo";

/**
 * 시공실적 허브의 참고 영상 모음. 실제 Firestore 기록이 없을 때만
 * PortfolioSection 페이지 분기에서 예시 카드 뒤에 노출됩니다.
 * 자사 시공 실적이 아니라 시안용 참고 영상이므로 실증으로 쓰지 않습니다.
 */
export function PortfolioWorkExamples() {
  const rootRef = useRef<HTMLDivElement>(null);

  const pauseOthers = (event: SyntheticEvent) => {
    const root = rootRef.current;
    const playing = event.target;
    if (!root || !(playing instanceof HTMLVideoElement)) return;
    root.querySelectorAll("video").forEach((video) => {
      if (video !== playing) video.pause();
    });
  };

  return (
    <section
      aria-labelledby="portfolio-work-examples-heading"
      className="mt-10 md:mt-12"
    >
      <h2
        id="portfolio-work-examples-heading"
        className="text-2xl font-bold tracking-tight text-brand-900"
      >
        작업 영상 예시
      </h2>
      <p className="mt-2 text-base leading-7 text-gray-600">
        사진과 함께 참고할 수 있는 작업 영상을 모아 두었습니다.
      </p>
      <div
        ref={rootRef}
        onPlayCapture={pauseOthers}
        className="mt-6 grid gap-8 md:grid-cols-2 md:gap-6 lg:gap-8"
      >
        {FIELD_WORK_DEMOS.map((demo) => (
          <figure key={demo.problemId} className="min-w-0">
            <FieldWorkVideo key={demo.videoSrc} demo={demo} />
            <figcaption className="mt-3">
              <p className="text-base font-semibold text-gray-900">
                {demo.caption}
                <span className="ml-2 font-normal tabular-nums text-gray-500">
                  {demo.durationLabel}
                </span>
              </p>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {DEMO_NOTICE}
              </p>
              <details className="mt-1 text-sm leading-6 text-gray-600">
                <summary className="inline-flex min-h-[44px] cursor-pointer items-center font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2">
                  영상 출처
                </summary>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {demo.credit} · {SOURCE_LICENSE_NOTE}
                </p>
              </details>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
