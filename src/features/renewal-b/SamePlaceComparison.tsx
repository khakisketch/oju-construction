"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useReducedMotion } from "framer-motion";
import BeforeAfterSlider from "../home/portfolio/BeforeAfterSlider";
import styles from "./RenewalBDesign.module.css";

/** Divider extremes for the scroll-driven sweep (percent of "before" visible). */
export const COMPARISON_SCROLL_TOP = 75;
export const COMPARISON_SCROLL_BOTTOM = 25;
export const COMPARISON_SCROLL_RANGE =
  COMPARISON_SCROLL_TOP - COMPARISON_SCROLL_BOTTOM;

export const clampComparisonPercent = (value: number) =>
  Math.min(100, Math.max(0, value));

export const clampUnitProgress = (progress: number) =>
  Math.min(1, Math.max(0, progress));

/** Absolute scroll mapping: the top of the sticky travel shows 75, the end shows 25. */
export function comparisonBaseForProgress(progress: number) {
  return (
    COMPARISON_SCROLL_TOP -
    COMPARISON_SCROLL_RANGE * clampUnitProgress(progress)
  );
}

export function comparisonProgressForScroll(
  scrollY: number,
  start: number,
  distance: number,
) {
  return clampUnitProgress((scrollY - start) / Math.max(1, distance));
}

/**
 * Displayed divider = clamped absolute mapping + a fixed handoff offset.
 * The offset is rebased every time the demo hands control to scroll, so the
 * interrupting gesture continues from the live value instead of snapping
 * back to the absolute mapping.
 */
export function comparisonValueForScroll(
  scrollY: number,
  start: number,
  distance: number,
  offset: number,
) {
  return clampComparisonPercent(
    comparisonBaseForProgress(
      comparisonProgressForScroll(scrollY, start, distance),
    ) + offset,
  );
}

/** Offset that keeps `liveValue` continuous at `scrollY` under current geometry. */
export function comparisonOffsetForHandoff(
  liveValue: number,
  scrollY: number,
  start: number,
  distance: number,
) {
  return (
    liveValue -
    comparisonBaseForProgress(
      comparisonProgressForScroll(scrollY, start, distance),
    )
  );
}

/** Divider travel (points) caused by a `stepPx` scroll over `distance` travel. */
export function comparisonDeltaForScrollStep(stepPx: number, distance: number) {
  return (Math.abs(stepPx) / Math.max(1, distance)) * COMPARISON_SCROLL_RANGE;
}

/** Scroll and manual input share one divider; manual input wins while in view. */
export default function SamePlaceComparison() {
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const comparison = useMotionValue(COMPARISON_SCROLL_TOP);
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const manualOverride = useRef(false);
  const autoDone = useRef(false);
  const cancelDemoRef = useRef<(() => void) | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || prefersReducedMotion) return;
    const track = trackRef.current;
    const panel = panelRef.current;
    if (!track || !panel) return;

    let inView = false;
    let autoRunning = false;
    let demoGeneration = 0;
    let frame: number | null = null;
    let offset = 0;
    let controls: { stop: () => void } | null = null;

    const geometry = () => {
      const bounds = track.getBoundingClientRect();
      const top = bounds.top + window.scrollY;
      const stickyTop = Number.parseFloat(getComputedStyle(panel).top) || 0;
      const start = top - stickyTop;
      const distance = Math.max(1, top + bounds.height - panel.offsetHeight - stickyTop - start);
      return { start, distance };
    };

    const baseAt = (scrollY: number) => {
      const { start, distance } = geometry();
      return comparisonBaseForProgress(
        comparisonProgressForScroll(scrollY, start, distance),
      );
    };

    const removeCancelListeners = () => {
      window.removeEventListener("wheel", interruptDemo, true);
      window.removeEventListener("pointerdown", interruptDemo, true);
      window.removeEventListener("touchstart", interruptDemo, true);
      window.removeEventListener("keydown", interruptDemo, true);
    };

    /** Freeze the demo and absorb the live value into the offset (no jump). */
    const interruptDemo = () => {
      if (!autoRunning) return;
      demoGeneration += 1;
      controls?.stop();
      controls = null;
      autoRunning = false;
      offset = comparison.get() - baseAt(window.scrollY);
      removeCancelListeners();
    };
    cancelDemoRef.current = interruptDemo;

    const updatePosition = () => {
      frame = null;
      if (!inView || autoRunning || manualOverride.current) return;
      const { start, distance } = geometry();
      comparison.set(
        comparisonValueForScroll(window.scrollY, start, distance, offset),
      );
    };

    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updatePosition);
    };

    /** Geometry changed (resize/orientation): keep the live value, don't snap. */
    const handleGeometryChange = () => {
      if (inView && !autoRunning && !manualOverride.current) {
        offset = comparison.get() - baseAt(window.scrollY);
      }
      scheduleUpdate();
    };

    const handleScroll = () => {
      if (!inView) return;
      // Rebase at the new scroll position first, so this gesture continues
      // from the live divider value instead of snapping to the mapping.
      if (autoRunning) interruptDemo();
      scheduleUpdate();
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) {
        interruptDemo();
        manualOverride.current = false;
        offset = 0;
        return;
      }

      const { start, distance } = geometry();
      const progress = comparisonProgressForScroll(
        window.scrollY,
        start,
        distance,
      );
      if (!autoDone.current && progress < 0.1) {
        autoDone.current = true;
        autoRunning = true;
        offset = 0;
        comparison.set(COMPARISON_SCROLL_TOP);
        window.addEventListener("wheel", interruptDemo, true);
        window.addEventListener("pointerdown", interruptDemo, true);
        window.addEventListener("touchstart", interruptDemo, true);
        window.addEventListener("keydown", interruptDemo, true);
        const generation = demoGeneration;
        controls = animate(comparison, COMPARISON_SCROLL_BOTTOM, {
          duration: 1.9,
          ease: [0.16, 1, 0.3, 1],
          onComplete: () => {
            if (generation !== demoGeneration || !autoRunning) return;
            controls = animate(comparison, COMPARISON_SCROLL_TOP, {
              duration: 0.7,
              ease: "easeInOut",
              onComplete: () => {
                if (generation !== demoGeneration || !autoRunning) return;
                autoRunning = false;
                controls = null;
                removeCancelListeners();
                // Settle exactly onto the scroll mapping so the full travel
                // stays 75 -> 25 from here (adjustment is under 5 points).
                const settled = geometry();
                offset = 0;
                comparison.set(
                  comparisonValueForScroll(
                    window.scrollY,
                    settled.start,
                    settled.distance,
                    offset,
                  ),
                );
              },
            });
          },
        });
      } else {
        autoDone.current = true;
        scheduleUpdate();
      }
    }, { threshold: 0 });

    const resizeObserver = new ResizeObserver(handleGeometryChange);
    observer.observe(track);
    resizeObserver.observe(track);
    resizeObserver.observe(panel);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleGeometryChange);
    window.visualViewport?.addEventListener("resize", handleGeometryChange);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      demoGeneration += 1;
      controls?.stop();
      removeCancelListeners();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleGeometryChange);
      window.visualViewport?.removeEventListener("resize", handleGeometryChange);
      if (frame !== null) window.cancelAnimationFrame(frame);
      cancelDemoRef.current = null;
    };
  }, [comparison, mounted, prefersReducedMotion]);

  const handleManualChange = (value: number) => {
    cancelDemoRef.current?.();
    manualOverride.current = true;
    comparison.set(value);
  };

  const scrollLinked = mounted && !prefersReducedMotion;

  return (
    <div ref={trackRef} className={styles.compareTrack}>
      <div ref={panelRef} className={styles.compareSticky}>
        <div className={styles.compareIntro}>
          <div>
            <h2 className={styles.compareTitle}>같은 공간, 달라지는 바닥</h2>
            <p className={styles.compareDescription}>움직여서 문제 상황과 개선된 모습을 비교해 보세요.</p>
          </div>
          <p className={styles.compareDisclosure}>AI로 만든 예시 · 오주건설의 실제 시공 실적이 아닙니다.</p>
        </div>
        <BeforeAfterSlider
          imageBefore="/images/renewal/same-before.webp"
          imageAfter="/images/renewal/same-after.webp"
          title="문제 상황과 개선 예시"
          controlLabel="문제 상황과 개선 예시 비교 조절"
          beforeLabel="문제 상황 예시"
          afterLabel="개선 모습 예시"
          exampleBadge="AI 이미지 · 실제 시공 사진 아님"
          className={styles.compareStage}
          frameClassName={styles.comparePhoto}
          imagePositionClassName="object-[50%_58%]"
          sizes="(max-width: 767px) 100vw, 1280px"
          example
          exampleCaption=""
          showStepButtons={false}
          scrollPosition={scrollLinked ? comparison : undefined}
          onManualChange={handleManualChange}
        />
        <div className={styles.compareBottom}>
          <span>좌우로 움직여 비교하세요. 키보드 방향키로도 조절할 수 있습니다.</span>
          <a href="#cross-section">어디를 살펴볼까요? ↓</a>
        </div>
      </div>
    </div>
  );
}
