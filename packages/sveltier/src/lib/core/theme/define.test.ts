import { describe, expect, it } from 'vitest';
import { auroraDark } from '../../themes/aurora.js';
import { monolithDark, monolithLight } from '../../themes/monolith.js';
import { defineTheme } from './define.js';

describe('defineTheme', () => {
	it('copies its base when nothing changes, and takes dark from it unless set', () => {
		expect(defineTheme({}, monolithLight)).toEqual(monolithLight);
		expect(defineTheme({}, monolithDark)).toEqual(monolithDark);
		expect(defineTheme({ dark: true }, monolithLight).dark).toBe(true);
	});

	it('recomputes the on- colour of an overridden colour', () => {
		const theme = defineTheme({ colors: { primary: 'oklch(0.45 0.12 260)' } }, monolithDark);
		expect(theme.colors.primary).toBe('oklch(0.45 0.12 260)');
		expect(theme.colors['on-primary']).toBe('oklch(0.985 0.005 260)');
	});

	it('keeps an explicit on- colour', () => {
		const theme = defineTheme(
			{ colors: { primary: 'oklch(0.45 0.12 260)', 'on-primary': 'oklch(1 0 0)' } },
			monolithLight
		);
		expect(theme.colors['on-primary']).toBe('oklch(1 0 0)');
	});

	it('adds custom colours with their on- colour, and merges variables', () => {
		const theme = defineTheme(
			{
				colors: { brand: 'oklch(0.35 0.1 300)' },
				variables: { 'radius-md': '2px', 'card-padding': '20px' }
			},
			monolithLight
		);
		expect(theme.colors['on-brand']).toBe('oklch(0.985 0.005 300)');
		expect(theme.variables).toMatchObject({
			'radius-md': '2px',
			'card-padding': '20px',
			'font-ui': monolithLight.variables['font-ui']
		});
	});

	it('extends its base without mutating it', () => {
		const snapshot = structuredClone(monolithDark);
		const theme = defineTheme({ colors: { surface: 'oklch(0.2 0.01 78)' } }, monolithDark);
		expect(theme.dark).toBe(true);
		expect(theme.colors.surface).toBe('oklch(0.2 0.01 78)');
		expect(monolithDark).toEqual(snapshot);
	});

	it('extends any pack, not only Monolith', () => {
		const teal = defineTheme({ colors: { primary: 'oklch(0.78 0.11 190)' } }, auroraDark);
		expect(teal.dark).toBe(true);
		expect(teal.variables['font-ui']).toBe(auroraDark.variables['font-ui']);
		expect(teal.colors['on-primary']).toBeDefined();
	});
});
