import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ModalHarness from '../../../tests/fixtures/ModalHarness.svelte';
import PortalHarness from '../../../tests/fixtures/PortalHarness.svelte';

const inert = (id: string) => page.getByTestId(id).element().hasAttribute('inert');
const html = document.documentElement;

describe('Portal', () => {
	it('renders its children elsewhere, with the contexts and theme scope of where it is used', async () => {
		await render(PortalHarness);
		const probe = page.getByTestId('portaled');
		await expect.element(probe).toHaveTextContent('monolith-dark|monolith-dark|true');
		const element = probe.element();
		expect(page.getByTestId('host').element().contains(element)).toBe(false);
		expect(element.closest('[data-sv-theme]')?.getAttribute('data-sv-theme')).toBe('monolith-dark');
	});

	it('mounts into a target selector', async () => {
		await render(PortalHarness, { into: '#portal-target' });
		await expect
			.element(page.getByTestId('target').getByTestId('portaled'))
			.toHaveTextContent('monolith-dark|monolith-dark|true');
	});

	it('removes its content when it goes away', async () => {
		const screen = await render(PortalHarness);
		await expect.element(page.getByTestId('portaled')).toBeInTheDocument();
		await screen.rerender({ open: false });
		await expect.element(page.getByTestId('portaled')).not.toBeInTheDocument();
	});
});

describe('inertOthers', () => {
	it('makes everything outside inert, except live regions', async () => {
		await render(ModalHarness, { first: true });
		await expect.element(page.getByRole('dialog', { name: 'First' })).toBeVisible();
		expect(inert('header')).toBe(true);
		expect(inert('beside')).toBe(true);
		expect(inert('main')).toBe(false);
		expect(inert('section')).toBe(false);
		expect(inert('first')).toBe(false);
		expect(inert('live')).toBe(false);
	});

	it('lets focus return to the opener, which was inert while the modal was open', async () => {
		const screen = await render(ModalHarness);
		const opener = page.getByRole('button', { name: 'Page action' });
		opener.element().focus();
		await screen.rerender({ first: true });
		await expect.element(page.getByRole('button', { name: 'First action' })).toHaveFocus();
		await screen.rerender({ first: false });
		await expect.element(opener).toHaveFocus();
	});

	it('stacks with a second modal and restores exactly what it changed', async () => {
		const screen = await render(ModalHarness, { first: true, second: true });
		expect(inert('section')).toBe(true);
		await screen.rerender({ first: true, second: false });
		expect(inert('section')).toBe(false);
		expect(inert('header')).toBe(true);
		await screen.rerender({ first: false, second: false });
		expect(inert('header')).toBe(false);
		expect(inert('beside')).toBe(false);
		expect(inert('already')).toBe(true);
	});
});

describe('scrollLock', () => {
	it('locks the page while any modal is open and restores its own styles', async () => {
		html.style.overflow = 'auto';
		const screen = await render(ModalHarness, { first: true, second: true });
		expect(html.style.overflow).toBe('hidden');
		await screen.rerender({ first: false, second: true });
		expect(html.style.overflow).toBe('hidden');
		await screen.rerender({ first: false, second: false });
		expect(html.style.overflow).toBe('auto');
		html.style.overflow = '';
	});
});
