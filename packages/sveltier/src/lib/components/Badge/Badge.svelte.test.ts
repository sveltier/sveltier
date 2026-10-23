import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import BadgeHarness from '../../../tests/fixtures/BadgeHarness.svelte';

const root = (id = 'badge') => page.getByTestId(id).element() as HTMLElement;
const badge = (id = 'badge') => root(id).querySelector<HTMLElement>('.sv-badge__badge');
const spoken = (id = 'badge') => root(id).querySelector('.sv-visually-hidden')?.textContent;

describe('Badge', () => {
	it('shows its count, and says what it counts', async () => {
		await render(BadgeHarness, { content: 3, label: 'unread messages' });
		expect(badge()?.textContent).toBe('3');
		expect(badge()?.closest('[aria-hidden="true"]')).not.toBeNull();
		expect(spoken()).toBe('3 unread messages');
	});

	it('caps the count it shows, not the one it says', async () => {
		const screen = await render(BadgeHarness, { content: 120, label: 'alerts' });
		expect(badge()?.textContent).toBe('99+');
		expect(spoken()).toBe('120 alerts');
		await screen.rerender({ max: 9 });
		expect(badge()?.textContent).toBe('9+');
	});

	it('gives its text an id to describe what it is pinned to', async () => {
		await render(BadgeHarness, { content: 3, label: 'unread messages', id: 'inbox' });
		expect(root().id).toBe('inbox');
		expect(document.getElementById('inbox-label')?.textContent).toBe('3 unread messages');
	});

	it('hides at zero', async () => {
		await render(BadgeHarness, { content: 0, label: 'alerts' });
		expect(badge()).toBeNull();
		expect(spoken()).toBeUndefined();
	});

	it('is a dot, announced by its label', async () => {
		await render(BadgeHarness, { dot: true, label: 'New activity' });
		expect(badge()?.textContent).toBe('');
		expect(spoken()).toBe('New activity');
		const box = badge()!.getBoundingClientRect();
		expect(box.width).toBeCloseTo(box.height, 1);
	});

	it('sits centred on the top end corner of its content', async () => {
		const screen = await render(BadgeHarness, { content: 3 });
		const corner = () => {
			const content = page.getByTestId('content').element().getBoundingClientRect();
			const box = badge()!.getBoundingClientRect();
			return { x: box.x + box.width / 2, y: box.y + box.height / 2, content };
		};
		let { x, y, content } = corner();
		expect(x).toBeCloseTo(content.right, 0);
		expect(y).toBeCloseTo(content.top, 0);
		await screen.rerender({ dir: 'rtl' });
		({ x, y, content } = corner());
		expect(x).toBeCloseTo(content.left, 0);
		expect(y).toBeCloseTo(content.top, 0);
	});

	it('sits in the line when it has no content to pin to', async () => {
		await render(BadgeHarness, {});
		expect(root('inline').classList).toContain('sv-badge--inline');
		const line = root('inline').parentElement!.getBoundingClientRect();
		const box = badge('inline')!.getBoundingClientRect();
		expect(box.top).toBeGreaterThanOrEqual(line.top - 1);
		expect(box.bottom).toBeLessThanOrEqual(line.bottom + 1);
		expect(badge('inline')?.textContent).toBe('New');
	});

	it('is filled with its colour', async () => {
		await render(BadgeHarness, { content: 3, color: 'error' });
		expect(badge()?.classList).toContain('sv-color-error');
		expect(badge()?.classList).toContain('sv-variant-flat');
	});
});
