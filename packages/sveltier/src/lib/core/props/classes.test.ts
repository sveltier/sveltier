import { describe, expect, it } from 'vitest';
import { sharedClasses } from './classes.js';

describe('sharedClasses', () => {
	it('maps every shared prop to one class, in a fixed order', () => {
		expect(
			sharedClasses({
				rounded: 'lg',
				color: 'success',
				size: 'sm',
				density: 'compact',
				variant: 'tonal'
			})
		).toBe('sv-variant-tonal sv-density-compact sv-size-sm sv-color-success sv-rounded-lg');
	});

	it('emits classes only for the props passed', () => {
		expect(sharedClasses({})).toBe('');
		expect(sharedClasses({ size: 'md' })).toBe('sv-size-md');
	});

	it('maps rounded: true to the component default, false and none to square corners', () => {
		expect(sharedClasses({ rounded: true })).toBe('sv-rounded');
		expect(sharedClasses({ rounded: false })).toBe('sv-rounded-none');
		expect(sharedClasses({ rounded: 'none' })).toBe('sv-rounded-none');
		expect(sharedClasses({ rounded: 'full' })).toBe('sv-rounded-full');
	});

	it('accepts registered custom colours and rejects unknown ones at compile time', () => {
		expect(sharedClasses({ color: 'brand' })).toBe('sv-color-brand');
		// @ts-expect-error -- "red" is not a theme colour, so the type check fails here.
		expect(sharedClasses({ color: 'red' })).toBe('sv-color-red');
	});
});
