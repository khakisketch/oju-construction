"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookPen } from "lucide-react";
import { ContactItemSkeleton, ContactDetailSkeleton } from "@/shared/components/ui/Skeleton";
import Pagination from "@/shared/components/ui/Pagination";

const ITEMS_PER_PAGE = 10;

interface ContactScreening {
  clientChecked: boolean;
  budgetChecked: boolean;
  contractPartyChecked: boolean;
  paymentTermsChecked: boolean;
}

const SCREENING_ITEMS: { key: keyof ContactScreening; label: string }[] = [
  { key: "clientChecked", label: "발주 주체 확인" },
  { key: "budgetChecked", label: "예산·승인 확인" },
  { key: "contractPartyChecked", label: "계약·지급 주체 확인" },
  { key: "paymentTermsChecked", label: "지급 조건 확인" },
];

const EMPTY_SCREENING: ContactScreening = {
  clientChecked: false,
  budgetChecked: false,
  contractPartyChecked: false,
  paymentTermsChecked: false,
};

function toScreening(value: unknown): ContactScreening {
  if (typeof value !== "object" || value === null) return { ...EMPTY_SCREENING };
  const record = value as Partial<Record<keyof ContactScreening, unknown>>;
  return {
    clientChecked: record.clientChecked === true,
    budgetChecked: record.budgetChecked === true,
    contractPartyChecked: record.contractPartyChecked === true,
    paymentTermsChecked: record.paymentTermsChecked === true,
  };
}

function screeningCount(screening: ContactScreening): number {
  return SCREENING_ITEMS.filter((item) => screening[item.key]).length;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  place?: string;
  category: string | string[];
  message: string;
  status: string;
  adminMemo?: string;
  createdAt: any;
  screening?: Partial<Record<keyof ContactScreening, boolean>>;
  // legacy fields
  company?: string;
  email?: string;
  inquiryType?: string;
  subject?: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [memoText, setMemoText] = useState("");
  const [screening, setScreening] = useState<ContactScreening>({ ...EMPTY_SCREENING });
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "processing" | "completed">("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchContacts();
  }, []);

  // 필터 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // 검색 및 필터링된 목록
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchQuery === "" ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      (contact.place || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.inquiryType || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.subject || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 선택된 연락처가 변경될 때 메모 상태 업데이트
  useEffect(() => {
    if (selectedContact) {
      setMemoText(selectedContact.adminMemo || "");
      setScreening(toScreening(selectedContact.screening));
    }
  }, [selectedContact]);

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const contactsData: Contact[] = [];

      querySnapshot.forEach((doc) => {
        contactsData.push({
          id: doc.id,
          ...doc.data(),
        } as Contact);
      });

      setContacts(contactsData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "contacts", id));
        setContacts(contacts.filter(c => c.id !== id));
        if (selectedContact?.id === id) {
          setSelectedContact(null);
        }
      } catch (error) {
        console.error("Error deleting contact:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "contacts", id), { status: newStatus });
      setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 메모 저장 핸들러
  const handleMemoSave = async () => {
    if (!selectedContact) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "contacts", selectedContact.id), { adminMemo: memoText, screening: { ...screening } });
      
      // 로컬 상태 업데이트
      const updatedContact = { ...selectedContact, adminMemo: memoText, screening: { ...screening } };
      setSelectedContact(updatedContact);
      setContacts(contacts.map(c => c.id === selectedContact.id ? updatedContact : c));
      
      alert("메모와 선별 확인이 저장되었습니다.");
    } catch (error) {
      console.error("Error saving memo:", error);
      alert("메모 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("ko-KR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-brand-100 text-brand-800 border-brand-200";
      case "processing": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new": return "신규";
      case "processing": return "처리중";
      case "completed": return "완료";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">문의 관리</h1>
          <p className="text-gray-500 text-sm">고객 문의 내역을 확인하고 관리합니다.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
        {/* Contact List (Left Side) */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="이름, 회사명, 제목 검색..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-500 text-sm"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-1.5">
              {[
                { value: "all", label: "전체" },
                { value: "new", label: "신규" },
                { value: "processing", label: "처리중" },
                { value: "completed", label: "완료" },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value as any)}
                  className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                    statusFilter === status.value
                      ? "bg-brand-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <ContactItemSkeleton key={i} />
                ))}
              </>
            ) : filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {contacts.length === 0 ? "문의가 없습니다." : "검색 결과가 없습니다."}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {paginatedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedContact?.id === contact.id ? "bg-brand-50/50 border-l-4 border-brand-700" : "border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm truncate pr-2">{contact.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(contact.status)}`}>
                        {getStatusLabel(contact.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1 truncate">{contact.inquiryType || contact.subject || "문의 종류 미기록"}</p>
                    <p className="text-xs text-gray-600 mb-1 truncate">{contact.place || "-"}</p>
                    {(() => {
                      const count = screeningCount(toScreening(contact.screening));
                      return (
                        <p className={`mt-1 text-[11px] font-semibold ${contact.screening ? "text-brand-700" : "text-gray-400"}`}>
                          {contact.screening ? `선별 ${count}/4` : "선별 미기록"}
                        </p>
                      );
                    })()}
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{Array.isArray(contact.category) ? contact.category.join(", ") : contact.category}</span>
                      <span>{formatDate(contact.createdAt).split('. ')[1] + '.' + formatDate(contact.createdAt).split('. ')[2]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50/50">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showFirstLast={false}
              />
            </div>
          )}
        </div>

        {/* Contact Detail (Right Side) */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/30">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{selectedContact.place || selectedContact.name} 문의</h2>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(selectedContact.status)}`}>
                      {getStatusLabel(selectedContact.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(selectedContact.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {Array.isArray(selectedContact.category) ? selectedContact.category.join(", ") : selectedContact.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={selectedContact.status}
                    onChange={(e) => handleStatusChange(selectedContact.id, e.target.value)}
                    className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2"
                  >
                    <option value="new">신규</option>
                    <option value="processing">처리중</option>
                    <option value="completed">완료</option>
                  </select>
                  <button
                    onClick={() => handleDelete(selectedContact.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">신청자 정보</h3>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">성함</label>
                      <div className="text-gray-900 font-medium">{selectedContact.name}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">연락처</label>
                      <a href={`tel:${selectedContact.phone}`} className="text-brand-700 hover:underline font-medium">
                        {selectedContact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">문의 정보</h3>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">문의 종류</label>
                      <div className="text-gray-900">{selectedContact.inquiryType || selectedContact.subject || "미기록"}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">발주 위치</label>
                      <div className="text-gray-900">{selectedContact.place || "-"}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">공사 유형</label>
                      <div className="flex flex-wrap gap-1.5">
                        {(Array.isArray(selectedContact.category) ? selectedContact.category : [selectedContact.category]).map((cat, i) => (
                          <span key={i} className="bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full">{cat}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">접수일시</label>
                      <div className="text-gray-900">{formatDate(selectedContact.createdAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Screening checklist */}
                <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4 mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-brand-900">
                      선별 확인 ({screeningCount(screening)}/4)
                    </span>
                    <span className="text-xs text-brand-700">담당자 내부 확인용</span>
                  </div>
                  <fieldset>
                    <legend className="sr-only">선별 확인 항목</legend>
                    <div className="grid gap-1 sm:grid-cols-2">
                      {SCREENING_ITEMS.map((item) => (
                        <label
                          key={item.key}
                          className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 border border-brand-100 hover:border-brand-300 focus-within:ring-2 focus-within:ring-brand-500"
                        >
                          <input
                            type="checkbox"
                            checked={screening[item.key]}
                            onChange={(e) =>
                              setScreening((prev) => ({ ...prev, [item.key]: e.target.checked }))
                            }
                            className="h-5 w-5 shrink-0 rounded border-gray-300 text-brand-700 focus:ring-brand-500"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                {/* Admin Memo UI (New Feature) */}
                <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-200 mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-yellow-800 flex items-center gap-2">
                      <NotebookPen className="w-4 h-4" /> 관리자 메모
                    </label>
                    <button 
                      onClick={handleMemoSave}
                      disabled={isSaving}
                      className="min-h-[44px] text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded-lg transition-colors font-semibold border border-yellow-200 disabled:opacity-50"
                    >
                      {isSaving ? "저장 중..." : "메모·선별 저장"}
                    </button>
                  </div>
                  <textarea
                    value={memoText}
                    onChange={(e) => setMemoText(e.target.value)}
                    className="w-full bg-white border border-yellow-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none resize-none placeholder-yellow-300/50"
                    placeholder="상담 내용이나 처리 결과를 기록하세요..."
                    rows={3}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-4">상세 내용</h3>
                  <div className="bg-gray-50 p-6 rounded-xl text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-100">
                    {selectedContact.message}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <svg className="w-24 h-24 mb-4 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-medium">문의 내역을 선택해주세요</p>
              <p className="text-sm opacity-70 mt-1">좌측 목록에서 항목을 클릭하면 상세 내용이 표시됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}