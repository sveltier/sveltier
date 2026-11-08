import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ToastProviders from '../../../tests/fixtures/ToastProviders.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Toasts on the server', () => {
	it('renders the live regions empty, and leaves the region to the browser', () => {
		const { body } = render(ToastProviders, { props: { root: 'ui' } });
		// The region loads in the browser, once the page is idle or a toast shows.
		expect(body).not.toContain('popover="manual"');
		expect(body).toContain('aria-live="polite"');
		expect(body).toContain('aria-live="assertive"');
		expect(body).not.toContain('Shown while rendering');
	});

	it('works under ThemeProvider with a ToastProvider', () => {
		const { body } = render(ToastProviders, { props: { root: 'toast' } });
		expect(body).toContain('Ready');
		expect(body).toContain('aria-live="polite"');
	});

	it('refuses useToast() without a provider, saying which one to add', () => {
		// The server renders on first read of the output.
		expect(() => render(ToastProviders, { props: { root: 'theme' } }).body).toThrow(
			/\[sveltier SV4003\] useToast\(\) was called outside a <UIProvider>/
		);
	});
});
