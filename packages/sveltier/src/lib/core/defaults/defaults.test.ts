import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import DefaultsHarness from '../../../tests/fixtures/DefaultsHarness.svelte';
import { mergeDefaults } from './context.js';

describe('mergeDefaults', () => {
	it('merges per component and per key, inner over outer, without mutating either', () => {
		const outer = { global: { size: 'sm' }, Probe: { size: 'lg', variant: 'tonal' } } as const;
		const parent = mergeDefaults(undefined, outer);
		const merged = mergeDefaults(parent, { global: { density: 'compact' }, Probe: { size: 'xl' } });

		expect(merged).toEqual({
			global: { size: 'sm', density: 'compact' },
			Probe: { size: 'xl', variant: 'tonal' }
		});
		expect(parent).toEqual({ global: { size: 'sm' }, Probe: { size: 'lg', variant: 'tonal' } });
	});
});

describe('defaults on the server', () => {
	it('renders resolved values', () => {
		const { body } = render(DefaultsHarness, {
			props: { outer: { global: { density: 'compact' }, Probe: { size: 'sm' } } }
		});
		expect(body).toContain('sm|flat|compact|initial');
	});
});
