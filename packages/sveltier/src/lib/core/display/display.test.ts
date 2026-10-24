import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import DisplayProbe from '../../../tests/fixtures/DisplayProbe.svelte';
import { createDisplay } from './display.js';

// Runs in Node, where every query reports its server fallback (ssrWidth).
describe('display on the server', () => {
	it('is mobile first by default', () => {
		const display = createDisplay();
		expect(display.name).toBe('xs');
		expect(display.xs).toBe(true);
		expect(display.smAndUp).toBe(false);
		expect(display.smAndDown).toBe(true);
		expect(display.mobile).toBe(true);
	});

	it('follows ssrWidth', () => {
		const display = createDisplay({ ssrWidth: 1300 });
		expect(display.name).toBe('lg');
		expect(display.lg).toBe(true);
		expect(display.md).toBe(false);
		expect(display.mdAndUp).toBe(true);
		expect(display.lgAndDown).toBe(true);
		expect(display.xlAndUp).toBe(false);
		expect(display.mobile).toBe(false);
	});

	it('enters a breakpoint at exactly its threshold', () => {
		expect(createDisplay({ ssrWidth: 959 }).name).toBe('sm');
		expect(createDisplay({ ssrWidth: 960 }).name).toBe('md');
		expect(createDisplay({ ssrWidth: 2560 }).xxl).toBe(true);
	});

	it('takes custom thresholds and a custom mobile breakpoint', () => {
		const display = createDisplay({
			thresholds: { md: 1024 },
			mobileBreakpoint: 'lg',
			ssrWidth: 1100
		});
		expect(display.name).toBe('md');
		expect(display.thresholds).toEqual({ sm: 600, md: 1024, lg: 1280, xl: 1920, xxl: 2560 });
		expect(display.mobile).toBe(true);
	});

	it('rejects thresholds that do not increase', () => {
		expect(() => createDisplay({ thresholds: { md: 500 } })).toThrow(
			'[sveltier SV2001] Display thresholds must increase from sm to xxl; got 600, 500, 1280, 1920, 2560.'
		);
	});

	it('exposes every flag as an enumerable property', () => {
		const keys = Object.keys(createDisplay());
		for (const key of [
			'name',
			'mobile',
			'xs',
			'xxl',
			'smAndUp',
			'xlAndUp',
			'smAndDown',
			'xlAndDown'
		]) {
			expect(keys).toContain(key);
		}
		expect(keys).not.toContain('xxlAndUp');
	});

	it('renders through useDisplay without browser globals', () => {
		const { body } = render(DisplayProbe);
		expect(body).toContain('xs|true|false|true');
	});
});
