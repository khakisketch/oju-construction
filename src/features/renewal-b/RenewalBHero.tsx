import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { env } from "@/shared/config/env";
import styles from "./RenewalBDesign.module.css";

/** The existing crane image is retained; only the B candidate's message changes. */
export default function RenewalBHero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/images/home/hero-slide1.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.heroImage}
      />
      <div className={styles.heroShade} aria-hidden="true" />
      <div className={`${styles.wrap} ${styles.heroInner}`}>
        <h1 className={styles.heroTitle}>
          아파트 단지의 땅과 길,<br />
          함께 시공합니다.
        </h1>
        <p className={styles.heroDescription}>
          부대토목부터 포장·배수·조경·유지보수까지<br />
          외부공간의 여러 공종을 함께 살핍니다.
        </p>
        <a href="#diagnosis-request" className={styles.primaryButton}>
          현장 진단 요청
          <ArrowRight size={17} aria-hidden="true" />
        </a>
        <p className={styles.heroHint}>
          {env.company.name} · {env.company.foundedYear}년 설립 · 충북 청주
        </p>
      </div>
    </section>
  );
}
