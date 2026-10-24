import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import AlertHarness from '../../../tests/fixtures/AlertHarness.svelte';

const alert = () => page.getByTestId('alert').query() as HTMLElement | null;
const icon = () => alert()?.querySelector('.sv-alert__icon svg');

describe('Alert', () => {
	it('is announced at once for warnings and errors, politely otherwise', async () => {
		const screen = await render(AlertHarness, { type: 'error' });
		expect(alert()?.getAttribute('role')).toBe('alert');
		await screen.rerender({ type: 'warning' });
		expect(alert()?.getAttribute('role')).toBe('alert');
		await screen.rerender({ type: 'success' });
		expect(alert()?.getAttribute('role')).toBe('status');
		await screen.rerender({ type: undefined });
		expect(alert()?.getAttribute('role')).toBe('status');
	});

	it('takes its colour and icon from the type, unless told otherwise', async () => {
		const screen = await render(AlertHarness, { type: 'success' });
		expect(alert()?.classList).toContain('sv-color-success');
		expect(alert()?.classList).toContain('sv-variant-tonal');
		expect(icon()?.getAttribute('aria-hidden')).toBe('true');
		await screen.rerender({ color: 'neutral' });
		expect(alert()?.classList).toContain('sv-color-neutral');
		await screen.rerender({ icon: false });
		expect(icon()).toBeNull();
	});

	it('shows its own icon, title, message and actions', async () => {
		await render(AlertHarness, {
			type: 'error',
			title: 'Transfer failed',
			withActions: true,
			withPrepend: true
		});
		expect(page.getByTestId('custom-icon').query()).not.toBeNull();
		expect(alert()?.querySelector('.sv-alert__title')?.textContent).toBe('Transfer failed');
		await expect
			.element(page.getByRole('alert'))
			.toMatchTextContent(/^\s*Transfer failed\s*The transfer could not be sent\.\s*Retry\s*$/);
		await expect.element(page.getByRole('button', { name: 'Retry' })).toBeVisible();
	});

	it('closes itself from its close button', async () => {
		const onclose = vi.fn();
		await render(AlertHarness, { type: 'info', closable: true, onclose });
		await page.getByRole('button', { name: 'Close' }).click();
		expect(alert()).toBeNull();
		expect(onclose).toHaveBeenCalledOnce();
		expect(page.getByTestId('open').element().textContent).toBe('false');
	});

	it('names its close button', async () => {
		await render(AlertHarness, { closable: true, closeLabel: 'Dismiss message' });
		await expect.element(page.getByRole('button', { name: 'Dismiss message' })).toBeVisible();
	});
});
