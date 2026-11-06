import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import SecureMaskHarness from '../../../tests/fixtures/SecureMaskHarness.svelte';

const SECRET = 'DE89370400440532013000';
const group = () => page.getByRole('group', { name: 'Account number' });
const mask = () => page.getByTestId('mask').element() as HTMLElement;
const toggle = () => page.getByRole('button', { name: 'Show' });

describe('SecureMask', () => {
	it('shows dots and the last four characters, and writes nothing more to the page', async () => {
		await render(SecureMaskHarness);
		await expect.element(group()).toBeVisible();
		const seen = [...mask().querySelectorAll('[aria-hidden="true"]')]
			.map((part) => part.textContent)
			.join('');
		expect(seen).toBe('••••3000');
		expect(document.body.innerHTML).not.toContain('0532013000');
		expect(document.body.textContent).not.toContain('0532');
	});

	it('is read as its label, then the characters it ends in', async () => {
		await render(SecureMaskHarness);
		const words = mask().textContent!.replace(/[•]/g, '');
		expect(words).toContain('ending in 3000');
		await expect.element(group()).toHaveAccessibleName('Account number');
	});

	it('keeps as many characters as visible, or none', async () => {
		const screen = await render(SecureMaskHarness, { visible: 2 });
		expect(mask().textContent).toContain('••••00');
		await screen.rerender({ visible: 0 });
		expect(mask().textContent).toBe('••••Hidden');
	});

	it('shows the whole value when revealed', async () => {
		await render(SecureMaskHarness, { revealed: true });
		expect(mask().textContent).toBe(SECRET);
	});

	it('reveals and hides from its button, which says whether it is pressed', async () => {
		await render(SecureMaskHarness, { toggle: true });
		await expect.element(toggle()).toHaveAttribute('aria-pressed', 'false');
		await toggle().click();
		await expect.element(page.getByTestId('revealed')).toHaveTextContent('true');
		expect(mask().textContent).toContain(SECRET);
		await expect.element(toggle()).toHaveAttribute('aria-pressed', 'true');
		await toggle().click();
		await expect.element(page.getByTestId('revealed')).toHaveTextContent('false');
		expect(mask().textContent).not.toContain(SECRET);
	});

	it('hides the value again after hideAfter', async () => {
		await render(SecureMaskHarness, { toggle: true, hideAfter: 300 });
		await toggle().click();
		expect(mask().textContent).toContain(SECRET);
		await expect.poll(() => mask().textContent!.includes(SECRET), { timeout: 3000 }).toBe(false);
		await expect.element(page.getByTestId('revealed')).toHaveTextContent('false');
	});
});
