import { EmailMessage } from "cloudflare:email";

// Where booking requests land + the verified sender domain.
const TO = "lushfund@protonmail.ch";
const FROM = "bookings@goolz.org";

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const clean = (s, max) => String(s == null ? "" : s).replace(/[\r\n]+/g, " ").trim().slice(0, max);
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// RFC 5322 encoded-word for a header value (keeps Unicode names safe).
const encHeader = (s) => "=?UTF-8?B?" + btoa(unescape(encodeURIComponent(s))) + "?=";

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "invalid request" }, 400);
  }

  // Honeypot: real users never fill this.
  if (data.company) return json({ ok: true });

  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const when = clean(data.when, 160);
  const alt1 = clean(data.alt1, 160);
  const alt2 = clean(data.alt2, 160);
  const note = String(data.note == null ? "" : data.note).trim().slice(0, 2000);

  if (!name || !email || !when || !note) {
    return json({ error: "missing required fields" }, 400);
  }
  if (!isEmail(email)) {
    return json({ error: "invalid email address" }, 400);
  }

  const subject = `Booking request from ${name}`;
  const bodyLines = [
    `New booking request via penn.goolz.org/booking`,
    ``,
    `Name:            ${name}`,
    `Email:           ${email}`,
    `Preferred time:  ${when}`,
    `Backup 1:        ${alt1 || "-"}`,
    `Backup 2:        ${alt2 || "-"}`,
    ``,
    `Message:`,
    note,
    ``,
    `--`,
    `Reply to this email to reach ${name} directly.`,
  ];
  const body = bodyLines.join("\r\n");

  const boundaryId = crypto.randomUUID();
  const messageId = `<${crypto.randomUUID()}@goolz.org>`;
  const date = new Date().toUTCString();

  const raw = [
    `From: Penn Booking <${FROM}>`,
    `To: <${TO}>`,
    `Reply-To: ${encHeader(name)} <${email}>`,
    `Message-ID: ${messageId}`,
    `Date: ${date}`,
    `Subject: ${encHeader(subject)}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    // base64 body, wrapped at 76 chars per RFC 2045
    btoa(unescape(encodeURIComponent(body))).replace(/(.{76})/g, "$1\r\n"),
  ].join("\r\n");

  try {
    const msg = new EmailMessage(FROM, TO, raw);
    await env.EMAIL.send(msg);
  } catch (err) {
    return json({ error: "could not send — try the direct email link" }, 502);
  }

  return json({ ok: true });
}
