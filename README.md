# Complete Construction & Home Solutions LLC — website

Private preview. Not a live site.

Static site, no framework, no build step. Plain HTML, CSS and vanilla JS, plus one
optional Netlify Function for secure lead forwarding.

```
index.html                  the page
assets/site.config.js       ALL editable content flags — start here
assets/styles.css           stylesheet
assets/app.js               behaviour (menu, tabs, lightbox, form)
netlify/functions/lead.mjs  secure lead endpoint (optional, see below)
netlify.toml                headers, caching, functions config
images/                     project photos and material crops
fonts/                      self-hosted Archivo, Source Serif 4, IBM Plex Mono (OFL)
```

## Run it locally

No install step. Any static server will do:

```bash
npx http-server -p 8080 .
# then open http://localhost:8080
```

To run the lead function locally as well:

```bash
npm install -g netlify-cli
netlify dev
```

There is nothing to build and no test suite. Verification is done in a browser at
375, 390, 430, 768, 1024 and 1440px.

---

## Editing content

**`assets/site.config.js` is the only file you need for day-to-day changes.**

Every claim the owner has not confirmed is **off by default**. The markup ships with
`hidden` on it, and it is revealed only when the matching flag is `true`. That means
an unverified claim cannot go live by accident, and it stays hidden even if
JavaScript fails to load.

| Flag | Controls | Currently |
|---|---|---|
| `smsEnabled` | "Text us photos" CTA, photo-by-text note | **off** |
| `spanishSupported` | "Hablamos español", English & Spanish trust item | **off** |
| `licensedAndInsuredClaim` | "Licensed & insured", insurance line in the footer | **off** |
| `warrantyClaim` | One-year workmanship warranty | **off** |
| `testimonials` | Testimonial section | **off** |
| `showRegistrationNumber` | NJ HIC registration line | **off** |

Services are toggled the same way in `services[]`. **New home construction** and
**Structural & exterior work** are disabled pending confirmation.

Service-area counties are toggled in `serviceArea.counties[]`. Ocean and Hudson are
on, because both are evidenced by documented job sites. Monmouth and Middlesex are
off pending confirmation.

Portfolio category filters appear automatically once a second real category exists.
With bathroom work only, the filter row is hidden rather than showing empty tabs.

---

## Lead automation

### Recommended flow

1. The browser validates the form and POSTs JSON to a server endpoint you control.
2. That endpoint validates, sanitises, rate-limits and forwards the lead.
3. The endpoint forwards to an n8n webhook using a secret held server-side.
4. n8n notifies the contractor immediately (SMS or push).
5. n8n sends the homeowner a confirmation.
6. n8n creates a CRM follow-up task.
7. Optional: a missed-call workflow texts back anyone whose call was not answered.

**Never put an n8n webhook URL, CRM key or token in `assets/site.config.js`.** That
file ships to the browser and anyone can read it.

### Connecting it

`netlify/functions/lead.mjs` is the server endpoint. It serves `/api/lead`, which is
what `lead.endpoint` in the config already points at.

In Netlify, under **Site configuration → Environment variables**, add:

```
N8N_WEBHOOK_URL    = https://<your-n8n-host>/webhook/<path>
N8N_WEBHOOK_TOKEN  = <optional shared secret, also checked inside n8n>
```

Redeploy. Until `N8N_WEBHOOK_URL` is set the function returns `501`, and the frontend
falls back to Web3Forms if a key is present, or shows a preview notice.

The function rejects non-POST requests, rate-limits to 5 submissions per minute per
IP, strips control characters, caps field length at 2000 characters, drops honeypot
submissions, requires name/phone/details, and stamps `submittedAt` server-side so it
cannot be spoofed.

### Lead payload

```json
{
  "name": "",
  "phone": "",
  "email": "",
  "townOrZip": "",
  "projectType": "",
  "timeframe": "",
  "budgetRange": "",
  "ownsPropertyOrLot": "",
  "spacesIncluded": "",
  "message": "",
  "sourcePage": "",
  "submittedAt": ""
}
```

`projectType` is one of `whole-home`, `kitchen`, `bathroom`, `addition`, `new-build`,
`millwork`, `exterior`, `unsure`. The server adds `userAgent`.

### Photo upload

Not built. A fake upload that silently discards a homeowner's photos is worse than no
upload at all. Add it once the endpoint has secure file storage; until then the SMS
route is the photo path, and it stays hidden until `smsEnabled` is confirmed.

---

## Deploying to Netlify

**Drag and drop:** https://app.netlify.com/drop, drop the folder. Rename the site
under Site configuration → Change site name.

**Connect the repo:** New site → Import from Git. Build command empty, publish
directory `.`. Functions are picked up from `netlify/functions`.

`netlify.toml` sets security headers, caches images and fonts for a year, leaves HTML
uncached, and sends `X-Robots-Tag: noindex, nofollow` while this is a preview.

Netlify's password protection is a paid feature. On the free tier the URL is public to
anyone who has it, which is why both noindex layers and the on-page preview banner
matter.

---

## Before launch

1. Delete `<meta name="robots" content="noindex, nofollow">` from `index.html`.
2. Delete the `.preview-flag` element at the top of `<body>`.
3. Delete `X-Robots-Tag` from `netlify.toml`.
4. Replace the canonical and Open Graph URLs with the real domain.
5. Work through the owner-approval list below.

## Needs owner approval before launch

Nothing in this list is invented on the site. Where a fact could not be verified the
content is hidden rather than guessed.

| Item | Status |
|---|---|
| Exact services offered | Four enabled. New home construction and exterior/structural work hidden pending confirmation |
| Service area | Ocean and Hudson confirmed by job sites. Monmouth and Middlesex hidden pending confirmation |
| NJ HIC registration (13VH…) | Not on the site. NJ requires it in advertising for registered contractors |
| Insurance wording | Hidden. The owner's proposals say "fully insured, certificate available on request" |
| Warranty wording | Hidden. Both proposals state a one-year workmanship warranty |
| Testimonials / reviews | None on the site. No placeholders either |
| Business address | Not published. Structured data carries region only |
| Business hours | Not published. Omitted from structured data rather than invented |
| Text-message capability | Hidden. Enable `smsEnabled` only if the number receives SMS |
| Project locations and detail | Projects carry no town, date, budget or client name |
| Spanish support | The EN/ES toggle works, but the "Hablamos español" claim is hidden until confirmed |
| Privacy and consent wording | Marked on the page as placeholder, for owner and legal review |
| Photo permission | The images are frames from video the owner sent. Confirm before indexing |
| Image resolution | Source video was 544x960 after phone compression. Originals would be roughly four times that |
