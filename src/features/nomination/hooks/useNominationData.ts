"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { NominationData, defaultNominationData } from "../types";

interface UseNominationDataReturn {
  data: NominationData;
  loading: boolean;
  saving: boolean;
  error: string | null;
  updateData: (newData: Partial<NominationData>) => void;
  saveData: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useNominationData(): UseNominationDataReturn {
  const [data, setData] = useState<NominationData>(defaultNominationData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, "company-documents", "nomination");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedData = docSnap.data() as NominationData;
        setData({
          ...defaultNominationData,
          ...fetchedData,
        });
      } else {
        setData(defaultNominationData);
      }
    } catch (err) {
      console.error("Error fetching nomination data:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateData = useCallback((newData: Partial<NominationData>) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  }, []);

  const saveData = useCallback(async (): Promise<boolean> => {
    try {
      setSaving(true);
      setError(null);
      const docRef = doc(db, "company-documents", "nomination");
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
      return true;
    } catch (err) {
      console.error("Error saving nomination data:", err);
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
