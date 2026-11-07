# Hackrange brand kit and design system

A target with a keyhole at its centre: a range you shoot at, and the lock you are there to open.

## The mark
One bold flat white glyph on an accent gradient tile. No text, no outline, no emblem.

- `../Hackrange.icon` is the source of truth (Icon Composer). Light and dark fills are set in it.
- `../icon.svg` is the flat copy for READMEs (shown at 80 px). `icon-1024.png` is the App Store icon, no alpha.
- `mark.svg` is the glyph alone in `currentColor` for your own background.
- Clear space equal to the width of the glyph's thickest stroke. Smallest size 16 px.

## Colour
| Role | Value |
|---|---|
| Accent | `#0a7a1f` |
| Gradient top | `#35d62c` |
| Text | `#1d1d1f` light, `#f5f5f7` dark |
| Background | `#ffffff` light, `#000000` dark |
| Surface | `#f5f5f7` light, `#1c1c1e` dark |

The accent is for actions, links and the icon. Never brown, beige, purple or teal.

## Type
The system font: `-apple-system, BlinkMacSystemFont, "SF Pro Text", Lato, "Helvetica Neue", Helvetica, Arial, sans-serif`. Scale 34/41 bold, 22/28, 17/24, 15/20, 13/18.

## Space and shape
- Space on the 8 point grid: 4, 8, 12, 16, 24, 32, 48. Side margin 20. Reading column 680.
- Radii: cards 28, grouped lists 20, controls fully round, icon 22 percent.
- Controls are 48 points tall capsules, one height in a row. Focus is a 4 point ring at 30 percent accent.
- Motion is 0.2 s ease and honours reduced motion.

`tokens.css` holds the app's accent. Everything else comes from the shared token file.

## Terminal
The product is a terminal, so the terminal is the signature component. Every block on the site is real output from this repo or a local Juice Shop, never mocked up.

- Face: the system mono stack, `ui-monospace, SFMono-Regular, Menlo, monospace`. No webfont.
- Dark block: `#0b0f0b` ground, `#d7e7d7` text, white commands, `#5be052` for the line that matters. It stays dark in both themes.
- Hero capture: `--bg2` ground, hairline border, accent commands, square corners.
- One green line per block at most. If everything is green, nothing is.

## Voice
Plain and direct. Say what happens on the machine. Always name the rule: only attack what you own or have written permission to test. No skulls, no hoodies, no Matrix rain, no Kali cosplay.

## Footer
A band of the app's own things, engraved: the target, a prompt, an open lock, a key, a chip and a juice cup. Never the name as text.
