import Image from "next/image";
import Link from "next/link";
import { env } from "@/shared/config/env";
import styles from "./renewal.module.css";

export default function RenewalFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <Link href="/renewal" className={styles.footerBrand} aria-label="오주건설(주) 새 홈페이지">
            <Image
              src="/images/ojuconstruction-logo.png"
              alt=""
              width={28}
              height={28}
              className={styles.footerBrandMark}
            />
            <span className={styles.footerBrandText}>
              오주건설(주)
              <span className={styles.footerBrandEn}>OJU CONSTRUCTION</span>
            </span>
          </Link>

          <nav className={styles.footerLinks} aria-label="푸터 메뉴">
            <Link href="/about">회사소개</Link>
            <Link href="/construction">사업분야</Link>
            <Link href="/portfolio">시공실적</Link>
            <Link href="/brochure">회사소개서</Link>
            <Link href="/privacy">개인정보처리방침</Link>
          </nav>
        </div>

        <div className={styles.footerLegal}>
          <div>
            <strong>상호</strong>
            {env.company.name}
          </div>
          <div>
            <strong>대표</strong>
            {env.company.ceo}
          </div>
          <div>
            <strong>사업자등록번호</strong>
            {env.company.businessNumber}
          </div>
          <div>
            <strong>설립</strong>
            {env.company.foundedYear}년
          </div>
          <div>
            <strong>소재지</strong>
            {env.company.address}
          </div>
          <div>
            <strong>전화</strong>
            <a href={`tel:${env.company.phone}`}>{env.company.phone}</a>
          </div>
          <div>
            <strong>이메일</strong>
            <a href={`mailto:${env.company.email}`}>{env.company.email}</a>
          </div>
          <div>
            <strong>법인 정보</strong>
            건설업 등록·면허 정보는 상담 시 확인하실 수 있습니다.
          </div>
        </div>

        <p className={styles.footerNote}>
          이 사이트는 오주건설(주)의 공식 홈페이지입니다. 동명의 다른 법인과
          구분하기 위해 상호·대표·사업자등록번호·소재지를 함께 표기합니다.
          <br />
          © {new Date().getFullYear()} 오주건설(주). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
