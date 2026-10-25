import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import AccordionHarness from '../../../tests/fixtures/AccordionHarness.svelte';

const header = (title: string) => page.getByText(title, { exact: true });
const opened = () =>
	[...document.querySelectorAll<HTMLDetailsElement>('.sv-accordion__item')]
		.filter((details) => details.open)
		.map((details) => details.querySelector('summary')?.textContent?.trim());
const value = () => page.getByTestId('value');
const changes = () => page.getByTestId('changes');

describe('Accordion', () => {
	it('opens a section from its header, closing the one that was open', async () => {
		await render(AccordionHarness);
		await header('Fees').click();
		await expect.poll(opened).toEqual(['Fees']);
		await expect.element(page.getByText('About fees.')).toBeVisible();
		await header('Limits').click();
		await expect.poll(opened).toEqual(['Limits']);
		await expect.element(value()).toHaveTextContent('"limits"');
		await header('Limits').click();
		await expect.poll(opened).toEqual([]);
		await expect.element(value()).toHaveTextContent('null');
		// One report per change, with no passing null while one section replaces another.
		await expect.element(changes()).toHaveTextContent('"fees" "limits" null');
	});

	it('keeps several sections open with multiple', async () => {
		await render(AccordionHarness, { multiple: true });
		await header('Fees').click();
		await header('Limits').click();
		await expect.poll(opened).toEqual(['Fees', 'Limits']);
		await expect.element(value()).toHaveTextContent('["fees","limits"]');
		await header('Fees').click();
		await expect.poll(opened).toEqual(['Limits']);
		await expect.element(value()).toHaveTextContent('["limits"]');
	});

	it('opens and closes from the keyboard', async () => {
		await render(AccordionHarness);
		(document.querySelector('summary') as HTMLElement).focus();
		await userEvent.keyboard('{Enter}');
		await expect.poll(opened).toEqual(['Fees']);
		await userEvent.keyboard('{Enter}');
		await expect.poll(opened).toEqual([]);
	});

	it('does not toggle a disabled section, which still takes focus and says so', async () => {
		await render(AccordionHarness);
		const cards = document.querySelectorAll('summary')[2] as HTMLElement;
		expect(cards.getAttribute('aria-disabled')).toBe('true');
		await header('Cards').click();
		cards.focus();
		await userEvent.keyboard('{Enter}');
		await expect.element(page.getByText('About cards.')).not.toBeVisible();
		expect(opened()).toEqual([]);
		expect(document.activeElement).toBe(cards);
	});

	it('follows a value set from outside, without reporting it as a change', async () => {
		await render(AccordionHarness);
		await page.getByRole('button', { name: 'Open limits' }).click();
		await expect.poll(opened).toEqual(['Limits']);
		await expect.element(changes()).toHaveTextContent('');
	});

	it('groups the sections under one name, except with multiple', async () => {
		const screen = await render(AccordionHarness);
		const names = () =>
			[...document.querySelectorAll('.sv-accordion__item')].map((details) =>
				details.getAttribute('name')
			);
		expect(new Set(names()).size).toBe(1);
		expect(names()[0]).toBeTruthy();
		await screen.rerender({ multiple: true });
		await expect.poll(names).toEqual([null, null, null]);
	});
});
