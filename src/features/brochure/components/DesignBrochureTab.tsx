"use client";

import { useRef, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { ArrowUpRight, FileText, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import { db } from "@/shared/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/shared/config/env";
import { BrochureData, DesignBrochureFile } from "../types";
import { deleteDesignBrochurePdf, uploadDesignBrochurePdf } from "../services/designBrochureStorage";

interface DesignBrochureTabProps {
  data: BrochureData;
  updateData: (newData: Partial<BrochureData>) => void;
}

function formatFileSize(sizeBytes: number) {
  if (!Number.isFinite(sizeBytes) || sizeBytes < 0) return "—";
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUploadedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 정보 없음";
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function getCanvaUrl(value: string) {
  try {
    const url = new URL(value);
    const isCanvaHost = url.hostname === "canva.com" || url.hostname.endsWith(".canva.com");
    return url.protocol === "https:" && isCanvaHost ? url.toString() : "";
  } catch {
    return "";
  }
}

export default function DesignBrochureTab({ data, updateData }: DesignBrochureTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const processFile = async (file?: File) => {
    if (!file) return;
    setErrorMessage("");
    setStatusMessage("");

    if (!isFirebaseConfigured) {
      setErrorMessage("Firebase 설정이 없어 PDF를 업로드할 수 없습니다. 관리자에게 설정을 요청해 주세요.");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".pdf") || (file.type && file.type !== "application/pdf")) {
      setErrorMessage("PDF 파일만 업로드할 수 있습니다. Canva에서 PDF 형식으로 내려받아 주세요.");
      return;
    }
    if (await file.slice(0, 5).text() !== "%PDF-") {
      setErrorMessage("선택한 파일에서 PDF 형식을 확인할 수 없습니다. Canva에서 PDF로 다시 내려받아 주세요.");
      return;
    }
    if (file.size >= 20 * 1024 * 1024) {
      setErrorMessage("파일 크기는 20MB 미만이어야 합니다. PDF를 압축한 뒤 다시 선택해 주세요.");
      return;
    }

    const previousFile = data.designPdf || null;
    let uploadedFile: DesignBrochureFile | null = null;
    setUploading(true);
    setUploadProgress(0);

    try {
      uploadedFile = await uploadDesignBrochurePdf(file, setUploadProgress);
      updateData({ designPdf: uploadedFile, useDesignPdf: true });

      await setDoc(doc(db, "company-documents", "brochure"), {
        designPdf: uploadedFile,
        useDesignPdf: true,
        updatedAt: new Date(),
      }, { merge: true });

      setUploadProgress(100);
      if (previousFile?.url && previousFile.url !== uploadedFile.url) {
        try {
          await deleteDesignBrochurePdf(previousFile.url);
          setStatusMessage("새 디자인 PDF를 홈페이지 다운로드에 적용했습니다. 이전 파일도 삭제했습니다.");
        } catch (deleteError) {
          console.error("Previous brochure PDF cleanup error:", deleteError);
          setStatusMessage("새 PDF를 홈페이지 다운로드에 적용했습니다. 이전 파일은 저장소에서 삭제되지 않아 관리자 확인이 필요합니다.");
        }
      } else {
        setStatusMessage("디자인 PDF를 업로드하고 홈페이지 다운로드 기본값으로 적용했습니다.");
      }
    } catch (error) {
      console.error("Design brochure PDF upload error:", error);
      if (uploadedFile) {
        setErrorMessage("파일 업로드는 완료됐지만 홈페이지 적용 정보를 저장하지 못했습니다. 상단 저장 버튼으로 다시 저장해 주세요.");
      } else {
        setErrorMessage("PDF 업로드에 실패했습니다. 인터넷 연결과 관리자 권한을 확인한 뒤 다시 시도해 주세요.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    void processFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (uploading) return;
    void processFile(event.dataTransfer.files?.[0]);
  };

  const handleDelete = async () => {
    const file = data.designPdf;
    if (!file) return;
    if (!isFirebaseConfigured) {
      setErrorMessage("Firebase 설정이 없어 파일을 삭제할 수 없습니다.");
      return;
    }
    if (!window.confirm("현재 디자인 PDF를 홈페이지 다운로드에서 제거하고 저장소에서도 삭제할까요?")) return;

    setErrorMessage("");
    setStatusMessage("");
    setDeleting(true);
    try {
      // 먼저 공개 문서의 URL을 해제해, 삭제 중 홈페이지가 끊어진 파일을 가리키지 않게 합니다.
      await setDoc(doc(db, "company-documents", "brochure"), {
        designPdf: null,
        useDesignPdf: false,
        updatedAt: new Date(),
      }, { merge: true });
      updateData({ designPdf: null, useDesignPdf: false });

      try {
        await deleteDesignBrochurePdf(file.url);
        setStatusMessage("디자인 PDF를 홈페이지와 저장소에서 삭제했습니다. 자동 생성 PDF가 기본 다운로드로 사용됩니다.");
      } catch (deleteError) {
        console.error("Design brochure PDF deletion error:", deleteError);
        setErrorMessage("홈페이지 연결은 해제했지만 저장소 파일 삭제에 실패했습니다. 관리자에게 저장소 정리를 요청해 주세요.");
      }
    } catch (error) {
      console.error("Design brochure PDF metadata deletion error:", error);
      setErrorMessage("PDF 삭제 정보를 저장하지 못했습니다. 파일은 변경되지 않았습니다. 연결 상태와 관리자 권한을 확인해 주세요.");
    } finally {
      setDeleting(false);
    }
  };

  const canvaUrl = getCanvaUrl(data.canvaEditUrl || "");

  return (
    <section aria-labelledby="download-files-heading" className="space-y-6">
      <header>
        <h2 id="download-files-heading" className="text-xl font-bold text-gray-900">다운로드 파일</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Canva에서 디자인한 뒤 PDF로 내려받아 아래에 업로드하세요. 업로드한 파일이 홈페이지 다운로드에 적용됩니다.
        </p>
      </header>

      {!isFirebaseConfigured && (
        <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Firebase 설정이 없어 업로드·저장·삭제 기능을 사용할 수 없습니다. 자동 생성 PDF는 미리보기와 다운로드가 가능합니다.
        </p>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="font-bold text-gray-900">디자인 PDF 업로드</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            PDF만 업로드할 수 있습니다. 파일은 20MB 미만이어야 하며, 업로드가 끝나면 홈페이지 다운로드 기본값으로 적용됩니다.
          </p>
        </div>

        <div
          onDragEnter={(event) => { event.preventDefault(); setDragOver(true); }}
          onDragOver={(event) => { event.preventDefault(); setDragOver(true); }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragOver(false);
          }}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors sm:p-8 ${
            dragOver ? "border-brand-600 bg-brand-50" : "border-gray-300 bg-gray-50"
          } ${uploading ? "pointer-events-none opacity-70" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            aria-label="디자인 PDF 파일 선택"
            onChange={handleFileInput}
            disabled={!isFirebaseConfigured || uploading || deleting}
            className="sr-only"
          />
          {uploading ? (
            <>
              <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-brand-700" aria-hidden="true" />
              <p className="mt-3 font-semibold text-gray-900">PDF 업로드 중</p>
              <div
                className="mx-auto mt-4 h-2 max-w-md overflow-hidden rounded-full bg-gray-200"
                role="progressbar"
                aria-label="디자인 PDF 업로드 진행률"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={uploadProgress}
              >
                <div className="h-full rounded-full bg-brand-700 transition-[width]" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="mt-2 text-sm tabular-nums text-gray-600">{uploadProgress}%</p>
            </>
          ) : (
            <>
              <UploadCloud className="mx-auto h-8 w-8 text-gray-500" aria-hidden="true" />
              <p className="mt-3 font-semibold text-gray-900">PDF를 이곳에 끌어다 놓으세요</p>
              <p className="mt-1 text-sm text-gray-600">또는 파일 선택 버튼을 눌러 Canva에서 내려받은 파일을 찾으세요.</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!isFirebaseConfigured || deleting}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                파일 선택
              </button>
            </>
          )}
        </div>

        {errorMessage && (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
            {errorMessage}
          </p>
        )}
        {statusMessage && (
          <p role="status" className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-900">
            {statusMessage}
          </p>
        )}

        {data.designPdf ? (
          <div className="mt-6 border-t border-gray-200 pt-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h4 className="break-all font-semibold text-gray-900">{data.designPdf.fileName}</h4>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-gray-600">
                    <dt>용량</dt><dd>{formatFileSize(data.designPdf.sizeBytes)}</dd>
                    <dt>업로드일</dt><dd>{formatUploadedAt(data.designPdf.uploadedAt)}</dd>
                  </dl>
                  <label htmlFor="brochure-design-version" className="mt-3 block text-sm font-medium text-gray-700">
                    버전 <span className="font-normal text-gray-500">(선택)</span>
                  </label>
                  <input
                    id="brochure-design-version"
                    type="text"
                    value={data.designPdf.version || ""}
                    onChange={(event) => {
                      const nextFile = { ...data.designPdf! };
                      if (event.target.value) {
                        nextFile.version = event.target.value;
                      } else {
                        delete nextFile.version;
                      }
                      updateData({ designPdf: nextFile });
                    }}
                    maxLength={30}
                    placeholder="예: 2026-1"
                    className="mt-1 min-h-10 w-full max-w-xs rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600"
                    disabled={!isFirebaseConfigured}
                  />
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                <a
                  href={data.designPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
                >
                  새 탭에서 보기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!isFirebaseConfigured || deleting || uploading}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                  {deleting ? "삭제 중..." : "삭제"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-5 border-t border-gray-200 pt-4 text-sm text-gray-600">등록된 디자인 PDF가 없습니다. 자동 생성 PDF가 계속 기본 다운로드로 사용됩니다.</p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <h3 className="font-bold text-gray-900">다운로드 기본값</h3>
        <label className={`mt-4 flex items-start gap-3 ${data.designPdf ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}>
          <input
            type="checkbox"
            checked={Boolean(data.useDesignPdf && data.designPdf?.url)}
            onChange={(event) => updateData({ useDesignPdf: event.target.checked })}
            disabled={!isFirebaseConfigured || !data.designPdf || uploading || deleting}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-700 focus:ring-brand-700"
          />
          <span>
            <span className="block font-medium text-gray-900">디자인 PDF를 다운로드 기본값으로 사용</span>
            <span className="mt-1 block text-sm leading-5 text-gray-600">
              {data.designPdf
                ? "선택하면 방문자가 받는 기본 PDF가 업로드한 디자인 파일로 바뀝니다."
                : "먼저 디자인 PDF를 업로드하면 이 옵션을 선택할 수 있습니다."}
            </span>
          </span>
        </label>
        <p className="mt-4 text-sm leading-6 text-gray-600">
          자동 생성 PDF는 그대로 유지됩니다. 디자인 PDF 사용을 끄거나 파일을 삭제하면 자동 생성 PDF가 기본값으로 돌아갑니다.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <h3 className="font-bold text-gray-900">Canva 편집 링크</h3>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          이 링크는 관리자 전용 문서에 저장되며 공개 홈페이지에는 표시되지 않습니다. 링크를 바꾼 뒤 상단의 저장 버튼을 눌러 주세요.
        </p>
        <label htmlFor="brochure-canva-url" className="mt-4 block text-sm font-medium text-gray-700">Canva 편집 주소</label>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input
            id="brochure-canva-url"
            type="url"
            value={data.canvaEditUrl || ""}
            onChange={(event) => updateData({ canvaEditUrl: event.target.value })}
            disabled={!isFirebaseConfigured}
            placeholder="https://www.canva.com/design/.../edit"
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600 disabled:bg-gray-100"
          />
          <a
            href={canvaUrl || undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!canvaUrl}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 ${
              canvaUrl
                ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                : "pointer-events-none border-gray-200 text-gray-400"
            }`}
          >
            Canva에서 열기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <p className="mt-2 text-xs leading-5 text-gray-500">
          Canva 편집 주소만 사용할 수 있습니다. 편집 링크는 별도의 비공개 관리자 설정에 저장됩니다.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
        <h3 className="font-bold text-gray-900">자동 생성 PDF (기본 파일)</h3>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          자동 생성 PDF는 계속 유지되며 회사소개서 내용 수정 사항이 반영됩니다. 상단 오른쪽의 <strong>자동 생성 PDF 다운로드</strong> 버튼으로 언제든 확인할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
