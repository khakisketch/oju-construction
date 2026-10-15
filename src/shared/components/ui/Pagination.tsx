"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  siblingCount?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages: (number | "...")[] = [];
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = 1 + 2 * siblingCount + 1;
      for (let i = 1; i <= Math.min(leftRange, totalPages); i++) {
        pages.push(i);
      }
      if (leftRange < totalPages - 1) pages.push("...");
      if (leftRange < totalPages) pages.push(totalPages);
    } else if (showLeftDots && !showRightDots) {
      pages.push(1);
      pages.push("...");
      const rightRange = totalPages - 2 * siblingCount;
      for (let i = Math.max(rightRange, 1); i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (showLeftDots && showRightDots) {
      pages.push(1);
      pages.push("...");
      for (let i = leftSibling; i <= rightSibling; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="flex items-center justify-center gap-1">
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="첫 페이지"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1 mx-2">
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 rounded-lg font-medium text-sm transition-colors ${
                currentPage === page
                  ? "bg-brand-700 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="다음 페이지"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="마지막 페이지"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
