import { describe, expect, it } from 'vitest';
import { contrast, parseOklch, toLinearSrgb, type Oklch } from '../core/theme/color.js';
import { INTENT_COLORS, type ThemeDefinition } from '../core/theme/types.js';
import { aurora } from './aurora.js';
import { heritage } from './heritage.js';
import { maison } from './maison.js';
import { milano } from './milano.js';
import { monolith } from './monolith.js';

// WCAG 2.2: text 4.5:1 (1.4.3), UI component boundaries and focus indicators 3:1 (1.4.11).
const TEXT = 4.5;
const UI = 3;
// Tonal fills (selected chips, badges, alerts) are the intent colour as a wash over a surface
// (--sv-tonal-wash is 12%; 14% is tested for headroom), with text mixed toward the theme's
// text colour (--sv-tonal-text-mix).
const WASH = 0.14;
const TONAL_TEXT_MIX = 0.8;
// A Table's current row is the primary colour washed over the table's surface by
// --sv-state-hover (8%), under cells in any text colour: up and down figures, muted notes.
const ROW_WASH = 0.08;

// Every built-in theme, light and dark.
const combos: Array<[string, ThemeDefinition]> = Object.entries({
	...monolith,
	...heritage,
	...aurora,
	...maison,
	...milano
});

const SURFACES = ['background', 'surface', 'surface-raised'] as const;
const TEXTS = ['text', 'text-muted', 'text-subtle', ...INTENT_COLORS] as const;

const color = (theme: ThemeDefinition, name: string): Oklch => {
	const value = theme.colors[name];
	const parsed = value === undefined ? undefined : parseOklch(value);
	if (!parsed) throw new Error(`Missing or unreadable colour "${name}"`);
	return parsed;
};

// Browsers composite in gamma-encoded sRGB, so the wash is blended there.
const encode = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const decode = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminanceOf = ([r, g, b]: number[]) => 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** color-mix(in oklch, a p, b): linear in L and C, shorter arc in hue. */
function mixOklch(a: Oklch, b: Oklch, p: number): Oklch {
	let delta = b.h - a.h;
	if (delta > 180) delta -= 360;
	if (delta < -180) delta += 360;
	return {
		l: a.l * p + b.l * (1 - p),
		c: a.c * p + b.c * (1 - p),
		h: (a.h + delta * (1 - p) + 360) % 360,
		alpha: 1
	};
}

/** Contrast of `text` on `tint` washed over `surface` by `amount`, blended as browsers do. */
function washContrast(text: Oklch, tint: Oklch, surface: Oklch, amount: number): number {
	const top = toLinearSrgb(tint).map(encode);
	const under = toLinearSrgb(surface).map(encode);
	const wash = under.map((channel, i) => decode(channel * (1 - amount) + top[i]! * amount));
	return ratio(luminanceOf(toLinearSrgb(text)), luminanceOf(wash));
}

function tonalContrast(intent: Oklch, text: Oklch, surface: Oklch): number {
	return washContrast(mixOklch(intent, text, TONAL_TEXT_MIX), intent, surface, WASH);
}

describe.each(combos)('%s', (_name, theme) => {
	it.each(TEXTS.flatMap((text) => SURFACES.map((surface) => [text, surface] as const)))(
		'%s text on %s ≥ 4.5:1',
		(text, surface) => {
			expect(contrast(color(theme, text), color(theme, surface))).toBeGreaterThanOrEqual(TEXT);
		}
	);

	it.each(INTENT_COLORS)('on-%s on a %s fill ≥ 4.5:1', (intent) => {
		expect(contrast(color(theme, `on-${intent}`), color(theme, intent))).toBeGreaterThanOrEqual(
			TEXT
		);
	});

	it.each(INTENT_COLORS.flatMap((intent) => SURFACES.map((surface) => [intent, surface] as const)))(
		'tonal %s text on its wash over %s ≥ 4.5:1',
		(intent, surface) => {
			expect(
				tonalContrast(color(theme, intent), color(theme, 'text'), color(theme, surface))
			).toBeGreaterThanOrEqual(TEXT);
		}
	);

	it.each(TEXTS)('%s text on the current row of a table ≥ 4.5:1', (text) => {
		expect(
			washContrast(color(theme, text), color(theme, 'primary'), color(theme, 'surface'), ROW_WASH)
		).toBeGreaterThanOrEqual(TEXT);
	});

	it.each(SURFACES)('control borders (border-strong) on %s ≥ 3:1', (surface) => {
		expect(contrast(color(theme, 'border-strong'), color(theme, surface))).toBeGreaterThanOrEqual(
			UI
		);
	});

	it.each(SURFACES)('focus ring (primary) on %s ≥ 3:1', (surface) => {
		expect(contrast(color(theme, 'primary'), color(theme, surface))).toBeGreaterThanOrEqual(UI);
	});
});
