import { getAuth, Auth } from "firebase/auth";
import { app } from "./app";
import { isFirebaseConfigured } from "@/shared/config/env";

// Firebase Auth는 최초 접근 시점에만 초기화합니다.
// 모듈 로드 시점에 getAuth()를 호출하면 정적 빌드(프리렌더) 단계에서
// API 키가 없을 때 "auth/invalid-api-key" 오류로 빌드가 실패합니다.
let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase 설정이 없습니다. .env.local에 NEXT_PUBLIC_FIREBASE_* 값을 설정하세요."
    );
  }
  if (!authInstance) {
    authInstance = getAuth(app);
  }
  return authInstance;
}
