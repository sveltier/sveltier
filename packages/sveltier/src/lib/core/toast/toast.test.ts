import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ToastProviders from '../../../tests/fixtures/ToastProviders.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Toasts on the server', () => {
	it('renders the region hidden and the live regions empty, ignoring toasts shown meanwhile', () => {
		const { body } = render(ToastProviders, { props: { root: 'ui' } });
		expect(body).toMatch(/<section[^>]*popover="manual"[^>]*aria-label="Notifications \(F8\)"/);
		expect(body).toContain('aria-live="polite"');
		expect(body).toContain('aria-live="assertive"');
		expect(body).not.toContain('Shown while rendering');
	});

	it('works under ThemeProvider with a ToastProvider', () => {
		const { body } = render(ToastProviders, { props: { root: 'toast' } });
		expect(body).toContain('Ready');
		expect(body).toContain('aria-label="Notifications (F8)"');
	});

	it('refuses useToast() without a provider, saying which one to add', () => {
		// The server renders on first read of the output.
		expect(() => render(ToastProviders, { props: { root: 'theme' } }).body).toThrow(
			/\[sveltier SV4003\] useToast\(\) was called outside a <UIProvider>/
		);
	});
});
