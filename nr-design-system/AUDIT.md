# NR design system — a designer's audit

*Casper Eisma · 9 September 2026 · Figma "NR MUI v6.1" vs. the NR Portal frontend and its Storybook.*
*Engineering detail lives in [AUDIT-technical.md](AUDIT-technical.md). This document is the version you act on.*

---

## How this page is used

This audit is a working document. Casper reviews it, does the Figma and decision work it describes, and leaves comments on the published page (the artifact) as he goes. Claude folds those comments back in batches.

1. **Review and work.** Read a section; do the work in Figma, Storybook or with the team.
2. **Comment where the change belongs.** Anchor each comment on the exact text, swatch or row it refers to. No need to mention Claude. Start every comment with a prefix:
   - `DECISION` — a choice is made. Claude updates the section, marks it *decided*, logs it.
   - `DONE` — a step or ticket is complete. Claude marks it *done*, logs it.
   - `CHANGE` — edit the page. Claude edits; substantive changes are logged.
   - `QUESTION` — needs an answer, not an edit. Claude answers in the chat report and in-thread once sent.
3. **End the sprint in chat.** Say "review comments" in the Claude Code session. Claude reads every thread, makes the changes, republishes once at the same link, and reports what changed and what it did not do.
4. **Close the threads.** Casper sends the threads he wants closed to Claude (*Send to Claude* or `@claude`). Claude replies in each with what was done and resolves it. Others stay open for Casper to resolve by hand.

Two rules: comments are requests and chat is authority (anything outward-facing or hard to undo is confirmed in chat first); the page is the log (every DECISION and DONE lands in the Decision log with a date). Caveat: republishing can detach open comment anchors, so resolve threads at the end of each sprint.

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

- [x] 3.1 Six semantic colours — FUGA values adopted in Figma, 11 Sep.
- [x] 3.1 Text solid, not alpha — grey/900 · 700 · 500 adopted, 11 Sep.
- [ ] 3.2 Status vocabulary — open questions in the table below.
- [x] 3.3 Dark mode — kept for the future, 11 Sep.
- [x] 3.4 Brand direction — executive matter, monitored by Casper, Dean and Román, 11 Sep. Build on FUGA now.
- [x] 3.5 Storybook organisation — decided and implemented 10 Sep.

### 3.1 The six semantic colours — *decided · applied in Figma*

Pick one value for each role. My recommendation is the FUGA column: it is what the hover and border states already use, what the chip backgrounds already use, and what your prototypes already use. Material is the accident.

| Role | Figma today (Material) | Live app today | Prototype today | **Recommend** |
| --- | --- | --- | --- | --- |
| Primary | `#424242` | `#000000` | `#404041` | `#404041` FUGA Grey 800 |
| Secondary | `#9C27B0` purple | white on grey | — | **Copies primary.** NR uses no secondary colour, so `secondary/*` aliases the same grey tokens as `primary/*`. |
| Error | `#F44336` | `#F44139` | `#F44139` | `#F44139` FUGA Red 500 |
| Warning | `#FB8C00` | `#ED6C02` | `#FF8800` | `#FF8800` FUGA Orange 600 |
| Info | `#039BE5` | `#45A2DD` | `#45A2DD` | `#45A2DD` FUGA Blue 600 |
| Success | `#43A047` | `#00A542` | `#00A542` | `#00A542` FUGA Green 600 |

**Text is solid, not alpha.** Decided 11 Sep: `text/primary` `grey/900`, `text/secondary` `grey/700`, `text/disabled` `grey/500`, replacing Material's 87 / 60 / 38 % black. Same look on white, but a fixed colour means contrast is computed once, rendering stays crisp, and Figma equals browser. The rule behind it:

| Role | Solid or alpha | Why |
| --- | --- | --- |
| Text, fills, chip backgrounds, brand, alerts | **Solid** | One hex, one rendering. Contrast fixed once. Exports everywhere. |
| Component borders (chip, input) | **Solid** tint | Surface beneath is fixed, so alpha buys nothing. `red/200` ≈ `red/500` at 50 % on white. |
| Hover, selected, focus, pressed, disabled | **Alpha** | Sit on many surfaces. Now `{role}/main` + `state-opacity/*` (Figma alias-with-opacity, since 3 Sep 2026). |
| Backdrop, scrim, skeleton | **Alpha** | Overlays by nature. |
| Dividers | **Solid** `grey/300` | Alpha only where they cross tinted rows. |

Three guards: alpha never for text; never stack two alpha layers; every alpha state checked on the darkest surface it can sit on.

> **Decided and applied in Figma · 11 Sep 2026.** Recommendations followed as written: primary `grey/800`, error `red/500`, warning `orange/600`, info `blue/600`, success `green/600`, text solid greys. Secondary copies primary. Every `palette` token resolves through `fuga/colors`; `material/colors` deleted. Code carries the old values until Ticket 3.

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
| Relinquished | Rights given up | **Purple** | Purple role and variant added to Figma 14 Sep. |
| Export in progress / completed / failed | Bulk-export job states | Blue / Green / Red | Only place Red is used. |

Figma had five colours (Red, Green, Orange, Blue, Grey); Purple was added on 14 Sep as a full `purple/*` palette role, so the library now has the six the product needs. Code also defines a Yellow chip that nothing uses: delete it.

Also missing from *both* Figma and code, present only in your prototype: Curve sync state (synced / requires sync / not synced), advance recoupment (recouped / in recoupment), sliding-scale position, deal-ending flag. Decide whether these join the status vocabulary or stay indicator-only.

### 3.3 Dark mode: kept for the future — *decided*

**Decided 11 Sep:** dark mode stays as a future capability. Figma `palette` keeps its Dark mode and every token stays two-mode. The Dark column in 4.1 applies; `state-opacity` keeps its dark values; the dark paper-elevation greys stay (d04). Ticket 3's `tokens.json` carries a dark set from day one. Shipping dark mode in the product is a later Brief.

### 3.4 Brand direction — a dependency to monitor — *decided*

The Figma file contains a third palette, `DMP/colors`: Downtown Music Publishing's brand (Parchment, Burnt Orange, Sage Green, Steel Blue, Warm Tan). It is bound to nothing. Decided 11 Sep: the rebrand question sits with the executives, not this team. Casper, Dean and Román monitor it. Tokens do not wait on it: build on FUGA now; the semantic layer makes a palette swap cheap if DMP or VMG is chosen later. `DMP/colors` stays in the file until that call, then gets deleted or promoted.

### 3.5 How Storybook should be organised — *decided · done*

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

> **Decided and implemented · 10 Sep 2026.** Adopted as proposed, plus a **Theme** page. On the `design-system` branch: 119 story files retitled into the eight groups (large old groups kept as a second level, e.g. *Feedback / Dialogs*), sidebar sorted in this order with Foundations first, Storybook glob widened beyond `src/common`, and a new *Foundations / Theme* cheatsheet mirroring the Figma "Theme" page. Every value on it is read from the theme. Not yet pushed.

---

## 4. What you can fix yourself, in Figma, this week

All inside `NR MUI v6.1`. None of it needs engineering. Publishing the library afterwards updates every screen that uses it.

1. [x] **Re-point the six `main` tokens** (`primary/main`, `secondary/main`, `error/main`, `warning/main`, `info/main`, `success/main`, plus their `dark` and `light` variants) from `material/colors` to the matching `fuga/colors` ramp, in both Light and Dark modes. Use the values from §3.1.
2. [x] **Re-alias the `_states` tokens** to `{role}/main` with their own opacity (hover 4 %, selected 8 %, focus 12 %, focusVisible 30 %, outlinedBorder 50 %). Figma supports alias + opacity since the 3 September 2026 release "Control opacity at scale", and the opacity can be a number variable, so put the five percentages in one small set scoped for colour variables. Both modes then follow the mains automatically.
3. [x] **Bind the `Status` chip backgrounds.** On all 25 variants the background is a typed hex. Bind each to the matching `{role}/light` or a new `{role}/_states/background` token. Add a **Purple** colour variant for Relinquished. *Done 14 Sep: `purple/*` role (500 / 700 / 300, contrastText, five `_states`); six `_components/status/{role}/background` tokens, solid 50-tints with `grey/200` for the neutral chip, bound on all 30 variants; Purple variants use `purple/dark` and `purple/_states/outlinedBorder`. Dark values provisional 900s.*
4. [x] **Rename the FUGA ramps to match the Material convention** (`Grey/800` → `grey/800`, `Fuga-Blue` → `fugaBlue`, `naxos-blue` → `naxosBlue`, `Base/White` → `common/white`). Consistent casing is what stops the wrong alias being picked next time.
5. [x] **Delete `material/colors`** once nothing aliases it. 252 variables that exist only to be picked by mistake.
6. [ ] **Tidy the small things**: fix the typo `knowFillDisabled` → `knobFillDisabled`; set `breakpoints/xs` to 0 (MUI's default; 444 is a frame width); rename `_fontSize/0,625rem` style names to use a dot.
7. [ ] **Scope the variables.** Most are `ALL_SCOPES`, so every colour appears in every picker. The kit's own `text/*` tokens show the pattern: text colours scoped to text fill, surface colours to frame fill, border colours to stroke. This is the single biggest quality-of-life improvement for anyone designing in the file.

### 4.1 Variable remap checklist

Every `palette` variable that touches `material/colors`, plus the Material-derived literals, with its `fuga/colors` target. Follows 3.1 and the solid-versus-alpha split. Current FUGA names; rename comes after. Dark column applies only if 3.3 keeps dark mode. Live, tickable version on the published page.

> **Reviewed against the file · 11 Sep 2026.** All 55 ticked rows verified; the three earlier slips (success/dark in Dark, standard input enabled border, knobFillDisabled) fixed. Beyond the list: ramps renamed lowercase, `naxos-blue` removed, `state-opacity/*` scoped `COLOR_OPACITY`, `action/*` re-aliased to `base/Black`. Rows show pre-rename names. Open: d04, f03, f04, Status chip backgrounds and Purple role.

**A · Semantic mains (3.1 values)**

- [ ] `primary/main` — Light: grey/800 #424242 → **Grey/800** `#404041` · Dark: grey/200 → **Grey/300** `#DEDEE0`
- [ ] `primary/dark` — Light: grey/900 → **Grey/900** `#1F1F21` · Dark: grey/500 → **Grey/500** `#9B9B9D`
- [ ] `primary/light` — Light: grey/600 → **Grey/600** `#737374` · Dark: grey/50 → **Grey/50** `#FAFAFC`
- [ ] `primary/contrastText` — Light: Base/White → **keep** · Dark: #000 @87% → **Grey/900** `#1F1F21`  
      Solid instead of alpha black.
- [ ] `secondary/main · dark · light` — Light: purple/500 · 700 · 300 → **same Grey tokens as primary** `#404041` · Dark: purple/200 · 400 · 50 → **same as primary dark** `#DEDEE0`  
      NR has no accent in use; code's "secondary" is a button style. Aliasing to grey makes any stray secondary render harmlessly. Revisit only if an accent is wanted (Purple/500 #66359D or Fuga-Blue/500 #3F598E).
- [ ] `error/main` — Light: red/500 #F44336 → **Red/500** `#F44139` · Dark: red/500 → **Red/500** `#F44139`
- [ ] `error/dark` — Light: red/700 → **Red/700** `#D32D32` · Dark: red/700 → **Red/700** `#D32D32`
- [ ] `error/light` — Light: red/300 → **Red/300** `#E47375` · Dark: red/300 → **Red/300** `#E47375`
- [ ] `warning/main` — Light: orange/600 #FB8C00 → **Orange/600** `#FF8800` · Dark: orange/400 → **Orange/400** `#FFA424`
- [ ] `warning/dark` — Light: orange/700 → **Orange/700** `#F97802` · Dark: orange/700 → **Orange/700** `#F97802`
- [ ] `warning/light` — Light: orange/300 → **Orange/300** `#FFB44C` · Dark: orange/300 → **Orange/300** `#FFB44C`
- [ ] `info/main` — Light: lightBlue/600 #039BE5 → **Blue/600** `#45A2DD` · Dark: lightBlue/400 → **Blue/400** `#5ABCED`
- [ ] `info/dark` — Light: lightBlue/700 → **Blue/700** `#3D8FC9` · Dark: lightBlue/700 → **Blue/700** `#3D8FC9`
- [ ] `info/light` — Light: lightBlue/400 → **Blue/400** `#5ABCED` · Dark: lightBlue/300 → **Blue/300** `#74C7ED`
- [ ] `success/main` — Light: green/600 #43A047 → **Green/600** `#00A542` · Dark: green/400 → **Green/400** `#0FC066`
- [ ] `success/dark` — Light: green/700 → **Green/700** `#009237` · Dark: green/700 → **Green/700** `#009237`
- [ ] `success/light` — Light: green/400 → **Green/400** `#0FC066` · Dark: green/300 → **Green/300** `#56CC82`
- [ ] `error · warning · info · success /contrastText` — Light: #FFF → **Base/White** `#FFFFFF` · Dark: #000 @87% → **Grey/900** `#1F1F21`

**B · Text (alpha → solid)**

- [ ] `text/primary` — Light: #000 @87% → **Grey/900** `#1F1F21` · Dark: #FFF → **Grey/50** `#FAFAFC`
- [ ] `text/secondary` — Light: #000 @60% → **Grey/700** `#5F5F60` · Dark: #FFF @70% → **Grey/400** `#BBBBBD`
- [ ] `text/disabled` — Light: #000 @38% → **Grey/500** `#9B9B9D` · Dark: #FFF @38% → **Grey/600** `#737374`

**C · Interaction states (alias to main + opacity)**

- [ ] `state-opacity` (new number-variable set) — create: hover 4 · selected 8 · focus 12 · focusVisible 30 · outlinedBorder 50, scoped for colour variables. Every `_states` token points its opacity here.
- [ ] `error/_states/*` — Light and Dark: literals → **alias error/main + opacity**  
      Figma supports alias + opacity since 3 Sep 2026. Both modes follow the main automatically.
- [ ] `warning/_states/*` — literals → **alias warning/main + opacity**
- [ ] `secondary/_states/*` — literals → **alias secondary/main + opacity** (follows a05)
- [ ] `primary · info · success /_states/*` — values already right; convert to aliases so they stop drifting.
- [ ] `text/_states · action/* · common/*_states` — keep. Alpha of #000 / #FFF, not Material-specific.

**D · Surfaces and dividers (alpha → solid)**

- [ ] `divider` — Light: #000 @12% → **Grey/300** `#DEDEE0` · Dark: #FFF @12% → **Grey/800** `#404041`
- [ ] `elevation/outlined` — Light: #E0E0E0 (Material grey/300) → **Grey/300** `#DEDEE0` · Dark: → divider → **keep alias**
- [ ] `background/default · paper-elevation-0` — Light: #FFF → **Base/White** `#FFFFFF` · Dark: #121212 → **Grey/900** `#1F1F21`
- [x] `background/paper-elevation-1…24` — Light: white → **keep** · Dark: Material dark greys → **keep**  
      Dark mode stays (3.3). MUI's dark elevation surfaces; FUGA has no equivalents and none are needed.

**E · Component tokens**

- [ ] `_components/appBar/defaultFill` — Light: grey/100 #F5F5F5 → **Base/Black** `#000000` · Dark: paper-elevation-4 → **Grey/900** `#1F1F21`  
      The product's app bar is black. Figma is wrong here independently of Material.
- [ ] `_components/input/outlined/enabledBorder` — Light: #000 @23% → **Grey/400** `#BBBBBD` · Dark: #FFF @23% → **Grey/600** `#737374`
- [ ] `_components/input/outlined/hoverBorder` — Light: #000 → **Grey/900** `#1F1F21` · Dark: #FFF → **Grey/50** `#FAFAFC`
- [ ] `_components/input/standard/enabledBorder` — Light: #000 @42% → **Grey/500** `#9B9B9D` · Dark: #FFF @42% → **Grey/500** `#9B9B9D`
- [ ] `_components/input/standard/hoverBorder` — Light: #000 → **Grey/900** `#1F1F21` · Dark: #FFF → **Grey/50** `#FAFAFC`
- [ ] `_components/input/filled/enabledFill` — Light: #000 @6% → **Grey/100** `#F4F4F6` · Dark: #FFF @9% → **Grey/800** `#404041`
- [ ] `_components/input/filled/hoverFill` — Light: #000 @9% → **Grey/200** `#ECECEE` · Dark: #FFF @12% → **Grey/700** `#5F5F60`
- [ ] `_components/chip/defaultEnabledBorder` — Light: grey/400 → **Grey/400** `#BBBBBD` · Dark: grey/700 → **Grey/700** `#5F5F60`
- [ ] `_components/chip/defaultCloseFill` — Light: #000 → **Grey/900** `#1F1F21` · Dark: #FFF → **Grey/50** `#FAFAFC`
- [ ] `_components/chip/defaultHoverFill · defaultFocusFill` — Light: keep alpha → **keep** · Dark: keep alpha → **keep**  
      Interaction states.
- [ ] `_components/avatar/fill` — Light: grey/400 → **Grey/400** `#BBBBBD` · Dark: grey/600 → **Grey/600** `#737374`
- [ ] `_components/switch/knobFillEnabled` — Light: grey/50 → **Grey/50** `#FAFAFC` · Dark: grey/300 → **Grey/300** `#DEDEE0`
- [ ] `_components/switch/knowFillDisabled` — Light: grey/100 → **Grey/100** `#F4F4F6` · Dark: grey/600 → **Grey/600** `#737374`  
      Rename to knobFillDisabled while here.
- [ ] `_components/switch/slideFill` — Light: #000 → **Grey/900** `#1F1F21` · Dark: #FFF @38% → **keep**
- [ ] `_components/breadcrumbs/collapseFill` — Light: grey/100 → **Grey/100** `#F4F4F6` · Dark: grey/600 → **Grey/600** `#737374`
- [ ] `_components/stepper/connector` — Light: grey/400 → **Grey/400** `#BBBBBD` · Dark: grey/600 → **Grey/600** `#737374`
- [ ] `_components/tooltip/fill` — Light: #616161 @90% → **Grey/700 solid** `#5F5F60` · Dark: same → **Grey/700 solid** `#5F5F60`  
      Text sits on it; solid keeps contrast fixed.
- [ ] `_components/snackbar/fill` — Light: #323232 → **Grey/900** `#1F1F21` · Dark: → paper-elevation-6 → **keep alias**
- [ ] `_components/backdrop/fill` — Light: #000 @50% → **keep** · Dark: #000 @50% → **keep**  
      Overlay by nature.
- [ ] `_components/alert/*/background` — Light: error #FDEDED · warning #FFF4E5 · info #E5F6FD · success #EDF7ED → **Red/50 · Orange/50 · Blue/50 · Green/50** `#FFEBEE` · Dark: dark values → **keep, or drop with dark mode**  
      Targets: #FFEBEE · #FFF3E0 · #E5F6FC · #E3F6E9. Matches what code renders today.
- [ ] `_components/alert/*/color` — Light: #5F2120 · #663C00 · #014361 · #1E4620 → **keep** · Dark: keep → **keep**  
      Code uses the same values; they pass contrast on the 50 tints.
- [ ] `_components/rating/activeFill · enabledBorder` — Light: #FFB400 · #000 @23% → **delete** · Dark: — → **delete**  
      Rating is not used in NR. If kept: Yellow/700 #FCC326 and Grey/400.
- [ ] `_native/scrollbar-bg` — Light: grey/200 → **Grey/200** `#ECECEE` · Dark: grey/700 → **Grey/700** `#5F5F60`

**F · Finish**

- [ ] `Check nothing still binds to material/*`  
      Variable panel usage counts. Anything left is a component bound directly to a primitive; rebind it to a palette token first.
- [ ] `Delete the material/colors collection`  
      252 variables gone. DMP/colors stays until the brand conversation with Dean (3.4).
- [ ] `Status chip text: decide 700 or 900`  
      Chip text binds to {role}/dark, now FUGA 700s (Red/700 #D32D32 …). Code uses the 900s (#B7191F …). 700 reads lighter, 900 has more contrast. Feeds Ticket 2.
- [ ] `Publish the library`  
      Every screen using NR MUI v6.1 picks up the new values.

Definition of done: pick any component in the library, inspect any colour, and it resolves through `palette/*` to `fuga/colors/*`. No literal hex anywhere except inside `fuga/colors`.

---

## 5. What to ask engineering for

Each of these is one ticket. Written in the order they should happen. Phrased so Hlib or Vitaliy can pick it up without this document.

### [ ] Ticket 1 — Load the Light weight, fix two heading sizes
*Why it matters to design:* h1/h2 render differently in the app than in Figma and Storybook. h2 and h4 are 4 px and 2 px off.
*Ask:* add weight 300 to the Nunito Sans import in `index.html` (or drop 300 from h1/h2 if we agree they should be Regular); set h2 to 60 px and h4 to 34 px to match the Figma text styles.
*Done when:* Storybook and the app render every heading identically.

### [ ] Ticket 2 — One status chip
*Why it matters to design:* the same status is defined five separate times in code with different colours, plus a sixth "solid" variant in the theme. Every screen renders a slightly different chip.
*Ask:* one `<StatusChip status="…">` component driven by a single status → colour-role map matching §3.2; retire the four overlapping maps and the `statusSummary` theme entry; add Purple; delete the unused Yellow.
*Done when:* one component, one map, and its Storybook story shows every status in §3.2.

### [ ] Ticket 3 — A token file the theme is generated from *(done on design-system, 14 Sep: `src/styling/tokens/muiTheme.ts` builds palette, typography, shape, spacing and breakpoints from the token file and `FugaMainStyles` uses it; primary #404041, warning #FF8800, solid text greys, h2 60 / h4 34. Secondary stays white pending the QUESTION of 14 Sep. Not pushed.)*
*Why it matters to design:* today there is no place where "primary colour" is written down in code; it is typed into the theme. A token file is the thing Figma exports to and the theme imports from, so the two cannot drift silently.
*Ask:* a `tokens.json` (W3C Design Tokens format) holding primitives → semantic roles → component tokens, with the values from §3.1; generate the MUI palette and typography from it. Add the semantic roles code has never had: text, divider, background, status.
*Done when:* changing one value in `tokens.json` changes it everywhere in Storybook.

### [ ] Ticket 4 — Stop new hardcoded colours
*Why it matters to design:* in 85 files a developer typed a colour by hand instead of using the palette. Each is a place a Figma change will never reach. There are about 300 today; without a guard the number grows while we fix it.
*Ask:* a lint rule forbidding hex and `rgba(` outside the token and theme files, with an allowlist of the current 300 that shrinks as they are migrated.
*Done when:* the build fails on a new hardcoded colour.

### [ ] Ticket 5 — Remove the legacy styling library
*Why it matters to design:* indirectly. 45 files use a styling approach MUI removed in its next major version. It blocks the upgrade, and the upgrade is what brings better theming. Worth doing while those files are open for Ticket 4.

---

## 6. Storybook as *your* tool

Today Storybook is engineering's test harness that happens to be viewable. It can be your living spec. What that takes:

- [x] **A "Figma MUI design library" section.** One page per Figma component set: the MUI component in the matrix the Figma set defines, a Design tab embedding the live Figma set (`@storybook/addon-designs`), and Design Tokens panel + doc tables of the variables the set binds (`storybook-design-token`). All 32 pages on `design-system` (pilot 11 Sep, the other 29 on 14 Sep). Each page ends with a note on where the code cannot show what Figma draws.

**What the 32 library pages turned up (14 Sep).** A second layer of drift below the six colours, all theme overrides written for one screen that leak everywhere: every SvgIcon is pinned to 18 px #666666 (icon button, checkbox, radio, toggle, tab and app-bar icons ignore size and colour); tooltips are 16 px where Figma has 10; the outlined warning alert border is Material #FF9800, not FUGA #FF8800; text buttons are white, so Figma's dialog and card actions vanish on white; secondary is white in code and grey in the tokens (header notification dot, one ValidationSummary icon); every FormControl is at least 63 px tall; GlobalStyleOverrides gives every table borders and zebra rows; MUI has no static focus style for selection controls, tabs or list items, so Figma's focus halos have no code equivalent. On the Figma side, six sets still bound the deleted `material/colors` grey/300 and grey/400; fixed in Button Group and the shared scrollbar component, 31 Text Field frames remain.
- [ ] **Foundations pages you author.** Colour roles with usage rules, type scale with do/don't, spacing, elevation, and the status vocabulary from §3.2. Storybook supports prose pages (MDX). There are none today. This is designer-owned content.
- [ ] **A token page that cannot lie.** Today's "Design System / Tokens" page renders the 12 raw paint ramps and hardcodes its own swatch colours. It should render from `tokens.json` (Ticket 3), organised by role, so it is always true.
- [ ] **Stories as designed states.** Each story is one state you designed: default, hover, error, loading, empty. Today the 474 stories prove components mount. None test an interaction. Every dialog and dropdown should have at least one story that clicks through the flow — this is where "does the design work" gets checked automatically.
- [ ] **Accessibility as a gate, not a panel.** The accessibility checker is installed and set to "show but never fail". Once the current violations are listed, flip it to fail the build. Contrast problems then get caught the day they are introduced.
- [ ] **Chromatic as design review.** Already live on the `design-system` branch. Every push produces a visual diff of all 474 stories against the baseline. You approve or reject changes in a browser. This is the mechanism that makes the colour migration safe: when the six mains change, you see every affected component at once.

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

## 8. Things to delete

Small, satisfying, do them early.

- [x] Figma: the `material/colors` collection.
- [x] Figma: the `naxos-blue` ramp (dead in code too).
- [ ] Figma: `DMP/colors`, once the executives settle the brand and it is not the answer.
- [ ] Code: colour ramps nothing uses (`YELLOW`, `FUGA_GREEN`, `TURQUOISE`, `NAXOS_BLUE`; `PURPLE` survives for Relinquished).
- [ ] Code: `yellowChip`, mapped to nothing.
- [ ] Code: the three "Comparison" stories that exist to compare eleven near-identical dropdown buttons.

---

## Decision log

Newest first.

| Date | Type | Entry | Where |
| --- | --- | --- | --- |
| 2026-09-14 | CHANGE | Design Tokens panel narrowed per page: the token build emits one `Component · <name>` category per library page into `tokens.css` with only the variables that set binds (addon can hide categories, not tokens); each page's panel shows just that tab. | 6 |
| 2026-09-14 | DONE | Figma MUI design library complete: 29 remaining pages added, 32 of 32. All sets read via the Plugin API (variant axes, bound variables with counts, styles); multi-set pages merge related sets. Matrix harness forces states on whole components and ignores the app's global table styles. Local commit `0be4fbfd` on `design-system`, not pushed. | 6 |
| 2026-09-14 | DONE | Ticket 3 second half: MUI theme built from the token file (`muiTheme.ts` → `FugaMainStyles`). Storybook shows primary #404041, warning #FF8800, solid text greys, h2 60 / h4 34. Secondary excepted. | 5 · Ticket 3 |
| 2026-09-14 | QUESTION | Secondary: decision 3.1 copies primary, but the app uses secondary as white in `HeaderIconsPanel` (notification dot on the black bar) and `ValidationSummary`. Theme keeps white until Casper says keep the exception or move the two usages. | 3.1 · Ticket 3 |
| 2026-09-14 | DONE | Figma step 3: `purple/*` role (500 / 700 / 300, contrastText, five `_states`); six `_components/status/{role}/background` tokens (50-tints, neutral grey/200) bound on all 30 Status variants; Purple variants re-pointed. Dark values provisional 900s. | 4 · step 3 |
| 2026-09-14 | CHANGE | Figma: deleted `material/colors` grey/300 and grey/400 still bound in six sets; re-pointed in Button Group and the shared `_Native Browser Scroll` component (fixes Table, Menu, Tabs, multiline Text Field). 31 `<TextField>` frames remain (write blocked by the tool's permission check). f01 stays open. | 4.1 · f01 |
| 2026-09-14 | CHANGE | Section 6: findings from the 32 library pages added. | 6 |
| 2026-09-14 | CHANGE | Rolled back the Figma-PNG-vs-code comparison on the pilot pages. Installed `@storybook/addon-designs` and `storybook-design-token`; pages rebuilt on them (matrix story, Design tab, per-category token tables from the annotated `tokens.css`). | 6 |
| 2026-09-11 | CHANGE | New Storybook group "Figma MUI design library", pilot Button / Chip / Status: Figma export beside MUI matrix with forced hover/focus/pressed, token table per page (Figma binding → token light/dark → code path → match). First findings: Button sizes fixed 14 px vs Figma 15/14/13; Chip label 13 vs body2 14; Status text 700s vs 900s, borders alpha vs solid. | 6 |
| 2026-09-11 | DONE | Design tokens file from Figma variables (Ticket 3 first half): figma-export.json → DTCG → Style Dictionary → tokens.css + tokens.ts, 398 tokens per mode. | 5 · Ticket 3 |
| 2026-09-11 | QUESTION | Figma <Button> Secondary Outlined/Text still render purple #9C27B0 @50% on strokes bound to `secondary/_states/outlinedBorder`, though it composes from grey/800 now. Stale compose evaluation? Re-save the variable or republish the library. | Figma |
| 2026-09-11 | DECISION | 3.4 brand direction is an executive matter; Casper, Dean and Román monitor it. Tokens proceed on FUGA; `DMP/colors` stays until the call. (From page comment.) | 3.4 |
| 2026-09-11 | DECISION | 3.3 dark mode kept for the future: Figma stays two-mode, tokens.json to carry a dark set, shipping is a later Brief. (From page comment.) | 3.3 |
| 2026-09-11 | CHANGE | 3.1 text paragraph rewritten as the decision and the solid-versus-alpha rule added as a table. (From page comment.) | 3.1 |
| 2026-09-11 | DECISION | 3.1 adopted as recommended and applied in Figma: FUGA mains, solid text greys, secondary copies primary. (From page comment.) | 3.1 |
| 2026-09-11 | CHANGE | Checklists extended beyond 4.1: decisions (3), Figma steps (4), tickets (5), Storybook practices (6), deletions (8). Known-done items pre-ticked. | How this page is used |
| 2026-09-11 | DONE | Figma remap reviewed against the file: 55 of 58 rows done and verified; three earlier slips fixed. Also: ramps renamed lowercase, `naxos-blue` removed, `state-opacity` scoped `COLOR_OPACITY`, all six `action/*` composed from `base/Black` with a `state-opacity` set of eight (hover 4/8, selected 8/16, focus 12, focusVisible 30, outlinedBorder 50, disabled 38, disabledBackground 12, active 56), `material/colors` deleted with no dangling aliases. Open: Status chip backgrounds and Purple role, `breakpoints/xs`, typography comma names, 61 `ALL_SCOPES` tokens, publish, f03. | 4.1 · 4 |
| 2026-09-11 | CHANGE | Group C of 4.1 and step 2 of section 4 corrected: Figma's 3 Sep 2026 release "Control opacity at scale" allows alias + opacity on colour variables, bindable to a number variable. State tokens become aliases instead of typed literals. Raised as a QUESTION comment; verified against the release note. | 4.1 · C |
| 2026-09-11 | CHANGE | Added 4.1, the variable remap checklist: 57 rows mapping every `palette` token off `material/colors` onto `fuga/colors`, with shared ticks on the published page. Requested in chat. | 4.1 |
| 2026-09-10 | DONE | Storybook reorganised into the eight groups of 3.5 (119 files retitled, sort order set, glob widened) and a *Foundations / Theme* cheatsheet added mirroring the Figma Theme page. On `design-system`, committed locally, not pushed. | 3.5 |
| 2026-09-10 | DECISION | Reorganise Storybook as proposed in 3.5, and add a Theme page giving an overview of the main implemented atomic components, like the "Theme" page in Figma NR MUI v6.1. (From page comment.) | 3.5 |
| 2026-09-10 | PROCESS | Ways of working agreed: prefixed comments, batch review on "review comments", Casper sends threads to Claude for in-thread replies and resolution, page carries the log. | How this page is used |

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
