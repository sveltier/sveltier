import '../../styles/props.css';
import type { SharedProps } from './types.js';

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
 */
export function sharedClasses({
	variant,
	density,
	size,
	color,
	rounded
}: SharedClassProps): string {
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
