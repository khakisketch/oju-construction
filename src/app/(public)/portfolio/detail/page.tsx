"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, Building2, CalendarDays, Clock3, MapPin, Ruler } from "lucide-react";
import { db } from "@/shared/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/shared/config/env";
import BeforeAfterSlider from "@/features/home/portfolio/BeforeAfterSlider";
import { portfolioExample, SAMPLE_PORTFOLIO_ID, type PortfolioItem } from "@/features/home/portfolio/portfolioData";

function getPortfolioImages(project: PortfolioItem) {
  const currentImages = Array.isArray(project.images) ? project.images : [];
  const legacyImage = project.image ? [project.image] : [];
  return Array.from(new Set([...currentImages, ...legacyImage].filter(Boolean)));
}

function getTradeLabel(project: PortfolioItem) {
  if (project.trade?.trim()) return project.trade;
  if (project.category === "construction") return "건설";
  return project.category || "";
}

function DetailField({ label, value, icon: Icon }: { label: string; value?: string; icon: typeof Building2 }) {
  if (!value?.trim()) return null;
  return (
    <div className="border-b border-gray-200 py-4">
      <dt className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1.5 break-words font-semibold whitespace-pre-wrap text-gray-900">{value}</dd>
    </div>
  );
}

export default function PortfolioDetailPage() {
  const [projectId, setProjectId] = useState("");
  const [queryReady, setQueryReady] = useState(false);
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [isExampleProject, setIsExampleProject] = useState(false);
  const [status, setStatus] = useState<"loading" | "success" | "unavailable" | "not-found" | "unpublished" | "error">("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    setProjectId(new URLSearchParams(window.location.search).get("id") || "");
    setQueryReady(true);
  }, []);

  useEffect(() => {
    if (!queryReady) return;
    if (!projectId) {
      setProject(null);
      setIsExampleProject(false);
      setStatus("not-found");
      return;
    }
    if (!isFirebaseConfigured) {
      if (projectId === SAMPLE_PORTFOLIO_ID) {
        setProject(portfolioExample);
        setIsExampleProject(true);
        setStatus("success");
      } else {
        setProject(null);
        setIsExampleProject(false);
        setStatus("unavailable");
      }
      return;
    }

    let isMounted = true;
    setStatus("loading");
    const fetchProject = async () => {
      try {
        const snapshot = await getDoc(doc(db, "portfolio", projectId));
        if (!isMounted) return;
        if (!snapshot.exists()) {
          if (projectId === SAMPLE_PORTFOLIO_ID) {
            setProject(portfolioExample);
            setIsExampleProject(true);
            setStatus("success");
          } else {
            setProject(null);
            setIsExampleProject(false);
            setStatus("not-found");
          }
          return;
        }
        const data = { id: snapshot.id, ...snapshot.data() } as PortfolioItem;
        if (data.published === false) {
          if (isMounted) {
            setProject(null);
            setIsExampleProject(false);
            setStatus("unpublished");
          }
          return;
        }
        setProject(data);
        setIsExampleProject(false);
        setStatus("success");
      } catch {
        if (isMounted) setStatus("error");
      }
    };

    void fetchProject();
    return () => {
      isMounted = false;
    };
  }, [projectId, queryReady, loadAttempt]);

  const images = project ? getPortfolioImages(project) : [];
  const trade = project ? getTradeLabel(project) : "";
  const hasComparison = Boolean(project?.imageBefore && project.imageAfter);
  const singleComparisonImage = project?.imageBefore || project?.imageAfter;

  // 시공 정보가 없는 예시 항목은 비교 영역을 가운데 정렬해 빈 공간이 남지 않게 합니다.
  const hasProjectDetails = Boolean(
    trade ||
      project?.location ||
      project?.scope ||
      project?.scale ||
      project?.duration ||
      project?.year ||
      project?.client ||
      project?.clientType ||
      project?.result
  );

  return (
    <main className="min-h-screen bg-white pb-16 pt-24 md:pb-24 md:pt-32">
      <div className="container mx-auto px-4 md:px-6">
        <nav aria-label="현재 위치" className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-700">홈</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link href="/portfolio" className="hover:text-brand-700">시공실적</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span className="font-medium text-gray-900">상세 정보</span>
        </nav>

        {status === "loading" ? (
          <p role="status" className="border-y border-gray-200 py-12 text-center text-gray-600">시공실적 정보를 불러오고 있습니다.</p>
        ) : status !== "success" || !project ? (
          <div className="border-y border-gray-200 py-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              {status === "error"
                ? "시공실적 정보를 불러오지 못했습니다."
                : status === "unavailable"
                  ? "현재 확인할 수 있는 시공실적 자료가 없습니다."
                  : status === "unpublished"
                    ? "공개되지 않은 시공사례입니다."
                    : "요청한 시공실적을 찾을 수 없습니다."}
            </h1>
            {status === "error" && (
              <button
                type="button"
                onClick={() => setLoadAttempt((attempt) => attempt + 1)}
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
              >
                다시 시도
              </button>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/portfolio"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-brand-700 px-4 font-semibold text-brand-700 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 시공실적 목록
              </Link>
              <Link
                href="/#contact"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-700 px-4 font-semibold text-white hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
              >
                입찰·협력 문의
              </Link>
            </div>
          </div>
        ) : (
          <article>
            <header className="mb-8 border-b border-gray-200 pb-6 md:mb-10 md:pb-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {isExampleProject && (
                  <span className="rounded bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">예시 이미지 · 실제 시공 실적 아님</span>
                )}
                {trade && <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">{trade}</span>}
                {project.year && <span className="text-sm font-medium tabular-nums text-gray-500">{project.year}</span>}
              </div>
              <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-4xl">{project.title}</h1>
              {project.description && <p className="mt-4 max-w-3xl whitespace-pre-wrap leading-7 text-gray-600">{project.description}</p>}
            </header>

            {hasComparison && (
              <section aria-labelledby="portfolio-comparison-heading" className="mb-10">
                <h2 id="portfolio-comparison-heading" className="mb-4 text-xl font-bold text-gray-900">시공 전·후 비교</h2>
                <BeforeAfterSlider
                  imageBefore={project.imageBefore!}
                  imageAfter={project.imageAfter!}
                  title={project.title}
                  example={isExampleProject}
                  priority
                  className={`w-full max-w-[34rem]${hasProjectDetails ? "" : " mx-auto"}`}
                />
              </section>
            )}

            {!hasComparison && singleComparisonImage && (
              <section aria-label="시공 전·후 사진" className="mb-10 max-w-2xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={singleComparisonImage}
                    alt={`${project.title} ${project.imageBefore ? "시공 전" : "시공 후"} 사진`}
                    fill
                    sizes="(max-width: 767px) 100vw, 672px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded bg-black/75 px-2.5 py-1.5 text-sm font-semibold text-white">
                    {project.imageBefore ? "BEFORE · 시공 전" : "AFTER · 시공 후"}
                  </span>
                </div>
                {isExampleProject && <p className="mt-2 text-xs text-gray-600">예시 이미지 · 실제 시공 사진으로 교체됩니다</p>}
              </section>
            )}

            {images.length > 0 && (
              <section aria-label="현장 사진" className="mb-10 grid gap-4 sm:grid-cols-2">
                {images.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={image}
                      alt={`${project.title} 현장 사진 ${index + 1}`}
                      fill
                      sizes="(max-width: 639px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </section>
            )}

            {project.videoUrl?.trim() && (
              <section aria-labelledby="portfolio-video-heading" className="mb-10">
                <h2 id="portfolio-video-heading" className="mb-4 text-xl font-bold text-gray-900">작업 영상</h2>
                <video
                  src={project.videoUrl}
                  controls
                  playsInline
                  preload="none"
                  poster={project.videoPoster?.trim() || undefined}
                  className="aspect-video w-full max-w-3xl rounded-xl bg-black"
                />
              </section>
            )}

            {hasProjectDetails && (
              <section aria-label="시공 정보" className="grid gap-x-8 sm:grid-cols-2">
                <dl>
                  <DetailField label="공종" value={trade} icon={Building2} />
                  <DetailField label="위치" value={project.location} icon={MapPin} />
                  <DetailField label="시공 범위" value={project.scope || project.scale} icon={Ruler} />
                </dl>
                <dl>
                  <DetailField label="기간" value={project.duration} icon={Clock3} />
                  <DetailField label="준공연도" value={project.year} icon={CalendarDays} />
                  <DetailField label="발주처" value={project.client} icon={Building2} />
                  <DetailField label="발주처 유형" value={project.clientType} icon={Building2} />
                  <DetailField label="확인된 결과" value={project.result} icon={Building2} />
                </dl>
              </section>
            )}

            <div className="mt-10 flex flex-wrap gap-3 border-t border-gray-200 pt-6">
              <Link
                href="/portfolio"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 전체 시공실적
              </Link>
              <Link
                href="/#contact"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-700 px-4 font-semibold text-white hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
              >
                입찰·협력 문의
              </Link>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
