import type { SVGAttributes } from 'svelte/elements';
import type { ElementProps } from '../../core/props/element.js';
import type { Color } from '../../core/props/types.js';

/** The patterns a Guilloche draws. */
export const GUILLOCHE_PATTERNS = ['rosette', 'waves'] as const;

/** `rosette`: a curve turned about the centre; `waves`: sine bands that cross. */
export type GuillochePattern = (typeof GUILLOCHE_PATTERNS)[number];

/** The Guilloche props that `DefaultsProvider` and `UIProvider` can set for a subtree. */
export interface GuillocheDefaults {
	/**
	 * The colour of the lines, drawn faint (`--sv-guilloche-opacity`, 0.236 by default).
	 * @default 'primary'
	 */
	color: Color;
}

declare module '../../core/defaults/context.js' {
	interface ComponentDefaults {
		Guilloche: GuillocheDefaults;
	}
}

/**
 * The fine interlaced lines of a banknote or a cheque, as decoration: an SVG hidden from
 * assistive technology that fills its box. Place it yourself, usually absolute behind content,
 * and size it with `class` or `style`.
 *
 * @example
 * <script>
 * 	import { Card, Guilloche } from '@sveltier/ui';
 * </script>
 *
 * <Card title="Premium account" style="position: relative; overflow: hidden">
 * 	<Guilloche style="position: absolute; inset: 0; z-index: -1" />
 * </Card>
 */
export type GuillocheProps = ElementProps<
	SVGSVGElement,
	SVGAttributes<SVGSVGElement>,
	Partial<GuillocheDefaults> & {
		/**
		 * The pattern.
		 * @default 'rosette'
		 */
		pattern?: GuillochePattern;
		/**
		 * How many lines: the turns of the rosette, or the bands of the waves.
		 * @default 8
		 */
		lines?: number;
	}
>;
