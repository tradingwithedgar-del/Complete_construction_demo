# Design record

## The badge decides the page

The client's identity is a circular gold-on-black badge. It already carries
the name, the trade, the tagline and the state, set in its own lettering.
Three things follow from that, and they are the whole layout:

1. **A gold-on-black badge only reads on a dark field.** So the page has dark
   bands — header, hero, one statement band, footer, the mobile action bar —
   and light paper everywhere else. The badge appears only on the dark.
2. **The badge is the `<h1>`.** Setting "Complete Construction" in type beside
   a logo that already says "Complete Construction" is saying everything
   twice. The heading is the badge image; its `alt` is the name, translated
   with the rest of the page, so search engines and screen readers get the
   same string a sighted visitor reads off the coin.
3. **It is the only circle in the build.** Every other corner is 0px. That is
   what stops the badge reading as one more rounded ornament.

## The palette, and the rule it had to get around

The standing rule is that a client demo never lands in dark-ground-plus-gold:
it is the stock "luxury trade" costume, and it is Grand Nash Studio's own
house style, so it is generic and off-brand at the same time. **It applies
even when the client's own print material is black and gold — which this one
is.** The resolution is the documented one: promote a secondary colour out of
the client's real identity, demote gold to hairlines, put it all on light.

The secondary colour here is not invented. It is sampled from the botanical
wall covering in the powder room Adolfo actually built and photographed —
`#485848` / `#384848` off the tiles in `images/gallery/bathrooms/`. The page
ground is the limestone and plaster from the same photographs. So the green on
the buttons and the green on the wall in the gallery are the same green, and
the page is built out of the client's own finished work rather than out of the
category's idea of expensive.

```
--ground     #F4F1EA   warm limestone paper, from his own marble and plaster
--ground-2   #EAE5DA   alternating ground
--panel      #FFFFFF   raised surfaces
--black      #14100C   the badge's field: header, hero, creed band, footer

--ink        #1E1913
--ink-soft   #4E463C
--ink-dim    #7A7163
--rule       #D6CEBF

--accent     #2E4033   promoted from his powder-room wall covering
--accent-2   #1F2C23
--accent-ink #F6F3EC

--brass      #B49059   sampled off the badge; hairlines and the badge only
--brass-lit  #E7CE96
```

Gold does exactly three jobs on this page, and no others: it is the badge, it
is the 13px hairline in front of a listed fact, and it is the single rule at
the edge where a dark band meets the paper. It is never a fill, never a button,
never a heading.

### The inverted scope

The dark bands re-declare the same tokens rather than owning a second set of
component rules, so every block works unchanged on either ground. They also
re-declare `color`, because a custom property inherits but an inherited
*colour* does not re-resolve it — `body`'s colour was already computed from
the light `--ink`, and without that line every heading inside a dark band
inherits it and disappears.

## Type

- **Archivo** — display, expanded, caps for headings. Self-hosted.
- **Source Serif 4** — body. Self-hosted.
- **IBM Plex Mono** — measurement, labels on real data, the badge's tagline
  where it is set as text. Never as a costume for "technical".

## Motion

**One authored moment: the hero video.** Everything else on the page is still.
No section entrances, no scroll reveals, no parallax.

## Bans carried from the craft floor

- No eyebrow or kicker above a heading.
- No same-size card grids as page structure. Services are editorial rows.
- No gradient text, no decorative glass, no coloured left borders above 1px.
- No dark ground with gold accents (see above).

## Structure

1. Hero — the badge over the build video
2. Who this is and how to reach them
3. What we build
4. Finished work, and materials from finished work
5. **Built right. Finished strong.** — the one dark band in the body
6. What your proposal says: Included / Not included
7. Start a project
8. Footer

The creed band sits at 5 on purpose. It is the bridge: "finished strong" is a
claim about what is behind the surface, and the proposal immediately below is
where that claim is actually enforced in writing.

## Hero mechanic

One video, played once on load, holding on its last frame. It never loops: a
build that restarts every ten seconds reads as a glitch and throws away the
finished-home ending, which is the frame the badge sits on.

The first scroll, tap or keypress jumps to the end. Reduced motion never plays
at all and parks on the final frame. A missing file, an unsupported codec,
blocked autoplay or no JavaScript all land on the poster — which is the
video's own final frame, the finished house with its lights on, with the badge
centred over it. Every fail state is the best frame in the clip.

Seeking to that final frame needs two things that are easy to get wrong: the
host must answer HTTP Range requests, and the seek must be clamped to what is
actually buffered and retried as more arrives. Without either, the seek is
silently dropped and the video resets to frame zero — putting the opening
sketch on screen, the worst possible frame to fall back to.

`--hdr` (the measured header height) carries a `112px` default in CSS rather
than `0`, so the hero composes correctly in the moment before `app.js` runs,
and for good if it never does.
