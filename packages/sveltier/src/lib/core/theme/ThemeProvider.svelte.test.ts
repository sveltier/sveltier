import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import NestedThemes from '../../../tests/fixtures/NestedThemes.svelte';
import ThemedProbe from '../../../tests/fixtures/ThemedProbe.svelte';
import ThemeProbe from '../../../tests/fixtures/ThemeProbe.svelte';
import { bone } from '../../themes/bone.js';
import { ink } from '../../themes/ink.js';

const html = document.documentElement;
const probe = (label = 'probe') => page.getByTestId(label);
const cssVar = (element: Element, name: string) =>
	getComputedStyle(element).getPropertyValue(name).trim();

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('root ThemeProvider', () => {
	it('injects the theme stylesheet and marks <html> after mount', async () => {
		await render(ThemedProbe);

		await expect.element(probe()).toMatchTextContent(/^system\|/);
		expect(document.getElementById('sv-theme')?.tagName).toBe('STYLE');
		expect(html.getAttribute('data-sv-theme')).toBe('system');
	});

	it('restores a stored choice and ignores unknown values', async () => {
		localStorage.setItem('sv-theme', 'ink');
		const first = await render(ThemedProbe);
		await expect.element(probe()).toHaveTextContent('ink|ink|true');
		expect(html.getAttribute('data-sv-theme')).toBe('ink');
		await first.unmount();

		localStorage.setItem('sv-theme', 'hacked');
		await render(ThemedProbe);
		await expect.element(probe()).toMatchTextContent(/^system\|/);
	});

	it('set() switches the theme, paints its tokens and remembers it', async () => {
		await render(ThemedProbe);
		await userEvent.click(page.getByRole('button', { name: 'probe ink' }));

		await expect.element(probe()).toHaveTextContent('ink|ink|true');
		expect(html.getAttribute('data-sv-theme')).toBe('ink');
		expect(localStorage.getItem('sv-theme')).toBe('ink');
		expect(cssVar(html, '--sv-color-background')).toBe(ink().colors.background);
		expect(getComputedStyle(html).colorScheme).toBe('dark');
	});

	it('toggle() flips between the light and dark themes', async () => {
		await render(ThemedProbe, { theme: 'bone' });
		await userEvent.click(page.getByRole('button', { name: 'probe toggle' }));
		await expect.element(probe()).toHaveTextContent('ink|ink|true');
		await userEvent.click(page.getByRole('button', { name: 'probe toggle' }));
		await expect.element(probe()).toHaveTextContent('bone|bone|false');
	});

	it('does not persist when storageKey is false', async () => {
		await render(ThemedProbe, { storageKey: false });
		await userEvent.click(page.getByRole('button', { name: 'probe ink' }));
		await expect.element(probe()).toHaveTextContent('ink|ink|true');
		expect(localStorage.length).toBe(0);
	});

	it('keeps working when storage throws', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new DOMException('blocked', 'SecurityError');
		});
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new DOMException('blocked', 'SecurityError');
		});
		await render(ThemedProbe);
		await userEvent.click(page.getByRole('button', { name: 'probe ink' }));
		await expect.element(probe()).toHaveTextContent('ink|ink|true');
	});

	it('removes its <html> attribute when unmounted', async () => {
		const screen = await render(ThemedProbe);
		await expect.element(probe()).toMatchTextContent(/^system\|/);
		await screen.unmount();
		expect(html.hasAttribute('data-sv-theme')).toBe(false);
	});
});

describe('nested ThemeProvider', () => {
	it('scopes a different theme to its subtree', async () => {
		await render(NestedThemes);
		const scope = page.getByTestId('inner-scope').element();

		await expect.element(probe('outer')).toHaveTextContent('bone|bone|false');
		await expect.element(probe('inner')).toHaveTextContent('ink|ink|true');
		expect(html.getAttribute('data-sv-theme')).toBe('bone');
		expect(cssVar(scope, '--sv-color-background')).toBe(ink().colors.background);
		expect(cssVar(html, '--sv-color-background')).toBe(bone().colors.background);
		expect(getComputedStyle(scope).backgroundColor).not.toBe(
			getComputedStyle(html).backgroundColor
		);
		expect(getComputedStyle(scope).color).not.toBe(getComputedStyle(document.body).color);
	});

	it('changes only its own scope', async () => {
		await render(NestedThemes);
		await userEvent.click(page.getByRole('button', { name: 'inner bone' }));
		await expect.element(probe('inner')).toHaveTextContent('bone|bone|false');
		await expect.element(probe('outer')).toHaveTextContent('bone|bone|false');
		expect(page.getByTestId('inner-scope').element().getAttribute('data-sv-theme')).toBe('bone');
	});
});

describe('useTheme', () => {
	it('throws a helpful error outside a provider', async () => {
		await expect(render(ThemeProbe)).rejects.toThrow(/inside a <ThemeProvider>/);
	});
});
