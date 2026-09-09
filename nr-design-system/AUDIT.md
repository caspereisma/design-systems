# NR design system — a designer's audit

*Casper Eisma · 9 September 2026 · Figma "NR MUI v6.1" vs. the NR Portal frontend and its Storybook.*
*Engineering detail lives in [AUDIT-technical.md](AUDIT-technical.md). This document is the version you act on.*

---

## The one-paragraph verdict

You have three design systems that each believe they are the real one: the Figma library, the code that ships, and the prototype you design in. They agree on the boring parts (font, corner radius, spacing unit, white background) and disagree on every part anyone ever customised: all six semantic colours, two heading sizes, a heading weight, and the status chip. Nobody noticed because the disagreements are between near-identical greys and oranges. That is not reassuring; it is the exact condition under which drift compounds.

**Fidelity score: 38 / 100**

| Dimension | Score | Meaning |
| --- | --- | --- |
| Design → build fidelity | 3 / 10 | What you design is not what ships. Six of six semantic colours differ. |
| Designer efficiency | 5 / 10 | Components exist in both tools, but Storybook is organised by code folder, not by design intent, and the token page shows paint chips rather than a palette. |
| Single source of truth | 2 / 10 | Three sources, no export between them, and the Figma library contradicts itself internally. |
| Foundations | 8 / 10 | Nunito Sans, 8-pt spacing, radius 4, elevation styles: all correct and matching. Build on this. |

---

## 1. What your users see today

These are visible consequences, not code-quality abstractions.

**The primary button is three different greys.**
Figma paints it `#424242`. The live app paints it pure black `#000000`. Your prototypes paint it `#404041` (FUGA Grey 800). A designer, an engineer and a user are each looking at a different button and calling it the same thing.

**Warning is three different oranges.**
Figma `#FB8C00` · live app `#ED6C02` · prototype `#FF8800`. The "requires sync" indicator you designed for the Curve work is not the orange the app will render.

**Headings render heavier in the app than in Figma or Storybook.**
`h1` and `h2` are designed in Nunito Sans Light (300). The app never loads the Light weight, so the browser fakes one. Storybook does load it, which is why the mismatch is invisible during review and visible in production.

**Two heading sizes are simply different numbers.** `h2` is 60 px in Figma and 64 px in the app; `h4` is 34 px vs 36 px. Any layout you tune to the Figma text style will be 2–4 px off when built.

**The status chip is built three different ways.**
Same chip, same 26 px height, same radius 4:
- *Background*: both sides hand-typed the FUGA 50-tints, so these match.
- *Text*: Figma binds it to a Material red/green/blue; code uses FUGA 900s. **1 of 5 match.**
- *Border*: Figma uses the main colour at 50 % opacity; code uses a solid 200-tint. **0 of 5 match.**
Every status chip in the app is a slightly different chip from the one in your library.

**Figma promises a dark mode the product does not have.** The `palette` collection has a full Dark mode. Nothing in the app can render it. Anyone designing in Dark is designing for a product that does not exist.

---

## 2. Why this happened — the one mechanism to understand

The Figma library is the official Material UI kit with FUGA colours added beside the Material ones. Both palettes ended up in the file: `material/colors` (spelled `grey/800`) and `fuga/colors` (spelled `Grey/800`). Whoever customised the kit re-typed the hover, focus and border tokens with FUGA values by hand, but left the *main* colour tokens pointing at the Material palette — almost certainly because the two `grey/800`s are indistinguishable in a picker.

Result: inside your own Figma file, `error/main` is Material red `#F44336` while the `error` border token beside it is FUGA red `#F44139`. The library disagrees with itself before code even enters the picture.

Everything in this audit follows from that one miswired alias. Fix it and most of the colour drift collapses.

---

## 3. Decisions only you can make

Nothing downstream can start until these are settled. Each is a design call, not an engineering one.

### 3.1 The six semantic colours

Pick one value for each role. My recommendation is the FUGA column: it is what the hover and border states already use, what the chip backgrounds already use, and what your prototypes already use. Material is the accident.

| Role | Figma today (Material) | Live app today | Prototype today | **Recommend** |
| --- | --- | --- | --- | --- |
| Primary | `#424242` | `#000000` | `#404041` | `#404041` FUGA Grey 800 |
| Secondary | `#9C27B0` purple | white on grey | — | Decide whether NR *has* a secondary. Today nothing uses it consistently. |
| Error | `#F44336` | `#F44139` | `#F44139` | `#F44139` FUGA Red 500 |
| Warning | `#FB8C00` | `#ED6C02` | `#FF8800` | `#FF8800` FUGA Orange 600 |
| Info | `#039BE5` | `#45A2DD` | `#45A2DD` | `#45A2DD` FUGA Blue 600 |
| Success | `#43A047` | `#00A542` | `#00A542` | `#00A542` FUGA Green 600 |

Also decide: is **text** `#000000 @ 87%` (Figma, Material convention) or solid `#1F1F21` (app, prototype)? They look the same on white and differ on any tint. Recommend solid FUGA Grey 900, because the app already uses it and opacity-based text is harder to reason about on coloured surfaces.

### 3.2 The status vocabulary

This is the one component that is genuinely *NR's*, and today it is a colour named after a colour ("redChip", "Color: Red"). Define it once as meaning → colour role. The statuses that exist in the product:

| Status (as the product names it) | Meaning | Colour role today | Question for you |
| --- | --- | --- | --- |
| Registered | Claim accepted by CMO | Green | — |
| Exclusive licence deal | Registered under an exclusive deal | Green | Same green as Registered. Should it be distinguishable? |
| Submitted / Exported | Sent to CMO, awaiting | Blue | Two words for one state? |
| To be registered | Not yet sent | Orange | — |
| Re-register | Needs resubmission | Orange | Same orange as "To be registered". Intentional? |
| Unavailable / Not applicable | Cannot be claimed | Grey | — |
| Relinquished | Rights given up | **Purple** | **Missing from Figma.** |
| Export in progress / completed / failed | Bulk-export job states | Blue / Green / Red | Only place Red is used. |

Figma has five colours (Red, Green, Orange, Blue, Grey). The product needs six (add Purple). Code also defines a Yellow chip that nothing uses: delete it.

Also missing from *both* Figma and code, present only in your prototype: Curve sync state (synced / requires sync / not synced), advance recoupment (recouped / in recoupment), sliding-scale position, deal-ending flag. Decide whether these join the status vocabulary or stay indicator-only.

### 3.3 Dark mode: in or out?

If out, delete the Dark mode from the Figma `palette` collection so it stops implying a promise. If in, it is a product decision with real engineering cost and should go through a Brief.

### 3.4 Brand direction — ask Dean before building tokens

The Figma file contains a third palette, `DMP/colors`: Downtown Music Publishing's brand (Parchment, Burnt Orange, Sage Green, Steel Blue, Warm Tan). It is bound to nothing. With the UMG/VMG integration underway, it is worth one conversation: is NR staying on FUGA's visual identity, moving to DMP's, or waiting for VMG's? The answer does not change the plan — a semantic layer makes a palette swap cheap — but it changes which palette you point it at first, and whether you delete `DMP/colors` or `fuga/colors`.

### 3.5 How Storybook should be organised

Storybook is your living component catalogue, but today it is arranged by the engineer's folder structure: 19 groups including both "Chips" and "Chips & Status", both "Feedback" and "Notifications", and five overlapping groups for inputs. This is an information-architecture task you own. A proposal to react to:

1. **Foundations** — colour roles, typography, spacing, elevation, the status vocabulary
2. **Actions** — buttons, dropdown buttons, bulk actions
3. **Inputs & forms** — text fields, selects, lookups, search, date
4. **Filters** — filter chips, filter containers
5. **Data display** — tables, event rows, charts, status chips
6. **Feedback** — alerts, dialogs, notifications, loading
7. **Navigation & layout** — header, breadcrumbs, page templates
8. **Domain** — asset metadata editing, client sections (NR-specific compositions)

Eight groups, Foundations first, one home per component.

---

## 4. What you can fix yourself, in Figma, this week

All inside `NR MUI v6.1`. None of it needs engineering. Publishing the library afterwards updates every screen that uses it.

1. **Re-point the six `main` tokens** (`primary/main`, `secondary/main`, `error/main`, `warning/main`, `info/main`, `success/main`, plus their `dark` and `light` variants) from `material/colors` to the matching `fuga/colors` ramp, in both Light and Dark modes. Use the values from §3.1.
2. **Regenerate the `_states` tokens** (hover 4 %, selected 8 %, focus 12 %, focusVisible 30 %, outlinedBorder 50 %) from the new mains so they stop being hand-typed literals. The Dark-mode ones currently use Material values; fix those too.
3. **Bind the `Status` chip backgrounds.** On all 25 variants the background is a typed hex. Bind each to the matching `{role}/light` or a new `{role}/_states/background` token. Add a **Purple** colour variant for Relinquished.
4. **Rename the FUGA ramps to match the Material convention** (`Grey/800` → `grey/800`, `Fuga-Blue` → `fugaBlue`, `naxos-blue` → `naxosBlue`, `Base/White` → `common/white`). Consistent casing is what stops the wrong alias being picked next time.
5. **Delete `material/colors`** once nothing aliases it. 252 variables that exist only to be picked by mistake.
6. **Tidy the small things**: fix the typo `knowFillDisabled` → `knobFillDisabled`; set `breakpoints/xs` to 0 (MUI's default; 444 is a frame width); rename `_fontSize/0,625rem` style names to use a dot.
7. **Scope the variables.** Most are `ALL_SCOPES`, so every colour appears in every picker. The kit's own `text/*` tokens show the pattern: text colours scoped to text fill, surface colours to frame fill, border colours to stroke. This is the single biggest quality-of-life improvement for anyone designing in the file.

Definition of done: pick any component in the library, inspect any colour, and it resolves through `palette/*` to `fuga/colors/*`. No literal hex anywhere except inside `fuga/colors`.

---

## 5. What to ask engineering for

Each of these is one ticket. Written in the order they should happen. Phrased so Hlib or Vitaliy can pick it up without this document.

### Ticket 1 — Load the Light weight, fix two heading sizes
*Why it matters to design:* h1/h2 render differently in the app than in Figma and Storybook. h2 and h4 are 4 px and 2 px off.
*Ask:* add weight 300 to the Nunito Sans import in `index.html` (or drop 300 from h1/h2 if we agree they should be Regular); set h2 to 60 px and h4 to 34 px to match the Figma text styles.
*Done when:* Storybook and the app render every heading identically.

### Ticket 2 — One status chip
*Why it matters to design:* the same status is defined five separate times in code with different colours, plus a sixth "solid" variant in the theme. Every screen renders a slightly different chip.
*Ask:* one `<StatusChip status="…">` component driven by a single status → colour-role map matching §3.2; retire the four overlapping maps and the `statusSummary` theme entry; add Purple; delete the unused Yellow.
*Done when:* one component, one map, and its Storybook story shows every status in §3.2.

### Ticket 3 — A token file the theme is generated from
*Why it matters to design:* today there is no place where "primary colour" is written down in code; it is typed into the theme. A token file is the thing Figma exports to and the theme imports from, so the two cannot drift silently.
*Ask:* a `tokens.json` (W3C Design Tokens format) holding primitives → semantic roles → component tokens, with the values from §3.1; generate the MUI palette and typography from it. Add the semantic roles code has never had: text, divider, background, status.
*Done when:* changing one value in `tokens.json` changes it everywhere in Storybook.

### Ticket 4 — Stop new hardcoded colours
*Why it matters to design:* in 85 files a developer typed a colour by hand instead of using the palette. Each is a place a Figma change will never reach. There are about 300 today; without a guard the number grows while we fix it.
*Ask:* a lint rule forbidding hex and `rgba(` outside the token and theme files, with an allowlist of the current 300 that shrinks as they are migrated.
*Done when:* the build fails on a new hardcoded colour.

### Ticket 5 — Remove the legacy styling library
*Why it matters to design:* indirectly. 45 files use a styling approach MUI removed in its next major version. It blocks the upgrade, and the upgrade is what brings better theming. Worth doing while those files are open for Ticket 4.

---

## 6. Storybook as *your* tool

Today Storybook is engineering's test harness that happens to be viewable. It can be your living spec. What that takes:

- **Foundations pages you author.** Colour roles with usage rules, type scale with do/don't, spacing, elevation, and the status vocabulary from §3.2. Storybook supports prose pages (MDX). There are none today. This is designer-owned content.
- **A token page that cannot lie.** Today's "Design System / Tokens" page renders the 12 raw paint ramps and hardcodes its own swatch colours. It should render from `tokens.json` (Ticket 3), organised by role, so it is always true.
- **Stories as designed states.** Each story is one state you designed: default, hover, error, loading, empty. Today the 474 stories prove components mount. None test an interaction. Every dialog and dropdown should have at least one story that clicks through the flow — this is where "does the design work" gets checked automatically.
- **Accessibility as a gate, not a panel.** The accessibility checker is installed and set to "show but never fail". Once the current violations are listed, flip it to fail the build. Contrast problems then get caught the day they are introduced.
- **Chromatic as design review.** Already live on the `design-system` branch. Every push produces a visual diff of all 474 stories against the baseline. You approve or reject changes in a browser. This is the mechanism that makes the colour migration safe: when the six mains change, you see every affected component at once.

---

## 7. Sequence

| When | Who | What | Done when |
| --- | --- | --- | --- |
| **Week 1** | You | Decisions §3.1–3.5; conversation with Dean on brand direction (§3.4) | Six colours written down; status table agreed; dark mode in/out; Storybook groups chosen |
| **Week 1–2** | You, in Figma | §4 steps 1–7; publish library | Every colour in the library resolves to `fuga/colors`; `material/colors` deleted |
| **Week 2** | You + Claude | Foundations pages and the taxonomy (§3.5) in Storybook on the `design-system` branch; rewrite the Tokens page | Storybook has 8 groups, Foundations first, prose pages for colour/type/spacing/status |
| **Week 2** | Engineering | Ticket 1 (headings) | Storybook = app for every heading |
| **Week 3** | Engineering | Ticket 2 (status chip), Ticket 3 (token file) | One chip; theme generated from tokens; Chromatic shows the colour change across all 474 stories; you approve it |
| **Week 4** | Engineering | Ticket 4 (lint guard), start Ticket 5 | New hardcoded colours fail the build |
| Ongoing | You | Review Chromatic diffs on every design-system push | Visual changes are approved by design, not discovered by users |

The critical path is Week 1. Every later step needs the six colours and the status table.

---

## 8. Things to delete (small, satisfying, do them early)

- Figma: `material/colors` collection (after re-aliasing); Dark mode (if §3.3 says out); the Yellow status colour if it is never added
- Code: five colour ramps nothing uses (`YELLOW`, `FUGA_GREEN`, `TURQUOISE`, `NAXOS_BLUE`, `PURPLE` — note Purple must survive if Relinquished keeps it); `yellowChip`; the three "Comparison" stories that exist to compare eleven near-identical dropdown buttons
- Both: any component that exists on one side only and nobody can name a screen for

---

## Glossary

- **Token** — a named design decision (`primary/main`) rather than a raw value (`#404041`). Change the token, everything using it changes.
- **Primitive** — a raw colour in a ramp (`Grey/800`). Never used directly by a component.
- **Semantic role** — a token that names *purpose* (`error/main`, `text/secondary`) and points at a primitive. Components use these.
- **Alias** — a token that points at another token instead of holding a value. `primary/main → Grey/800`.
- **Variable** (Figma) — Figma's implementation of a token. Lives in a collection, can have modes (Light/Dark).
- **Style** (Figma) — the older mechanism; text and effect styles are still styles here, colours are variables.
- **Story** (Storybook) — one rendered state of one component. Storybook is the catalogue of all of them.
- **Chromatic** — a service that screenshots every story on every push and shows you what changed.
- **Semantic layer** — the middle tier of tokens (roles). Figma has one; code does not.
