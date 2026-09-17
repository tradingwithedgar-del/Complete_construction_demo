# Design record

## The world: the build record

The page is organised the way a job is documented, not the way a brochure is
laid out. The hero is a building going up; everything below it is the record of
how that happens — what gets built, what has been built, what each phase covers,
what the proposal does and does not include.

The light in the page is the light in the renders. The hero frames are shot at
dusk against a petrol-blue sky with warm interior light; the page carries the
same petrol ground and the same brass light, so the sequence bleeds into the
document rather than sitting on top of it as a banner.

Dark is chosen from the use scene, not the category: this is browsed in the
evening, on a phone, by someone who has been thinking about their house all day.

## Tokens

```
--ground     #16242E   page ground, matches the render sky
--ground-2   #1B2C38   alternating section ground
--panel      #20323E   raised surfaces
--black      #0D161C   header, footer, lightbox
--ink        #EFE9DE   primary text
--ink-soft   #AEBAC2   secondary text, tinted from the ground hue
--ink-dim    #8494A0   tertiary, labels
--brass      #C4A575   the single accent
--brass-deep #9A7F4E   pressed and hover states
--steel      #8A9AA3
--rule       #2E4150   hairlines
```

One accent. Brass marks the thing to act on and nothing else.

## Type

- **Archivo** — display, expanded, caps for headings. Self-hosted.
- **Source Serif 4** — body. Self-hosted.
- **IBM Plex Mono** — used only for measurement, labels on real data, and
  sequence numbers. Never as a costume for "technical".

Corners are 0px everywhere. Nothing on this page is rounded.

## Motion

**One authored moment: the hero opener.** Everything else on the page is still.
No section entrances, no scroll reveals, no parallax.

The build plays once, on load, and is over inside seven seconds. It runs on
exponential ease-out from an already-visible default.

Nobody is held hostage by it. The first scroll, tap or keypress fast-forwards
to the finished house, the phone number stays in the sticky header throughout,
and `prefers-reduced-motion` or a JavaScript failure both resolve straight to
the finished frame with the name in place — the fail state is the good picture.

## Bans carried from the craft floor

- No eyebrow or kicker above a heading. The previous build had
  `Finish schedule` set above its `<h2>`; it is gone and does not come back.
- No same-size card grids as page structure. Services and phases are editorial
  rows and a real tablist.
- Section numbers appear **only** on the phase rail, where the sequence is the
  information — a renovation runs 01 through 08 in that order.
- No gradient text, no decorative glass, no coloured left borders above 1px.

## Structure

The order is fixed by the brief: the sequence, then the business.

1. Hero assembly sequence
2. Who this is and how to reach them
3. What we build
4. Selected work
5. Gallery, filtered in place
6. Finish schedule
7. Every phase handled
8. What your proposal says
9. Where we work
10. Start a project
11. Footer

## Hero mechanic

Eight frames stacked in one pinned stage, revealed over each other:

| step | from → to | register |
|---|---|---|
| 1 | sketch → blueprint | soft-edged wipe |
| 2 | blueprint → lot | dissolve |
| 3–7 | lot → finished | slab assembly, bottom-up |

Assembly slabs sit in clipped slots and slide in from above, staggered, landing
bottom-up so nothing arrives before the thing it rests on. Sky and ground are
identical across frames, so only the house appears to move.

Steps overlap by a fifth of their span so there is never a frozen beat between
them, but that overlap is clamped at both ends of the timeline. Unclamped, the
first step starts before zero (the sketch is never seen) and the last ends
after one (the final slab never lands).
