import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { app } from "./app";

export const storage = getStorage(app);

// 이미지 업로드 함수
export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

// 포트폴리오 이미지 업로드
export async function uploadPortfolioImage(file: File, portfolioId: string): Promise<string> {
  const timestamp = Date.now();
  const extension = file.name.split(".").pop();
  const path = `portfolio/${portfolioId}/${timestamp}.${extension}`;
  return uploadImage(file, path);
}

// 뉴스 이미지 업로드
export async function uploadNewsImage(file: File, newsId: string): Promise<string> {
  const timestamp = Date.now();
  const extension = file.name.split(".").pop();
  const path = `news/${newsId}/${timestamp}.${extension}`;
  return uploadImage(file, path);
}

// 이미지 삭제
export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
