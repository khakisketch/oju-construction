"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
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

export function useBrochureData(): UseBrochureDataReturn {
  const [data, setData] = useState<BrochureData>(defaultBrochureData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, "company-documents", "brochure");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedData = docSnap.data() as BrochureData;
        setData({
          ...defaultBrochureData,
          ...fetchedData,
        });
      } else {
        setData(defaultBrochureData);
      }
    } catch (err) {
      console.error("Error fetching brochure data:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateData = useCallback((newData: Partial<BrochureData>) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  }, []);

  const saveData = useCallback(async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);
      const docRef = doc(db, "company-documents", "brochure");
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
      return true;
    } catch (err) {
      console.error("Error saving brochure data:", err);
      setError("저장 중 오류가 발생했습니다.");
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
