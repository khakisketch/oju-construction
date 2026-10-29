"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
  type MotionStyle,
} from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import styles from "./BeforeAfterSlider.module.css";

interface BeforeAfterSliderProps {
  imageBefore: string;
  imageAfter: string;
  title: string;
  className?: string;
  /** 프레임 비율. 기본 세로형이며, 호출부에서 반응형으로 덮어쓸 수 있습니다. */
  frameClassName?: string;
  /** 두 비교 이미지의 object-position 추가 클래스 (크롭 위치 조정용). */
  imagePositionClassName?: string;
  /** example이면서 이미지 위 배지를 숨깁니다 (주변에 별도 안내가 있을 때 중복 방지). */
  hideExampleBadge?: boolean;
  sizes?: string;
  example?: boolean;
  exampleCaption?: string;
  priority?: boolean;
  /** Scroll-linked position for the home showcase; omitted on manually controlled pages. */
  scrollPosition?: MotionValue<number>;
  /** Keep the step buttons on manual portfolio/detail sliders, but omit them on home. */
  showStepButtons?: boolean;
  /** Lock the divider when reduced motion requires a fixed comparison. */
  manualControlEnabled?: boolean;
  /** Fires with the rounded divider position (0-100) on scroll-sync and manual moves. */
  onPositionChange?: (value: number) => void;
  /** Optional labels and manual-input callback for a specific comparison. */
  beforeLabel?: string;
  afterLabel?: string;
  exampleBadge?: string;
  controlLabel?: string;
  onManualChange?: (value: number) => void;
}

function SyncScrollPosition({
  source,
  target,
}: {
  source: MotionValue<number>;
  target: MotionValue<number>;
}) {
  const syncPosition = useCallback((value: number) => target.set(value), [target]);

  useMotionValueEvent(source, "change", syncPosition);
  useEffect(() => {
    syncPosition(source.get());
  }, [source, syncPosition]);

  return null;
}

function SliderRange({
  id,
  position,
  onPositionChange,
  disabled,
  className,
  beforeLabel,
  afterLabel,
}: {
  id: string;
  position: MotionValue<number>;
  onPositionChange: (value: number) => void;
  disabled: boolean;
  className: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const [value, setValue] = useState(Math.round(position.get()));
  const syncValue = useCallback((nextValue: number) => setValue(Math.round(nextValue)), []);

  useMotionValueEvent(position, "change", syncValue);
  useEffect(() => {
    syncValue(position.get());
  }, [position, syncValue]);

  return (
    <input
      id={id}
      type="range"
      min="0"
      max="100"
      value={value}
      aria-valuetext={`${beforeLabel} ${value}%, ${afterLabel} ${100 - value}%`}
      className={className}
      disabled={disabled}
      onChange={(event) => {
        const nextValue = Number(event.currentTarget.value);
        setValue(nextValue);
        onPositionChange(nextValue);
      }}
    />
  );
}

export default function BeforeAfterSlider({
  imageBefore,
  imageAfter,
  title,
  className = "",
  frameClassName = "aspect-[3/4]",
  imagePositionClassName = "",
  hideExampleBadge = false,
  sizes = "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 560px",
  example = false,
  exampleCaption = "예시 이미지 · AI 생성 목업 · 실제 시공 사진으로 교체됩니다",
  priority = false,
  scrollPosition,
  showStepButtons = true,
  manualControlEnabled = true,
  onPositionChange,
  beforeLabel = "BEFORE · 시공 전",
  afterLabel = "AFTER · 시공 후",
  exampleBadge = "예시 이미지",
  controlLabel,
  onManualChange,
}: BeforeAfterSliderProps) {
  const inputId = `comparison-${useId()}`;
  const activePosition = useMotionValue(50);
  const [position, setPosition] = useState(50);
  const comparisonStyle = {
    "--comparison-position": useTransform(activePosition, (value) => `${value}%`),
  } as MotionStyle;
  const handlePositionChange = useCallback((value: number) => {
    onManualChange?.(value);
    activePosition.set(value);
  }, [activePosition, onManualChange]);
  const syncButtonPosition = useCallback((value: number) => {
    if (showStepButtons) setPosition(Math.round(value));
  }, [showStepButtons]);

  useMotionValueEvent(activePosition, "change", syncButtonPosition);

  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;
  useMotionValueEvent(activePosition, "change", (value) => {
    onPositionChangeRef.current?.(Math.round(value));
  });

  const moveDivider = (direction: -1 | 1) => {
    const nextPosition = Math.min(100, Math.max(0, activePosition.get() + direction * 15));
    // Route through the manual path so scroll-linked parents (renewal-b)
    // treat step buttons as user input; parents without onManualChange
    // (home, portfolio detail) behave exactly as before.
    handlePositionChange(nextPosition);
  };

  return (
    <div className={className}>
      {scrollPosition && <SyncScrollPosition source={scrollPosition} target={activePosition} />}
      <motion.div
        data-scroll-linked={scrollPosition ? "true" : undefined}
        className={`${styles.frame} relative isolate ${frameClassName} w-full overflow-hidden rounded-xl bg-gray-200`}
        style={comparisonStyle}
      >
        <Image
          src={imageAfter}
          alt=""
          aria-hidden="true"
          fill
          priority={priority}
          sizes={sizes}
          className={`pointer-events-none select-none object-cover ${imagePositionClassName}`}
          draggable={false}
        />
        <div className={styles.beforeImage}>
          <Image
            src={imageBefore}
            alt=""
            aria-hidden="true"
            fill
            priority={priority}
            sizes={sizes}
            className={`pointer-events-none select-none object-cover ${imagePositionClassName}`}
            draggable={false}
          />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded bg-black/70 px-2.5 py-1.5 text-[11px] font-bold tracking-wide text-white sm:left-4 sm:top-4 sm:text-xs">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 z-10 rounded bg-black/70 px-2.5 py-1.5 text-[11px] font-bold tracking-wide text-white sm:right-4 sm:top-4 sm:text-xs">
          {afterLabel}
        </span>

        <SliderRange
          id={inputId}
          position={activePosition}
          onPositionChange={handlePositionChange}
          disabled={!manualControlEnabled}
          className={styles.range}
          beforeLabel={beforeLabel === "BEFORE · 시공 전" ? "시공 전" : beforeLabel}
          afterLabel={afterLabel === "AFTER · 시공 후" ? "시공 후" : afterLabel}
        />

        <div className={styles.divider} aria-hidden="true">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-brand-700 text-white shadow-lg">
            <ChevronLeft className="-mr-1 h-4 w-4" strokeWidth={2.5} />
            <ChevronRight className="-ml-1 h-4 w-4" strokeWidth={2.5} />
          </span>
        </div>

        {example && !hideExampleBadge && (
          <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded bg-black/75 px-2.5 py-1.5 text-xs font-semibold text-white sm:bottom-4 sm:left-4">
            {exampleBadge}
          </span>
        )}
        <span className="sr-only">
          {manualControlEnabled
            ? "왼쪽 또는 오른쪽 화살표 키로 비교 경계를 조절할 수 있습니다."
            : "시공 전과 시공 후 이미지가 절반씩 표시됩니다."}
        </span>
      </motion.div>
      <label htmlFor={inputId} className="sr-only">
        {controlLabel ?? `${title} 시공 전·후 비교 조절`}
      </label>
      {showStepButtons && (
        <div className="mt-3 grid grid-cols-2 gap-3" role="group" aria-label="비교 이미지 보기 조절">
          <button
            type="button"
            aria-label="시공 전 이미지를 더 보기"
            disabled={position === 100}
            onClick={() => moveDivider(1)}
            className="inline-flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-brand-200 bg-white px-2 py-2 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4"
          >
            <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>시공 전 보기</span>
          </button>
          <button
            type="button"
            aria-label="시공 후 이미지를 더 보기"
            disabled={position === 0}
            onClick={() => moveDivider(-1)}
            className="inline-flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-brand-200 bg-white px-2 py-2 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4"
          >
            <span>시공 후 보기</span>
            <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      )}
      {example && exampleCaption && (
        <p className="mt-2 text-xs leading-5 text-gray-600">
          {exampleCaption}
        </p>
      )}
    </div>
  );
}
