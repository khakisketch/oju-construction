import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "오주건설(주) 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16 md:pt-32 md:pb-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">개인정보처리방침</h1>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="text-gray-600 leading-relaxed">
              오주건설(주)(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다.
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
              이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>견적 문의 및 상담 접수</li>
              <li>프로젝트 관련 연락 및 회신</li>
              <li>서비스 개선을 위한 통계 분석</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">2. 수집하는 개인정보 항목</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>필수항목: 성명, 연락처</li>
              <li>선택항목: 이메일, 소속(회사명), 문의 내용</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">3. 개인정보의 보유 및 이용 기간</h2>
            <p className="text-gray-600 leading-relaxed">
              회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              단, 관련 법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
              <li>문의 접수 기록: 3년 (전자상거래법)</li>
              <li>계약 관련 기록: 5년 (상법)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-600 leading-relaxed">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 법령의 규정에 의한 경우 또는 이용자의 별도 동의가 있는 경우에 한하여 제공할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">5. 개인정보의 파기 절차 및 방법</h2>
            <p className="text-gray-600 leading-relaxed">
              회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체 없이 해당 개인정보를 파기합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">6. 개인정보 보호 책임자</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600">성명: 이자영 (대표이사)</p>
              <p className="text-gray-600">연락처: 043-265-6010</p>
              <p className="text-gray-600">이메일: thdgjs6560@hanmail.net</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">7. 개인정보처리방침 변경</h2>
            <p className="text-gray-600 leading-relaxed">
              이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.
              변경 사항이 있을 경우 웹사이트를 통하여 공지할 예정입니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
