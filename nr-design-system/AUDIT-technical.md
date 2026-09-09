# NR design system audit — Storybook, code tokens, and Figma "NR MUI v6.1"

| | |
| --- | --- |
| Date | 2026-09-08 |
| Code | `Songtrust/nr-ui-tools` @ `edd73c2` (`staging`; `design-system` @ `84a2287` differs only by the Chromatic workflow) |
| Figma | `NR MUI v6.1`, file `nO0Daixnlx3Xux6oxsXtHY`, kit metadata version `6.1.0` |
| Method | Full read of Figma variable collections via the Plugin API (597 variables, values resolved through aliases); static scan of 400 app source files and 131 story files; Storybook index from a live build (130 docs pages, 474 stories) |

## 1. Summary

**Score: 38 / 100.** The parts exist. They do not connect.

Both sides have real assets: Storybook is modern and wired into CI; Figma has a proper MUI semantic layer with light and dark modes. But the two disagree on every one of the six MUI semantic colours, the code has no semantic layer at all, and the NR domain status vocabulary is defined five times in code and once in Figma with different values each time.

Three findings decide the next moves:

1. **Not one of the six MUI semantic `main` colours agrees between Figma and code.** Figma's `palette` aliases point at the stock `material/colors` collection, not at `fuga/colors`. `primary/main` resolves to Material `#424242`; PROD code says `#000000`; the prototype says `#404041`. Same story for `error`, `warning`, `info`, `success`, `secondary`.
2. **Figma was customised halfway.** The `_states` tokens (`hover`, `selected`, `focus`, `outlinedBorder`) were hand-typed with FUGA values, while the `main` tokens beside them still alias Material. Inside Figma, `error/main` (`#F44336`) and `error/_states/outlinedBorder` (`#F44139 @50%`) disagree with each other.
3. **Code has primitives nobody uses and no semantic layer anyone could use.** `FUGA_COLORS` is referenced zero times outside `src/styling/`. Components carry 139 raw hex and 50 raw `rgba()` values across 85 files instead, plus 183 inline `style={{}}` blocks that bypass the theme entirely.

## 2. Storybook versus best practice

### What is already right

- Storybook 10.2.19 on the Vite builder; CSF3 in 126 of 131 files (`satisfies Meta`).
- `tags: ['autodocs']` and a component description on 130 of 131 files.
- `.storybook/preview.tsx` wraps every story in the real `FugaMainStyles` theme with `CssBaseline`, Redux, Router, and the date-picker provider, and mocks `fetch`. Stories render under production conditions.
- `@storybook/addon-vitest` is installed and `pnpm test:storybook` runs all 474 stories as tests in both `ci.yml` and `cd.yml`.
- `@storybook/addon-a11y` installed.
- Nunito Sans loaded in `preview-head.html`.
- Visual regression now exists: Chromatic on the `design-system` branch, baseline build 1 at `84a2287` (added 2026-09-08).

### Gaps

| # | Gap | Evidence | Why it matters |
| --- | --- | --- | --- |
| S1 | **No interaction tests.** | `play:` appears in 0 of 131 files. | 474 stories prove components mount, not that they work. addon-vitest is paid for and unused. |
| S2 | **No curated controls.** | `argTypes` in 0 files. | Autodocs infers controls from TypeScript, but without `argTypes` there are no prop descriptions, categories, or sensible defaults. Docs pages are prop dumps. |
| S3 | **Accessibility never fails.** | `a11y: { test: 'todo' }` in preview; 0 stories set a11y params. | Violations render in the panel and nobody looks. Best practice: `'error'` in CI with a documented allowlist. |
| S4 | **Stories bypass the theme.** | Raw hex in 31 story files, 156 occurrences. | Stories should be the reference rendering. Hardcoding colours in them makes them wrong references. |
| S5 | **The token page undercuts itself.** | `DesignTokens.stories.tsx` renders 12 primitive ramps and hardcodes `#5F5F60` and `#DEDEE0` in its own swatch markup. No semantic roles, no spacing, no radius, no shadows, no status vocabulary. | It documents the layer nobody should use and omits the layers everyone should. |
| S6 | **No foundations or usage docs.** | 0 MDX files. | No "getting started", no principles, no spacing or typography guidance, no do/don't. A design system without prose is a component dump. |
| S7 | **Taxonomy drift.** | 19 top-level groups. `Chips` and `Chips & Status` both exist. `Feedback` and `Notifications` both exist. `Inputs` (4), `Forms` (3), `Dropdowns` (15), `Filters` (13), `Lookups & Search` (6) overlap. | Nobody can predict where a component lives. Best practice is roughly eight groups, purpose-based, with Foundations first. |
| S8 | **Component sprawl visible in the sidebar.** | 11 dropdown-button components (`CommonDropDownButton`, `…WithFixedLabel`, `…WithInput`, `…WithCheckboxesBtn`, `CommonIconDropDownButton`, `CommonMoreDropDownButton`, `MoreDropDownButton`, `DropDownButtonKebabMenu`, `BulkActionsDropDownButton`, `…ExportButton`, `ClientsHeaderBtnDropDownButton`). Three `*Comparison.stories.tsx` files exist to compare them. | Figma has one `<Button>` and one `<Menu>`. The comparison stories are the team documenting the problem rather than fixing it. |
| S9 | **Glob excludes pages.** | `stories: ['../src/common/**/*.stories.@(ts|tsx)']`. | Page-level compositions have no stories. `DesignTokens.stories.tsx` is filed under `src/common/` only because the glob demands it. |
| S10 | **Font weight mismatch with production.** | `preview-head.html` loads Nunito Sans 300/400/600/700. `index.html` loads 400/600/700. Theme `h1`/`h2` use weight 300. | `h1` and `h2` render true Light in Storybook and a synthesised weight in production. Storybook is lying about two headings. |
| S11 | **No mode switching.** | No `@storybook/addon-themes`; no dark palette in code. | Figma has a Dark mode. Code cannot show one. |

### Code styling hygiene (what Storybook is rendering)

| Signal | Count | Reading |
| --- | --- | --- |
| `theme.palette.*` references | 58 in 14 files | Token use exists but is rare |
| `theme.spacing()` references | 19 in 12 files | Almost nobody uses the spacing function |
| `FUGA_COLORS.X[...]` outside `styling/` | **0** | The primitive object is decorative |
| Raw 6-digit hex outside `styling/` | 139 in 56 files | Colours are copied, not referenced |
| Raw `rgba()` | 50 in 29 files | |
| `sx={{ }}` blocks | 738 in 138 files | Fine in itself, but they carry the raw values above |
| Inline `style={{ }}` | 183 in 71 files | Bypasses MUI entirely; unthemeable |
| `@mui/styles` (legacy JSS `makeStyles`) | 45 files | Deprecated since MUI v5, removed in v7. Blocks the next MUI upgrade. |
| Off-grid spacing literals | `18px` ×87, `20px` ×72, `10px` ×41, `7px` ×16, `5px` ×15 | An 8-pt system with a 2-pt drift |
| Dead primitive ramps | `YELLOW`, `FUGA_GREEN`, `TURQUOISE`, `NAXOS_BLUE`, `PURPLE` | Only self-referenced inside `fugaColors.ts` |

Typography oddities in `FugaMainStyles.tsx`: `h6` carries `textAlign: 'left'` (layout in a type token); `caption` has `lineHeight: 12px` on `fontSize: 12px` (zero leading); `letterSpacing` varies without a system.

## 3. Figma "NR MUI v6.1" variables — what is actually there

597 variables in 8 collections, plus 35 text styles, 24 elevation effect styles, 3 paint styles.

| Collection | Vars | Modes | What it is |
| --- | --- | --- | --- |
| `palette` | 134 | Light, Dark | The MUI semantic layer: `primary` `secondary` `error` `warning` `info` `success` (each `main` `dark` `light` `contrastText` + `_states/*`), `text/*`, `action/*`, `background/default` + `paper-elevation-0…24`, `divider`, `common/*`, `_components/*` (avatar, input, switch, rating, snackbar, chip, tooltip, backdrop, appBar, breadcrumbs, alert, stepper), `_native/scrollbar-bg` |
| `material/colors` | 252 | 1 | Stock Material 2014 palette, 19 ramps with A-shades. Untouched from the kit. |
| `fuga/colors` | 113 | 1 | FUGA ramps: `Yellow` `Orange` `Grey` `Base` `Red` `Purple` `Blue` `Turquoise` `Green` `Fuga-Blue` `Fuga-Green` `naxos-blue`. Value-identical to `fugaColors.ts` except `Fuga-Green/50` (`#ECFFEA` vs code `#f8fdfa`). |
| `DMP/colors` | 60 | 1 | Downtown Music Publishing brand: `Parchment` `Black` `BurntOrange` `SageGreen` `SteelBlue` `WarmTan`. Not referenced by anything in code. |
| `spacing` | 12 | 1 | `1`…`12` = 8…96 px. Pure 8-pt. No 4. |
| `typography` | 18 | 1 | `fontFamily` Nunito Sans; 12 sizes (10 12 13 14 15 16 20 24 34 48 60 96); weights 300 400 500 600 700 |
| `breakpoints` | 5 | 1 | xs 444, sm 600, md 900, lg 1200, xl 1536 |
| `shape` | 2 | 1 | `borderRadius` 4, `none` 0 |
| `metadata` | 1 | 1 | `version` "6.1.0" |

Three primitive collections (`material`, `fuga`, `DMP`) sit side by side. That is the same fragmentation pattern as the eleven libraries, one level down.

### The alias problem, in full

`palette` semantic tokens alias `material/colors` (lowercase `grey/800`), not `fuga/colors` (capitalised `Grey/800`). The `_states` literals beside them were hand-typed with FUGA values.

| Token | `main` resolves to | `_states/outlinedBorder` literal | Agree? |
| --- | --- | --- | --- |
| `primary` | `grey/800` → **#424242** (Material) | `#404041 @50%` (FUGA Grey/800) | No |
| `secondary` | `purple/500` → **#9C27B0** (Material) | `#9C27B0 @50%` | Yes, both Material; FUGA Purple/500 is `#66359D` |
| `error` | `red/500` → **#F44336** (Material) | `#F44139 @50%` (FUGA Red/500) | No |
| `warning` | `orange/600` → **#FB8C00** (Material) | `#FF8800 @50%` (FUGA Orange/600) | No |
| `info` | `lightBlue/600` → **#039BE5** (Material) | `#45A2DD @50%` (FUGA Blue/600) | No |
| `success` | `green/600` → **#43A047** (Material) | `#00A542 @50%` (FUGA Green/600) | No |

Dark-mode `_states` literals use Material values (`#F44336`, `#FFA726`, `#5ABCED`…), so the light/dark pair is inconsistent too.

### Figma hygiene

- Casing collision: `fuga/colors` uses `Grey/800`, `material/colors` uses `grey/800`. Alias pickers show both. This is almost certainly how the wrong ramp got aliased.
- Mixed separators and casing: `Fuga-Blue`, `naxos-blue`, `Base/White`, `Fuga-Green`.
- Typo: `_components/switch/knowFillDisabled`.
- `_fontSize/0,625rem` — comma decimals in token names.
- `ALL_SCOPES` on nearly every semantic and primitive token. The kit's own `text/*` tokens show the right pattern (`TEXT_FILL`, `STROKE_COLOR`). Everything else pollutes every property picker.
- `breakpoints/xs` = 444. MUI's default is 0.
- The `Status` component binds border and text to variables but leaves the **background as an unbound literal** on all 25 variants.

## 4. Figma versus code — semantic roles

| Role | Figma `palette` (Light) | PROD `FugaMainStyles.tsx` | Prototype (`--nr-*` / theme) | Match |
| --- | --- | --- | --- | --- |
| `primary.main` | `#424242` | `#000000` | `#404041` | **three values** |
| `secondary.main` | `#9C27B0` | `#FFFFFF` (bg `#404041`) | — | no |
| `error.main` | `#F44336` | `#F44139` | `#f44139` | no |
| `warning.main` | `#FB8C00` | `#ED6C02` | `#ff8800` | **three values** |
| `info.main` | `#039BE5` | `#45A2DD` | `#45a2dd` | no |
| `success.main` | `#43A047` | `#00A542` | `#00a542` | no |
| `text.primary` | `#000000 @87%` | `#000000` (palette) and `#1F1F21` (typography) | `#1f1f21` | no; code disagrees with itself |
| `text.secondary` | `#000000 @60%` | `#5F5F60` | `#5f5f60` | no (alpha vs solid) |
| `divider` | `#000000 @12%` | none defined; raw `#ededed`, `#dedee0` | `#ededed` | no |
| `background.default` | `#FFFFFF` | MUI default `#fff` | `#ffffff` | **yes** |
| `_components/appBar/defaultFill` | `grey/100` → `#F5F5F5` | black (`#000`) | `#000000` | no — but `#f5f5f5` is code's most-repeated raw hex (×34) |
| `_components/alert/error` | bg `#FDEDED`, text `#5F2120` | bg `#FFEBEE`, text `#5F2120` | — | text yes, bg no |
| `_components/alert/warning` | bg `#FFF4E5`, text `#663C00` | bg `#FFF3E0`, text `#663C00` | — | text yes, bg no |
| `_components/alert/success` | bg `#EDF7ED` | bg `#E3F6E9` | — | no |
| `shape.borderRadius` | 4 | MUI default 4 | `--nr-radius-md: 4px` | **yes** |
| spacing unit | 8 | MUI default 8 | 4-pt scale | yes at the unit; code uses 4 and 12 freely, Figma has neither |
| font family | Nunito Sans | Nunito Sans | Nunito Sans | **yes** |
| `h2` size | 60 | 64 | — | no |
| `h4` size | 34 | 36 | — | no |
| weights available | 300 400 500 600 700 | 300, normal, bold | — | code lacks 500/600 |
| dark mode | Light + Dark | none | none | no |

Six semantic mains: **0 of 6** agree. Foundations (`font`, `radius`, `spacing unit`, `background`): 4 of 4 agree. The system agrees on everything that was never customised and disagrees on everything that was.

## 5. Figma versus code — the NR status vocabulary

This is the part of the system that is NR-specific and therefore the part worth owning.

**Figma** has one `Status` component set on `NR custom / Atoms`: 25 variants = `Color` (Red, Green, Orange, Blue, Grey) × `State` (Enabled, Hover, Focussed, Pressed) × `Select` (True, False). Height 26, radius 4. Bindings: border → `{role}/_states/outlinedBorder`, text → `{role}/dark`, background → unbound literal.

**Code** defines the same idea five times:
- `chipThemes` in `AssetClaimStatusConstants.ts` — 7 themes (`red` `green` `blue` `orange` `grey` `purple` `yellow`), each `{color, border, backgroundColor}` with raw hex
- `ASSET_CLAIM_STATUS_TYPE`, `STATUSES_LIST`, `ASSET_STATUSES_LIST`, `ASSET_CLAIM_STATUS_FILTER_TYPE` — four overlapping status→theme maps
- `palette.statusSummary` in the theme — a **second visual language** for the same statuses (solid fill, white text: `registered` `#00A542`, `submitted` `#3D8FC9`, `toBeRegistered` `#FCC326`)
- `ChipLabel` in `customChips.tsx` — height 26, radius 4, 10px bold, letter-spacing 1.5; hover/focus/active as raw `rgba`

| Colour | Background | Text | Border |
| --- | --- | --- | --- |
| Red | Figma `#FFEBEE` · code `#FFEBEE` **✓** | Figma `#D32F2F` (Material red/700) · code `#B7191F` (FUGA Red/900) | Figma `#F44139 @50%` · code `#EE9A9B` solid |
| Green | `#E3F6E9` · `#E3F6E9` **✓** | `#388E3C` · `#006218` | `#00A542 @50%` · `#56CC82` solid |
| Blue | `#E5F6FC` · `#E5F6FC` **✓** | `#0288D1` · `#295E95` | `#45A2DD @50%` · `#74C7ED` solid |
| Orange | `#FFF3E0` · `#FFF3E0` **✓** | `#F57C00` · `#EA4B04` | `#FF8800 @50%` · `#FFB44C` solid |
| Grey | `rgba(0,0,0,.12)` · same **✓** | `rgba(0,0,0,.6)` · same **✓** | `#404041 @50%` · `rgba(0,0,0,.54)` |

Backgrounds match 5/5 because both sides hand-typed FUGA 50-tints. Text matches 1/5 because Figma's text binds to `{role}/dark`, which resolves to Material. Borders match 0/5 because code uses a solid 200-tint and Figma uses 50 % alpha of `main`. Same chip, three different construction methods.

Missing from Figma: `Purple` (code maps `RELINQUISHED` to it) and `Yellow` (defined in code, mapped nowhere — likely dead). Missing from code: the `Select` axis. Missing from both: any token for Curve sync state (`synced` / `requires-sync` / `not-synced`), advance recoupment, sliding-scale, or the deal-ending flag; those exist only in the prototype.

## 6. Other Figma-only and code-only inventory

**Figma `NR custom` components:** `Status` (above), `NR App Logo`, `NR App Bar`, `NR Page Header` (5 variants), `NR Form Section Grid`, `NR Table`, `Filters row`, `NR Detail page template`. Two designed pages: "CMO Detail - Generated", "Events page - 2".

**Code `src/common` components with no Figma counterpart:** 45 files, including `RegStatusBarChart`, `RegStatusNumbersPopUp`, `StatusSummaryFilters`, `BulkActionBanner`, `AlertsRow`, `OverflowTip`, `CommonSearchInput`, `CommonLookupPopupWithSuggestionList`, the 11 dropdown buttons, and the whole `AssetMetaDataEdit` family.

**Code Connect:** none. No `figma.config.json`, no `figma.connect()` calls. Nothing binds a Figma component to a code component.

## 7. Best-practice reference frame

What "good" looks like for a system of this size, so the gaps above have a measure:

- **Three tiers, one direction.** Primitives (one collection, not three) → semantic roles (aliases only, never literals) → component tokens (aliases to semantic). Figma has tiers 2 and 3 but aliases tier 2 to the wrong tier 1. Code has tier 1 only.
- **One source of truth, exported.** A neutral token file (W3C DTCG) that generates both the MUI theme and the Figma collection, so neither side can drift silently. Today there are three sources (Figma, PROD theme, prototype CSS) and no export.
- **Semantic names carry meaning, not colour.** `chipThemes.redChip` is a colour; `status.error` or `status.failed` is a meaning. Figma's `Color: Red` has the same problem.
- **Explicit scopes** on every variable. The kit's `text/*` tokens do this; nothing else does.
- **Components bind to semantic tokens, never to primitives or literals.** The `Status` background literal and every raw hex in a story break this.
- **Storybook is the contract:** Foundations first, then components; each story file has controls (`argTypes`), at least one `play` test for anything interactive, a11y as a gate, visual regression on every push, and Code Connect so Figma links straight to the story.
- **Delete what is unused.** 5 dead ramps in code, `material/colors` shipped but only 6 ramps aliased, `DMP/colors` unbound, `yellowChip` mapped nowhere.

## 8. Priority actions

1. **Choose the six semantic mains.** Figma (Material), PROD (`#000000` primary, MUI-default warning) and prototype (FUGA) each claim a different truth. This is a design decision Casper makes once. Everything below is blocked on it. Recommendation: FUGA values — they are what the `_states`, the chip backgrounds, and the prototype already use; Material is the accident.
2. **Re-alias Figma `palette` to `fuga/colors`**, regenerate the `_states` literals from the new mains (light and dark), bind the `Status` backgrounds, add `Purple`. Then hide or delete `material/colors`. One afternoon in Figma, high leverage: every NR MUI v6.1 component updates at once.
3. **Author `tokens.json` (DTCG)** from the agreed values and generate `FugaMainStyles.tsx`'s palette from it. Add the semantic layer code has never had (`text`, `divider`, `background`, `status.*`). Collapse `chipThemes` + four status maps + `statusSummary` into one `status` token group and one `<StatusChip>` component.
4. **Storybook, in this order:** rewrite the Tokens page from `tokens.json` so it cannot drift; add a Foundations group (tokens, typography, spacing, status vocabulary); collapse 19 groups to ~8; `argTypes` on the 10 most-used components; a `play` test on each dialog and dropdown; flip a11y to `'error'` once the current violations are listed; load weight 300 in `index.html` or drop it from `h1`/`h2`.
5. **Lint the door shut.** An ESLint rule forbidding hex and `rgba(` outside `src/styling/` and the token files, with an allowlist that shrinks as the 295 are migrated. Otherwise the count grows while the system is being built.
6. **Retire `@mui/styles`** (45 files). Unrelated to tokens but it is the thing that will block the MUI 7 upgrade, and touching those files for tokens is the moment to do it.

## Appendix — provenance and reproducibility

- Figma read via `use_figma` Plugin API: `getLocalVariableCollectionsAsync`, `getLocalVariablesAsync`, alias resolution one level, colours to hex with alpha; `Status` variants read for fills, strokes, text fills and their bound variables.
- Code scan: Python over `src/**/*.{ts,tsx}` excluding `tests/`, `generated/`; `styling/` excluded where stated. Story scan over `src/**/*.stories.tsx` and `.storybook/`.
- Storybook counts from `http://localhost:6006/index.json` on a build of `edd73c2`.
- Known limits: Figma component-variant coverage was sampled (Status only); the other 30-odd NR MUI v6.1 component sets were not diffed against code props. `DMP/colors` consumers were not traced.
