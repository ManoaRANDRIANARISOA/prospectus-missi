// Supabase Edge Function: notify-booking
// Triggered by a Supabase Database Webhook on INSERT into public.bookings.
// Supports instant notification via Telegram Bot (free, recommended 2-min setup)
// and/or Email via Resend (free tier). Secrets live ONLY in Supabase Secrets.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

interface BookingRecord {
  id: string;
  created_at: string;
  market: string;
  full_name: string;
  organization?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  service_pole: string;
  preferred_date: string;
  preferred_slot: string;
  visitor_timezone?: string | null;
  message?: string | null;
}

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Optional shared webhook secret check
  const expectedSecret = Deno.env.get("WEBHOOK_SECRET");
  if (expectedSecret) {
    const provided = req.headers.get("x-webhook-secret");
    if (provided !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  let payload: { record?: BookingRecord };
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const b = payload.record;
  if (!b) {
    return new Response("Missing record", { status: 400 });
  }

  const lines = [
    `Nouvelle reservation Missi Innovation (${b.market})`,
    `Nom : ${b.full_name}${b.organization ? ` (${b.organization})` : ""}`,
    `Pole : ${b.service_pole}`,
    `Creneau : ${b.preferred_date} | ${b.preferred_slot} EAT (${b.visitor_timezone ?? "N/A"})`,
    `WhatsApp : ${b.whatsapp ?? "-"}`,
    `Email : ${b.email ?? "-"}`,
    b.message ? `Message : ${b.message}` : null,
    `Admin : https://missi-innovation.web.app/admin`,
  ].filter(Boolean);

  const text = lines.join("\n");
  const results: Record<string, string> = {};

  // 1. Telegram Bot (Free, instant mobile push — recommended)
  const tgToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const tgChatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (tgToken && tgChatId) {
    const tgRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: tgChatId, text }),
    });
    results.telegram = tgRes.ok ? "sent" : `error_${tgRes.status}`;
  }

  // 2. Resend Email (Optional free tier)
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const notifyEmail = Deno.env.get("NOTIFY_TO_EMAIL");
  if (resendKey && notifyEmail) {
    const mailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Missi Bookings <onboarding@resend.dev>",
        to: [notifyEmail],
        subject: `[RDV ${b.market}] ${b.full_name} — ${b.service_pole}`,
        text,
      }),
    });
    results.resend = mailRes.ok ? "sent" : `error_${mailRes.status}`;
  }

  return new Response(JSON.stringify({ ok: true, results }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
