import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import SliderHarness from '../../../tests/fixtures/SliderHarness.svelte';

const slider = () => page.getByRole('slider', { name: 'Risk' });
const input = () => slider().element() as HTMLInputElement;
const root = () => input().closest('.sv-slider') as HTMLElement;
const shown = (testId: string) => page.getByTestId(testId);
const RISK = [
	{ value: 0, label: 'Careful' },
	{ value: 50, label: 'Balanced' },
	{ value: 100, label: 'Bold' }
];

describe('Slider', () => {
	it('is a native range named by its label, whose value binds both ways as a number', async () => {
		const screen = await render(SliderHarness, { value: 50 });
		expect(input().type).toBe('range');
		// Safari does not focus a range input on click, so the keys need focus given.
		input().focus();
		await userEvent.keyboard('{Home}');
		await expect.element(shown('value')).toHaveTextContent('number:0');
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(shown('value')).toHaveTextContent('number:1');
		await screen.rerender({ value: 80 });
		expect(input().value).toBe('80');
	});

	it('shows its value beside the label, and reads a formatted value out', async () => {
		const screen = await render(SliderHarness, { value: 40 });
		const header = input().previousElementSibling as HTMLElement;
		expect(header.textContent).toContain('40');
		expect(input().getAttribute('aria-valuetext')).toBeNull();
		await screen.rerender({ format: (value: number) => `${value}%` });
		expect(header.textContent).toContain('40%');
		expect(input().getAttribute('aria-valuetext')).toBe('40%');
	});

	it('reads the label of the tick it sits on', async () => {
		await render(SliderHarness, { value: 50, step: 50, ticks: RISK });
		expect(input().getAttribute('aria-valuetext')).toBe('Balanced');
		input().focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.element(slider()).toHaveAttribute('aria-valuetext', 'Bold');
	});

	it('fills the track to the value, and puts each tick under the thumb at its value', async () => {
		const screen = await render(SliderHarness, { value: 50, step: 50, ticks: RISK });
		expect(root().style.getPropertyValue('--sv-slider-fraction')).toBe('0.5');
		const track = input().getBoundingClientRect();
		const ticks = [...root().querySelectorAll<HTMLElement>('.sv-slider__tick')];
		expect(ticks).toHaveLength(3);
		// The thumb's centre at the middle value is the middle of the track.
		const middle = ticks[1]!.getBoundingClientRect().left;
		expect(Math.abs(middle - (track.left + track.width / 2))).toBeLessThan(1);
		await screen.rerender({ dir: 'rtl' });
		const first = ticks[0]!.getBoundingClientRect().left;
		expect(first).toBeGreaterThan(track.left + track.width / 2);
	});

	it('draws a tick on every step, at the values the input stops at', async () => {
		await render(SliderHarness, { value: 0.3, min: 0, max: 1, step: 0.1, ticks: true });
		expect(root().querySelectorAll('.sv-slider__tick')).toHaveLength(11);
		expect(input().value).toBe('0.3');
	});

	it('shows a rule’s message once the user lets go, and submits the value', async () => {
		await render(SliderHarness, {
			value: 50,
			rules: [(value: number) => value <= 80 || 'Keep it at 80 or under']
		});
		input().focus();
		await userEvent.keyboard('{End}');
		await expect.element(slider()).toHaveAttribute('aria-invalid', 'true');
		await expect.element(slider()).toHaveAccessibleDescription('Keep it at 80 or under');
		await userEvent.keyboard('{Home}');
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(shown('submitted')).toHaveTextContent('risk=0');
	});

	it('goes back to the value it started at on a form reset', async () => {
		await render(SliderHarness, { value: 30 });
		input().focus();
		await userEvent.keyboard('{End}');
		await expect.element(shown('value')).toHaveTextContent('number:100');
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(shown('value')).toHaveTextContent('number:30');
	});

	it('mutes the slider but not its hint when disabled', async () => {
		await render(SliderHarness, { value: 30, disabled: true, hint: 'Locked while you trade' });
		await expect.element(slider()).toBeDisabled();
		expect(getComputedStyle(input()).opacity).toBe('0.382');
		const hint = page.getByText('Locked while you trade').element();
		expect(getComputedStyle(hint).opacity).toBe('1');
	});
});
