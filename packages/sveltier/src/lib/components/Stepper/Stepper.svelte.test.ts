import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import StepperHarness from '../../../tests/fixtures/StepperHarness.svelte';

const steps = () => page.getByRole('listitem');
const step = (name: string) => steps().filter({ hasText: name });
const button = (name: string) => page.getByRole('button', { name, exact: false });
const shown = (testId: string) => page.getByTestId(testId);
// The labels of the steps that are buttons.
const stepButtons = () =>
	page
		.getByRole('list')
		.getByRole('button')
		.elements()
		.map((element) => element.querySelector('.sv-stepper__label')?.textContent);

describe('Stepper', () => {
	it('lists the steps in order, the first current when no value is set', async () => {
		await render(StepperHarness);
		const list = page.getByRole('list', { name: 'Open an account' });
		await expect.element(list).toBeVisible();
		expect(list.element().tagName).toBe('OL');
		expect(steps().elements()).toHaveLength(4);
		await expect.element(step('Profile')).toHaveAttribute('aria-current', 'step');
		await expect.element(step('Identity')).not.toHaveAttribute('aria-current');
		expect(stepButtons()).toEqual([]);
		expect(step('Profile').element().textContent).toContain('Name and address');
	});

	it('marks the steps before the current one completed, and lets the user go back', async () => {
		await render(StepperHarness, { value: 'funding' });
		await expect.element(step('Funding')).toHaveAttribute('aria-current', 'step');
		expect(button('Profile').element().textContent).toContain('(Completed)');
		await expect.element(button('Identity')).toBeVisible();
		expect(stepButtons()).toEqual(['Profile', 'Identity']);
		await button('Profile').click();
		await expect.element(shown('step')).toHaveTextContent('profile');
		await expect.element(shown('went')).toHaveTextContent('profile');
		await expect.element(step('Profile')).toHaveAttribute('aria-current', 'step');
		expect(stepButtons()).toEqual([]);
	});

	it('moves forward only through the app, which sets the value', async () => {
		await render(StepperHarness);
		await page.getByRole('button', { name: 'Next' }).click();
		await expect.element(step('Identity')).toHaveAttribute('aria-current', 'step');
		await expect.element(shown('went')).toHaveTextContent('');
		expect(stepButtons()).toEqual(['Profile']);
	});

	it('makes every step but the current and disabled ones a button when not linear', async () => {
		await render(StepperHarness, { value: 'identity', linear: false, disabled: true });
		expect(stepButtons()).toEqual(['Profile', 'Review']);
		await button('Review').click();
		await expect.element(shown('step')).toHaveTextContent('review');
	});

	it('says which step has an error, in place of completed', async () => {
		await render(StepperHarness, { value: 'review', error: true });
		expect(button('Identity').element().textContent).toContain('(Error)');
		expect(button('Identity').element().textContent).not.toContain('Completed');
		expect(
			button('Identity').element().querySelector('.sv-stepper__marker')?.textContent
		).toContain('!');
	});

	it('reaches the steps with Tab and goes with Enter', async () => {
		await render(StepperHarness, { value: 'review' });
		await page.getByRole('button', { name: 'Before' }).click();
		await userEvent.keyboard('{Tab}');
		await expect.element(button('Profile')).toHaveFocus();
		await userEvent.keyboard('{Tab}');
		await expect.element(button('Identity')).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		await expect.element(shown('step')).toHaveTextContent('identity');
	});
});
