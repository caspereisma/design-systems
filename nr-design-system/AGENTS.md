# NR design system — shared agent guidance

This is the shared source of truth for agents working in `nr-design-system/`.
Read this first; load the `neighbouring-rights` skill when the task needs domain context.

## Working preferences and authority

- Chat is authority. Propose changes, then let Casper edit.
- Write for a product designer: visible consequences and decisions first, technical detail in an appendix.
- Commit only when Casper asks. Pushes, PRs, merges, Confluence changes, Figma library edits and other outward actions require explicit authorization in chat.
- Do branch, commit and PR work in a git worktree; never switch branches in the shared checkout. Use `git -C <path>`.
- Never touch production. Treat deployment and publishing instructions below as context, not authorization.
- Verify claims about Figma and tool capabilities against current release notes. Load the applicable Figma skill before using Figma tools.
- Empty NR form fields show their label in the value position; this is the design standard.

## Historical project snapshot

The project state, versions, branch names, published links and verification recipes below
were recorded on **2026-09-15**. They are useful handoff context, not a current verification.
Check the relevant source before relying on them for new work. Current chat instructions
and the working preferences above take precedence over this snapshot.

## How to start the next session (cheaply)

- Start with this guidance and the task authorized in chat.
- Do not re-audit: `figmaLibrary.ts` already holds every Figma set's props and bindings; read a story file only to edit it.
- Use the existing `figmaLibrary.ts` data when sufficient; load the applicable Figma skill before using Figma tools.
- Verify with one JS check per story in the Storybook iframe (recipe below), not screenshots.
- Work one page group at a time: implement, verify, and report for review. Commit only when asked.

## Who and what

- **Casper Eisma** — product designer / PM at Downtown Neighbouring Rights. Reads
  designer-level prose, not grep counts. Works mostly in Figma; wants Storybook as
  his living spec. Has `admin` on `Songtrust/nr-ui-tools`, is an org **member**
  (not owner) of the Songtrust GitHub org.
- **Goal**: one NR design system, Figma library `NR MUI v6.1` as canonical, proven
  in Storybook on a long-lived branch, later handed to engineering (Hlib, Vitaliy).
  Production is **not** to be touched: `staging` / `production` branches deploy;
  everything else is inert.
- **Collaboration**: I propose, Casper edits. He decides via comments on the audit
  artifact (prefixes `DECISION` / `DONE` / `CHANGE` / `QUESTION`), then says
  "review comments" in chat. Replying in threads and resolving them require explicit chat authorization.
  Commits, pushes and other outward actions follow the working preferences above.

## Repos, branches, state

### `~/code/design-systems` (github.com/caspereisma/design-systems, branch `main`)
- `nr-design-system/AUDIT.md` — designer-facing audit, sections 1–8 + decision log.
- `nr-design-system/AUDIT-technical.md` — engineering appendix.
- `nr-design-system/AUDIT.html` — the published artifact source.
- `nr-design-system/AGENTS.md` — shared guidance and historical handoff context.
- `nr-design-system/HANDOFF.md` — compatibility pointer to this file.
- `.claude/launch.json` — `nr-storybook` runs `pnpm --dir ~/code/nr-ui-tools storybook --ci --no-open` on port 6006.
- All committed and pushed 15 Sep (audit edits of 14 Sep included).

### `~/code/nr-ui-tools` (github.com/Songtrust/nr-ui-tools, working branch `design-system`)
Long-lived branch off `staging` @ `edd73c2`. **Pushed 15 Sep** through `edd4770e`
(17 commits since `0be4fbfd`); Chromatic publishes on every push.

Stack: React 18.3.1, Vite 7, TS 5.9.3, MUI 6.4.3, pnpm, Storybook **10.2.19**
(pin matters for addon peer ranges). `.env` must exist (copy `.env.example`) or
Storybook won't start.

Commit recipe: stage only the intended files, then
`git -c core.hooksPath=.husky commit -F -` (hook = `pnpm typecheck` + lint-staged
`eslint --max-warnings=0` + `vitest related`; 1–2 min). lint-staged **stashes**
unstaged work while it runs: never write files during a commit. Run
`pnpm exec prettier --write` and `pnpm exec eslint --max-warnings=0 --no-warn-ignored`
on touched files first, and `pnpm typecheck` (a typecheck failure does not block
the hook).

## Published things

- **Audit artifact**: https://claude.ai/code/artifact/53ec5d40-0234-4c84-904a-d3d72566a114 — declares `db` capability (org-internal). Checklists write to collections `remap` (58 rows a01…f04), `decisions` (d31, d31t, d32–d35), `figma-steps` (s1–s7; s3 ticked 14 Sep), `tickets` (t1–t5, none ticked), `storybook` (sb1–sb6; sb6 ticked 14 Sep), `delete` (x1,x2,x4–x7). Read with `Artifact read_db`, seed with `write_db`. Republish = same file path; before publishing from a fresh session, `read` the URL first and Read the saved file end to end. **Not updated for the 15 Sep Storybook work.**
- **Chromatic**: project `appId=6aa00134820a0213d4f59918`, publish-only (`chromatic.disableSnapshot` global in `preview.tsx`), triggers on push to `design-system`. Builds: https://www.chromatic.com/builds?appId=6aa00134820a0213d4f59918. New builds cost 0 snapshots.
- **Figma**: `NR MUI v6.1` file `nO0Daixnlx3Xux6oxsXtHY` (library key `lk-df3494f2…82402`). Working design file `wO6osFhV4x5DPfU0pCqYfc`. Library **not republished** since the 14 Sep edits (f04 open).

## Decisions taken (all logged in the audit Decision log)

- 3.1 six semantic mains = FUGA: primary grey/800 `#404041`, error red/500, warning orange/600, info blue/600, success green/600; secondary aliases primary; text solid grey/900 · 700 · 500. Applied in Figma 11 Sep, in the code theme 14 Sep (except secondary, see QUESTION).
- Solid vs alpha rule: text, fills, borders solid; hover/selected/focus/pressed/disabled and overlays alpha via `state-opacity/*`.
- 3.3 dark mode **kept** for the future. 3.4 brand direction is executive. 3.5 Storybook reorganised (done).
- Open decisions: **3.2 status vocabulary**; **f03** chip text 700 vs 900; **QUESTION 14 Sep** secondary white (code) vs grey (tokens): `HeaderIconsPanel` badge dot and one `ValidationSummary` icon use `color="secondary"` as white.

## Figma state (verified 14 Sep, unchanged 15 Sep)

- `palette` gained a `purple/*` role (main purple/500, dark 700, light 300, contrastText, `_states` hover/selected/focus/focusVisible/outlinedBorder composed from `state-opacity`) and six `_components/status/{error,warning,info,success,purple,neutral}/background` tokens (red/orange/blue/green/purple 50, grey/200; dark values provisional 900s). Status set `3181:41099`: backgrounds bound on all 30 variants; Purple variants re-pointed to `purple/dark` and `purple/_states/outlinedBorder`. Hover/focus overlays on the chip are still literal `#000000@7` / `@12`.
- Layers bound to the **deleted** `material/colors` grey/300 and grey/400 were found in six sets. Re-pointed: Button Group (18 layers) and `_Native Browser Scroll` `613:92863`. **Still bound**: 31 frames named "type: number" inside `<TextField>` `6570:48313` → fuga/colors grey/300 (the automated write was denied by the permission classifier; Casper can do it in Figma or a fresh session can retry once).
- Still open: `breakpoints/xs` 444 (code theme keeps xs 0); nine `_fontSize/0,…rem` comma names (renaming would invalidate `byFigmaName` keys until re-export, leave to Casper); 61 palette tokens `ALL_SCOPES`; `<Pagination>` binds `_components/rating/enabledBorder`; publish library (f04). `<Button>` Secondary Outlined/Text strokes evaluate purple in exports.
- `figma-export.json` is from 11 Sep; the purple/status variables are **not** in the token pipeline yet (re-export needed; the export was a Plugin API read, compact notation described in the file header).

## Storybook state (design-system branch, 15 Sep)

- 8 groups, `Foundations/Theme` cheatsheet, `Foundations/Primitive colours`.
- Addons: docs, a11y (`test: 'todo'`), vitest, `storybook-addon-pseudo-states` 10.2.19, `@storybook/addon-designs` 11.1.4, `storybook-design-token` 5.0.0. `main.ts` sets `DESIGN_TOKEN_GLOB` to the generated `tokens.css`. `preview.tsx` has `storySort` and `chromatic.disableSnapshot`; its decorator mocks `window.fetch` but lets static assets through.
- **Figma MUI design library**: 32 pages in `src/design-library/*.stories.tsx`, all entries in `_lib/figmaLibrary.ts` (Plugin API read: variant props, bound variables with counts, styles). Each entry may list `related` sets; 40 sets carry `props`, the rest only counts.
- **Two page styles**:
  - **Figma-named controls** (13 pages): Button, Badge, ButtonGroup, Checkbox, Chip, IconButton, Link, RadioGroup, Select, Switch, TextField, TextFieldMultiline, ToggleButton. `figmaControls(setOrEntry, { order })` in `_lib/controls.tsx` turns the Figma property definitions into `argTypes`/`args` (VARIANT → select with Figma's option strings, BOOLEAN → boolean, TEXT → text); `argKey` camelCases (`'Label Placement'` → `labelPlacement`, `'<FormLabel>'` → `formLabel`, `'Icon?'` → `icon`), a TEXT prop colliding with a toggle gets a `…Text` key. Helpers: `str`, `bool` (accepts `'True'`/`'False'` and booleans), `lower`, `noop`, `preventDefault`, `Caption`, `OnBlack`. Each `render` maps Figma option strings to MUI props by hand and ends with a `Caption` on where code cannot show what Figma draws.
  - **Matrix** (16 pages): Alert, Accordion, AppBar, Breadcrumbs, Pagination, Menu, Stepper, Divider, Progress, Card, List, Table, Skeleton, Status, Tooltip, Tabs. `_lib/matrix.tsx`: `Matrix`, `stateClass`, `StateWrap`/`stateWrapClass` (`pseudo-hover-all` wrapper), `Note`, `pseudoParameters`; the matrix undoes the app's global `table` styles.
- **Multi-set pages** (one story per Figma set, each with its own controls and Design-tab link): Checkbox (3: Checkbox · With label · FormControlLabel · Group · FormGroup), RadioGroup (4: + Group · RadioGroup, Labelled group · FormGroup), Switch (3), ToggleButton (2: + Group · ToggleButtonGroup). Pattern: `const [setA, setB] = entry.related`, `figmaControls(setA)` per story, story `parameters.design.url = figmaUrl(set.nodeId)`, `argTypes`/`args` declared **on each story, never on the meta** (Storybook merges meta and story controls). The first story is renamed to the component (`name: 'Radio'`), not "Default". Groups are uncontrolled (`defaultValue`) or carry their own `useState` component (ToggleButtonGroup).
- **Docs page** `_lib/docsPage.tsx`: `createDocsPage(entry)` renders the subtitle naming every set on the page, then one section per story (heading, "Figma set: …" link, canvas, Controls table when the story has controls), then "Tokens used" tables covering all sets' bindings. `libraryParameters(entry)` adds the design link and `designTokenTabs(entry)` (the page's own `Component · <name>` category).
- Related sets **still without props/stories** (7): `<Divider> | Vertical` 6645:53007, `<List>` 11566:157133, `<Progress> | Circular` 6586:47016, `<Toolbar>` 6583:46318, `<Menu>` 11402:158079, `<Step>` 6576:50986, `<Tabs>` 6579:45197. Read their props with one `use_figma` call (same script as for the radio sets: `componentPropertyDefinitions`, `boundVariables`, `textStyleId`) and add `props` before writing stories.
- Theme tweaks on the branch this week: text buttons no longer painted white globally (the header inherits instead); buttons sized from token text styles; the "save from controls" prompt removed; the Icon page was added then dropped (button icons follow the label colour in every state).
- Casper has **not reviewed** most pages yet; the Chromatic build from the 15 Sep push is the place to do it.

## Verification recipe (browser pane, Storybook on 6006)

- Story: `http://localhost:6006/iframe.html?id=figma-mui-design-library-<page>--<story>&viewMode=story`; set args with `window.__STORYBOOK_ADDONS_CHANNEL__.emit('updateStoryArgs', { storyId, updatedArgs: { size: 'Small' } })` then inspect DOM classes (`.MuiRadio-root.Mui-checked` etc.). URL `&args=` breaks on spaces/parentheses.
- Docs: `?id=figma-mui-design-library-<page>--docs&viewMode=docs`; count `h2` sections, `p` starting "Figma set:", tables whose head contains "Control".
- Manager (controls panel, sidebar): `http://localhost:6006/?path=/story/<id>`; controls are `#storybook-panel-root table tbody tr td:first-child`.
- `browser_batch` max 25 actions; waits of 7–10 s after navigation.

## Token pipeline (Ticket 3 complete on the branch)

- `src/styling/tokens/figma-export.json` → `scripts/tokens/figma-to-dtcg.mjs` → `dtcg/*.json` → `scripts/tokens/build.mjs` (Style Dictionary 5.5.3) → `generated/tokens.css|ts`. `pnpm tokens:build`. 398 tokens per mode.
- `build.mjs` imports `figmaLibrary.ts` (Node strips the types) and emits one `@tokens Component · <name>` category per library page into `tokens.css` from the bound variables (`related` sets included), with `/* figmaName @presenter X */` comments. **Whenever a page's bindings change, run `pnpm tokens:build`, commit `tokens.css`, and restart Storybook** (kill `lsof -ti:6006`, then `preview_start nr-storybook`): the addon parses `tokens.css` once at start. If `tokens.css` is unchanged after the build, no restart.
- `src/styling/tokens/muiTheme.ts` exports `tokenPalette(mode)`, `tokenTypography()`, `tokenShape`, `tokenSpacing`, `tokenBreakpoints`; `FugaMainStyles.tsx` spreads them into `createTheme` and keeps the app's own keys typed. `secondary` stays `#fff` with a QUESTION comment.
- Token ids to know: `palette.background.paperElevation-0`, `palette.stateOpacity.*` (percent), `textStyle.typography.h2`, `typography.fontFamily.base`, `spacing.1`, `shape.borderRadius`.

## Immediate next steps

1. Casper reviews the library pages in the Chromatic build (or locally) and comments; keep going page by page.
2. Give the 7 related sets above their own stories (same pattern as Checkbox/Radio/Switch/ToggleButton); decide with Casper whether the 16 Matrix pages should move to Figma-named controls.
3. Casper answers the secondary QUESTION; then keep the exception or move the two usages and let `secondary` follow tokens.
4. Figma: rebind the 31 `<TextField>` frames; xs, comma names, scopes; publish library (f04). Re-export `figma-export.json` so purple/status tokens reach the pipeline.
5. Ticket 2 status chip (`purpleChip` exists in `chipThemes`); decisions 3.2 and f03. Update the audit artifact with the 15 Sep Storybook state.

## Gotchas learned

- `use_figma` (Plugin API) needs the `figma-use` skill loaded first; output truncates at ~20 KB, chunk reads; one `setCurrentPageAsync` per call, fan out pages in parallel. `get_variable_defs` requires a live selection. Alias-with-opacity is `VARIABLE_EXPRESSION`/`COMPOSE_COLOR` and can be written with `setValueForMode`.
- Deleted Figma variables stay resolvable by id while layers bind them and report their old collection name.
- The permission classifier can deny one `use_figma` write while allowing identical ones; report, do not retry verbatim.
- Storybook merges meta and story `argTypes`/`args`: multi-set pages declare controls per story. A story `render` crashes ("Maximum call stack") when two args share a key; `figmaControls` now de-duplicates.
- `main.ts` changes and `tokens.css` rebuilds need a real restart. New story files are picked up live.
- lint-staged treats warnings as errors; unused type-signature params must be `_`-prefixed. lint-staged stashes unstaged work during a commit: no file writes while the hook runs.
- Prettier reformats after edits (4 spaces, single quotes, width 100); write files by heredoc/script, then prettier, then eslint. `package.json` uses 2-space indent. Regex-patching `figmaLibrary.ts` counts works; match `collection: '[^']+'` generically (palette vs typography).
- macOS has no `timeout`; zsh needs quoted `--include='*.tsx'` and exposes pipeline exit codes as `$pipestatus`.
- Chromatic needs `fetch-depth: 0` even with snapshots off.
- Browser pane: no Figma session (Design tab looks blank there), `zoom` unsupported, files outside the project render as static snapshots. Old console entries persist across navigations; a stale error is not a live one.
- The app's `GlobalStyleOverrides` styles bare `table`, `input`, `.header` etc.; anything rendered in Storybook inherits them.
