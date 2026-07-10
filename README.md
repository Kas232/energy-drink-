# energy-drink-
A single-page energy drink storefront built with plain **HTML, CSS, and JavaScript**
# VOLTIS — Energy Drink Store

A single-page energy drink storefront built with plain **HTML, CSS, and JavaScript**, featuring a real **3D product can** (rendered live with [Three.js](https://threejs.org/), not an image) that tilts toward your cursor and arcs with electricity on click.

No frameworks, no build step — clone it and open `index.html`.

## Features

- **3D can hero** — a Three.js scene with a procedurally textured aluminum can, orbiting charge particles, colored point lighting, and mouse-parallax rotation
- **Click-to-arc** — click or tap the can for a lightning-bolt interaction
- **Glitch headline** — layered clip-path animation for the hero title
- **Flavor grid** — four product cards with a "voltage" rating and caffeine bar
- **Oscilloscope spec sheet** — an animated SVG waveform paired with real nutrition facts
- **Live counter** — an animated "cans cracked today" stat
- Fully responsive, keyboard-focus visible, and respects `prefers-reduced-motion`

## Stack

- `index.html` — structure
- `style.css` — design system (CSS custom properties for the palette/type scale)
- `script.js` — Three.js scene + interactions (loaded from cdnjs, r128)
- Fonts: Anton (display), Space Grotesk (body), JetBrains Mono (data/labels) via Google Fonts

## Run locally

Just open `index.html` in a browser. For live-reload during development:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Customize

- Colors, type, and spacing all live as CSS variables at the top of `style.css` under `:root`.
- The can's label is drawn procedurally on a `<canvas>` in `script.js` (`buildLabelTexture`) — edit the text/colors there instead of swapping an image file.
- Flavor cards are plain HTML in `index.html` — duplicate a `.flavor-card` block to add a new flavor.

## License

Free to use for your own project.
