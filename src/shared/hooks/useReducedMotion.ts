"use client";

import { useState, useEffect } from "react";

/**
 * prefers-reduced-motion 미디어 쿼리를 감지하는 훅
 * 사용자가 시스템 설정에서 모션 줄이기를 활성화했는지 확인
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * 모바일 여부를 감지하는 훅
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * 모션 설정을 최적화하는 훅
 * prefers-reduced-motion이 활성화되어 있거나 모바일이면 애니메이션 감소
 */
export function useOptimizedMotion() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return {
    shouldReduceMotion: prefersReducedMotion,
    shouldSimplifyAnimations: isMobile,
    // 최적화된 애니메이션 설정
    motionConfig: {
      initial: prefersReducedMotion ? false : undefined,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : isMobile
        ? { duration: 0.2 }
        : { duration: 0.4 },
    },
  };
}
