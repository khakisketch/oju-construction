"use client";

import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import NominationPDF from "./NominationPDF";
import { NominationData } from "../types";

interface NominationDownloadButtonProps {
  data: NominationData;
}

export default function NominationDownloadButton({ data }: NominationDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: "OJU CONSTRUCTION",
    ceo: "",
    address: "",
    phone: "",
    bizNum: "",
  });

  useEffect(() => {
    setIsClient(true);
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const settings = docSnap.data();
        if (settings.companyInfo) {
          setCompanyInfo(settings.companyInfo);
        }
      }
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

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

  const fileName = `${companyInfo.name.replace(/\s+/g, "_")}_지명원_${new Date().toISOString().split("T")[0]}.pdf`;

  return (
    <PDFDownloadLink
      document={
        <NominationPDF
          data={data}
          companyName={companyInfo.name}
          ceo={companyInfo.ceo}
          address={companyInfo.address}
          phone={companyInfo.phone}
          bizNum={companyInfo.bizNum}
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
            PDF 다운로드
          </>
        )
      }
    </PDFDownloadLink>
  );
}
