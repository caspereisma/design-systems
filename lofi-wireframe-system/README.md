# Lo-fi Wireframe System

A pencil-on-paper wireframe kit for sketching ideas fast — buttons, forms, layouts, devices. Designed to be ugly on purpose: lo-fi sketches invite feedback about structure; hi-fi mocks invite arguments about pixel padding.

Sourced verbatim from a Claude Design (`claude.ai/design`) handoff bundle. The original chat transcript is paraphrased in the system's masthead: the user iterated on a Figma lo-fi wireframe kit, removed sticky notes, switched redacted text to the Redacted Script font, switched labels to sentence case, and finally extracted tokens and styles into separate files.

## What's in it

A single self-contained HTML page with a cover and **15 numbered sections**:

01. Foundations · why lo-fi
02. Type · Hand (Kalam) + Label (Inter) + Redacted scales
03. Color & effects · one blue, lots of grey, plus borders and shadows
04. Spacing & grid · 4-pt scale, radius, stroke weights
05. Buttons · solid / outlined / text in 3 sizes, icon buttons, button group
06. Forms · text fields, radio/check/switch/slider/dropdown, error & focus states
07. Tabs & pills · horizontal, vertical, with-icons, top-icon, mobile tab bar
08. Text blocks · leading / trailing / top icon arrangements, paragraph, redacted
09. Images & shapes · placeholders, avatars, video, map, charts, basic shapes
10. Tables · header + body example
11. Loaders · progress bar, spinner, skeleton rows
12. Icons · 24 stroke icons (Feather idiom), 2px, 24px
13. Cursors · arrow / pointer / grab / grabbing / resize / text
14. Devices · iPhone, Android, browser frames
15. Example · everything composed into one dashboard (topbar, sidebar, KPIs, chart, populated customers table, full new-customer form)

Plus a floating **Tweaks panel** (bottom-right) for live theming: primary color, hand font (Kalam / Caveat / Patrick / Gloria), tinted sections on/off, and a sketchy-wobble toggle.

## Files

| File | Role |
| --- | --- |
| `Lo-fi Wireframe System.html` | The page. Loads Google Fonts, links `styles.css`, and mounts the React tweaks panel. |
| `styles.css` | All component styles. Imports `./tokens.css`. |
| `tokens.css` | Single source of truth: color, type, space, radius, border, shadow, motion, layout, control tokens. Primitive → semantic role layering, plus legacy aliases (`--ink`, `--paper`, etc.). |
| `tweaks-panel.jsx` | Reusable React shell (`TweaksPanel`, `TweakSection`, `TweakColor`, `TweakRadio`, `TweakToggle`, `useTweaks`) compiled in-browser by Babel. |

Import chain: `Lo-fi Wireframe System.html` → `styles.css` → `tokens.css`. Filenames must be preserved when vendoring — relative paths inside the files depend on them.

## Use it

### Open as-is

```sh
open "Lo-fi Wireframe System.html"
```

That's the whole thing — it's static. Internet is required at first load for Google Fonts and the unpkg CDN scripts (see below).

### Vendor into another project

Copy the four files into a folder in your target project, keeping their names exact. From there:

- For a **standalone wireframe page**, just link to the HTML.
- For **just the design language** in your own HTML/JSX harness, link `styles.css` from your page (it pulls in `tokens.css` automatically). You can drop the React/Babel `<script>` tags and the tweaks-panel block if you don't need live theming.
- For a **framework port** (React/Vue/Svelte/etc.), treat the HTML/CSS as a *visual reference*. Reuse the tokens (`tokens.css`) verbatim, but rebuild components in your framework's idiom — don't copy the prototype's DOM structure unless it happens to fit.

### External resources fetched at runtime

The HTML pulls these from the public web:

- **Google Fonts**: Kalam, Caveat, Gloria Hallelujah, Patrick Hand, Inter, JetBrains Mono, Redacted Script.
- **unpkg CDN**: `react@18.3.1`, `react-dom@18.3.1`, `@babel/standalone@7.29.0` — only needed for the tweaks panel.

If you're shipping this offline or behind a firewall, mirror the fonts and the React/Babel bundles locally and update the URLs in the HTML.

## Customize

The Tweaks panel is the intended customization surface for design exploration:

- **Primary** — pick a hex chip; `--color-primary` updates live across links, buttons, pills, active tabs, focus rings.
- **Hand font** — swaps `--font-hand` between four Google handwritten faces.
- **Tinted sections** — toggles the soft blue tint on the alternating section backgrounds.
- **Sketchy wobble** — adds a subtle rotation to titles, buttons, inputs, devices, and tiles for a more hand-drawn feel.

For deeper customization, edit `tokens.css` directly — it's the single source of truth. Every component reads through the semantic roles (`--color-fg`, `--color-bg`, `--color-border`, `--color-primary`, etc.) so renaming a primitive flows through automatically.

## Lo-fi rules

These come from the original handoff README and the wireframe kit's own foundations:

- **Speed over polish.** Get a layout on the page in minutes; throw it away in seconds.
- **Honest fidelity.** A lo-fi sketch should obviously be a sketch. Don't make it look real.
- **One blue.** Reserve a single accent for interactive intent; everything else is graphite.
- **Never use real photos.** Use the X-marked image placeholders, the alt landscape SVG, or the avatar silhouettes. Real photos break the "this is a sketch" contract.
