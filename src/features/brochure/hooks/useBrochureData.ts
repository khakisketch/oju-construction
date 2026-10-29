"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/shared/config/env";
import { BrochureData, defaultBrochureData } from "../types";

interface UseBrochureDataReturn {
  data: BrochureData;
  loading: boolean;
  saving: boolean;
  error: string | null;
  updateData: (newData: Partial<BrochureData>) => void;
  saveData: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

const publicBrochureRef = () => doc(db, "company-documents", "brochure");
const privateBrochureRef = () => doc(db, "company-documents-private", "brochure");

export function useBrochureData(): UseBrochureDataReturn {
  const [data, setData] = useState<BrochureData>(defaultBrochureData);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setData(defaultBrochureData);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const [publicResult, privateResult] = await Promise.allSettled([
      getDoc(publicBrochureRef()),
      getDoc(privateBrochureRef()),
    ]);

    if (publicResult.status === "rejected") {
      console.error("Error fetching brochure data:", publicResult.reason);
      setData(defaultBrochureData);
      setError("회사소개서 정보를 불러오지 못했습니다. 연결 상태와 관리자 권한을 확인해 주세요.");
      setLoading(false);
      return;
    }

    const publicData = publicResult.value.exists() ? publicResult.value.data() as Partial<BrochureData> : {};
    let canvaEditUrl = "";
    if (privateResult.status === "fulfilled" && privateResult.value.exists()) {
      const privateData = privateResult.value.data();
      canvaEditUrl = typeof privateData.canvaEditUrl === "string" ? privateData.canvaEditUrl : "";
    } else if (privateResult.status === "rejected") {
      console.error("Error fetching private brochure settings:", privateResult.reason);
      setError("Canva 편집 링크를 불러오지 못했습니다. 관리자 권한을 확인해 주세요.");
    }

    setData({
      ...defaultBrochureData,
      ...publicData,
      canvaEditUrl,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const updateData = useCallback((newData: Partial<BrochureData>) => {
    setData((previous) => ({ ...previous, ...newData }));
  }, []);

  const saveData = useCallback(async (): Promise<boolean> => {
    if (!isFirebaseConfigured) {
      setError("Firebase 설정이 없어 저장할 수 없습니다.");
      return false;
    }

    setSaving(true);
    setError(null);
    try {
      const { canvaEditUrl, ...publicData } = data;
      const batch = writeBatch(db);
      batch.set(publicBrochureRef(), {
        ...publicData,
        updatedAt: new Date(),
      });
      batch.set(privateBrochureRef(), {
        canvaEditUrl: canvaEditUrl?.trim() || "",
        updatedAt: new Date(),
      }, { merge: true });
      await batch.commit();
      return true;
    } catch (err) {
      console.error("Error saving brochure data:", err);
      setError("회사소개서 설정을 저장하지 못했습니다. 연결 상태와 관리자 권한을 확인한 뒤 다시 시도해 주세요.");
      return false;
    } finally {
      setSaving(false);
    }
  }, [data]);

  return {
    data,
    loading,
    saving,
    error,
    updateData,
    saveData,
    refetch: fetchData,
  };
}
