import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import CommandPaletteHarness from '../../../tests/fixtures/CommandPaletteHarness.svelte';
import { matchesShortcut } from './shortcut.js';

const press = (key: string, init: KeyboardEventInit = {}) =>
	({
		key,
		code: '',
		ctrlKey: false,
		metaKey: false,
		altKey: false,
		shiftKey: false,
		...init
	}) as KeyboardEvent;

describe('matchesShortcut', () => {
	it('reads Mod as Ctrl elsewhere and ⌘ on Apple platforms', () => {
		expect(matchesShortcut(press('k', { ctrlKey: true }), 'Mod+K', false)).toBe(true);
		expect(matchesShortcut(press('k', { metaKey: true }), 'Mod+K', false)).toBe(false);
		expect(matchesShortcut(press('k', { metaKey: true }), 'Mod+K', true)).toBe(true);
		expect(matchesShortcut(press('k', { ctrlKey: true }), 'Mod+K', true)).toBe(false);
	});

	it('wants exactly the modifiers named, and the key in any case', () => {
		const shifted = press('P', { ctrlKey: true, shiftKey: true });
		expect(matchesShortcut(shifted, 'Ctrl+Shift+P', false)).toBe(true);
		expect(matchesShortcut(shifted, 'Ctrl+P', false)).toBe(false);
		expect(matchesShortcut(press('k'), 'Mod+K', false)).toBe(false);
		expect(matchesShortcut(press('/'), '/', false)).toBe(true);
	});

	it('matches a letter or a digit by its place where Alt changes the character', () => {
		const alt = press('˚', { altKey: true, metaKey: true, code: 'KeyK' });
		expect(matchesShortcut(alt, 'Mod+Alt+K', true)).toBe(true);
		const digit = press('¡', { altKey: true, code: 'Digit1' });
		expect(matchesShortcut(digit, 'Alt+1', true)).toBe(true);
	});
});

// Runs in Node: the markup the server sends before any script runs.
describe('CommandPalette on the server', () => {
	it('renders its trigger and no dialog while closed', () => {
		const { body } = render(CommandPaletteHarness);
		expect(body).toContain('aria-haspopup="dialog"');
		expect(body).not.toContain('<dialog');
	});
});
