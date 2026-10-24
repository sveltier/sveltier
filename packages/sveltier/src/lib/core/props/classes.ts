import { checkValue, DEV } from '#dev';
import '../../styles/props.css';
import { INTENT_COLORS } from '../theme/types.js';
import { DENSITIES, ROUNDED, SIZES, VARIANTS, type SharedProps, type Variant } from './types.js';

/** The shared props that map to classes. */
export type SharedClassProps = Pick<
	SharedProps,
	'variant' | 'density' | 'size' | 'color' | 'rounded'
>;

/**
 * Classes for a component's shared props, for example
 * `sv-variant-flat sv-density-default sv-size-md sv-color-primary sv-rounded`.
 *
 * The classes set custom properties (`--sv-color`, `--sv-variant-bg`, `--sv-size-height`,
 * `--sv-density`, `--sv-rounded`, …) that the component reads. Custom properties inherit,
 * so pass a value for every shared prop the component has, defaults included (the values
 * `useDefaults()` resolves); an omitted one would follow the parent component.
 *
 * In development, a value outside its list warns with the valid ones, naming `component`.
 * A component that takes only some variants passes them as `variants`.
 *
 * @example
 * // In a component: resolve the defaults, then name the component for the warnings.
 * const p = $derived(resolve({ variant, size, color }));
 * const classes = $derived(['my-pill', sharedClasses(p, 'MyPill')]);
 */
export function sharedClasses(
	{ variant, density, size, color, rounded }: SharedClassProps,
	component = 'component',
	variants: readonly Variant[] = VARIANTS
): string {
	if (DEV) {
		// An intent given as the variant usually meant the colour.
		const intent = (INTENT_COLORS as readonly unknown[]).includes(variant);
		checkValue(
			component,
			'variant',
			variant,
			variants,
			intent ? `To colour it, use color="${variant}".` : undefined
		);
		checkValue(component, 'size', size, SIZES);
		checkValue(component, 'density', density, DENSITIES);
		checkValue(component, 'rounded', rounded, ROUNDED);
	}
	let classes = '';
	if (variant) classes += ` sv-variant-${variant}`;
	if (density) classes += ` sv-density-${density}`;
	if (size) classes += ` sv-size-${size}`;
	if (color) classes += ` sv-color-${color}`;
	if (rounded !== undefined) {
		classes += rounded === true ? ' sv-rounded' : ` sv-rounded-${rounded || 'none'}`;
	}
	return classes.slice(1);
}
