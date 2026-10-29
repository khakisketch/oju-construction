import Link from "next/link";
import { env } from "@/shared/config/env";
import styles from "./RenewalBDesign.module.css";

export default function CompanyProofStrip() {
  const company = env.company;

  return (
    <section className={styles.identity} aria-label="법인 정보">
      <div className={`${styles.wrap} ${styles.identityInner}`}>
        <p className={styles.identityName}>{company.name}</p>
        <div className={styles.identityList}>
          <span><strong>대표</strong> {company.ceo}</span>
          <span><strong>사업자등록번호</strong> {company.businessNumber}</span>
          <span><strong>소재지</strong> 충북 청주시 상당구</span>
        </div>
        <Link href="/about" className={styles.identityLink}>
          회사 정보 보기 →
        </Link>
      </div>
    </section>
  );
}
