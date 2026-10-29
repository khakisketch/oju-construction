import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { isFirebaseConfigured } from "@/shared/config/env";
import { DesignBrochureFile } from "../types";

function getSafeStorageFileName(fileName: string) {
  return fileName.replace(/[\\/\u0000-\u001f]/g, "_").replace(/\s+/g, "_");
}

function getContentDispositionFileName(fileName: string) {
  const asciiName = fileName.replace(/[^\x20-\x7e]/g, "_").replace(/["\\;]/g, "_");
  return `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

async function getConfiguredStorage() {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase 설정이 없어 파일 저장소에 연결할 수 없습니다.");
  }
  const { storage } = await import("@/shared/lib/firebase/storage");
  return storage;
}

export async function uploadDesignBrochurePdf(
  file: File,
  onProgress: (percent: number) => void,
): Promise<DesignBrochureFile> {
  const storage = await getConfiguredStorage();
  const safeFileName = getSafeStorageFileName(file.name);
  const storageRef = ref(storage, `brochure/${Date.now()}-${safeFileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: "application/pdf",
    contentDisposition: getContentDispositionFileName(file.name),
  });

  await new Promise<void>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = snapshot.totalBytes === 0
          ? 0
          : Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress(percent);
      },
      reject,
      resolve,
    );
  });

  const url = await getDownloadURL(uploadTask.snapshot.ref);
  return {
    url,
    fileName: file.name,
    sizeBytes: file.size,
    uploadedAt: new Date().toISOString(),
  };
}

export async function deleteDesignBrochurePdf(url: string) {
  const storage = await getConfiguredStorage();
  await deleteObject(ref(storage, url));
}
