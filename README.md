# Complete Construction & Home Solutions LLC — website

Private preview. Not a live site.

Static site, no framework, no build step. Plain HTML, CSS and vanilla JS, plus one
optional Netlify Function for secure lead forwarding.

```
index.html                  the page
assets/site.config.js       ALL editable content flags — start here
assets/styles.css           stylesheet
assets/app.js               behaviour (menu, tabs, lightbox, form)
netlify.toml                headers and caching
images/                     project photos and material crops
fonts/                      self-hosted Archivo, Source Serif 4, IBM Plex Mono (OFL)
```

## Run it locally

No install step. Any static server will do:

```bash
npx http-server -p 8080 .
# then open http://localhost:8080
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

## The contact form

The form posts straight to [Web3Forms](https://web3forms.com), which emails the
enquiry to whichever inbox the access key was created against. No server, no build
step, nothing to maintain.

**Setup, once:** create a free key at web3forms.com using the business email that
should receive enquiries, then paste it into `assets/site.config.js`:

```js
form: {
  web3formsAccessKey: "paste-the-key-here",
```

That is the whole integration. To change where enquiries land, change the key.

A Web3Forms access key is public by design. It names the destination inbox, it is not
a credential, and it cannot be used to read anything back, so it is safe in a file
that ships to the browser.

**Until the key is filled in the form refuses to submit and says so.** It never shows
a false confirmation, so a real customer cannot come away believing an enquiry was
sent when nothing was.

### What Adolfo receives

Field names double as the labels in the email, so it reads as a message rather than a
database dump. The subject carries the project type and town, so enquiries can be
triaged from the inbox list without opening them:

```
Subject: New project enquiry — Whole-home renovation — Jackson, 08527
Reply-to: maria@example.com

Name              Maria Alvarez
Phone             7325550123
Email             maria@example.com
Town or ZIP       Jackson, 08527
Project type      Whole-home renovation
Project details   Kitchen plus two bathrooms, hoping to start in spring.
Desired start     In the next 1 to 3 months
Spaces included   Kitchen, two bathrooms
Sent from         home page
```

Optional answers appear only when they were filled in, so the email is not padded
with empty rows. Reply-to is set to the customer's address, so hitting reply in any
mail client reaches them directly.

A hidden honeypot field catches bots. Web3Forms drops anything that fills it.

### Photo upload

Not built. A fake upload that silently discards a homeowner's photos is worse than no
upload at all. If photos matter, the simplest route is text messages to the business
number — enable `smsEnabled` in the config once the owner confirms the number
receives SMS, and the "Text us photos" option appears.

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
