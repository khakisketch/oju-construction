"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { motion } from "framer-motion";
import { SettingsFormSkeleton } from "@/shared/components/ui/Skeleton";

interface NotificationEmail {
  email: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<NotificationEmail[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [notifSaving, setNotifSaving] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    ceo: "",
    address: "",
    phone: "",
    fax: "",
    email: "",
    bizNum: "",
  });

  const [scripts, setScripts] = useState({
    metaPixelId: "",
    googleAnalyticsId: "",
    naverAnalyticsId: "",
  });

  useEffect(() => {
    fetchSettings();
    fetchNotifications();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.companyInfo) setCompanyInfo(data.companyInfo);
        if (data.scripts) setScripts(data.scripts);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const docRef = doc(db, "settings", "notifications");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.emails) setNotifications(data.emails);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const saveNotifications = async () => {
    setNotifSaving(true);
    try {
      await setDoc(doc(db, "settings", "notifications"), {
        emails: notifications,
        updatedAt: new Date(),
      });
      alert("알림 설정이 저장되었습니다.");
    } catch (error) {
      console.error("Error saving notifications:", error);
      alert("알림 설정 저장 중 오류가 발생했습니다.");
    } finally {
      setNotifSaving(false);
    }
  };

  const addNotificationEmail = () => {
    const trimmed = newEmail.trim();
    if (!trimmed) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }
    if (notifications.some((n) => n.email === trimmed)) {
      alert("이미 등록된 이메일입니다.");
      return;
    }
    setNotifications((prev) => [...prev, { email: trimmed, enabled: true }]);
    setNewEmail("");
  };

  const toggleNotificationEmail = (index: number) => {
    setNotifications((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const removeNotificationEmail = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScripts(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await setDoc(doc(db, "settings", "general"), {
        companyInfo,
        scripts,
        updatedAt: new Date(),
      });
      alert("설정이 저장되었습니다.");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SettingsFormSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">사이트 설정</h1>
        <p className="text-gray-500 text-sm">회사 정보 및 외부 스크립트 설정을 관리합니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Info Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-gray-900">회사 기본 정보</h2>
            <p className="text-xs text-gray-500 mt-1">푸터(Footer) 및 사이트 전반에 표시되는 정보입니다.</p>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">회사명 (상호)</label>
              <input
                type="text"
                name="name"
                value={companyInfo.name}
                onChange={handleCompanyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="예: 오주건설(주)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">대표자명</label>
              <input
                type="text"
                name="ceo"
                value={companyInfo.ceo}
                onChange={handleCompanyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="예: 홍길동"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
              <input
                type="text"
                name="address"
                value={companyInfo.address}
                onChange={handleCompanyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="예: 서울특별시 강남구..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input
                type="text"
                name="phone"
                value={companyInfo.phone}
                onChange={handleCompanyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="예: 02-1234-5678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">팩스번호</label>
              <input
                type="text"
                name="fax"
                value={companyInfo.fax}
                onChange={handleCompanyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="예: 02-1234-5679"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                name="email"
                value={companyInfo.email}
                onChange={handleCompanyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="예: contact@oju.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
              <input
                type="text"
                name="bizNum"
                value={companyInfo.bizNum}
                onChange={handleCompanyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="예: 123-45-67890"
              />
            </div>
          </div>
        </section>

        {/* Scripts Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-gray-900">마케팅 스크립트 설정</h2>
            <p className="text-xs text-gray-500 mt-1">추적 ID를 입력하면 자동으로 스크립트가 삽입됩니다.</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Pixel ID (Facebook)</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-lg">f</span>
                <input
                  type="text"
                  name="metaPixelId"
                  value={scripts.metaPixelId}
                  onChange={handleScriptChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono text-sm"
                  placeholder="예: 123456789012345"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID (G-Tag)</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-lg">G</span>
                <input
                  type="text"
                  name="googleAnalyticsId"
                  value={scripts.googleAnalyticsId}
                  onChange={handleScriptChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono text-sm"
                  placeholder="예: G-XXXXXXXXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">네이버 프리미엄 로그 분석 ID</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-lg">N</span>
                <input
                  type="text"
                  name="naverAnalyticsId"
                  value={scripts.naverAnalyticsId}
                  onChange={handleScriptChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono text-sm"
                  placeholder="예: wcs.naver.net/..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Notification Email Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-gray-900">문의 알림 이메일 설정</h2>
            <p className="text-xs text-gray-500 mt-1">새 문의 접수 시 알림을 받을 이메일 주소를 관리합니다.</p>
          </div>
          <div className="p-6 space-y-4">
            {/* Email List */}
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-sm font-medium truncate ${item.enabled ? "text-gray-900" : "text-gray-400 line-through"}`}>
                        {item.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleNotificationEmail(index)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.enabled ? "bg-brand-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeNotificationEmail(index)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm">
                등록된 알림 이메일이 없습니다.
              </div>
            )}

            {/* Add Email */}
            <div className="flex gap-2 pt-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNotificationEmail();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                placeholder="알림 받을 이메일 주소 입력"
              />
              <button
                type="button"
                onClick={addNotificationEmail}
                className="px-4 py-2 bg-brand-700 text-white font-medium rounded-lg hover:bg-brand-800 transition-colors text-sm whitespace-nowrap"
              >
                추가
              </button>
            </div>

            {/* Save Notifications */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={saveNotifications}
                disabled={notifSaving}
                className="px-6 py-2 bg-brand-700 text-white font-bold rounded-lg hover:bg-brand-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              >
                {notifSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    저장 중...
                  </>
                ) : (
                  "알림 설정 저장"
                )}
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end pb-12">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-brand-700 text-white font-bold rounded-xl hover:bg-brand-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                저장 중...
              </>
            ) : (
              "변경사항 저장"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
