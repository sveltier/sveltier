import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import TimelineHarness, { ORDER } from '../../../tests/fixtures/TimelineHarness.svelte';

const list = () => page.getByRole('list', { name: 'Order history' });
const events = () => page.getByRole('listitem').all();
const markers = () => [...document.querySelectorAll<HTMLElement>('.sv-timeline__marker')];
const colour = (element: Element, property = 'background-color') =>
	getComputedStyle(element).getPropertyValue(property);

describe('Timeline', () => {
	it('is an ordered list of the events, in the order given', async () => {
		await render(TimelineHarness);
		await expect.element(list()).toBeVisible();
		expect(list().element().tagName).toBe('OL');
		expect(
			events().map((event) =>
				event.element().querySelector('.sv-timeline__title')?.textContent?.trim()
			)
		).toEqual(['Order placed', 'Partly filled', 'Filled', 'Settles, Pending']);
		expect(markers().every((marker) => marker.getAttribute('aria-hidden') === 'true')).toBe(true);
	});

	it('writes each time in the locale, with the machine-readable date in datetime', async () => {
		await render(TimelineHarness);
		const time = document.querySelector('time')!;
		expect(time.getAttribute('datetime')).toBe('2026-11-07T09:30:00.000Z');
		expect(time.textContent).toBe('Nov 7, 2026, 9:30 AM');
		expect(page.getByText('Buy 300 VNM').element().tagName).toBe('P');
	});

	it('takes Intl options for the times, or shows them relative with the date on hover', async () => {
		const screen = await render(TimelineHarness, { timeFormat: { timeStyle: 'medium' } });
		expect(document.querySelector('time')!.textContent).toBe('9:30:00 AM');
		const soon = new Date(Date.now() - 3 * 3600_000);
		await screen.rerender({
			items: [{ title: 'Signed in', time: soon }],
			timeFormat: { dateStyle: 'medium', timeStyle: 'short' },
			relative: true
		});
		const time = document.querySelector('time')!;
		expect(time.textContent).toBe('3 hours ago');
		expect(time.title).toMatch(/\d{4}/);
	});

	it('shows a time that is not a date as written, and no time when there is none', async () => {
		await render(TimelineHarness, {
			items: [{ title: 'Queued', time: 'Next business day' }, { title: 'Draft' }]
		});
		expect(document.querySelectorAll('time')).toHaveLength(0);
		await expect.element(page.getByText('Next business day')).toBeVisible();
	});

	it('marks a pending event hollow and reads it as pending', async () => {
		await render(TimelineHarness);
		const pending = markers()[3]!;
		const filled = markers()[0]!;
		expect(colour(pending)).toBe('rgba(0, 0, 0, 0)');
		expect(colour(filled)).not.toBe('rgba(0, 0, 0, 0)');
		await expect.element(page.getByText('Settles, Pending')).toBeInTheDocument();
	});

	it("colours an event's marker in its own colour, the others in the timeline's", async () => {
		const screen = await render(TimelineHarness);
		const read = () => markers().map((marker) => colour(marker));
		const [placed, , filled] = read();
		expect(filled).not.toBe(placed);
		await screen.rerender({ color: 'error' });
		const [placedNow, , filledNow] = read();
		expect(placedNow).not.toBe(placed);
		expect(placedNow).not.toBe(filledNow);
		expect(filledNow).toBe(filled);
	});

	it('draws a line from each marker to the next, none after the last', async () => {
		await render(TimelineHarness);
		const items = [...document.querySelectorAll('.sv-timeline__event')];
		const line = (item: Element) => getComputedStyle(item, '::after');
		expect(line(items[0]!).content).not.toBe('none');
		expect(line(items.at(-1)!).content).toBe('none');
		const first = markers()[0]!.getBoundingClientRect();
		const second = markers()[1]!.getBoundingClientRect();
		const height = Number.parseFloat(line(items[0]!).height);
		expect(height).toBeGreaterThan(0);
		expect(height).toBeLessThan(second.top - first.bottom);
	});

	it('renders the item snippet in place of the title, with the extra fields typed', async () => {
		await render(TimelineHarness, { custom: true });
		await expect.element(page.getByText('Partly filled on HOSE')).toBeVisible();
		expect(document.querySelectorAll('[data-testid="custom"]')).toHaveLength(ORDER.length);
	});
});
