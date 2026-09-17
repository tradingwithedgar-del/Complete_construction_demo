# Hero video

Upload the finished build video here as:

    video/hero.mp4

That is the only file the page needs. Everything else in the hero is
ordinary HTML over the top of it.

## What happens after you upload it

The video is re-encoded for the web, a VP9 WebM is produced alongside it,
and a poster frame is pulled from its final frame, overwriting
`images/hero-poster.jpg`.

    hero.webm   677,878 bytes   VP9, offered first
    hero.mp4    843,882 bytes   H.264, universal fallback
    original  6,327,450 bytes   kept in git history

Both are audio-free. The hero never plays sound, so the AAC track on the
upload was pure transfer cost.

That poster already exists as a placeholder - a dark gradient in the site's
own palette - so nothing 404s while the video is outstanding. You do not
need to supply it. `video/hero.mp4` is the only file to upload.

## How it behaves on the page

- Autoplays muted on load, plays once, holds on the last frame
- Never loops. A build that restarts every ten seconds reads as a glitch and
  throws away the finished-home ending, which is the frame the name sits on
- The first scroll, tap or keypress jumps to the end, so nobody is held
  hostage waiting for it before they can reach a phone number
- `prefers-reduced-motion` parks on the final frame without ever playing
- If the video cannot play at all - no file, a refused codec, autoplay
  blocked by the operating system, JavaScript off - the poster frame shows
  and the name still sits over it. There is no state where the hero is a
  blank box.

## Uploading

GitHub web UI: open this folder, then **Add file -> Upload files**. Not the
pencil icon - that is a text editor and refuses binaries.

The clips cannot be fetched automatically because Higgsfield serves
generation output from a CloudFront host this build environment's egress
policy blocks, so this upload is by hand.

DO NOT RENAME A VIDEO THROUGH THE GITHUB WEB EDITOR. It cannot rename a
binary: it will replace the file with a one-line text file of the same
name and the video is gone from the working tree. Delete and re-upload
under the right name instead. (The first upload here was lost that way and
had to be recovered from the git object store.)

SERVING REQUIREMENT: the host must support HTTP Range requests, or the
browser cannot seek and the skip-to-end and reduced-motion paths land on
the opening sketch instead of the finished house. GitHub Pages and Netlify
both support Range. `python -m http.server` does not, which is worth
knowing before trusting a local preview.
