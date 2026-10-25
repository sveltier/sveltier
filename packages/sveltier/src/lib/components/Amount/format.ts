/** A run of a formatted figure: `dim` for the decimal separator and the fraction digits. */
export interface FigureSegment {
	text: string;
	dim: boolean;
}

const hasDigits = (options: Intl.NumberFormatOptions): boolean =>
	options.minimumFractionDigits !== undefined ||
	options.maximumFractionDigits !== undefined ||
	options.minimumSignificantDigits !== undefined ||
	options.maximumSignificantDigits !== undefined;

/**
 * The Intl options for a figure: `decimals` fixes the fraction digits; money without a
 * currency takes the locale's. Without fraction digits, defaults that keep the data: up to 8
 * decimals for a number (Intl keeps 3, so 0.00012345 would print "0") and 2 for a percentage
 * (Intl keeps none). Money keeps its currency's digits and compact notation its own.
 */
export function figureOptions(
	format: Intl.NumberFormatOptions = {},
	decimals: number | undefined,
	currency: string
): Intl.NumberFormatOptions {
	const options = { ...format };
	if (options.style === 'currency' && !options.currency) options.currency = currency;
	if (decimals !== undefined) {
		options.minimumFractionDigits = decimals;
		options.maximumFractionDigits = decimals;
	} else if (!hasDigits(options) && options.notation !== 'compact') {
		if (!options.style || options.style === 'decimal') options.maximumFractionDigits = 8;
		else if (options.style === 'percent') options.maximumFractionDigits = 2;
	}
	return options;
}

/**
 * Formats a figure into runs, the decimal separator and the fraction digits apart, with a true
 * minus (U+2212), which is as wide as the plus in tabular figures.
 */
export function figureSegments(
	formatter: Intl.NumberFormat,
	value: number | bigint
): FigureSegment[] {
	const segments: FigureSegment[] = [];
	for (const part of formatter.formatToParts(value)) {
		const text = part.type === 'minusSign' ? part.value.replace('-', '−') : part.value;
		const dim = part.type === 'decimal' || part.type === 'fraction';
		const last = segments.at(-1);
		if (last?.dim === dim) last.text += text;
		else segments.push({ text, dim });
	}
	return segments;
}
