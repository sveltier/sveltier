import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import AvatarHarness from '../../../tests/fixtures/AvatarHarness.svelte';

// A one-pixel PNG, and an image that cannot load.
const PIXEL =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const BROKEN = '/missing-avatar.png';

const avatar = () => page.getByTestId('avatar').element() as HTMLElement;
const image = () => avatar().querySelector('img');

describe('Avatar', () => {
	it('shows its fallback without an image, round and as tall as a control', async () => {
		await render(AvatarHarness, {});
		expect(image()).toBeNull();
		expect(avatar().textContent).toBe('am');
		const box = avatar().getBoundingClientRect();
		expect(box.width).toBeCloseTo(2.618 * 16, 1);
		expect(box.height).toBeCloseTo(box.width, 1);
		expect(getComputedStyle(avatar()).borderTopLeftRadius).toBe('9999px');
		expect(getComputedStyle(avatar()).textTransform).toBe('uppercase');
	});

	it('shows the image, and the fallback again when it fails', async () => {
		const screen = await render(AvatarHarness, { src: PIXEL });
		expect(image()?.getAttribute('src')).toBe(PIXEL);
		expect(image()?.getAttribute('alt')).toBe('');
		await screen.rerender({ src: BROKEN });
		await expect.poll(() => image()).toBeNull();
		expect(avatar().textContent).toBe('am');
		// A new image gets its own chance.
		await screen.rerender({ src: PIXEL });
		expect(image()?.getAttribute('src')).toBe(PIXEL);
	});

	it('is decorative unless it has alt text', async () => {
		const screen = await render(AvatarHarness, {});
		expect(avatar().getAttribute('aria-hidden')).toBe('true');
		await screen.rerender({ alt: 'Alex Morgan' });
		expect(avatar().hasAttribute('aria-hidden')).toBe(false);
		await expect.element(page.getByRole('img', { name: 'Alex Morgan' })).toBeVisible();
	});

	it('takes the shared size, colour and rounding', async () => {
		await render(AvatarHarness, { size: 'xl', color: 'primary', variant: 'flat', rounded: 'md' });
		expect([...avatar().classList]).toEqual(
			expect.arrayContaining(['sv-size-xl', 'sv-color-primary', 'sv-variant-flat', 'sv-rounded-md'])
		);
		expect(avatar().getBoundingClientRect().width).toBeCloseTo(4.2361 * 16, 1);
	});
});
