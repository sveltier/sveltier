import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import BareThemeProvider from '../../../tests/fixtures/BareThemeProvider.svelte';
import NestedThemes from '../../../tests/fixtures/NestedThemes.svelte';
import ThemedProbe from '../../../tests/fixtures/ThemedProbe.svelte';

describe('ThemeProvider on the server', () => {
	it('requires themes at the root and says what to pass', () => {
		expect(() => render(BareThemeProvider).body).toThrow(
			"[sveltier SV1001] The root <ThemeProvider> has no themes. Pass one, for example themes={monolith} from '@sveltier/ui/themes/monolith'. https://sveltier.com/errors#SV1001"
		);
	});

	it('puts the stylesheet and the restore script in <head> and no wrapper in <body>', () => {
		const { head, body } = render(ThemedProbe);

		expect(head).toContain('<style id="sv-theme">');
		expect(head).toContain('localStorage.getItem("sv-theme")');
		expect(body).not.toContain('sv-theme-provider');
		// The OS preference is unknown on the server, so "system" resolves to the light theme.
		expect(body).toContain('system|monolith-light|false');
	});

	it('omits the script without persistence and adds the nonce', () => {
		const { head } = render(ThemedProbe, { props: { storageKey: false, nonce: 'r4nd0m' } });
		expect(head).toContain('<style id="sv-theme" nonce="r4nd0m">');
		expect(head).not.toContain('<script');
	});

	it('maps a bare <html> to an explicit theme prop', () => {
		const { head, body } = render(ThemedProbe, { props: { theme: 'monolith-dark' } });
		expect(head).toContain(':root:not([data-sv-theme]){color-scheme:dark;');
		expect(body).toContain('monolith-dark|monolith-dark|true');
	});

	it('renders nested scopes as wrappers with their theme', () => {
		const { head, body } = render(NestedThemes);
		expect(head.match(/<style id="sv-theme"/g)).toHaveLength(1);
		expect(body).toMatch(
			/<div[^>]*class="sv-theme-provider sv-theme-provider--background"[^>]*data-sv-theme="monolith-dark"/
		);
	});
});
