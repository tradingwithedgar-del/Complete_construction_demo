# Complete Construction & Home Solutions LLC — product truth

## What this is

A one-page marketing site for a New Jersey residential construction company.
One page, no build step, no framework. Hosted from the client's own GitHub
repository; Netlify is only ever used for preview.

## Who it is for

New Jersey homeowners planning a renovation they have not committed to yet.
They are deciding whether this contractor is trustworthy enough to let into
their house, and most of them have heard a renovation horror story. Many are
Spanish-speaking, and the language choice must be reachable without hunting.

## What the visitor must believe

That this contractor finishes what he starts and tells you the price before he
starts it. The core promise, in the owner's own framing:

> We finish the home, not just the room you can see.

## Mode

**Persuade.** The visitor's success is placing a call or sending an enquiry.

## Product truth

- Full-service residential construction, **not** a bathroom-only remodeler.
  Whole-home renovations, kitchens and bathrooms, additions and
  reconfigurations, custom interiors and architectural millwork.
- Work is sold on a written scope with an explicit *Not included* column. That
  ledger is the trust mechanism and the reason the final invoice matches the
  first number.
- The owner avoids jobs that try to bargain and works at the upper end. The
  site must read as expensive without ever using the word "luxury".
- Tagline on the logo: **Built right. No shortcuts. Every phase handled.**
- Phone: (732) 890-6244. Instagram: `complete__construccion`.

## Hard constraints

- **Never claim** a licence, insurance status, warranty, certification, review
  score, county or service that has not been confirmed in writing by the owner.
  Everything unconfirmed ships behind a flag in `assets/site.config.js`, with
  the markup carrying `hidden` so a claim cannot appear even if JS fails.
- **Never mention Houston, Texas, or any Texas service area.**
- New Jersey requires a 13VH registration number in contractor advertising. The
  owner has not supplied one, so the site carries no licensing language at all.
- No secrets in client code. The Web3Forms access key is public by design and
  is the only key that belongs here.
- The hero renders are **generated concept imagery**, not photographs of
  completed work. They must never be presented as a finished project or placed
  in the portfolio gallery. Only the photographs in `images/gallery/` and the
  video stills are real work.
- Real client photographs were shot in a private customer's home and arrived
  carrying GPS coordinates. Rotation is baked in and all metadata is stripped.
  Any new photograph gets the same treatment before it is committed.

## Audience language

English first, Spanish available from the top of the page on every viewport.
Translation is `data-en` / `data-es` attribute pairs swapped in place — there is
no second page and there never should be.
