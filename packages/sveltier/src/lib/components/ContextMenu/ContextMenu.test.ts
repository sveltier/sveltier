import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ContextMenuHarness from '../../../tests/fixtures/ContextMenuHarness.svelte';
import { EDGE, placeAt } from './place.js';

const VIEWPORT = { width: 800, height: 600 };
const MENU = { width: 200, height: 100 };
const at = (x: number, y: number) => ({ x, below: y, above: y });

describe('where a context menu opens', () => {
	it('puts its inline-start, top corner at the point', () => {
		expect(placeAt(at(100, 50), MENU, VIEWPORT, false)).toEqual({ left: 100, top: 50 });
		expect(placeAt(at(500, 50), MENU, VIEWPORT, true)).toEqual({ left: 300, top: 50 });
	});

	it('moves to the other side of the point where it would overflow', () => {
		expect(placeAt(at(700, 550), MENU, VIEWPORT, false)).toEqual({ left: 500, top: 450 });
		expect(placeAt(at(100, 50), MENU, VIEWPORT, true)).toEqual({ left: 100, top: 50 });
	});

	it('opens above an element that has no room below it', () => {
		const point = { x: 100, below: 560, above: 530 };
		expect(placeAt(point, MENU, VIEWPORT, false)).toEqual({ left: 100, top: 430 });
	});

	it('stays inside the viewport, at its start when it is too big', () => {
		expect(placeAt(at(150, 300), { width: 200, height: 590 }, VIEWPORT, false)).toEqual({
			left: 150,
			top: EDGE
		});
		expect(placeAt(at(150, 50), { width: 900, height: 100 }, VIEWPORT, false).left).toBe(EDGE);
	});
});

// Runs in Node: the markup the server sends before any script runs.
describe('ContextMenu on the server', () => {
	it('renders its targets as they are, and no menu while closed', () => {
		const { body } = render(ContextMenuHarness);
		expect(body.match(/<button[^>]*data-id=/g)).toHaveLength(3);
		expect(body).not.toContain('role="menu"');
		expect(body).not.toContain('aria-haspopup');
	});

	it('renders a menu named by its label while open', () => {
		const { body } = render(ContextMenuHarness, { props: { open: true } });
		expect(body).toMatch(/<div[^>]*aria-label="Order actions"[^>]*role="menu"/);
		expect(body.match(/role="menuitem"/g)).toHaveLength(3);
	});
});
