import Image from "next/image";
import { ArrowRight } from "lucide-react";
import homeStyles from "../HomeSections.module.css";
import {
  FEATURED_FIELD_PROBLEM_ID,
  type CaseResolution,
  type FieldProblemId,
} from "./fieldProblems";
import {
  DEMO_NOTICE,
  SOURCE_LICENSE_NOTE,
  getFieldWorkDemo,
} from "./fieldWorkMedia";
import { FieldWorkVideo } from "./FieldWorkVideo";

interface FieldWorkShowcaseProps {
  cases?: CaseResolution;
  featuredId?: FieldProblemId;
}

const hubLinkClassName =
  "inline-flex min-h-[44px] items-center gap-1.5 text-base font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2";

export function FieldWorkShowcase({
  cases = {},
  featuredId = FEATURED_FIELD_PROBLEM_ID,
}: FieldWorkShowcaseProps) {
  const demo = getFieldWorkDemo(featuredId);
  const record = cases[featuredId] ?? null;
  const recordClientType = record?.clientType?.trim() ?? "";
  const recordResult = record?.result?.trim() ?? "";
  const recordExcerpt = recordResult || record?.excerpt || "";

  return (
    <div className="mx-auto grid w-full max-w-[64rem] grid-cols-1 items-start gap-6 md:grid-cols-[16.5rem_minmax(0,1fr)] md:grid-rows-[auto_minmax(0,1fr)] md:gap-x-8 md:gap-y-6 md:[grid-template-areas:'intro_media'_'actions_media'] lg:grid-cols-[minmax(15rem,17.5rem)_minmax(0,40rem)] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:[grid-template-areas:'intro_media'_'actions_media']">
      <div className="min-w-0 md:[grid-area:intro]">
        <header data-home-section-heading>
          <h2
            id="field-problems-heading"
            className={`${homeStyles.title} [text-wrap:balance] [word-break:keep-all]`}
          >
            주차장·진입로 포장 보수
          </h2>
        </header>
        {!record && (
          <ol
            aria-label="작업 순서 예시"
            className="mt-5 hidden space-y-2 md:block"
          >
            {demo.steps.map((step, index) => (
              <li key={step.title} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-900 text-[13px] font-bold tabular-nums text-white"
                >
                  {index + 1}
                </span>
                <span className="text-base font-semibold leading-7 text-gray-700">
                  {step.title}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="min-w-0 md:[grid-area:media]">
        {record ? (
          <figure>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={record.image}
                alt={`${record.title} 현장 사진`}
                fill
                sizes="(max-width: 1279px) 100vw, 66vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <figcaption className="mt-2 md:mt-3">
              <p className="font-bold leading-7 text-gray-900">
                {record.title}
              </p>
              {recordClientType && (
                <p className="mt-1 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {recordClientType}
                </p>
              )}
              {recordExcerpt && (
                <p className="mt-1 line-clamp-2 text-base leading-relaxed text-gray-600">
                  {recordExcerpt}
                </p>
              )}
            </figcaption>
          </figure>
        ) : (
          <figure className="w-full max-w-[40rem]">
            <FieldWorkVideo key={demo.videoSrc} demo={demo} />
            <figcaption className="mt-2 md:mt-3">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <p className="text-base font-semibold text-gray-900">
                  {demo.caption}
                  <span className="ml-2 font-normal tabular-nums text-gray-500">
                    {demo.durationLabel}
                  </span>
                </p>
                <details className="text-sm leading-6 text-gray-600">
                  <summary className="inline-flex min-h-[44px] cursor-pointer items-center font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2">
                    영상 출처
                  </summary>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {demo.credit} · {SOURCE_LICENSE_NOTE}
                  </p>
                </details>
              </div>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {DEMO_NOTICE}
              </p>
            </figcaption>
          </figure>
        )}
      </div>

      <div className="min-w-0 self-start md:[grid-area:actions]">
        <p className="text-base leading-7 text-gray-600">
          방수·도장·조경·유지보수 시공 문의도 받습니다
        </p>
        <div className="flex flex-row flex-wrap items-center gap-x-3">
          <a href="/portfolio" className={hubLinkClassName}>
            다른 현장 사례
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href="/construction" className={hubLinkClassName}>
            전체 사업분야 보기
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
