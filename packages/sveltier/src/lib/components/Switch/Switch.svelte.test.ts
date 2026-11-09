import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import SwitchHarness from '../../../tests/fixtures/SwitchHarness.svelte';
import RefusedChoices from '../../../tests/fixtures/RefusedChoices.svelte';

const control = () => page.getByRole('switch', { name: 'Sign in with biometrics' });
const input = () => control().element() as HTMLInputElement;
const shown = (testId: string) => page.getByTestId(testId);
const track = () => input().nextElementSibling as HTMLElement;
const thumb = () => track().querySelector('.sv-switch__thumb') as HTMLElement;
// The thumb's move along the x axis, in px: positive is to the right.
const moved = () => {
	const translate = getComputedStyle(thumb()).translate;
	return translate === 'none' ? 0 : parseFloat(translate);
};

describe('Switch', () => {
	it('is a native checkbox with the switch role, whose state binds both ways', async () => {
		const screen = await render(SwitchHarness);
		expect(input().type).toBe('checkbox');
		await page.getByText('Sign in with biometrics').click();
		await expect.element(control()).toBeChecked();
		await expect.element(shown('checked')).toHaveTextContent('true');
		await screen.rerender({ checked: false });
		await expect.element(control()).not.toBeChecked();
	});

	it('calls onchange with its new state when the user toggles it, not when code sets it', async () => {
		const onchange = vi.fn();
		const screen = await render(SwitchHarness, { onchange });
		await page.getByText('Sign in with biometrics').click();
		expect(onchange).toHaveBeenLastCalledWith(true);
		await page.getByText('Sign in with biometrics').click();
		expect(onchange).toHaveBeenLastCalledWith(false);
		await screen.rerender({ checked: true });
		await expect.element(control()).toBeChecked();
		expect(onchange).toHaveBeenCalledTimes(2);
	});

	it('toggles with Space, and draws the focus ring on the track', async () => {
		await render(SwitchHarness);
		await userEvent.keyboard('{Tab}');
		await expect.element(control()).toHaveFocus();
		await userEvent.keyboard(' ');
		await expect.element(shown('checked')).toHaveTextContent('true');
		expect(getComputedStyle(track()).outlineStyle).toBe('solid');
	});

	it('moves the thumb to the end when on, and to the start of the line in RTL', async () => {
		const screen = await render(SwitchHarness, { checked: true });
		await expect.poll(moved).toBeGreaterThan(0);
		await screen.rerender({ dir: 'rtl' });
		await expect.poll(moved).toBeLessThan(0);
		await screen.rerender({ checked: false });
		await expect.poll(moved).toBe(0);
	});

	it('is wider than tall by φ, and its row is at least 24px tall', async () => {
		await render(SwitchHarness, { size: 'xs' });
		const box = track().getBoundingClientRect();
		expect(box.width / box.height).toBeCloseTo(1.618, 1);
		const row = input().closest('label') as HTMLElement;
		expect(row.getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
	});

	it('must be on when required, shows why at once, and submits its value once on', async () => {
		await render(SwitchHarness, { required: true, checked: true, value: 'yes' });
		await control().click();
		await expect.element(control()).toHaveAttribute('aria-invalid', 'true');
		await expect.element(control()).toHaveAccessibleDescription('Required');
		// checkValidity() refuses the form without the browser's bubble, which in Firefox on Linux
		// swallows the next click, even in the next test.
		expect(input().form?.checkValidity()).toBe(false);
		await control().click();
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(shown('submitted')).toHaveTextContent('biometrics=yes');
	});

	it('goes back to the state it started in on a form reset', async () => {
		await render(SwitchHarness, { checked: true });
		await control().click();
		await expect.element(shown('checked')).toHaveTextContent('false');
		await page.getByRole('button', { name: 'Reset' }).click();
		await expect.element(shown('checked')).toHaveTextContent('true');
	});

	it('cannot be toggled while disabled', async () => {
		await render(SwitchHarness, { disabled: true });
		await expect.element(control()).toBeDisabled();
		await page.getByText('Sign in with biometrics').click({ force: true });
		await expect.element(shown('checked')).toHaveTextContent('false');
	});
});

describe('Switch refused', () => {
	it("shows its owner's state again when a binding's setter keeps it, and calls no onchange", async () => {
		const screen = await render(RefusedChoices);
		const venues = page.getByRole('switch', { name: 'Venues' });
		await page.getByText('Venues').click();
		await expect.element(venues).toBeChecked();
		await expect.element(page.getByTestId('state')).toHaveTextContent('true false true 7 gb');
		await expect.element(page.getByTestId('changes')).toHaveTextContent('');
		await screen.rerender({ locked: false });
		await page.getByText('Venues').click();
		await expect.element(venues).not.toBeChecked();
		await expect.element(page.getByTestId('state')).toHaveTextContent('false false true 7 gb');
		await expect.element(page.getByTestId('changes')).toHaveTextContent('venues');
	});
});
