/* ==========================================================================
   Secure lead endpoint
   --------------------------------------------------------------------------
   The browser posts a lead here. This function validates it, then forwards
   it to n8n (or any CRM webhook) using a secret held server-side.

   The webhook URL is NEVER sent to the browser.

   SETUP
   1. In Netlify: Site configuration -> Environment variables, add
        N8N_WEBHOOK_URL   = https://<your-n8n-host>/webhook/<path>
      and optionally
        N8N_WEBHOOK_TOKEN = <a shared secret you also check inside n8n>
   2. Redeploy. The frontend already posts to /api/lead (see `lead.endpoint`
      in assets/site.config.js).
   3. Until N8N_WEBHOOK_URL is set this returns 501, and the frontend falls
      back to Web3Forms if a key is configured, or shows a preview notice.

   Deliberately dependency-free so it needs no build step.
   ========================================================================== */

const FIELDS = [
  "name", "phone", "email", "townOrZip", "projectType",
  "timeframe", "budgetRange", "ownsPropertyOrLot", "spacesIncluded",
  "message", "sourcePage", "submittedAt"
];

const MAX_LEN = 2000;
const RATE_LIMIT = { windowMs: 60000, max: 5 };
const hits = new Map(); // best-effort, per warm instance

function clean(v) {
  // Strip control characters, collapse whitespace, cap the length.
  return String(v === undefined || v === null ? "" : v)
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_LEN);
}

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.start > RATE_LIMIT.windowMs) {
    hits.set(ip, { start: now, n: 1 });
    return false;
  }
  rec.n += 1;
  return rec.n > RATE_LIMIT.max;
}

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });

export default async (request) => {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  const ip = request.headers.get("x-nf-client-connection-ip") || "unknown";
  if (rateLimited(ip)) {
    return json(429, { ok: false, error: "Too many submissions. Please try again shortly." });
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return json(400, { ok: false, error: "Invalid JSON" });
  }

  // Honeypot: a real person never fills this in.
  if (clean(body.botcheck)) {
    return json(200, { ok: true });
  }

  const lead = {};
  for (const f of FIELDS) { lead[f] = clean(body[f]); }

  if (!lead.name || !lead.phone || !lead.message) {
    return json(422, { ok: false, error: "Name, phone and project details are required." });
  }
  if (lead.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
    return json(422, { ok: false, error: "That email address does not look right." });
  }

  // Stamp server-side so the timestamp cannot be spoofed by the client.
  lead.submittedAt = new Date().toISOString();
  lead.userAgent = clean(request.headers.get("user-agent"));

  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) {
    // Not configured yet. 501 tells the frontend to use its fallback.
    return json(501, { ok: false, error: "Lead forwarding is not configured." });
  }

  const headers = { "Content-Type": "application/json" };
  if (process.env.N8N_WEBHOOK_TOKEN) {
    headers["X-Webhook-Token"] = process.env.N8N_WEBHOOK_TOKEN;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) {
      console.error("n8n rejected the lead:", res.status);
      return json(502, { ok: false, error: "Could not deliver the enquiry." });
    }
  } catch (err) {
    console.error("n8n forward failed:", err && err.message);
    return json(502, { ok: false, error: "Could not deliver the enquiry." });
  }

  return json(200, { ok: true });
};

export const config = { path: "/api/lead" };
