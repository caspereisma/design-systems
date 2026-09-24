/**
 * Button — token slot map.
 *
 * This is the one hand-authored file per component in the token-spec pipeline.
 * Everything the spec block renders is either in here, in the generated token
 * files, or in the anatomy SVGs. Nothing in the docs page is typed by hand.
 *
 * Read TOKEN-SPEC-BRIEF.md first — it explains what consumes this and why the
 * shape is what it is.
 *
 * Scope: primary colour only. NR does not use secondary, error, warning, info
 * or success on Button, so those variants are deliberately absent rather than
 * missing. Light mode only.
 *
 * Source of the values: the NR MUI v6.1 Figma library and
 * src/styling/tokens/generated/tokens.css, reconciled September 2026.
 */

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type Variant = 'contained' | 'outlined' | 'text';
export type State = 'enabled' | 'hover' | 'focusVisible' | 'active' | 'disabled';
export type Size = 'small' | 'medium' | 'large';
export type IconPlacement = 'start' | 'end';

/** The named parts of the component. These are the anatomy labels, and they are
 *  the row names in the spec cards. One vocabulary, used in both places. */
export type Part =
    | 'containerFill'
    | 'label'
    | 'border'
    | 'cornerRadius'
    | 'padding'
    | 'elevation'
    | 'focusRing'
    | 'startIcon'
    | 'endIcon';

/**
 * What a slot resolves to.
 *
 *  token    — a CSS custom property in tokens.css. The only kind that appears
 *             in the Tokens used trace.
 *  literal  — a real value with no token behind it. Today this is only
 *             `transparent` and the 1px/3px line widths.
 *  none     — the part is absent in this combination. Renders as "none".
 *  inherit  — identical to the same slot in another state. Renders as
 *             "inherits <state>" and is NOT repeated in the trace.
 */
export type SlotValue =
    | { kind: 'token'; token: string; note?: string }
    | { kind: 'literal'; value: string; note?: string }
    | { kind: 'none' }
    | { kind: 'inherit'; from: State };

/** Marks a value that is documented but not agreed. The spec block renders
 *  these with a "to fix" badge and an orange border; see DEFERRED below. */
export interface Deferred {
    reason: string;
    /** Set when the deferred decision is wider than this component. */
    scope?: 'component' | 'system';
}

export interface StateSpec {
    fill: SlotValue;
    label: SlotValue;
    border: SlotValue;
    elevation: SlotValue;
    focusRing: SlotValue;
    deferred?: Deferred;
}

export interface SizeSpec {
    fontSize: SlotValue;
    /** MUI sets line height per size; there is no token for it. */
    lineHeight: SlotValue;
    paddingBlock: SlotValue;
    /** contained and outlined */
    paddingInline: SlotValue;
    /** text variant sits one step tighter */
    paddingInlineText: SlotValue;
    iconSize: SlotValue;
}

export interface IconSpec {
    fill: SlotValue;
    size: SlotValue;
    gap: SlotValue;
}

export interface ComponentSpec {
    component: string;
    /** Storybook story id prefix, for cross-linking from the spec block. */
    storyTitle: string;
    scope: string;
    parts: Part[];
    anatomy: AnatomyFrame[];
    shared: Record<string, SlotValue>;
    states: Record<Variant, Record<State, StateSpec>>;
    sizes: Record<Size, SizeSpec>;
    icons: Record<IconPlacement, IconSpec>;
    pending: string[];
}

export interface AnatomyFrame {
    id: string;
    caption: string;
    /** Path relative to the anatomy directory the brief names. */
    file: string;
    /** Parts this frame labels. Any part not labelled by some frame is a gap. */
    labels: Part[];
}

/* ------------------------------------------------------------------ *
 * Shorthand
 * ------------------------------------------------------------------ */

const t = (token: string, note?: string): SlotValue => ({ kind: 'token', token, note });
const lit = (value: string, note?: string): SlotValue => ({ kind: 'literal', value, note });
const none = (): SlotValue => ({ kind: 'none' });
const from = (state: State): SlotValue => ({ kind: 'inherit', from: state });

/**
 * Focus-visible is specified but NOT decided. The ring token exists and nothing
 * binds it, the anatomy has no frame that labels the part, and the treatment
 * below (3px, 0.3 alpha) is a proposal rather than an NR decision. It also has
 * to be decided identically for all 32 components or it stops working as an
 * accessibility affordance — so it is a system decision, not a Button ticket.
 */
const DEFERRED: Deferred = {
    reason: 'Focus-visible treatment is proposed, not decided. The ring token exists but nothing binds it, and no anatomy frame names the part.',
    scope: 'system',
};

/* ------------------------------------------------------------------ *
 * The spec
 * ------------------------------------------------------------------ */

export const buttonSpec: ComponentSpec = {
    component: 'Button',
    storyTitle: 'Figma MUI design library/Button',
    scope: 'Primary colour only, light mode only. Three variants, five interaction states, three sizes, two icon placements.',

    parts: [
        'containerFill',
        'label',
        'cornerRadius',
        'padding',
        'border',
        'elevation',
        'focusRing',
        'startIcon',
        'endIcon',
    ],

    anatomy: [
        {
            id: 'default',
            caption: 'Default · large / primary / contained / enabled',
            file: 'button-default.svg',
            labels: ['containerFill', 'label', 'cornerRadius', 'padding'],
        },
        {
            id: 'start-icon',
            caption: 'Start icon · large / primary / contained / enabled',
            file: 'button-start-icon.svg',
            labels: ['containerFill', 'label', 'cornerRadius', 'padding', 'startIcon'],
        },
        {
            id: 'end-icon',
            caption: 'End icon · large / primary / contained / enabled',
            file: 'button-end-icon.svg',
            labels: ['containerFill', 'label', 'cornerRadius', 'padding', 'endIcon'],
        },
    ],

    /** True for every variant, size and state. */
    shared: {
        cornerRadius: t('--nr-shape-border-radius'),
        fontFamily: t('--nr-typography-font-family-base'),
        fontWeight: t('--nr-typography-font-weight-bold'),
    },

    states: {
        /* -------------------------------------------------- contained */
        contained: {
            enabled: {
                fill: t('--nr-palette-primary-main'),
                label: t('--nr-palette-primary-contrast-text'),
                border: none(),
                elevation: t('--nr-elevation-2'),
                focusRing: none(),
            },
            hover: {
                fill: t('--nr-palette-primary-dark'),
                label: from('enabled'),
                border: none(),
                elevation: t('--nr-elevation-4'),
                focusRing: none(),
            },
            focusVisible: {
                fill: from('enabled'),
                label: from('enabled'),
                border: none(),
                elevation: t('--nr-elevation-6'),
                focusRing: t('--nr-palette-primary-states-focus-visible', '3px ring, offset 0'),
                deferred: DEFERRED,
            },
            active: {
                fill: t('--nr-palette-primary-dark'),
                label: from('enabled'),
                border: none(),
                elevation: t('--nr-elevation-8'),
                focusRing: none(),
            },
            disabled: {
                fill: t('--nr-palette-action-disabled-background'),
                label: t('--nr-palette-action-disabled'),
                border: none(),
                elevation: none(),
                focusRing: none(),
            },
        },

        /* --------------------------------------------------- outlined */
        outlined: {
            enabled: {
                fill: lit('transparent'),
                label: t('--nr-palette-primary-main'),
                border: t('--nr-palette-primary-states-outlined-border', '1px, drawn inset'),
                elevation: none(),
                focusRing: none(),
            },
            hover: {
                fill: t('--nr-palette-primary-states-hover'),
                label: from('enabled'),
                border: t('--nr-palette-primary-main', '1px, drawn inset'),
                elevation: none(),
                focusRing: none(),
            },
            focusVisible: {
                fill: from('enabled'),
                label: from('enabled'),
                border: from('enabled'),
                elevation: none(),
                focusRing: t('--nr-palette-primary-states-focus-visible', '3px ring, offset 0'),
                deferred: DEFERRED,
            },
            active: {
                fill: from('hover'),
                label: from('enabled'),
                border: t('--nr-palette-primary-main', '1px, drawn inset'),
                elevation: none(),
                focusRing: none(),
            },
            disabled: {
                fill: lit('transparent'),
                label: t('--nr-palette-action-disabled'),
                border: t('--nr-palette-action-disabled-background', '1px, drawn inset'),
                elevation: none(),
                focusRing: none(),
            },
        },

        /* ------------------------------------------------------- text */
        text: {
            enabled: {
                fill: lit('transparent'),
                label: t('--nr-palette-primary-main'),
                border: none(),
                elevation: none(),
                focusRing: none(),
            },
            hover: {
                fill: t('--nr-palette-primary-states-hover'),
                label: from('enabled'),
                border: none(),
                elevation: none(),
                focusRing: none(),
            },
            focusVisible: {
                fill: from('enabled'),
                label: from('enabled'),
                border: none(),
                elevation: none(),
                focusRing: t('--nr-palette-primary-states-focus-visible', '3px ring, offset 0'),
                deferred: DEFERRED,
            },
            active: {
                fill: from('hover'),
                label: from('enabled'),
                border: none(),
                elevation: none(),
                focusRing: none(),
            },
            disabled: {
                fill: lit('transparent'),
                label: t('--nr-palette-action-disabled'),
                border: none(),
                elevation: none(),
                focusRing: none(),
            },
        },
    },

    /**
     * Sizes vary by measurement, not colour, so they render as one table rather
     * than nine more cards.
     *
     * Every padding value is a token as of the September 2026 scale extension
     * (spacing/0-5, 0-75 and 1-5 were added for exactly this). Four values moved
     * to reach the 8px scale: contained and outlined small 10px → 12px and large
     * 22px → 24px horizontally; text small 5px → 4px and large 11px → 12px.
     *
     * Outlined uses the same padding tokens as contained because its 1px border
     * is drawn inset (box-shadow) rather than added, so the two variants measure
     * the same height. MUI's stock behaviour subtracts 1px from outlined padding
     * instead, which is why it could not share a token before.
     */
    sizes: {
        small: {
            fontSize: t('--nr-typography-font-size-13'),
            lineHeight: lit('22px', 'no token — MUI sets line height per size'),
            paddingBlock: t('--nr-spacing-0-5'),
            paddingInline: t('--nr-spacing-1-5'),
            paddingInlineText: t('--nr-spacing-0-5'),
            iconSize: lit('18px'),
        },
        medium: {
            fontSize: t('--nr-typography-font-size-14'),
            lineHeight: lit('24px', 'no token — MUI sets line height per size'),
            paddingBlock: t('--nr-spacing-0-75'),
            paddingInline: t('--nr-spacing-2'),
            paddingInlineText: t('--nr-spacing-1'),
            iconSize: lit('20px'),
        },
        large: {
            fontSize: t('--nr-typography-font-size-15'),
            lineHeight: lit('26px', 'no token — MUI sets line height per size'),
            paddingBlock: t('--nr-spacing-1'),
            paddingInline: t('--nr-spacing-3'),
            paddingInlineText: t('--nr-spacing-1-5'),
            iconSize: lit('22px'),
        },
    },

    /** Identical across all three variants; the icon takes the label colour. */
    icons: {
        start: {
            fill: lit('inherits label'),
            size: lit('matches the size ramp — 18 / 20 / 22px'),
            gap: t('--nr-spacing-1'),
        },
        end: {
            fill: lit('inherits label'),
            size: lit('matches the size ramp — 18 / 20 / 22px'),
            gap: t('--nr-spacing-1'),
        },
    },

    /**
     * True statements the spec block should surface, because the page otherwise
     * reads as though they are already so.
     */
    pending: [
        'Padding rows describe the tokenised target. Nothing is bound to spacing/0-5, 0-75 or 1-5 yet, in Figma or in the theme, so the app still renders the pre-token values (large contained is 8px 22px today, not 8px 24px).',
        'The inset outlined border is a theme styleOverrides change that has not been made. MUI still adds the border, so outlined is currently 2px taller than contained.',
        'Outlined and text show "inherits hover" for active because MUI gives them no distinct pressed treatment. That is a gap in the component, not in the spec. --nr-palette-state-opacity-active (0.56) exists and Button does not use it.',
    ],
};

/* ------------------------------------------------------------------ *
 * Trace naming
 * ------------------------------------------------------------------ */

/**
 * The Name column of the Tokens used table is derived, not authored.
 *
 *   button/contained/fill                slot in one variant, enabled state
 *   button/contained/fill:hover          … in a non-enabled state
 *   button/*&#47;label:disabled          identical across all three variants
 *   button/large/padding                 size rows
 *
 * `inherit` values never produce a row — the row they point at already exists.
 */
export const traceName = (
    slot: string,
    opts: { variant?: Variant | '*'; size?: Size; state?: State } = {},
): string => {
    const scope = opts.size ?? opts.variant ?? '*';
    const state = opts.state && opts.state !== 'enabled' ? `:${kebab(opts.state)}` : '';
    return `button/${scope}/${slot}${state}`;
};

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export default buttonSpec;
