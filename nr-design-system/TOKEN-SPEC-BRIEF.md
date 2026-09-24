# Token spec block — implementation brief

**What this is.** A single documentation block, generated per component, that answers three
different questions about a component's tokens. It is built once as a Storybook DocBlock and
then reused on all 32 component pages in the `Figma MUI design library` section.

**Why it exists.** Today `createDocsPage` ends with a "Tokens used" section that lists the
variables a Figma set binds. It tells you *which* tokens are involved but not *where* they land,
not *what happens in each state*, and not *why a value is what it is*. Designers and engineers
both end up reading the component source to answer those. This block answers them on the page.

**Status.** Nothing is built yet. Button is the pilot; everything below is scoped to making
Button's page correct, in a way that generalises to the other 31.

Companion file: `button-spec.ts` in this directory — the hand-authored slot map. Read it
alongside this brief; the types in it are the contract.

---

## 1. The three blocks, in order

### Block A — Anatomy

Three SVG frames showing the component with its parts labelled. **Part names only, no values.**
Its job is to teach the vocabulary that blocks B and C then use as row names, so a reader never
meets a term the page has not already defined.

Rendered as `<img>`, one per frame, with the caption from `spec.anatomy[].caption`.

This block is the one piece of the spec that **Figma owns**. It carries no token values, so it
does not change when a token changes — only when the component grows or loses a part. The SVGs
in `anatomy/` were drawn to match the Figma frames; when the Figma frames are updated, re-export
and replace the files.

Do not rebuild the anatomy in code. Do not screenshot it.

### Block B — Variant spec cards

A card per variant × state: 3 × 5 = 15 for Button. Each card is a live render of the component
in that state, then five rows:

| Row | Source |
| --- | --- |
| Fill | `spec.states[variant][state].fill` |
| Label | `.label` |
| Border | `.border` |
| Elevation | `.elevation` |
| Focus ring | `.focusRing` |

Rows render by `SlotValue.kind`:

- `token` → the custom property name verbatim, e.g. `--nr-palette-primary-main`, plus `note` if present
- `literal` → the literal, e.g. `transparent`
- `none` → the word "none", muted
- `inherit` → "inherits enabled" / "inherits hover", muted italic

A state carrying `deferred` renders the whole card with a warning border and a **to fix** badge
on the card name, plus `deferred.reason` surfaced once above the card grid. Button has three such
cards — the focus-visible state in every variant.

**Sizes and icons do not get cards.** They vary by measurement rather than colour, so four of
five rows would repeat unchanged. They render as two small tables underneath, from `spec.sizes`
and `spec.icons`. This matters for the components that come after Button: a complex component
multiplies its *state* cards only.

The render on each card must be the real component under the real theme — not a styled `div`.
Use the same pseudo-state forcing the stories already use (`storybook-addon-pseudo-states`, see
`_lib/matrix.tsx`), so hover/focus/active states are shown rather than described.

### Block C — Tokens used

Replaces the existing "Tokens used" section in `createDocsPage`. Four columns:

| Column | What it is | Where it comes from |
| --- | --- | --- |
| **Name** | The component slot, e.g. `button/contained/fill:hover` | derived — see `traceName()` in `button-spec.ts` |
| **Semantic** | The CSS custom property, e.g. `--nr-palette-primary-dark` | the slot map |
| **Primitive** | What that resolves to, e.g. `--nr-fuga-colors-grey-900` | `tokens.meta.json` — **does not exist yet, see §2** |
| **Value** | The resolved value, e.g. `#1F1F21` | `tokens.css` |

The **Value** cell carries a small colour swatch inline before the value, **for colour rows
only** — alpha values on a checkerboard so transparency reads. Elevation, shape, type and spacing
rows get no swatch and no preview of any kind. There is no separate preview column.

Rows are grouped: Colour, Elevation, Shape & type, Spacing.

Rules for building the row set:

- One row per `token` slot value. `literal`, `none` and `inherit` produce no row.
- When a slot resolves to the same token in all three variants, emit one row scoped `button/*/…`
  rather than three.
- `enabled` takes no state suffix; every other state does.
- A row whose Primitive cannot be resolved is a **bug, not an empty cell** — it means a component
  slot is bound straight to a primitive with no semantic alias between. Render it flagged. Button
  had exactly one of these (`button/outlined/border:disabled` → `--nr-fuga-colors-grey-300`) and
  it has since been re-pointed at `--nr-palette-action-disabled-background`.

Finally, render `spec.pending[]` as a short note under the block heading. These are statements
that are true now and would otherwise make the page read as a description of reality when it is
partly a description of intent.

---

## 2. The build change: `tokens.meta.json`

**Block C's Primitive column has no source today.** This is the one piece of infrastructure the
spec block needs and the repository does not have.

`scripts/tokens/build.mjs` currently emits `tokens.css` and `tokens.ts`. Both are *resolved* — by
the time a token reaches them the alias chain has been flattened away. `figmaLibrary.ts` records
which Figma variable a layer binds (`FigmaBinding.figma` + `.collection`) but not what that
variable aliases.

Add a third output, `src/styling/tokens/generated/tokens.meta.json`, keyed by CSS custom property:

```json
{
  "--nr-palette-primary-main": {
    "id": "palette.primary.main",
    "figma": "palette/primary/main",
    "aliasOf": "fuga.colors.grey.800",
    "primitive": "--nr-fuga-colors-grey-800",
    "value": { "light": "#404041", "dark": "#404041" }
  },
  "--nr-palette-primary-states-hover": {
    "id": "palette.primary.statesHover",
    "figma": "primary/_states/hover",
    "compose": {
      "base": "--nr-palette-primary-main",
      "opacity": "--nr-palette-state-opacity-hover"
    },
    "primitive": "--nr-fuga-colors-grey-800",
    "value": { "light": "rgba(64, 64, 65, 0.04)", "dark": "…" }
  },
  "--nr-spacing-1": {
    "id": "spacing.1",
    "figma": "spacing/1",
    "primitive": null,
    "value": { "light": "8px", "dark": "8px" }
  }
}
```

Notes on the shape:

- `primitive` is the **end** of the chain, not the next link — walk aliases until you reach a
  token with no alias. `null` when the token is itself a primitive or has no alias (spacing,
  shape, typography).
- `compose` is required for the alias-with-opacity tokens. `build.mjs` already resolves the
  `nr.compose` extension into `rgba()`; capture `base` and `opacity` **before** that flattening.
  Block C renders these as "grey-800 × state-opacity-hover", which is only possible with both
  halves.
- Emit both modes. Dark is out of scope for the spec block today but the file should not need
  changing when that lands.
- The file is generated. It goes in `generated/`, which is already git-tracked, and it must be
  rebuilt by `pnpm tokens:build` like the other two outputs.

---

## 3. Where things go

Existing, for orientation:

| Path | What it is |
| --- | --- |
| `src/design-library/Button.stories.tsx` | the pilot page; `meta.parameters.docs.page = createDocsPage(entry)` |
| `src/design-library/_lib/docsPage.tsx` | `createDocsPage`; owns the `<h2 id="tokens">Tokens used</h2>` section Block C replaces |
| `src/design-library/_lib/figmaLibrary.ts` | `FigmaComponentEntry` per component, incl. `bindings` |
| `src/design-library/_lib/matrix.tsx` | `pseudoParameters`, `stateClass`, `StateWrap` — reuse for Block B's state renders |
| `src/styling/tokens/generated/tokens.css` | resolved custom properties, annotated `@tokens` categories |
| `src/styling/tokens/generated/tokens.ts` | typed flat map per mode + Figma-name index |
| `scripts/tokens/build.mjs` | the token build; add the `tokens.meta.json` output here |

New:

| Path | What it is |
| --- | --- |
| `src/design-library/_lib/tokenSpec/TokenSpec.tsx` | the DocBlock — `<TokenSpec spec={buttonSpec} />` |
| `src/design-library/_lib/tokenSpec/Anatomy.tsx` | Block A |
| `src/design-library/_lib/tokenSpec/SpecCards.tsx` | Block B |
| `src/design-library/_lib/tokenSpec/TokensUsed.tsx` | Block C |
| `src/design-library/_lib/tokenSpec/types.ts` | the types from `button-spec.ts` |
| `src/design-library/_lib/specs/button.ts` | `button-spec.ts` from this directory |
| `src/design-library/_lib/specs/anatomy/button-*.svg` | the three files from `anatomy/` |

Wire it into `createDocsPage` rather than into `Button.stories.tsx`, so every component page
picks it up from one edit. `createDocsPage(entry)` should take an optional spec and render the
block when one exists — components without a slot map keep the page they have today.

---

## 4. Acceptance criteria

1. `pnpm tokens:build` emits `tokens.meta.json` alongside the existing outputs, and
   `pnpm typecheck` passes. (The pre-commit hook does **not** fail on typecheck — run it
   yourself.)
2. Button's docs page renders all three blocks, in the order A, B, C.
3. **No value on the page is typed by hand.** Every colour, shadow, size and spacing figure
   traces to `tokens.css` via the slot map. Grepping the built page for a hex code should find
   only values that came out of the token file.
4. The 15 spec cards each render the real MUI Button under the real theme, in the right state.
5. The three focus-visible cards render as deferred, with the reason shown once.
6. Block C shows four columns, with colour swatches inline in the Value column and no preview
   column. Every row resolves a Primitive, or is flagged.
7. Sizes and icons render as two tables, not as cards.
8. `spec.pending[]` is visible on the page.
9. Nothing regresses on the other 31 pages — components without a spec file render exactly as
   before.

---

## 5. Decisions already made — do not relitigate

These were settled while the spec was designed. They are in the slot map; this is the reasoning,
so it does not have to be rediscovered.

- **Anatomy carries no values.** It was a spec, it is now a legend. That is what lets Figma own
  it and lets it not regenerate on every token change.
- **Spec cards are generated, never drawn in Figma.** Button alone is 15 cards; the library would
  be ~480 hand-maintained instances, each wrong the moment a token moves.
- **Focus ring is its own row, not a border.** It is a ring outside the container and it coexists
  with the outlined variant's real border; putting it under Border read as though focus replaced
  the outline.
- **Sizes and icons collapsed to tables.** 30 cards became 15 plus two tables with no information
  lost.
- **Swatches are for colours only.** Elevation, type and spacing rows are text.
- **No slashes as separators in data columns.** `15px / 26px`, `spacing-1 / spacing-3` and an
  unlabelled type specimen each produced a "what does this mean?" question during review. Write
  `15px · line-height 26px`, `y --nr-spacing-1 · x --nr-spacing-3`, and label any specimen.

## 6. Out of scope

- **Dark mode.** Every render is on light `background/paper`. Outlined and text both put
  `--nr-palette-primary-main` (#404041) on the surface and would disappear on a dark ground; that
  needs a decision, not an implementation.
- **Secondary, error, warning, info, success.** NR does not use them on Button.
- **Changing the component.** See §7 — this is a live question, not a silent omission.
- **Visual regression.** Chromatic is wired and snapshot-free; turning snapshots on is a separate
  decision.

## 7. The one open question that blocks nothing but changes the outcome

The slot map describes the **tokenised target**. The component in Storybook today does not match
it in two places:

| | Spec says | Component renders today |
| --- | --- | --- |
| Large contained padding | `8px 24px` (`--nr-spacing-1` / `--nr-spacing-3`) | `8px 22px` |
| Outlined border | 1px, drawn inset | 1px, added — outlined is 2px taller than contained |

So either:

- **Docs only** — the spec block renders the target while the component renders the old values,
  and the page visibly disagrees with its own live render; or
- **Docs plus theme** — also update `components.MuiButton.styleOverrides` to bind the padding
  tokens and draw the border inset. Every button in the application gets 2px wider on each side,
  and outlined finally measures the same as contained.

The second is the honest one and it is a visual change to a production application. **Ask before
choosing.** Do not pick silently.

---

## 8. Repository gotchas worth knowing before you start

- Work on the long-lived `design-system` branch of `Songtrust/nr-ui-tools`. Never `staging` or
  `production`. Do not commit or push without being asked.
- The pre-commit hook runs `pnpm typecheck` then lint-staged, but has no `set -e` — **a typecheck
  failure does not block the commit.** Run it yourself. `tsc -p tsconfig.json` is not the same
  check as `tsconfig.app.json`.
- Storybook will not start unless `.env.example` is copied to `.env`
  (`@import-meta-env/unplugin` refuses otherwise).
- `.storybook/main.ts` changes need a real restart; new story files are picked up live.
- Prettier is 4-space, single quotes, width 100, and reformats TS after edits — run
  `pnpm exec prettier --write` on generated or heredoc-written files before eslint.
- `storybook-design-token` parses every css/png in the repo unless `DESIGN_TOKEN_GLOB` is set;
  it already is, in `main.ts`.
- Storybook is pinned at 10.2.19 — match addon peer ranges (pseudo-states 10.2.19,
  addon-designs 11.1.4, design-token 5.0.0).
- Story-level `argTypes`/`args` merge with the meta's, so pages with several Figma-set stories
  must declare controls per story.
