"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";

interface UseNewContactsResult {
  count: number;
  loading: boolean;
}

export function useNewContacts(): UseNewContactsResult {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "contacts"),
      where("status", "==", "new")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setCount(snapshot.size);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to contacts:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { count, loading };
}
