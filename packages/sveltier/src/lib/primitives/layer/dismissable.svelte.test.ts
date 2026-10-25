import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import LayerHarness from '../../../tests/fixtures/LayerHarness.svelte';

const log = () => page.getByTestId('log');
const field = (name: string) => page.getByRole('textbox', { name });
const button = (name: string) => page.getByRole('button', { name, exact: true });

function tap(target: Element, { click = true } = {}) {
	target.dispatchEvent(
		new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch', button: 0 })
	);
	if (click) target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('dismissable', () => {
	it('closes only the topmost layer on Escape', async () => {
		await render(LayerHarness, { innerOpen: true });
		await userEvent.click(field('Search'));
		await userEvent.keyboard('{Escape}');
		await expect.element(log()).toHaveTextContent('inner:escape');
		await expect.element(page.getByTestId('outer')).toBeInTheDocument();

		await userEvent.keyboard('{Escape}');
		await expect.element(log()).toHaveTextContent('inner:escape,outer:escape');
	});

	it('leaves Escape to an element inside that handles it', async () => {
		await render(LayerHarness, { innerOpen: true });
		await userEvent.type(field('Search'), 'eur');
		await userEvent.keyboard('{Escape}');
		await expect.element(field('Search')).toHaveValue('');
		expect(log().element().textContent).toBe('');

		await userEvent.keyboard('{Escape}');
		await expect.element(log()).toHaveTextContent('inner:escape');
	});

	it('closes only the topmost layer on a press outside it', async () => {
		await render(LayerHarness, { innerOpen: true });
		await userEvent.click(field('Outer field'));
		await expect.element(log()).toHaveTextContent('inner:outside');
		await expect.element(page.getByTestId('outer')).toBeInTheDocument();

		await userEvent.click(button('Outside'));
		await expect.element(log()).toHaveTextContent('inner:outside,outer:outside');
	});

	it('lets a press through a transient layer, which closes, to the layer beneath', async () => {
		await render(LayerHarness, { innerOpen: true, transient: true });
		await userEvent.click(button('Outside'));
		await expect.element(log()).toHaveTextContent('inner:outside,outer:outside');
	});

	it('gives Escape to a transient layer first', async () => {
		await render(LayerHarness, { innerOpen: true, transient: true });
		field('Outer field').element().focus();
		await userEvent.keyboard('{Escape}');
		await expect.element(log()).toHaveTextContent('inner:escape');
		await expect.element(page.getByTestId('outer')).toBeInTheDocument();
	});

	it('counts the elements in inside as inside, so a trigger can toggle', async () => {
		await render(LayerHarness);
		await userEvent.click(button('Trigger'));
		await expect.element(page.getByTestId('outer')).not.toBeInTheDocument();
		expect(log().element().textContent).toBe('');
	});

	it('ignores presses with other buttons', async () => {
		await render(LayerHarness);
		await userEvent.click(button('Outside'), { button: 'right' });
		await expect.element(page.getByTestId('outer')).toBeInTheDocument();
	});

	it('waits for the click on touch, so a scroll does not dismiss', async () => {
		await render(LayerHarness);
		tap(button('Outside').element(), { click: false });
		await expect.element(page.getByTestId('outer')).toBeInTheDocument();
		tap(button('Outside').element());
		await expect.element(log()).toHaveTextContent('outer:outside');
	});

	it('dismisses when focus leaves, with focusOutside', async () => {
		await render(LayerHarness, { innerOpen: true, focusOutside: true });
		await userEvent.click(field('Search'));
		field('Outer field').element().focus();
		await expect.element(log()).toHaveTextContent('inner:focus');
	});

	it('turns a reason off', async () => {
		await render(LayerHarness, { escape: false });
		await userEvent.click(field('Outer field'));
		await userEvent.keyboard('{Escape}');
		await expect.element(page.getByTestId('outer')).toBeInTheDocument();
	});

	it('picks up again with the layer below when the top one goes', async () => {
		await render(LayerHarness, { innerOpen: true });
		await userEvent.click(button('Outside'));
		await expect.element(log()).toHaveTextContent('inner:outside');
		await userEvent.click(button('Outside'));
		await expect.element(log()).toHaveTextContent('inner:outside,outer:outside');
	});
});
