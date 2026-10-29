"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMotionValue, useReducedMotion, type MotionValue } from "framer-motion";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { db } from "@/shared/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/shared/config/env";
import BeforeAfterSlider from "./BeforeAfterSlider";
import sliderStyles from "./BeforeAfterSlider.module.css";
import homeStyles from "../HomeSections.module.css";
import { PortfolioWorkExamples } from "./PortfolioWorkExamples";
import {
  portfolioExample,
  portfolioExampleHeroImage,
  type PortfolioItem,
} from "./portfolioData";
import {
  EMPTY_PORTFOLIO_FILTER,
  filterProjects,
  getClientTypeOptions,
  getTradeOptions,
  isPublishedProject,
  type PortfolioFilter,
} from "./portfolioFilters";

interface PortfolioSectionProps {
  view?: "home" | "page";
}

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

function getProjectScope(project: PortfolioItem) {
  return project.scope?.trim() || project.scale?.trim() || "";
}

const homeExampleSliderProps = {
  imageBefore: portfolioExample.imageBefore!,
  imageAfter: portfolioExample.imageAfter!,
  title: portfolioExample.title,
  example: true,
  exampleCaption: "",
  frameClassName: sliderStyles.homeExampleFrame,
  imagePositionClassName: "object-[50%_60%]",
  hideExampleBadge: true,
  sizes: "(max-width: 767px) calc(100vw - 32px), (max-width: 1279px) calc(100vw - 48px), 1280px",
  className: "w-full",
};

function HomeExampleContent({
  header,
  scrollPosition,
  reducedMotion = false,
}: {
  header: ReactNode;
  scrollPosition?: MotionValue<number>;
  reducedMotion?: boolean;
}) {
  return (
    <div className={`${sliderStyles.homeExampleContent} w-full`}>
      {header}
      <BeforeAfterSlider
        {...homeExampleSliderProps}
        scrollPosition={scrollPosition}
        showStepButtons={false}
        manualControlEnabled={!reducedMotion}
      />
      <div data-home-example-caption className="mt-3 flex flex-col gap-3 min-[380px]:flex-row min-[380px]:items-end min-[380px]:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-base font-medium text-gray-600">
            아파트 주차장
            <span className="inline-flex shrink-0 rounded bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
              예시
            </span>
          </p>
          <h3 className="mt-0.5 text-2xl font-bold leading-snug text-brand-900 md:text-3xl">
            포장 보수 사례
          </h3>
        </div>
        <Link
          href="/portfolio"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-brand-700 px-3 font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 sm:px-4"
        >
          다른 현장 사례 <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function ScrollDrivenHomeExampleSlider({ header }: { header: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinnedScreenRef = useRef<HTMLDivElement>(null);
  const comparisonPosition = useMotionValue(85);

  useEffect(() => {
    const track = trackRef.current;
    const pinnedScreen = pinnedScreenRef.current;
    if (!track || !pinnedScreen) return;

    let isInView = false;
    let animationFrame: number | null = null;

    const updatePosition = () => {
      animationFrame = null;
      const trackBounds = track.getBoundingClientRect();
      const trackTop = trackBounds.top + window.scrollY;
      // Keep fractional aspect-ratio/svh sizes so the divider finishes exactly
      // when CSS sticky releases, including on narrow mobile viewports.
      const trackHeight = trackBounds.height;
      const screenHeight = pinnedScreen.getBoundingClientRect().height;
      const stickyTop = Number.parseFloat(getComputedStyle(pinnedScreen).top) || 0;
      const start = trackTop - stickyTop;
      const end = trackTop + trackHeight - screenHeight - stickyTop;
      const travelDistance = Math.max(1, end - start);
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY - start) / travelDistance),
      );

      comparisonPosition.set(85 - progress * 70);
    };

    const scheduleUpdate = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(updatePosition);
    };

    const handleScroll = () => {
      if (isInView) scheduleUpdate();
    };

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          isInView = entry.isIntersecting;
          scheduleUpdate();
        });

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(scheduleUpdate);

    if (observer) observer.observe(track);
    else isInView = true;
    resizeObserver?.observe(track);
    resizeObserver?.observe(pinnedScreen);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.visualViewport?.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", scheduleUpdate);
      window.visualViewport?.removeEventListener("resize", scheduleUpdate);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, [comparisonPosition]);

  return (
    <div
      ref={trackRef}
      className={sliderStyles.scrollPinTrack}
      data-scroll-pinned="true"
    >
      <div
        ref={pinnedScreenRef}
        className={sliderStyles.scrollPinPanel}
        data-scroll-pinned="true"
      >
        <HomeExampleContent
          header={header}
          scrollPosition={comparisonPosition}
        />
      </div>
    </div>
  );
}

function HomeExampleSlider({ header }: { header: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (hasMounted && prefersReducedMotion) {
    return (
      <div className={sliderStyles.scrollPinPanel} data-scroll-pinned="true">
        <HomeExampleContent header={header} reducedMotion />
      </div>
    );
  }

  return <ScrollDrivenHomeExampleSlider header={header} />;
}

function ExamplePortfolio({ view, header }: { view: "home" | "page"; header?: ReactNode }) {
  if (view === "page") {
    return (
      <article className="grid max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white sm:grid-cols-[15rem_minmax(0,1fr)]">
        <Link
          href={`/portfolio/detail?id=${encodeURIComponent(portfolioExample.id)}`}
          aria-label="전·후 비교 예시 상세 보기"
          className="group relative block aspect-[3/2] overflow-hidden bg-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-700 sm:aspect-auto sm:min-h-64"
        >
          <Image
            src={portfolioExampleHeroImage}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 639px) 100vw, 240px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <span className="absolute left-3 top-3 rounded bg-black/75 px-2.5 py-1.5 text-xs font-semibold text-white">
            예시 이미지
          </span>
        </Link>
        <div className="flex flex-col items-start justify-center p-4 sm:p-5">
          <p className="text-xs font-semibold text-gray-600">실제 시공실적이 아닌 디자인 목업</p>
          <h2 className="mt-1.5 text-xl font-bold text-gray-900">{portfolioExample.title}</h2>
          <p className="mt-1.5 max-w-xl text-base leading-relaxed text-gray-600">
            시안용 AI 목업 이미지입니다. 실제 오주건설 시공 사진이나 실적이 아니며, 실제 자료가 등록되면 해당 정보가 표시됩니다.
          </p>
          <Link
            href={`/portfolio/detail?id=${encodeURIComponent(portfolioExample.id)}`}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-700 px-4 font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
          >
            전·후 비교 보기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <HomeExampleSlider header={header} />
  );
}

export default function PortfolioSection({ view = "page" }: PortfolioSectionProps) {
  const isHome = view === "home";
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [filter, setFilter] = useState<PortfolioFilter>(EMPTY_PORTFOLIO_FILTER);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setProjects([]);
      setIsLoading(false);
      setLoadError(false);
      return;
    }

    let isMounted = true;
    const fetchPortfolio = async () => {
      setIsLoading(true);
      setLoadError(false);
      try {
        const portfolioQuery = query(collection(db, "portfolio"), orderBy("createdAt", "desc"), limit(12));
        const snapshot = await getDocs(portfolioQuery);
        if (isMounted) {
          setProjects(snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          } as PortfolioItem)));
        }
      } catch {
        if (isMounted) setLoadError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void fetchPortfolio();
    return () => {
      isMounted = false;
    };
  }, [loadAttempt]);

  const publishedProjects = projects.filter(isPublishedProject);
  const tradeOptions = getTradeOptions(publishedProjects);
  const clientTypeOptions = getClientTypeOptions(publishedProjects);
  const filteredProjects = filterProjects(publishedProjects, filter);
  const hasActiveFilter = filter.trade !== "" || filter.clientType !== "" || filter.query.trim() !== "";
  // 필터 UI는 /portfolio 목록(view="page")에서 실데이터가 있을 때만 노출.
  const showFilters = !isHome && publishedProjects.length > 0;
  const visibleProjects = isHome ? publishedProjects.slice(0, 3) : filteredProjects;
  const Heading = isHome ? "h2" : "h1";
  const isHomeExample = isHome && !isLoading && !loadError && publishedProjects.length === 0;
  const sectionHeader = (
        <div data-portfolio-header className={isHome ? `${homeStyles.header} flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between` : "mb-7 md:mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"}>
          <div className="max-w-2xl">
            <Heading id="portfolio-heading" className={isHome ? homeStyles.title : "text-3xl font-bold tracking-tight text-brand-900 md:text-4xl"}>
              주요 시공실적
            </Heading>
            <p className={isHome ? homeStyles.description : "mt-2.5 leading-6 text-gray-600"}>
              {isHome
                ? "공종과 현장별 시공 정보를 확인하세요."
                : "공종·위치·시공 범위와 현장 사진을 살펴보세요."}
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600">
            <Building2 className="h-4 w-4 text-brand-700" aria-hidden="true" />
            시공 프로젝트
          </span>
        </div>
  );

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className={isHome ? `bg-white ${isHomeExample ? "" : "py-8 md:py-12"}` : "bg-white py-10 md:py-12"}
    >
      <div className="container mx-auto px-4 md:px-6">
        {!isHomeExample && sectionHeader}

        {isLoading ? (
          <p role="status" className="border-y border-gray-200 py-8 text-center text-base text-gray-600">
            시공실적을 불러오고 있습니다.
          </p>
        ) : loadError ? (
          <div role="alert" className="border-y border-gray-200 py-10 text-center">
            <p className="font-semibold text-gray-900">시공실적을 불러오지 못했습니다.</p>
            <button
              type="button"
              onClick={() => setLoadAttempt((attempt) => attempt + 1)}
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
            >
              다시 시도
            </button>
          </div>
        ) : publishedProjects.length === 0 ? (
          <>
            <ExamplePortfolio view={view === "home" ? "home" : "page"} header={sectionHeader} />
            {!isHome && <PortfolioWorkExamples />}
          </>
        ) : (
          <>
            {showFilters && (
              <div aria-label="시공사례 검색 조건" className="mb-6 grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3">
                {tradeOptions.length > 0 && (
                  <div>
                    <label htmlFor="portfolio-filter-trade" className="mb-1.5 block text-sm font-semibold text-brand-900">
                      공종
                    </label>
                    <select
                      id="portfolio-filter-trade"
                      value={filter.trade}
                      onChange={(event) => setFilter((previous) => ({ ...previous, trade: event.target.value }))}
                      className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-base text-gray-900 outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700"
                    >
                      <option value="">전체 공종</option>
                      {tradeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}
                {clientTypeOptions.length > 0 && (
                  <div>
                    <label htmlFor="portfolio-filter-client-type" className="mb-1.5 block text-sm font-semibold text-brand-900">
                      발주처 유형
                    </label>
                    <select
                      id="portfolio-filter-client-type"
                      value={filter.clientType}
                      onChange={(event) => setFilter((previous) => ({ ...previous, clientType: event.target.value }))}
                      className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-base text-gray-900 outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-700"
                    >
                      <option value="">전체 유형</option>
                      {clientTypeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label htmlFor="portfolio-filter-query" className="mb-1.5 block text-sm font-semibold text-brand-900">
                    검색
                  </label>
                  <input
                    id="portfolio-filter-query"
                    type="search"
                    value={filter.query}
                    onChange={(event) => setFilter((previous) => ({ ...previous, query: event.target.value }))}
                    placeholder="제목·위치·시공범위·결과 검색"
                    className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-base text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>
            )}
            {visibleProjects.length === 0 ? (
              <div className="border-y border-gray-200 py-10 text-center">
                <p className="text-base font-semibold text-gray-900">조건에 맞는 시공사례가 없습니다.</p>
                <button
                  type="button"
                  onClick={() => setFilter(EMPTY_PORTFOLIO_FILTER)}
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-700 px-5 font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
                >
                  전체 보기
                </button>
              </div>
            ) : (
            <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleProjects.map((project, index) => {
                const images = getPortfolioImages(project);
                const trade = getTradeLabel(project);
                const scope = getProjectScope(project);
                const clientType = project.clientType?.trim() || "";
                const result = project.result?.trim() || "";
                const coverImage = images[0] || project.imageAfter || project.imageBefore;
                const coverAlt = project.imageAfter && !images[0]
                  ? `${project.title} 시공 후 사진`
                  : `${project.title} 현장 사진`;

                return (
                  <article
                    key={project.id}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
                  >
                    <Link
                      href={`/portfolio/detail?id=${encodeURIComponent(project.id)}`}
                      aria-label={`${project.title} 상세 보기`}
                      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-700"
                    >
                      {coverImage && (
                        <div className="relative h-60 overflow-hidden bg-gray-100 md:h-64">
                          <Image
                            src={coverImage}
                            alt={coverAlt}
                            fill
                            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
                            <span className="font-semibold">{project.title}</span>
                            {images.length > 1 && (
                              <span className="shrink-0 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium">
                                사진 {images.length}장
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="p-5">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          {trade && (
                            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                              {trade}
                            </span>
                          )}
                          {clientType && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                              {clientType}
                            </span>
                          )}
                          {project.year && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium tabular-nums text-gray-500">{project.year}</span>
                          )}
                          {project.videoUrl?.trim() && (
                            <span className="rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold text-white">
                              작업 영상
                            </span>
                          )}
                        </div>
                        {!coverImage && <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>}
                        <div className="space-y-1.5 text-base leading-relaxed text-gray-600">
                          {project.location && (
                            <p className="flex items-start gap-1.5">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                              <span>{project.location}</span>
                            </p>
                          )}
                          {scope && <p className="line-clamp-2">{scope}</p>}
                          {result && <p className="line-clamp-2">{result}</p>}
                          {project.duration && <p>{project.duration}</p>}
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                          상세 정보 <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            {isHome && visibleProjects.length > 0 && (
              <div className="mt-9 text-center">
                <Link
                  href="/portfolio"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-brand-700 px-6 py-2.5 font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
                >
                  전체 시공실적 보기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
            </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
