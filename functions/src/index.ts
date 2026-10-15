import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();
const db = admin.firestore();

const smtpEmail = defineSecret("SMTP_EMAIL");
const smtpPassword = defineSecret("SMTP_PASSWORD");

interface ContactData {
  name: string;
  phone: string;
  place: string;
  category: string[];
  message: string;
}

interface NotificationEmail {
  email: string;
  enabled: boolean;
}

export const onNewContact = onDocumentCreated(
  {
    document: "contacts/{contactId}",
    region: "asia-northeast3",
    secrets: [smtpEmail, smtpPassword],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const data = snapshot.data() as ContactData;

    const notifDoc = await db.doc("settings/notifications").get();
    if (!notifDoc.exists) { logger.warn("No notification settings found"); return; }

    const notifData = notifDoc.data();
    const emails: NotificationEmail[] = notifData?.emails ?? [];
    const activeEmails = emails.filter((e) => e.enabled).map((e) => e.email);
    if (activeEmails.length === 0) { logger.info("No active notification emails"); return; }

    const email = smtpEmail.value();
    const password = smtpPassword.value();
    if (!email || !password) { logger.error("SMTP secrets missing"); return; }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: email, pass: password },
    });

    const placeLabel = data.place || "-";
    const categoryLabel = Array.isArray(data.category) ? data.category.join(", ") : (data.category || "-");
    const messageLabel = data.message || "-";

    const subject = `[오주건설] 새 문의가 접수되었습니다 - ${data.name}님`;

    const text = `[오주건설] 새 문의가 접수되었습니다

■ 문의자 정보
- 이름: ${data.name}
- 연락처: ${data.phone}

■ 문의 내용
- 공사 장소: ${placeLabel}
- 공사 유형: ${categoryLabel}
- 추가 요청: ${messageLabel}

■ 관리자 페이지에서 확인:
https://ojuec.co.kr/admin/contacts
`;

    const now = new Date();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${days[now.getDay()]}) ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const categoryBadges = (Array.isArray(data.category) ? data.category : [data.category || "-"])
      .map((c: string) => `<span style="display: inline-block; background: #f0f4f9; color: #0e2f64; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 12px; margin: 2px 4px 2px 0;">${c}</span>`)
      .join("");

    const html = `
<table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;">

  <tr><td style="background: #0e2f64; padding: 22px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td><div style="font-size: 16px; font-weight: 700; color: #ffffff;">오주건설(주)</div></td>
        <td align="right"><div style="font-size: 12px; color: #8aaad4;">OJUCONSTRUCTION</div></td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding: 32px 40px;">
    <div style="font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 6px;">
      <span style="color: #0e2f64;">${data.name}</span>님이 견적을 문의했습니다
    </div>
    <div style="font-size: 13px; color: #9ca3af; margin-bottom: 24px;">${dateStr}</div>

    <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
      <div style="background: #f9fafb; padding: 10px 18px; border-bottom: 1px solid #e5e7eb;">
        <span style="font-size: 12px; font-weight: 600; color: #6b7280; letter-spacing: 0.5px;">문의자 정보</span>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 14px 18px; border-bottom: 1px solid #f3f4f6; width: 50%;">
            <div style="font-size: 11px; color: #9ca3af; margin-bottom: 3px;">이름</div>
            <div style="font-size: 14px; color: #111827; font-weight: 600;">${data.name}</div>
          </td>
          <td style="padding: 14px 18px; border-bottom: 1px solid #f3f4f6;">
            <div style="font-size: 11px; color: #9ca3af; margin-bottom: 3px;">연락처</div>
            <div style="font-size: 14px; font-weight: 600;"><a href="tel:${data.phone}" style="color: #0e2f64; text-decoration: none;">${data.phone}</a></div>
          </td>
        </tr>
      </table>
    </div>

    <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
      <div style="background: #f9fafb; padding: 10px 18px; border-bottom: 1px solid #e5e7eb;">
        <span style="font-size: 12px; font-weight: 600; color: #6b7280; letter-spacing: 0.5px;">문의 내용</span>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 14px 18px; border-bottom: 1px solid #f3f4f6; width: 40%;">
            <div style="font-size: 11px; color: #9ca3af; margin-bottom: 3px;">공사 장소</div>
            <div style="font-size: 14px; color: #111827; font-weight: 500;">${placeLabel}</div>
          </td>
          <td style="padding: 14px 18px; border-bottom: 1px solid #f3f4f6;">
            <div style="font-size: 11px; color: #9ca3af; margin-bottom: 3px;">공사 유형</div>
            <div style="font-size: 14px; color: #111827;">${categoryBadges}</div>
          </td>
        </tr>
      </table>
      ${data.message ? `<div style="padding: 16px 18px;">
        <div style="font-size: 11px; color: #9ca3af; margin-bottom: 6px;">추가 요청사항</div>
        <div style="background: #f9fafb; border-left: 3px solid #0e2f64; padding: 14px 16px; font-size: 14px; color: #374151; line-height: 1.7; white-space: pre-wrap;">${data.message}</div>
      </div>` : ""}
    </div>

    <div style="text-align: center;">
      <a href="https://ojuec.co.kr/admin/contacts" style="display: inline-block; padding: 12px 32px; background: #0e2f64; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">관리자 페이지에서 확인</a>
    </div>
  </td></tr>

  <tr><td style="padding: 20px 40px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <div style="font-size: 12px; color: #9ca3af; line-height: 1.6;">
            오주건설(주) | TEL 043-265-6010<br>
            충청북도 청주시 상당구 용암북로160번길 20
          </div>
        </td>
        <td align="right" valign="bottom">
          <a href="https://ojuec.co.kr" style="font-size: 12px; color: #9ca3af; text-decoration: none;">ojuec.co.kr</a>
        </td>
      </tr>
    </table>
  </td></tr>

</table>`;

    const mailOptions = {
      from: `"오주건설 알림" <${email}>`,
      to: activeEmails.join(", "),
      subject,
      text,
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Notification sent to ${activeEmails.length} recipients`);
    } catch (error) {
      logger.error("Failed to send notification email:", error);
    }
  }
);
