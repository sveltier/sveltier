import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import BareThemeProvider from '../../../tests/fixtures/BareThemeProvider.svelte';
import NestedThemes from '../../../tests/fixtures/NestedThemes.svelte';
import ThemedProbe from '../../../tests/fixtures/ThemedProbe.svelte';
import ThemeProbe from '../../../tests/fixtures/ThemeProbe.svelte';
import { maison } from '../../themes/maison.js';
import { monolithDark, monolithLight } from '../../themes/monolith.js';

const html = document.documentElement;
const probe = (label = 'probe') => page.getByTestId(label);
const cssVar = (element: Element, name: string) =>
	getComputedStyle(element).getPropertyValue(name).trim();
const DARK = 'monolith-dark|monolith-dark|true';
const LIGHT = 'monolith-light|monolith-light|false';

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('root ThemeProvider', () => {
	it('requires themes and says what to pass', async () => {
		await expect(render(BareThemeProvider)).rejects.toThrow(
			/needs themes, for example themes={monolith}/
		);
	});

	it('injects the theme stylesheet and marks <html> after mount', async () => {
		await render(ThemedProbe);

		await expect.element(probe()).toMatchTextContent(/^system\|monolith-/);
		expect(document.getElementById('sv-theme')?.tagName).toBe('STYLE');
		expect(html.getAttribute('data-sv-theme')).toBe('system');
	});

	it('restores a stored choice and ignores unknown values', async () => {
		localStorage.setItem('sv-theme', 'monolith-dark');
		const first = await render(ThemedProbe);
		await expect.element(probe()).toHaveTextContent(DARK);
		expect(html.getAttribute('data-sv-theme')).toBe('monolith-dark');
		await first.unmount();

		localStorage.setItem('sv-theme', 'hacked');
		await render(ThemedProbe);
		await expect.element(probe()).toMatchTextContent(/^system\|/);
	});

	it('set() switches the theme, paints its tokens and remembers it', async () => {
		await render(ThemedProbe);
		await userEvent.click(page.getByRole('button', { name: 'probe dark' }));

		await expect.element(probe()).toHaveTextContent(DARK);
		expect(html.getAttribute('data-sv-theme')).toBe('monolith-dark');
		expect(localStorage.getItem('sv-theme')).toBe('monolith-dark');
		expect(cssVar(html, '--sv-color-background')).toBe(monolithDark.colors.background);
		expect(getComputedStyle(html).colorScheme).toBe('dark');
	});

	it('toggle() flips between the light and dark themes', async () => {
		await render(ThemedProbe, { theme: 'monolith-light' });
		await userEvent.click(page.getByRole('button', { name: 'probe toggle' }));
		await expect.element(probe()).toHaveTextContent(DARK);
		await userEvent.click(page.getByRole('button', { name: 'probe toggle' }));
		await expect.element(probe()).toHaveTextContent(LIGHT);
	});

	it('takes light and dark from the registered pack and restyles more than colour', async () => {
		await render(ThemedProbe, { themes: maison, theme: 'maison-light' });

		await expect.element(probe()).toHaveTextContent('maison-light|maison-light|false');
		expect(cssVar(html, '--sv-radius-md')).toBe('0px');
		expect(cssVar(html, '--sv-font-ui')).toContain('Jost');
		await userEvent.click(page.getByRole('button', { name: 'probe toggle' }));
		await expect.element(probe()).toHaveTextContent('maison-dark|maison-dark|true');
	});

	it('does not persist when storageKey is false', async () => {
		await render(ThemedProbe, { storageKey: false });
		await userEvent.click(page.getByRole('button', { name: 'probe dark' }));
		await expect.element(probe()).toHaveTextContent(DARK);
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
		await userEvent.click(page.getByRole('button', { name: 'probe dark' }));
		await expect.element(probe()).toHaveTextContent(DARK);
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

		await expect.element(probe('outer')).toHaveTextContent(LIGHT);
		await expect.element(probe('inner')).toHaveTextContent(DARK);
		expect(html.getAttribute('data-sv-theme')).toBe('monolith-light');
		expect(cssVar(scope, '--sv-color-background')).toBe(monolithDark.colors.background);
		expect(cssVar(html, '--sv-color-background')).toBe(monolithLight.colors.background);
		expect(getComputedStyle(scope).backgroundColor).not.toBe(
			getComputedStyle(html).backgroundColor
		);
		expect(getComputedStyle(scope).color).not.toBe(getComputedStyle(document.body).color);
	});

	it('changes only its own scope', async () => {
		await render(NestedThemes);
		await userEvent.click(page.getByRole('button', { name: 'inner light' }));
		await expect.element(probe('inner')).toHaveTextContent(LIGHT);
		await expect.element(probe('outer')).toHaveTextContent(LIGHT);
		expect(page.getByTestId('inner-scope').element().getAttribute('data-sv-theme')).toBe(
			'monolith-light'
		);
	});
});

describe('useTheme', () => {
	it('throws a helpful error outside a provider', async () => {
		await expect(render(ThemeProbe)).rejects.toThrow(/inside a <ThemeProvider>/);
	});
});
