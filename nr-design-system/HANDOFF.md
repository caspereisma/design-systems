# Handover — NR design system work (as of 2026-09-14)

Temporary handover for a fresh Claude Code session. Read this first, then the
`neighbouring-rights` skill for domain context. Delete or fold into README/AGENTS
once the `nr-design-system/` folder becomes a real system.

## Who and what

- **Casper Eisma** — product designer / PM at Downtown Neighbouring Rights. Reads
  designer-level prose, not grep counts. Works mostly in Figma; wants Storybook
  as his living spec. Has `admin` on `Songtrust/nr-ui-tools`, is an org
  **member** (not owner) of the Songtrust GitHub org.
- **Goal**: one NR design system, Figma library `NR MUI v6.1` as canonical,
  proven in Storybook on a long-lived branch, later handed to engineering
  (Hlib, Vitaliy). Production is **not** to be touched: `staging` /
  `production` branches deploy; everything else is inert.
- **Style of collaboration**: I propose, Casper edits. He decides via comments
  on the audit artifact (prefixes `DECISION` / `DONE` / `CHANGE` / `QUESTION`),
  then says "review comments" in chat. Threads he wants closed he sends to
  Claude; I reply in-thread and resolve. Pushes to `nr-ui-tools` and anything
  outward-facing get an explicit word from him first ("push", "go").

## Repos, branches, state

### `~/code/design-systems` (github.com/caspereisma/design-systems, branch `main`)
- `nr-design-system/AUDIT.md` — designer-facing audit, sections 1–8 + decision log. **Modified, uncommitted.**
- `nr-design-system/AUDIT-technical.md` — engineering appendix (committed).
- `nr-design-system/AUDIT.html` — the published artifact source. **Modified, uncommitted.**
- `.claude/launch.json` — `nr-storybook` runs `pnpm --dir ~/code/nr-ui-tools storybook --ci --no-open` on port 6006.
- Last commit `9b10293`. Casper has asked to commit/merge/push explicitly each time ("I want them in", "merge", "push").

### `~/code/nr-ui-tools` (github.com/Songtrust/nr-ui-tools, working branch `design-system`)
Long-lived branch off `staging` @ `edd73c2`. **2 commits ahead of `origin/design-system`, not pushed**:
- `cb5f5cb3` Figma MUI design library section + Figma-derived tokens
- `68d7dbf3` Rebuild pilot on addon-designs + storybook-design-token

Pushed earlier: `84a22873` Chromatic workflow · `a6cfbdc0` Storybook reorganised into 8 groups + `Foundations/Theme` cheatsheet · `ebc5b7e8` Chromatic publish-only · `bedde91c` fetch-depth restore.

Stack: React 18.3.1, Vite 7, TS 5.9.3, MUI 6.4.3, pnpm, Storybook **10.2.19** (pin matters for addon peer ranges). Pre-commit hook: `pnpm typecheck` + lint-staged (`eslint --max-warnings=0`, `vitest related`). `.env` must exist (copy `.env.example`) or Storybook won't start.

## Published things

- **Audit artifact**: https://claude.ai/code/artifact/53ec5d40-0234-4c84-904a-d3d72566a114 — declares `db` capability (org-internal). Checklists write to collections `remap` (58 rows a01…f04), `decisions` (d31, d31t, d32–d35), `figma-steps` (s1–s7), `tickets` (t1–t5), `storybook` (sb1–sb6), `delete` (x1,x2,x4–x7). Read with `Artifact read_db`, seed with `write_db`. Republish = same file path; before publishing from a fresh session, `read` the URL first.
- **Chromatic**: project `appId=6aa00134820a0213d4f59918`, publish-only (`chromatic.disableSnapshot` global in `preview.tsx`), triggers on push to `design-system`. Builds: https://www.chromatic.com/builds?appId=6aa00134820a0213d4f59918. Snapshot budget ≈949/5000 used in Sep; new builds cost 0.
- **Figma**: `NR MUI v6.1` file `nO0Daixnlx3Xux6oxsXtHY` (library key `lk-df3494f2…82402`). Working design file `wO6osFhV4x5DPfU0pCqYfc`.

## Decisions taken (all logged in the audit Decision log)

- 3.1 six semantic mains = FUGA: primary grey/800 `#404041`, error red/500, warning orange/600, info blue/600, success green/600; secondary aliases primary; text solid grey/900 · 700 · 500. **Applied in Figma.**
- Solid vs alpha rule: text, fills, borders solid; hover/selected/focus/pressed/disabled and overlays alpha via `state-opacity/*` (alias + opacity, Figma feature since 3 Sep 2026).
- 3.3 dark mode **kept** for the future (Figma stays two-mode; tokens carry dark).
- 3.4 brand direction is an executive matter; Casper, Dean, Román monitor. Build on FUGA; `DMP/colors` stays.
- 3.5 Storybook reorganised: Foundations · Actions · Inputs & forms · Filters · Data display · Feedback · Navigation & layout · Domain. Done.
- Open decision: **3.2 status vocabulary** (Registered vs Exclusive licence deal green; Submitted vs Exported; Re-register orange; Purple in; Yellow out; sync states in or indicator-only) and **f03** chip text 700 vs 900.

## Figma state (verified 11 Sep)

340 variables, 8 collections. `material/colors` deleted. `palette` (140) all aliases to `fuga/colors` (now lowercase `grey/800`, `base/White`, `fuga-Blue`, `fuga-Green`; `naxos-blue` removed). `state-opacity/*` = 8 numbers scoped `COLOR_OPACITY` (hover 4/8, selected 8/16, focus 12, focusVisible 30, outlinedBorder 50, disabled 38, disabledBackground 12, active 56). Every `_states` token = `COMPOSE_COLOR(→{role}/main, →state-opacity/x)`.

Still open in Figma: Status chip backgrounds unbound and Purple variant a copy of Grey (needs a `purple` palette role); `breakpoints/xs` 444; nine `_fontSize/0,…rem` comma names; 61 palette tokens still `ALL_SCOPES`; publish library (f04). **Oddity**: `<Button>` Secondary Outlined/Text strokes bound to `secondary/_states/outlinedBorder` still evaluate purple `#9C27B0 @50%` in exports though the variable composes from grey — looks like a stale compose evaluation; logged as QUESTION.

## Storybook state (design-system branch)

- 8 groups, `Foundations/Theme` cheatsheet (`src/styling/Theme.stories.tsx`), `Foundations/Primitive colours` (old token page).
- Addons: docs, a11y (`test: 'todo'`), vitest, `storybook-addon-pseudo-states` 10.2.19, `@storybook/addon-designs` 11.1.4, `storybook-design-token` 5.0.0. `main.ts` sets `process.env.DESIGN_TOKEN_GLOB` to the generated `tokens.css` only. `preview.tsx` has `storySort` order and `chromatic.disableSnapshot`.
- **Figma MUI design library** group, pilot pages `src/design-library/{Button,Chip,Status}.stories.tsx`:
  - story = MUI component in Figma's variant × state × size matrix (`_lib/matrix.tsx`: `Matrix`, `stateClass`, `pseudoParameters`); Text buttons on black panel because theme forces `MuiButton.text.color #fff`
  - `parameters.design` → Design tab with live Figma set (`_lib/figmaLibrary.ts` holds node ids, variant props, bindings, styles)
  - `parameters.designToken.tabs` limits the Design Tokens panel to used categories
  - autodocs page from `_lib/docsPage.tsx`: Storybook blocks + one `DesignTokenDocBlock` per category filtered to the bound variables
  - Casper **rolled back** the earlier Figma-PNG-vs-code comparison and match table. Do not reintroduce.
- Casper asked for 32 components total; 29 remain: Icon button (default & primary), Button group (primary), Checkbox, Radio group, Select (standard), Switch (primary), Text field (standard), Text field multiline (standard), Toggle Button, Badge, Divider, List, Table, Tooltip, Alert, Dialog, Progress, Skeleton, Accordion, App Bar, Card, Popover, Breadcrumbs, Drawer, Link, Menu, Pagination, Stepper, Tabs. Per component: read the Figma set (variant defs + bound variables, see pattern in `figmaLibrary.ts`), add an entry, write a story in the pilot's shape. He reviews the pilot first.

## Token pipeline (Ticket 3, first half done)

- `src/styling/tokens/figma-export.json` — read-only snapshot of all variables/styles (compact notation: `→collection/name` alias, `C(base|opacity)` compose, `#RRGGBB@NN`).
- `scripts/tokens/figma-to-dtcg.mjs` → `src/styling/tokens/dtcg/{primitives,foundation,palette.light,palette.dark,text-styles,elevation}.json` (W3C DTCG; compose kept as alias + `$extensions["nr.compose"]`).
- `scripts/tokens/build.mjs` → Style Dictionary 5.5.3 resolves per mode → `src/styling/tokens/generated/tokens.css` (annotated `@tokens`/`@presenter` categories, dark overrides after `@tokens-end`) and `tokens.ts` (`tokens.light/dark[id]`, `byFigmaName`, `cssVar`, `category`). 398 tokens per mode. Command: `pnpm tokens:build`. Generated files are committed (`build/` is gitignored, hence `generated/`).
- Naming: `palette.primary.states.outlinedBorder`, `fuga.colors.grey.800`, `typography.fontSize.15`, `textStyle.button.medium`, `elevation.2`; CSS `--nr-palette-primary-states-outlined-border`.
- Not done: generating `FugaMainStyles.tsx` from the tokens (second half of Ticket 3).

## Immediate next steps

1. Casper reviews the rebuilt pilot; say **push** to publish via Chromatic.
2. Commit the two audit files in `design-systems` when he asks; republish the artifact after any edit.
3. Remaining 29 library pages (after pilot sign-off).
4. Figma: `purple` palette role + bind Status backgrounds; xs, comma names, scopes; publish library.
5. Ticket 3 second half; Ticket 2 status chip; decisions 3.2 and f03.

## Gotchas learned

- `use_figma` (Plugin API) needs the `figma-use` skill loaded first; output truncates at ~20 KB, so chunk reads. `get_variable_defs` requires a live selection; prefer Plugin API reads. Alias-with-opacity appears as `VARIABLE_EXPRESSION` / `COMPOSE_COLOR`.
- Never claim a Figma absence from one search; phrase twice.
- Storybook `main.ts` changes need a real restart: kill the node process on 6006 (`lsof -ti:6006`), then `preview_start nr-storybook`. HMR console errors with old `?t=` stamps are stale, not bugs.
- lint-staged treats warnings as errors: no `eslint-disable` directives in generated files; unused type-signature params must be `_`-prefixed.
- Prettier reformats after my edits; string-match edits can miss. `package.json` uses 2-space indent (don't `json.dumps(indent=4)`).
- Chromatic needs `fetch-depth: 0` even with snapshots off.
- Browser pane: no Figma session (Design tab looks blank there), `zoom` unsupported, files outside the project render as static snapshots.
- Design-token addon parses every css/png in the repo unless `DESIGN_TOKEN_GLOB` is set.
