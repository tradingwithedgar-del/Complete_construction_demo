# Hero sequence frames

Upload the eight Higgsfield frames into THIS folder, named exactly as below.
Order matters — the number is the playback order of the hero sequence.

| file                  | frame                                      |
|-----------------------|--------------------------------------------|
| `01-sketch.png`       | Concept sketch (the idea)                  |
| `02-blueprint.png`    | Blueprint (the plan)                       |
| `03-lot.png`          | Empty lot with survey stakes               |
| `04-foundation.png`   | Poured foundation                          |
| `05-framing.png`      | Open timber frame                          |
| `06-enclosure.png`    | Sheathed and dried in                      |
| `07-clad.png`         | Clad and glazed, interior lights off       |
| `08-finished.png`     | Finished, interior lights on               |

The real frames are installed. What the page actually loads is the WebP in
this folder, at two widths (`-sm` is 768px for phones, the plain name is
1344px). The full-resolution PNG masters are in `src/` and are never
fetched by the page - they are there so a frame can be re-cut without
regenerating it.

TO REPLACE A FRAME
Put the new PNG in `src/` under the same name, then re-run the conversion
(Pillow: resize to 1344 and 768 wide, save as WebP quality 80). Everything is converted to
sized WebP during integration; the PNGs stay here as the masters so a frame can
be re-cut without regenerating it.

These are generated architectural renders of a concept house. They are NOT
photographs of completed work and must never be presented as a finished project
or placed in the portfolio gallery.
