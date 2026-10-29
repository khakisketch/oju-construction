import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import RenewalBHero from "@/features/renewal-b/RenewalBHero";
import CompanyProofStrip from "@/features/renewal-b/CompanyProofStrip";
import DiagnosisExplorer from "@/features/renewal-b/DiagnosisExplorer";
import DiagnosisRequestForm from "@/features/renewal-b/DiagnosisRequestForm";
import SamePlaceComparison from "@/features/renewal-b/SamePlaceComparison";
import { SYMPTOM_CASES } from "@/features/renewal-b/symptomCases";
import { env, isFirebaseConfigured } from "@/shared/config/env";
import styles from "@/features/renewal-b/RenewalBDesign.module.css";

export const metadata: Metadata = {
  title: "아파트 외부공간 진단·시공",
  description: "오주건설(주)의 아파트 외부공간 시공 범위와 물 고임·포장·배수·누수 확인 안내.",
  robots: { index: false, follow: false },
};

const scope = [
  { title: "토목·지반", detail: "외부 기반 조성" },
  { title: "포장", detail: "주차장·보도" },
  { title: "배수·방수", detail: "물길·누수 점검" },
  { title: "조경·유지보수", detail: "외부공간 관리" },
];

const anchorIds = ["water", "pavers", "drain", "leak", "slope", "clog", "pipe", "compaction", "joint"];

export default function RenewalBPage() {
  return (
    <div className={styles.page}>
      <RenewalBHero />
      <CompanyProofStrip />

      <section className={styles.scope} aria-labelledby="scope-heading">
        <div className={`${styles.wrap} ${styles.scopeInner}`}>
          <div>
            <h2 id="scope-heading" className={styles.scopeTitle}>외부공간을 폭넓게</h2>
            <p className={styles.scopeDescription}>서로 맞물리는 공종을 함께 살핍니다.</p>
          </div>
          <div className={styles.scopeList}>
            {scope.map((item) => (
              <div key={item.title} className={styles.scopeItem}>
                <strong>{item.title}</strong><span>{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="symptoms-heading">
        <div className={styles.wrap}>
          <div className={styles.symptomHeading}>
            <div>
              <h2 id="symptoms-heading" className={styles.sectionHeading}>우리 현장의 증상은 무엇인가요?</h2>
              <p className={styles.sectionDescription}>사진에서 비슷한 상황을 골라 확인해 보세요.</p>
            </div>
            <p className={styles.disclosure}>사진은 이해를 돕는 AI 예시입니다.</p>
          </div>
          <div className={styles.symptomGrid}>
            {SYMPTOM_CASES.map((item) => (
              <a key={item.id} href={`#cross-section/${item.id}`} className={styles.symptomCard}>
                <span className={styles.symptomImage}>
                  <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 900px) 50vw, 25vw" />
                  <span className={styles.imageBadge}>AI 이미지 예시</span>
                </span>
                <span className={styles.symptomText}>
                  <strong>{item.cardTitle}</strong>
                  <span className={styles.symptomAction}>살펴볼 지점 보기 <ArrowRight size={14} aria-hidden="true" /></span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="before-after" className={styles.comparison} aria-label="문제 상황과 개선 모습 예시 비교">
        <div className={styles.wrap}><SamePlaceComparison /></div>
      </section>

      <section id="cross-section" className={`${styles.section} ${styles.diagnosis}`} aria-labelledby="diagnosis-heading">
        {anchorIds.map((id) => <span key={id} id={`cross-section/${id}`} className={styles.anchor} aria-hidden="true" />)}
        <div className={styles.wrap}>
          <div className={styles.diagnosisIntro}>
            <h2 id="diagnosis-heading" tabIndex={-1} className={styles.sectionHeading}>증상 뒤에서, 무엇을 살필까요?</h2>
            <p className={styles.sectionDescription}>가능한 확인 지점을 간단히 살펴봅니다. 실제 원인은 현장 조사가 필요합니다.</p>
          </div>
          <DiagnosisExplorer />
        </div>
      </section>

      <section className={styles.trust} aria-labelledby="trust-heading">
        <div className={`${styles.wrap} ${styles.trustInner}`}>
          <div>
            <h2 id="trust-heading" className={styles.trustTitle}>확인할 수 있는 정보로<br />이야기하겠습니다.</h2>
            <p className={styles.trustDescription}>회사 정보와 시공 범위를 먼저 확인하세요.</p>
          </div>
          <div className={styles.trustRow}>
            <div className={styles.trustItem}><strong>{env.company.name}</strong><span>{env.company.foundedYear}년 설립 · 충북 청주</span></div>
            <div className={styles.trustItem}><strong>실적·등록 자료</strong><span>확인된 자료 확보 후 안내 예정</span></div>
          </div>
        </div>
      </section>

      <section id="diagnosis-request" className={styles.contact} aria-labelledby="contact-heading">
        <div className={`${styles.wrap} ${styles.contactLayout}`}>
          <div>
            <h2 id="contact-heading" className={styles.contactTitle}>현장 상황을<br />들려주세요.</h2>
            <p className={styles.contactIntro}>물 고임, 포장 침하, 누수 등<br />위치와 증상을 알려주시면 상담에 도움이 됩니다.</p>
            <div className={styles.phoneBox}>
              <span>전화 상담</span>
              <a href={`tel:${env.company.phone}`}>{env.company.phone}</a>
              <p>{isFirebaseConfigured ? "현장 상황을 전화로도 문의하실 수 있습니다." : "온라인 접수 연결 전에는 전화로 문의해 주세요."}</p>
            </div>
          </div>
          <div className={styles.formPanel}>
            <h3 className={styles.formTitle}>현장 진단 요청</h3>
            <p className={styles.formIntro}>
              {isFirebaseConfigured ? "상담에 필요한 정보를 남겨주세요. * 필수 항목" : "현장 위치와 증상을 전화로 알려주세요."}
            </p>
            <DiagnosisRequestForm />
          </div>
        </div>
      </section>
    </div>
  );
}
