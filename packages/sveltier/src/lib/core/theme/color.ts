// Minimal oklch maths: enough to pick readable "on" colours and to check WCAG contrast.
// Conversion from Björn Ottosson's OKLab reference (https://bottosson.github.io/posts/oklab/).

export interface Oklch {
	/** Lightness, 0–1. */
	l: number;
	/** Chroma, 0–0.4 in practice. */
	c: number;
	/** Hue in degrees. */
	h: number;
	/** Alpha, 0–1. */
	alpha: number;
}

const OKLCH =
	/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)(%?)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/i;

/** Parses `oklch(L C H)` or `oklch(L C H / A)` with numbers or percentages. */
export function parseOklch(value: string): Oklch | undefined {
	const match = OKLCH.exec(value.trim());
	if (!match) return undefined;
	const [, l = '0', lPct, c = '0', cPct, h = '0', a, aPct] = match;
	return {
		l: lPct ? +l / 100 : +l,
		c: cPct ? (+c / 100) * 0.4 : +c,
		h: +h,
		alpha: a === undefined ? 1 : aPct ? +a / 100 : +a
	};
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Linear-light sRGB channels, clamped to the sRGB gamut. */
export function toLinearSrgb({ l, c, h }: Oklch): [number, number, number] {
	const rad = (h * Math.PI) / 180;
	const a = c * Math.cos(rad);
	const b = c * Math.sin(rad);
	const l3 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m3 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s3 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		clamp01(4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3),
		clamp01(-1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3),
		clamp01(-0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3)
	];
}

/** WCAG relative luminance of an opaque colour. */
export function luminance(color: Oklch): number {
	const [r, g, b] = toLinearSrgb(color);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two opaque oklch colours (1–21). */
export function contrast(a: Oklch, b: Oklch): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
	return (hi + 0.05) / (lo + 0.05);
}

const format = ({ l, c, h }: Pick<Oklch, 'l' | 'c' | 'h'>) => `oklch(${l} ${c} ${h})`;

/**
 * Picks a readable text colour for a filled background: a deep ink or a near-white, both
 * tinted with the background's hue, whichever contrasts more.
 */
export function onColor(background: string): string | undefined {
	const bg = parseOklch(background);
	if (!bg) return undefined;
	const dark = { l: 0.2, c: 0.02, h: bg.h, alpha: 1 };
	const light = { l: 0.985, c: 0.005, h: bg.h, alpha: 1 };
	return format(contrast(bg, dark) >= contrast(bg, light) ? dark : light);
}
