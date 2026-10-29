import Image from "next/image";
import Link from "next/link";
import { env } from "@/shared/config/env";
import SectionDrawing from "@/features/renewal/SectionDrawing";
import RenewalContactForm from "@/features/renewal/RenewalContactForm";
import styles from "@/features/renewal/renewal.module.css";

const scopes = [
  {
    id: "01",
    name: "부대토목",
    desc: "터파기, 성토·절토, 지반개량, 옹벽, 석축. 단지의 바닥을 만드는 첫 공정.",
  },
  {
    id: "02",
    name: "포장",
    desc: "아스팔트, 보도블럭, 투수콘, 경계석, 측구, 주차장, 지하주차장 바닥.",
  },
  {
    id: "03",
    name: "배수·상하수도",
    desc: "우수·오수관, 정화조, 빗물저류·침투, 상수도, 소방 관로.",
  },
  {
    id: "04",
    name: "조경",
    desc: "식재, 잔디, 조경석, 수경시설, 옥상녹화, 관수 시설.",
  },
  {
    id: "05",
    name: "시설물",
    desc: "놀이터, 운동시설, 휴게시설, 펜스, 가로등, CCTV, EV 충전, 택배함.",
  },
  {
    id: "06",
    name: "유지보수",
    desc: "포장 보수, 균열·침하, 옹벽 보수, 놀이터 교체, 조경 유지.",
  },
];

const process = [
  {
    id: "01",
    title: "현장 진단",
    desc: "도면·현장 상태·공정표를 확인하고, 시공 범위와 리스크를 정리합니다.",
  },
  {
    id: "02",
    title: "간섭 체크",
    desc: "건축·설비·전기·조경과의 접점을 표로 정리해 공정 순서를 맞춥니다.",
  },
  {
    id: "03",
    title: "시공 계획",
    desc: "공종·순서·장비·인력·안전 계획을 한 장의 공정표로 합칩니다.",
  },
  {
    id: "04",
    title: "시공·검측",
    desc: "구배·다짐·줄눈·배수를 단계별로 검측하고 기록을 남깁니다.",
  },
  {
    id: "05",
    title: "준공·하자",
    desc: "준공 확인 후 하자 접수·현장 확인·보수까지 책임집니다.",
  },
];

const standards = [
  {
    label: "Daily",
    title: "TBM",
    desc: "매일 작업 전 위험요인과 작업 순서를 공유합니다.",
  },
  {
    label: "Risk",
    title: "위험성평가",
    desc: "공종별 위험요인과 감소대책을 작업 전에 정리합니다.",
  },
  {
    label: "Inspection",
    title: "검측",
    desc: "구배·다짐·줄눈·배수를 단계별로 확인하고 기록합니다.",
  },
  {
    label: "After",
    title: "하자 대응",
    desc: "준공 후 접수, 현장 확인, 보수까지 같은 창구로 대응합니다.",
  },
];

const matrix = [
  { name: "부대토목", newBuild: "full", rebuild: "full", maintenance: "none" },
  { name: "포장", newBuild: "full", rebuild: "full", maintenance: "full" },
  { name: "배수·상하수도", newBuild: "full", rebuild: "full", maintenance: "partial" },
  { name: "조경", newBuild: "full", rebuild: "full", maintenance: "partial" },
  { name: "시설물", newBuild: "full", rebuild: "full", maintenance: "full" },
  { name: "유지보수", newBuild: "partial", rebuild: "partial", maintenance: "full" },
] as const;

const org = [
  { role: "현장소장", duty: "공정·품질·안전 총괄, 발주처·감리 대응" },
  { role: "공무", duty: "계약·기성·자재·도면 관리" },
  { role: "품질", duty: "검측·시험·기록, 준공 자료 정리" },
  { role: "안전", duty: "TBM·위험성평가·현장 점검" },
];

function MatrixDot({ state }: { state: "full" | "partial" | "none" }) {
  const label = state === "full" ? "가능" : state === "partial" ? "부분 가능" : "해당 없음";
  return (
    <>
      <span
        className={`${styles.matrixDot} ${
          state === "partial"
            ? styles.matrixDotPartial
            : state === "none"
              ? styles.matrixDotNone
              : ""
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </>
  );
}

export default function RenewalHomePage() {
  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              아파트 단지의
              <br />
              땅과 길,
              <br />
              사람이 쓰는 시설까지
            </h1>
            <p className={styles.heroLead}>
              부대토목·포장·배수·조경·시설물을 한 계약으로. 공종 간 간섭을
              줄이는 아파트 외부공간 시공.
            </p>
            <div className={styles.heroActions}>
              <Link href="/brochure" className={`${styles.button} ${styles.buttonPrimary}`}>
                회사소개서 보기
                <span className={styles.buttonArrow} aria-hidden="true">→</span>
              </Link>
              <a href="#contact" className={`${styles.button} ${styles.buttonGhost}`}>
                현장 자료 보내기
                <span className={styles.buttonArrow} aria-hidden="true">→</span>
              </a>
            </div>
            <dl className={styles.heroFacts}>
              <div className={styles.heroFact}>
                <dt className={styles.heroFactLabel}>Since</dt>
                <dd className={styles.heroFactValue}>2004년 설립</dd>
              </div>
              <div className={styles.heroFact}>
                <dt className={styles.heroFactLabel}>Scope</dt>
                <dd className={styles.heroFactValue}>6개 시공 분야</dd>
              </div>
              <div className={styles.heroFact}>
                <dt className={styles.heroFactLabel}>Base</dt>
                <dd className={styles.heroFactValue}>충북 청주</dd>
              </div>
            </dl>
            <p className={styles.mono} style={{ marginTop: 18, fontSize: 10, letterSpacing: "0.04em", color: "var(--muted)" }}>
              오주건설(주) · 대표 이자영 · 사업자등록번호 217-81-16716
            </p>
          </div>

          <figure className={styles.heroDrawing} style={{ margin: 0 }}>
            <div className={styles.drawingFrame}>
              <SectionDrawing />
            </div>
            <figcaption className={styles.drawingCaption}>
              <span>단지 외부공간 단면 개념도 · SECTION A-A</span>
              <span>OJU SCOPE 01—05</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Proof strip */}
      <section className={styles.proof} aria-label="법인 정보">
        <div className={styles.proofInner}>
          <div className={styles.proofItem}>
            <span className={styles.proofLabel}>상호</span>
            <span className={styles.proofValue}>{env.company.name}</span>
          </div>
          <div className={styles.proofItem}>
            <span className={styles.proofLabel}>대표</span>
            <span className={styles.proofValue}>{env.company.ceo}</span>
          </div>
          <div className={styles.proofItem}>
            <span className={styles.proofLabel}>사업자등록번호</span>
            <span className={styles.proofValue}>{env.company.businessNumber}</span>
          </div>
          <div className={styles.proofItem}>
            <span className={styles.proofLabel}>소재지</span>
            <span className={styles.proofValue}>{env.company.address}</span>
          </div>
          <div className={styles.proofItem}>
            <a href="#company" className={styles.proofLink}>
              법인 정보 →
            </a>
          </div>
        </div>
      </section>

      {/* Scope */}
      <section id="scope" className={styles.section} aria-labelledby="scope-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 id="scope-title" className={styles.sectionTitle}>
              아파트 외부공간을
              <br />
              한 계약으로
            </h2>
            <p className={styles.sectionLead}>
              부대토목부터 포장·배수·조경·시설물까지. 공정이 맞물리는 공종을
              한 팀이 맡아, 현장의 <strong>조정 비용과 책임 경계</strong>를
              줄입니다. 필요한 범위만 골라 발주하는 방식도 함께 상담합니다.
            </p>
          </div>

          <div className={styles.scopeTable}>
            {scopes.map((scope) => (
              <a key={scope.id} href="#contact" className={styles.scopeRow}>
                <span className={styles.scopeNum}>{scope.id}</span>
                <span className={styles.scopeName}>{scope.name}</span>
                <span className={styles.scopeDesc}>{scope.desc}</span>
                <span className={styles.scopeLink}>상담 →</span>
              </a>
            ))}
          </div>

          <div className={styles.sectionFoot}>
            <Link href="/construction" className={styles.textLink}>
              사업분야 전체 보기 <span aria-hidden="true">→</span>
            </Link>
            <Link href="/portfolio" className={styles.textLink}>
              시공실적 보기 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interface */}
      <section id="interface" className={styles.section} aria-labelledby="interface-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 id="interface-title" className={styles.sectionTitle}>
              업체가 다섯 개면,
              <br />
              책임도 다섯 개입니다
            </h2>
            <p className={styles.sectionLead}>
              아파트 외부공간은 공정이 서로 물려 있습니다. 포장 구배 하나가
              배수와 조경에 영향을 주고, 준공 검사와 하자 대응까지 이어집니다.
              오주건설은 이 다섯 공종을 한 계약으로 묶어, 현장소장이 조정할
              업체 수를 줄입니다.
            </p>
          </div>

          <div className={styles.interfaceGrid}>
            <div className={styles.interfacePanel}>
              <span className={styles.interfaceKicker}>분리 발주</span>
              <span className={styles.interfaceCount}>
                5<small>개 업체</small>
              </span>
              <div className={styles.interfaceStack}>
                {["부대토목", "포장", "배수", "조경", "시설물"].map((item, index) => (
                  <div key={item} className={styles.interfaceChip}>
                    <span>{item}</span>
                    <span>0{index + 1}</span>
                  </div>
                ))}
              </div>
              <p className={styles.interfaceNote}>
                공정 조정 5개, 책임 경계 5개, 하자 분쟁 5개. 현장소장이 중간에서
                계속 조정해야 합니다.
              </p>
            </div>

            <div className={`${styles.interfacePanel} ${styles.interfacePanelOju}`}>
              <span className={styles.interfaceKicker}>오주건설</span>
              <span className={styles.interfaceCount}>
                1<small>개 계약</small>
              </span>
              <div className={styles.interfaceOne}>
                {["부대토목", "포장", "배수", "조경", "시설물"].map((item) => (
                  <div key={item} className={styles.interfaceChip}>
                    <span>{item}</span>
                    <span>OJU</span>
                  </div>
                ))}
              </div>
              <p className={styles.interfaceNote}>
                공정 조정 1개, 책임 경계 1개. 준공과 하자 대응까지 같은 창구로
                이어집니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Field record */}
      <section className={styles.record} aria-labelledby="record-title">
        <Image
          src="/images/construction/maintenance.jpg"
          alt="콘크리트 포장 현장에서 굴착기와 롤러, 작업자들이 시공 중인 모습"
          fill
          sizes="100vw"
          className={styles.recordImage}
        />
        <div className={styles.recordShade} aria-hidden="true" />
        <div className={styles.recordOverlay}>
          <div className={styles.recordInner}>
            <div>
              <span className={styles.recordLabel}>Field record · 콘크리트 포장</span>
              <h2 id="record-title" className={styles.recordTitle}>
                포장은 마감이 아니라
                <br />
                구조입니다
              </h2>
              <p className={styles.recordText}>
                지반이 다져지고, 배수가 빠지고, 그 위에 포장이 올라갑니다.
                눈에 보이는 줄눈보다 그 아래의 순서가 오래가는 단지를 만듭니다.
              </p>
              <div className={styles.recordTags}>
                <span className={styles.recordTag}>지반 다짐</span>
                <span className={styles.recordTag}>배수 구배</span>
                <span className={styles.recordTag}>줄눈</span>
                <span className={styles.recordTag}>검측</span>
              </div>
              <p className={styles.recordNote}>
                이미지는 현장 기록용 참고 이미지입니다. 실제 오주건설 시공
                사진과 프로젝트 정보는 발주처 동의 후 공개합니다.
              </p>
            </div>

            <div className={styles.recordSide}>
              <dl>
                <div>
                  <dt>공종</dt>
                  <dd>콘크리트 포장 · 배수 · 지반</dd>
                </div>
                <div>
                  <dt>확인</dt>
                  <dd>평탄성 · 구배 · 다짐 · 줄눈</dd>
                </div>
                <div>
                  <dt>기준</dt>
                  <dd>시공 전 간섭 체크, 시공 중 검측, 준공 후 하자 대응</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Matrix */}
      <section id="matrix" className={styles.section} aria-labelledby="matrix-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 id="matrix-title" className={styles.sectionTitle}>
              공종과
              <br />
              프로젝트 유형
            </h2>
            <p className={styles.sectionLead}>
              아파트 신축·재건축·유지보수에서 반복되는 범위를 정리했습니다.
              실제 준공 실적과 상세 자료는 발주처 동의 후 순차 공개합니다.
              현재 단계에서는 <strong>공종별 시공 가능 범위</strong>를 먼저
              확인하실 수 있습니다.
            </p>
          </div>

          <div className={styles.matrixWrap}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th scope="col">공종</th>
                  <th scope="col">아파트 신축</th>
                  <th scope="col">재건축·재개발</th>
                  <th scope="col">유지보수</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td><MatrixDot state={row.newBuild} /></td>
                    <td><MatrixDot state={row.rebuild} /></td>
                    <td><MatrixDot state={row.maintenance} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.matrixLegend} aria-hidden="true">
            <span><i className={styles.matrixDot} /> 가능</span>
            <span><i className={`${styles.matrixDot} ${styles.matrixDotPartial}`} /> 부분 가능</span>
            <span><i className={`${styles.matrixDot} ${styles.matrixDotNone}`} /> 해당 없음</span>
          </div>
          <div className={styles.sectionFoot}>
            <a href="#contact" className={styles.textLink}>
              실적 자료 요청 <span aria-hidden="true">→</span>
            </a>
            <Link href="/portfolio" className={styles.textLink}>
              시공실적 페이지 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className={styles.section} aria-labelledby="process-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 id="process-title" className={styles.sectionTitle}>
              상담부터 준공까지
            </h2>
            <p className={styles.sectionLead}>
              현장을 먼저 읽고, 공종 간 접점을 정리한 뒤, 시공과 검측을
              기록으로 남깁니다. 준공 후 하자 대응까지 같은 창구로 이어집니다.
            </p>
          </div>

          <div className={styles.processList}>
            {process.map((step) => (
              <div key={step.id} className={styles.processStep}>
                <span className={styles.processNum}>{step.id}</span>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section id="standards" className={styles.standards} aria-labelledby="standards-title">
        <div className={styles.standardsInner}>
          <div className={styles.standardsHead}>
            <h2 id="standards-title" className={styles.standardsTitle}>
              공정은 줄이고,
              <br />
              <em>기록은 남깁니다</em>
            </h2>
            <p className={styles.standardsLead}>
              현장에서 지키는 네 가지 기준. 말이 아니라 매일의 기록으로
              남깁니다. 안전·품질 문서는 상담 시 요청하시면 확인하실 수
              있습니다.
            </p>
          </div>

          <div className={styles.standardGrid}>
            {standards.map((item) => (
              <div key={item.title} className={styles.standardItem}>
                <span className={styles.standardLabel}>{item.label}</span>
                <h3 className={styles.standardTitle}>{item.title}</h3>
                <p className={styles.standardText}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company */}
      <section id="company" className={styles.section} aria-labelledby="company-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 id="company-title" className={styles.sectionTitle}>
              현장을 맡는 사람,
              <br />
              책임지는 회사
            </h2>
            <p className={styles.sectionLead}>
              현장소장·공무·품질·안전이 한 팀으로 움직입니다. 회사 정보는
              아래에 그대로 표기합니다. 동명의 다른 법인과 구분하기 위해
              상호·대표·사업자등록번호·소재지를 함께 확인해 주세요.
            </p>
          </div>

          <div className={styles.orgGrid}>
            <div className={styles.orgBlock}>
              <h3>현장 조직</h3>
              <div className={styles.orgTable}>
                {org.map((row) => (
                  <div key={row.role} className={styles.orgRow}>
                    <span className={styles.orgRole}>{row.role}</span>
                    <span className={styles.orgDuty}>{row.duty}</span>
                  </div>
                ))}
              </div>
              <p className={styles.orgDuty} style={{ marginTop: 14 }}>
                장비·자재·전문 인력은 현장 조건과 공정에 맞춰 구성하며, 발주처
                협의 후 확정합니다.
              </p>
            </div>

            <div className={styles.orgBlock}>
              <h3>법인 정보</h3>
              <div className={styles.orgTable}>
                <div className={styles.orgRow}>
                  <span className={styles.orgRole}>상호</span>
                  <span className={styles.orgDuty}>{env.company.name}</span>
                </div>
                <div className={styles.orgRow}>
                  <span className={styles.orgRole}>대표</span>
                  <span className={styles.orgDuty}>{env.company.ceo}</span>
                </div>
                <div className={styles.orgRow}>
                  <span className={styles.orgRole}>설립</span>
                  <span className={styles.orgDuty}>{env.company.foundedYear}년</span>
                </div>
                <div className={styles.orgRow}>
                  <span className={styles.orgRole}>소재지</span>
                  <span className={styles.orgDuty}>{env.company.address}</span>
                </div>
                <div className={styles.orgRow}>
                  <span className={styles.orgRole}>사업자등록번호</span>
                  <span className={styles.orgDuty}>{env.company.businessNumber}</span>
                </div>
                <div className={styles.orgRow}>
                  <span className={styles.orgRole}>연락처</span>
                  <span className={styles.orgDuty}>
                    <a href={`tel:${env.company.phone}`}>{env.company.phone}</a>
                    {" · "}
                    <a href={`mailto:${env.company.email}`}>{env.company.email}</a>
                  </span>
                </div>
              </div>
              <div className={styles.sectionFoot}>
                <Link href="/about" className={styles.textLink}>
                  회사소개·연혁 보기 <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={styles.contact} aria-labelledby="contact-title">
        <div className={styles.contactInner}>
          <div className={styles.contactHead}>
            <div>
              <h2 id="contact-title" className={styles.contactTitle}>
                현장 자료를
                <br />
                보내주세요
              </h2>
              <a href={`tel:${env.company.phone}`} className={styles.contactPhone}>
                {env.company.phone}
              </a>
            </div>
            <p className={styles.contactLead}>
              현장 위치, 공종, 규모, 희망 시기를 알려주시면 검토 후
              연락드립니다. 발주처·협력업체·채용 문의를 구분해 접수합니다.
              영업일 1일 이내 회신을 원칙으로 합니다.
            </p>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <span className={styles.contactLabel}>발주처·사업주</span>
              <a href={`mailto:${env.company.email}?subject=${encodeURIComponent("현장 상담 문의")}`} className={styles.contactValue}>
                현장 상담
              </a>
              <p className={styles.contactNote}>
                도면·현장 사진·공종 범위를 보내주시면 검토 후 회신드립니다.
              </p>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactLabel}>협력업체</span>
              <a href={`mailto:${env.company.email}?subject=${encodeURIComponent("협력업체 등록 문의")}`} className={styles.contactValue}>
                협력업체 등록
              </a>
              <p className={styles.contactNote}>
                업종, 보유 장비, 인력, 실적을 보내주시면 검토합니다.
              </p>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactLabel}>채용</span>
              <a href={`mailto:${env.company.email}?subject=${encodeURIComponent("채용 지원")}`} className={styles.contactValue}>
                입사 지원
              </a>
              <p className={styles.contactNote}>
                현장소장·공무·품질·안전·기능인력 상시 채용.
              </p>
            </div>
          </div>

          <RenewalContactForm />
        </div>
      </section>
    </main>
  );
}
