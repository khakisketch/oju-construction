"use client";

import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown } from "lucide-react";
import BrochurePDF, { generateQRCodeDataUrl } from "./BrochurePDF";
import { BrochureData } from "../types";

interface BrochureDownloadButtonProps {
  data: BrochureData;
  mode?: "selected" | "generated";
  companyName?: string;
  companyInfo?: {
    address: string;
    phone: string;
    email: string;
    fax: string;
  };
}

export default function BrochureDownloadButton({
  data,
  mode = "selected",
  companyName = "OJU CONSTRUCTION",
  companyInfo = { address: "", phone: "", email: "", fax: "" },
}: BrochureDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const designFile = mode === "selected" && data.useDesignPdf && data.designPdf?.url
    ? data.designPdf
    : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // QR코드 생성
  useEffect(() => {
    if (data.websiteUrl) {
      generateQRCodeDataUrl(data.websiteUrl).then(setQrCodeDataUrl);
    }
  }, [data.websiteUrl]);

  if (!isClient) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed"
      >
        <FileDown className="w-5 h-5" />
        PDF 준비 중...
      </button>
    );
  }

  const fileName = `${companyName.replace(/\s+/g, "_")}_회사소개서_${new Date().toISOString().split("T")[0]}.pdf`;

  if (designFile) {
    const uploadedDate = designFile.uploadedAt && !Number.isNaN(Date.parse(designFile.uploadedAt))
      ? new Date(designFile.uploadedAt).toLocaleDateString("ko-KR")
      : "";
    const fileDetails = [designFile.version ? `v${designFile.version}` : "", uploadedDate]
      .filter(Boolean)
      .join(" · ");

    return (
      <div className="flex flex-col items-end gap-0.5">
        <a
          href={designFile.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`디자인 PDF 다운로드: ${designFile.fileName}`}
          className="flex min-h-10 items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
        >
          <FileDown className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>PDF 다운로드</span>
        </a>
        <span className="max-w-40 truncate text-[10px] leading-4 text-gray-500" title={fileDetails || "디자인 PDF"}>
          {fileDetails ? `디자인 PDF · ${fileDetails}` : "디자인 PDF"}
        </span>
      </div>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <BrochurePDF
          data={data}
          companyName={companyName}
          companyInfo={companyInfo}
          qrCodeDataUrl={qrCodeDataUrl || undefined}
        />
      }
      fileName={fileName}
      className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
    >
      {({ loading }) =>
        loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            PDF 생성 중...
          </>
        ) : (
          <>
            <FileDown className="w-5 h-5" />
            {mode === "generated" ? "자동 생성 PDF 다운로드" : "PDF 다운로드"}
          </>
        )
      }
    </PDFDownloadLink>
  );
}
