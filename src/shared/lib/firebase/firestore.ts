import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { app } from "./app";

// Firestore 인스턴스 생성
// getFirestore는 싱글톤으로 관리되므로 여러 번 호출해도 동일한 인스턴스를 반환합니다.
export const db: Firestore = getFirestore(app);

// 개발 환경에서 에뮬레이터 사용 시 (필요한 경우 주석 해제)
// if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

// 오프라인 지속성(enableIndexedDbPersistence)은 
// Next.js의 SSR/SSG 환경과 충돌할 수 있어 기본적으로는 클라이언트 사이드에서만 
// 조건부로 활성화하는 것이 좋으나, 최신 Firebase SDK는 이를 자동으로 처리합니다.
// 만약 'client is offline' 에러가 지속된다면, 네트워크 문제이거나
// 방화벽, 또는 브라우저의 IndexedDB 권한 문제일 수 있습니다.