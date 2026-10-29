"use client";

import { useRef, useState, type Ref } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { FieldWorkDemo } from "./fieldWorkMedia";

interface FieldWorkVideoProps {
  demo: FieldWorkDemo;
  mediaRef?: Ref<HTMLVideoElement>;
}

type PlaybackStatus = "ready" | "started" | "ended" | "error";

function assignRef(ref: Ref<HTMLVideoElement> | undefined, element: HTMLVideoElement | null) {
  if (typeof ref === "function") {
    ref(element);
  } else if (ref && typeof ref === "object" && "current" in ref) {
    (ref as { current: HTMLVideoElement | null }).current = element;
  }
}

export function FieldWorkVideo({ demo, mediaRef }: FieldWorkVideoProps) {
  const innerRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>("ready");

  const playFromGesture = (resetFirst: boolean) => {
    const video = innerRef.current;
    if (!video) return;
    if (resetFirst) video.currentTime = 0;
    const request = video.play();
    if (request && typeof request.catch === "function") {
      request.catch(() => setStatus("error"));
    }
  };

  const handleRetry = () => {
    const video = innerRef.current;
    setStatus("ready");
    if (!video) return;
    video.load();
    const request = video.play();
    if (request && typeof request.catch === "function") {
      request.catch(() => setStatus("error"));
    }
  };

  const overlayLabel =
    status === "ended" ? `${demo.caption} 다시 재생` : `${demo.caption} 재생`;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-900">
      <video
        ref={(element) => {
          innerRef.current = element;
          assignRef(mediaRef, element);
        }}
        controls={status === "started"}
        preload="none"
        playsInline
        poster={demo.posterSrc}
        src={demo.videoSrc}
        aria-label={`${demo.caption} (${demo.durationLabel})`}
        className="aspect-video w-full"
        onPlay={() => setStatus("started")}
        onEnded={() => setStatus("ended")}
        onError={() => setStatus("error")}
      />
      {status === "ready" || status === "ended" ? (
        <button
          type="button"
          onClick={() => playFromGesture(status === "ended")}
          aria-label={overlayLabel}
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-900 text-white shadow-lg transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900 md:h-[72px] md:w-[72px]"
        >
          {status === "ended" ? (
            <RotateCcw className="h-6 w-6 md:h-8 md:w-8" aria-hidden="true" />
          ) : (
            <Play
              className="ml-0.5 h-6 w-6 fill-current md:h-8 md:w-8"
              aria-hidden="true"
            />
          )}
        </button>
      ) : null}
      {status === "error" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <img
            src={demo.posterSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/65"
          />
          <p className="relative text-base font-semibold text-white">
            영상을 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="relative inline-flex min-h-[44px] items-center rounded-lg bg-white px-4 text-base font-semibold text-brand-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            다시 시도
          </button>
        </div>
      ) : null}
      <span className="pointer-events-none absolute left-3 top-3 rounded bg-black/75 px-2.5 py-1 text-[13px] font-semibold leading-5 text-white">
        예시 영상
      </span>
    </div>
  );
}
