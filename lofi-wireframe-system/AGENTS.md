# AGENTS.md — Lo-fi Wireframe System

If you're a coding agent asked to use this design system in another repo, **this folder is the canonical source**. Vendor from here; don't reinvent.

## Files to vendor (verbatim)

Copy all four into your target project. **Preserve filenames exactly** — including the space in the HTML name. Relative paths inside the files depend on them.

```
Lo-fi Wireframe System.html
styles.css            ← imports ./tokens.css
tokens.css            ← single source of truth
tweaks-panel.jsx      ← only needed if you want the live-theming panel
```

If you're only consuming the design language in your own harness, you can drop everything except `tokens.css` (+ `styles.css` if you want the components too).

## Two-line consumption recipe

```html
<!-- in your <head> -->
<link rel="stylesheet" href="path/to/styles.css">
<!-- styles.css does @import url('./tokens.css') itself, so co-locate the two -->
```

That's it. All component classes (`btn`, `pill`, `tabs`, `input`, `field`, `tbl`, `tile`, `img-ph`, `avatar`, `device-iphone`, `device-android`, `browser`, `progress`, `spinner`, `skeleton`, etc.) become available, plus the type/spacing/color utility classes (`hand-xl`, `hand-m`, `row`, `stack`, `grid`, `grid-3`, etc.).

## Token namespace

Reference these CSS custom properties instead of inventing values. All defined in `tokens.css`.

| Group | Variables |
| --- | --- |
| **Color · primitives** | `--color-white`, `--color-black`, `--color-ink-{100..900}`, `--color-blue-{25,50,500,600}`, `--color-yellow-200`, `--color-danger-500` |
| **Color · semantic** | `--color-fg`, `--color-fg-muted`, `--color-fg-subtle`, `--color-fg-on-primary`, `--color-bg`, `--color-bg-muted`, `--color-bg-page`, `--color-bg-tint`, `--color-bg-tint-2`, `--color-bg-inverse`, `--color-border`, `--color-border-strong`, `--color-border-subtle`, `--color-primary`, `--color-primary-hover`, `--color-primary-fg`, `--color-primary-tint`, `--color-danger`, `--color-highlight` |
| **Color · legacy aliases** | `--ink`, `--ink-2`, `--ink-3`, `--line`, `--line-2`, `--line-soft`, `--paper`, `--paper-2`, `--paper-3`, `--paper-tint`, `--paper-tint-2`, `--primary`, `--primary-2`, `--highlight` (kept so existing class names resolve — prefer the semantic names above for new code) |
| **Type · families** | `--font-hand`, `--font-label`, `--font-mono`, `--font-redacted` (legacy: `--hand`, `--label`, `--mono`) |
| **Type · scale** | `--text-2xs` … `--text-5xl` (10 → 96px) |
| **Type · weight** | `--weight-regular` … `--weight-black` (400 → 800) |
| **Type · leading** | `--leading-tight`, `--leading-snug`, `--leading-normal`, `--leading-relaxed` |
| **Type · tracking** | `--tracking-tight` … `--tracking-widest` |
| **Spacing** | `--space-0` … `--space-20` on a 4-pt scale |
| **Radius** | `--radius-none`, `--radius-xs`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-pill`, `--radius-full` |
| **Border** | `--border-1`, `--border-1-5`, `--border-2`, `--border-3` |
| **Shadow** | `--shadow-1`, `--shadow-2`, `--shadow-3`, `--shadow-page`, `--ring-focus` |
| **Motion** | `--duration-instant`, `--duration-fast`, `--duration-base`, `--easing-standard`, `--easing-emphasized` |
| **Layout** | `--layout-page-max`, `--layout-section-pad`, `--layout-section-pady-{top,bottom}` |
| **Control** | `--control-height-{sm,md,lg}`, `--control-radius`, `--control-border`, `--control-pad-x-{sm,md,lg}` |

When you need a new color/size/space, **first** see if a token already covers it. If not, add a primitive in `tokens.css` and a semantic role on top — don't sprinkle hex values across components.

## Lo-fi rules (do not break)

Carried over from the source handoff:

- This is a **thinking tool, not production**. The medium is HTML/CSS/JS prototypes. If you're porting to React/Vue/native, **recreate the visual output** — don't slavishly copy the prototype's DOM unless it happens to fit your framework.
- **Never use real photos.** Use the `.img-ph` placeholders (with the diagonal X), the `.img-ph.alt` SVG landscape, or the `.avatar` silhouettes. Real photos break the "this is a sketch" contract.
- **One blue.** `--color-primary` is for interactive intent only. Everything else stays graphite.
- **Sentence case** for labels and table headers (not ALL CAPS), per the original iteration history.

## Tweaks panel (optional)

`tweaks-panel.jsx` provides a reusable React shell with `TweaksPanel`, `TweakSection`, `TweakColor`, `TweakRadio`, `TweakToggle`, `TweakSlider`, and the `useTweaks(defaults)` hook. It runs in-browser via `@babel/standalone` (loaded from unpkg in the HTML's `<script>` tags).

If your target project already uses React with a build step, skip Babel-in-browser — import the JSX as a regular module and render `<TweaksPanel>` into a fixed-position container.

## What this folder is *not*

- Not an npm package. Don't `npm install` it; vendor the files.
- Not a framework. There's no JS dependency for the components themselves — only the optional tweaks panel uses React.
- Not a hi-fi system. If your target is production UI, use a real component library; this is for the sketching phase.
