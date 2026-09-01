# Complete Construction & Home Solutions LLC — website

Private demo build for Adolfo (Complete Construction & Home Solutions LLC, New Jersey).
Single static page, no build step. Open `index.html` or serve the folder.

```
index.html          the whole site (HTML + CSS + JS inline)
images/             project photos and logo crops
fonts/              self-hosted Archivo, Source Serif 4, IBM Plex Mono (SIL OFL)
```

## Before this goes live — three things

**1. Connect the contact form.**
Create a free Web3Forms access key at https://web3forms.com using the business email
that should receive enquiries, then replace the placeholder in `index.html`:

```html
<input type="hidden" name="access_key" value="REPLACE_WITH_WEB3FORMS_ACCESS_KEY">
```

Until that key is set the form deliberately refuses to submit and says so. It never
shows a fake "thank you", so nobody can believe a message was sent when it wasn't.

**2. Turn on search indexing.**
Delete this line from `<head>`:

```html
<meta name="robots" content="noindex, nofollow">
```

It is there on purpose. An unapproved demo carrying a real business name should not
appear in Google.

**3. Remove the preview banner.**
Delete the `<div class="demo-flag">…</div>` element just inside `<body>`.

Also update the canonical URL and the two `og:*` image/URL values in `<head>` once the
real domain is known. They currently point at `completeconstructionnj.com`, which is a
guess, not a registered domain.

## Deploying to Netlify

`netlify.toml` is set up already. Two ways in:

**Drag and drop (fastest, no account link needed).** Go to https://app.netlify.com/drop
and drop the folder, or `complete-construction-netlify.zip` if one was built. You get a
live URL in a few seconds. Rename the site under Site configuration → Change site name
to get something like `complete-construction-preview.netlify.app`.

**Connect the repo (better once he says yes).** New site → Import from Git → pick this
repo and branch. Build command stays empty, publish directory is `.`. Every push then
redeploys on its own.

To put it on his own domain: Domain management → Add a domain, then point the domain's
DNS at Netlify. HTTPS is issued automatically and free.

The config sets security headers, caches images and fonts for a year while leaving HTML
uncached so edits appear immediately, and sends `X-Robots-Tag: noindex, nofollow` on
everything. That last one is a preview guard and is marked in the file for removal at
launch, alongside the meta tag in `index.html`.

Note: Netlify's password protection is a paid feature. On the free tier the URL is
public to anyone who has it, which is why both noindex layers and the on-page preview
banner matter.

## Still outstanding

- **NJ Home Improvement Contractor registration (13VH…).** Not on the page anywhere.
  New Jersey requires registered contractors to display the number in advertising. If
  Adolfo has one, add it to the footer. If he does not, leave the page as it is — there
  is deliberately no "licensed" or "registered" wording anywhere in the copy.
- **Photo permission.** Every image is a frame from video Adolfo sent, colour corrected.
  Confirm he is happy for them to be public before the site is indexed.
- **Higher-resolution photos.** Source video was 544x960 after phone compression. Originals
  straight off his phone would be roughly four times the resolution. Drop-in replacements,
  no layout changes needed.
- **Service area.** Ocean, Monmouth, Middlesex and Hudson are listed. Confirm with him.

## Claims on the page, and where they come from

Everything factual traces to Adolfo's own written proposals. Nothing was invented.

| Claim | Source |
|---|---|
| One-year workmanship warranty | Stated in both of his proposals |
| Fully insured, COI on request | His own wording, Zuli proposal footer |
| Written scope with exclusions | Both proposals |
| Change orders approved in writing | Both proposals |
| Staged payments tied to progress | Both proposals |
| Homeowner supplies finish materials on labor-only scopes | Zuli proposal, Material Responsibility |

There are no review counts, star ratings, years-in-business figures, named testimonials,
license claims, or award claims, because none of those could be verified.

## Structure

Deliberately not hero / services / testimonials / CTA. Services are absorbed into the
phase rail, because showing capability as a sequence is more persuasive here than an
icon grid, and an icon grid was the one section that could have been lifted onto any
other contractor's site.

1. **Hero** — asymmetric, image right, claim left
2. **Finish schedule** — six material details cropped from his own photos, labelled
   M-01 to M-06 like a real finish schedule. Placed before any service copy so the
   first thing after the hero is evidence, not assertion
3. **Finished rooms** — three projects, P-01 to P-03
4. **Every phase handled** — an interactive phase rail, six phases, full tablist
   keyboard support. Dramatises the tagline rather than repeating it
5. **What your proposal says** — a two-column ledger, Included against Not included
6. **Where we work**
7. **Start a project**

## Art direction

Concept: a job ticket that opens into a finished room.

Ground `#16242E` is sampled from the glazed tile in his own shower; brass `#C4A575`
and steel from the logo. Sharp corners throughout, hairline rules, mono type for
anything behaving like a spec label, serif for reading. The dark ground is what lets
his photography sit in the page rather than on it, and it matches a logo that was
drawn for a black field.

## Notes

- English first with a Spanish toggle. Choice persists in `localStorage` and follows the
  browser language on a first visit. `<html lang>` updates with it.
- Fonts are self-hosted rather than loaded from Google, so the page has no third-party
  requests at all. Nothing is tracked and no analytics are installed.
- Responsive to 360px. Verified: no horizontal overflow, no contrast failures, all tap
  targets at least 44px, alt text on every image, single `h1` with no skipped levels,
  `prefers-reduced-motion` respected.
