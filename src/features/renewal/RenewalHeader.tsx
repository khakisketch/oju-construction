"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./renewal.module.css";

const navItems = [
  { href: "#scope", label: "아파트 사업" },
  { href: "#interface", label: "통합 시공" },
  { href: "#matrix", label: "공종·실적" },
  { href: "#standards", label: "현장 기준" },
  { href: "#company", label: "회사" },
  { href: "#contact", label: "문의" },
];

export default function RenewalHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/renewal" className={styles.brand} aria-label="오주건설(주) 새 홈페이지">
          <Image
            src="/images/ojuconstruction-logo.png"
            alt=""
            width={32}
            height={32}
            className={styles.brandMark}
            priority
          />
          <span className={styles.brandText}>
            <span className={styles.brandKo}>오주건설(주)</span>
            <span className={styles.brandEn}>OJU CONSTRUCTION</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="주요 메뉴">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <a href="tel:043-265-6010" className={styles.headerPhone}>
            043-265-6010
          </a>
          <Link href="/brochure" className={styles.headerCta}>
            회사소개서
          </Link>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="renewal-mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="renewal-mobile-nav"
        className={styles.mobileNav}
        data-open={open}
      >
        <div className={styles.mobileNavInner}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="tel:043-265-6010"
            className={styles.mobileNavLink}
            onClick={() => setOpen(false)}
          >
            전화 043-265-6010
          </a>
        </div>
      </div>
    </header>
  );
}
