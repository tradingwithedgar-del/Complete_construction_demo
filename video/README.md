# Hero clips

Kling 3.0 Turbo clips, 5s each at 720p, generated from the hero stills.
Download them from the Higgsfield widget and upload them here with these
exact names:

| file                  | starts from        | shows                                  |
|-----------------------|--------------------|----------------------------------------|
| `01-foundation.mp4`   | empty lot          | foundation descends and settles         |
| `02-framing.mp4`      | foundation         | timber framing rises                    |
| `03-enclosure.mp4`    | open frame         | sheathing and slate roof enclose it     |
| `04-lights.mp4`       | clad, lights off   | interior and facade lights bloom on     |

Only upload the clips that actually hold. A clip is unusable if the camera
drifts, pushes or gains parallax, or if the house changes - a gable that
grows or shifts, or a roof pitch that moves mid-clip. Those cannot be cut
against the stills either side of them, and no prompt rewrite fixes it on a
start-frame-only model.

Upload the good ones and leave the rest out. The page falls back to the
still-frame assembly for any stage that has no clip, so a partial set still
produces a working opener.

WHY THESE ARE UPLOADED BY HAND
Higgsfield serves generation output from a CloudFront host that this build
environment's egress policy blocks, so the clips cannot be fetched directly.
The renders from the 3D service came through because that one uses Cloudflare
R2, which is allowed.

AFTER UPLOADING
The clips get concatenated, retimed to fit inside the ten-second opener,
stripped of audio and re-encoded for the web. The originals stay in this
folder as masters; the page loads the encoded result.
