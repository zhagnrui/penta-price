import { NextRequest } from "next/server";
import { Resend } from "resend";

const NOTIFY_EMAIL = "ryan139@gmail.com";

interface InquiryPayload {
  name: string;
  company: string;
  industry: string;
  grade: string;
  volume: string;
  contact: string;
  notes?: string;
}

function buildHtml(p: InquiryPayload): string {
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:8px 12px;font-weight:600;color:#4a6b5a;white-space:nowrap;background:#f4faf7;border-bottom:1px solid #e1f5ee">${label}</td>
      <td style="padding:8px 12px;color:#1a2e25;border-bottom:1px solid #e1f5ee">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f7f3;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(15,110,86,0.1)">

    <div style="background:linear-gradient(135deg,#1D9E75,#085041);padding:24px 28px">
      <div style="font-size:11px;color:#9FE1CB;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px">PentaPrice · 新询盘 / New inquiry</div>
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff">季戊四醇询价通知</h1>
      <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.75)">Pentaerythritol Quote Request</p>
    </div>

    <div style="padding:24px 28px">
      <table style="width:100%;border-collapse:collapse;font-size:14px;border-radius:8px;overflow:hidden;border:1px solid #e1f5ee">
        ${row("姓名 / Name", p.name)}
        ${row("公司 / Company", p.company)}
        ${row("行业 / Industry", p.industry)}
        ${row("规格 / Grade", p.grade)}
        ${row("月用量 / Volume", `${p.volume} 吨/t`)}
        ${row("联系方式 / Contact", p.contact)}
        ${row("备注 / Notes", p.notes || "—")}
      </table>

      <div style="margin-top:20px;padding:14px;background:#e1f5ee;border-radius:8px;font-size:12px;color:#4a6b5a">
        📅 收到时间 / Received: ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })} (CST)<br>
        📧 请直接回复此邮件联系询盘方 / Reply to this email to follow up
      </div>
    </div>

    <div style="padding:16px 28px;background:#f4faf7;border-top:1px solid #e1f5ee;font-size:11px;color:#7a9e8a;text-align:center">
      PentaPrice · www.pentaprice.com · 数据仅供参考
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "无效的请求格式" }, { status: 400 });
  }

  const p = body as Partial<InquiryPayload>;

  // Validate required fields
  if (!p.name || !p.company || !p.industry || !p.grade || !p.volume || !p.contact) {
    return Response.json({ error: "缺少必填字段" }, { status: 422 });
  }

  const payload = p as InquiryPayload;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "PentaPrice询盘 <noreply@pentaprice.com>",    // ← Resend 验证域名后生效；未验证时用 onboarding@resend.dev
      to: NOTIFY_EMAIL,
      replyTo: payload.contact.includes("@") ? payload.contact : undefined,
      subject: `季戊四醇询价 — ${payload.company} · ${payload.grade}`,
      html: buildHtml(payload),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error: "邮件发送失败，请直接发邮件至 " + NOTIFY_EMAIL }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ error: "服务器错误" }, { status: 500 });
  }
}
