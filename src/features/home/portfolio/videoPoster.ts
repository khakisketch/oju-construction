/**
 * 작업 영상 포스터 캡처 모듈.
 * 업로드한 파일을 object URL로 읽어 <video>로 재생 → 1초 지점에서
 * canvas로 캡처 → JPEG data URL(최대 폭 960, quality 0.8).
 * 실패 시 빈 문자열로 포스터 없이 진행.
 */

export const PORTFOLIO_VIDEO_MAX_SIZE = 30 * 1024 * 1024;
export const PORTFOLIO_VIDEO_ACCEPT = ["video/mp4", "video/webm"] as const;
export const PORTFOLIO_VIDEO_ACCEPT_ATTR = "video/mp4,video/webm";
export const PORTFOLIO_VIDEO_POSTER_MAX_WIDTH = 960;
export const PORTFOLIO_VIDEO_POSTER_QUALITY = 0.8;
export const PORTFOLIO_VIDEO_CAPTURE_TIME = 1;

/** 순수 검증 함수: 영상 파일 MIME·용량 검사. 문제없으면 null, 있으면 한국어 메시지. */
export function validatePortfolioVideoFile(file: {
  type: string;
  size: number;
}): string | null {
  if (!PORTFOLIO_VIDEO_ACCEPT.includes(file.type as (typeof PORTFOLIO_VIDEO_ACCEPT)[number])) {
    return "MP4 또는 WebM 형식의 영상만 업로드할 수 있습니다.";
  }
  if (file.size > PORTFOLIO_VIDEO_MAX_SIZE) {
    return "영상 파일 크기는 30MB 이하여야 합니다.";
  }
  return null;
}

/** 업로드 Storage 경로. 기존 uploadPortfolioImage 스타일 유지. */
export function buildPortfolioVideoPath(
  portfolioId: string,
  fileName: string,
  now: number = Date.now(),
): string {
  const rawExtension = fileName.split(".").pop()?.toLowerCase() || "mp4";
  const extension = rawExtension === "webm" ? "webm" : "mp4";
  return `portfolio/${portfolioId}/work-${now}.${extension}`;
}

/**
 * 클라이언트 포스터 캡처. DOM 필요. 실패 시 "" 반환(포스터 없이 진행).
 * 테스트에서는 validatePortfolioVideoFile/buildPortfolioVideoPath를 검증.
 */
export function captureVideoPoster(
  file: File,
  captureTime: number = PORTFOLIO_VIDEO_CAPTURE_TIME,
): Promise<string> {
  return new Promise((resolve) => {
    try {
      const objectUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.src = objectUrl;
      const cleanup = () => URL.revokeObjectURL(objectUrl);

      const fail = () => {
        cleanup();
        resolve("");
      };

      video.addEventListener(
        "seeked",
        () => {
          try {
            const width = video.videoWidth || 0;
            const height = video.videoHeight || 0;
            if (!width || !height) return fail();
            const scale = Math.min(
              1,
              PORTFOLIO_VIDEO_POSTER_MAX_WIDTH / width,
            );
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(width * scale);
            canvas.height = Math.round(height * scale);
            const context = canvas.getContext("2d");
            if (!context) return fail();
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL(
              "image/jpeg",
              PORTFOLIO_VIDEO_POSTER_QUALITY,
            );
            cleanup();
            resolve(dataUrl);
          } catch {
            fail();
          }
        },
        { once: true },
      );
      video.addEventListener("error", fail, { once: true });
      video.addEventListener(
        "loadedmetadata",
        () => {
          try {
            video.currentTime = Math.min(
              captureTime,
              Math.max(0, (video.duration || captureTime) - 0.1),
            );
          } catch {
            fail();
          }
        },
        { once: true },
      );
      // loadedmetadata가 이미 지났거나 타임아웃 대비
      window.setTimeout(() => {
        if (video.readyState >= 1 && video.currentTime === 0) {
          try {
            video.currentTime = captureTime;
          } catch {
            fail();
          }
        }
      }, 3000);
      video.load();
    } catch {
      resolve("");
    }
  });
}
