import { NextRequest } from "next/server";

interface InquiryPayload {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  quantity: string;
  message?: string;
  productId: string;
  productModel: string;
  productSpec: string;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "无效的请求格式" }, { status: 400 });
  }

  const payload = body as Partial<InquiryPayload>;

  // Basic validation
  if (!payload.name || !payload.email || !payload.quantity || !payload.productId) {
    return Response.json({ error: "缺少必填字段" }, { status: 422 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    return Response.json({ error: "邮箱格式不正确" }, { status: 422 });
  }

  // Log inquiry (replace with email delivery in production)
  console.log("=== 新询价请求 ===", {
    timestamp: new Date().toISOString(),
    product: `${payload.productModel} (${payload.productSpec})`,
    contact: {
      name: payload.name,
      company: payload.company || "—",
      email: payload.email,
      phone: payload.phone || "—",
    },
    quantity: payload.quantity,
    message: payload.message || "—",
  });

  // TODO: Send email notification via Resend / Nodemailer / SendGrid
  // Example with Resend:
  // await resend.emails.send({
  //   from: "noreply@penta.com",
  //   to: "sales@penta.com",
  //   subject: `新询价 — ${payload.productModel}`,
  //   html: buildEmailHtml(payload as InquiryPayload),
  // });

  return Response.json({ success: true }, { status: 200 });
}
