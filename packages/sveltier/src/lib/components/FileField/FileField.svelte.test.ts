import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import FileFieldHarness from '../../../tests/fixtures/FileFieldHarness.svelte';

// Not exact: a required field's label ends in an asterisk.
const input = () => page.getByLabelText('Backup', { exact: false });
const element = () => input().element() as HTMLInputElement;
const root = () => element().closest('.sv-file-field') as HTMLElement;
const shown = () => root().querySelector('.sv-file-field__shown')!.textContent?.trim();
const testId = (id: string) => page.getByTestId(id);
const json = (name = 'backup.json') =>
	new File(['{"orders":[]}'], name, { type: 'application/json' });

describe('FileField', () => {
	it('is the labelled file input, its box saying what to do and what was chosen', async () => {
		await render(FileFieldHarness);
		expect(element().type).toBe('file');
		expect(shown()).toBe('Choose a file No file chosen');
		await userEvent.upload(input(), json());
		await expect.element(testId('files')).toHaveTextContent('backup.json');
		await expect.element(testId('changes')).toHaveTextContent('backup.json');
		expect(shown()).toBe('Choose a file backup.json');
		// The words in the box are the input's to say.
		expect(root().querySelector('.sv-file-field__shown')!.getAttribute('aria-hidden')).toBe('true');
	});

	it('covers the box with the input, so a press anywhere chooses', async () => {
		await render(FileFieldHarness);
		const box = root().querySelector('.sv-field__box')!.getBoundingClientRect();
		const area = element().getBoundingClientRect();
		// Inside the box's border.
		expect(box.width - area.width).toBeLessThanOrEqual(2);
		expect(box.height - area.height).toBeLessThanOrEqual(2);
	});

	it('submits the files under its name', async () => {
		await render(FileFieldHarness);
		await userEvent.upload(input(), json());
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(testId('submitted')).toHaveTextContent('backup.json');
	});

	it('clears with its button, gives focus back to the input, and reports it', async () => {
		await render(FileFieldHarness);
		await userEvent.upload(input(), json());
		await page.getByRole('button', { name: 'Clear the file' }).click();
		await expect.element(testId('files')).toHaveTextContent('none');
		await expect.element(testId('changes')).toHaveTextContent('backup.json|');
		expect(element().files).toHaveLength(0);
		await expect.element(input()).toHaveFocus();
		await expect
			.element(page.getByRole('button', { name: 'Clear the file' }))
			.not.toBeInTheDocument();
	});

	it('counts several files', async () => {
		await render(FileFieldHarness, { multiple: true });
		expect(shown()).toBe('Choose files No file chosen');
		await userEvent.upload(input(), [json('a.json'), json('b.json')]);
		await expect.element(testId('files')).toHaveTextContent('a.json,b.json');
		expect(shown()).toBe('Choose files 2 files');
		await expect.element(page.getByRole('button', { name: 'Clear the files' })).toBeVisible();
	});

	it('says a file of another kind is an error, as a drop is not filtered', async () => {
		await render(FileFieldHarness, { accept: '.json,application/json', validateOn: 'input' });
		await userEvent.upload(input(), new File(['x'], 'notes.txt', { type: 'text/plain' }));
		await expect
			.element(input())
			.toHaveAccessibleDescription('Choose a file of type .json,application/json');
		await userEvent.upload(input(), json());
		await expect.element(input()).not.toHaveAttribute('aria-invalid');
	});

	it('blocks a form without a file when required', async () => {
		await render(FileFieldHarness, { required: true });
		expect(element().required).toBe(true);
		expect(element().validationMessage).toBe('Required');
		await userEvent.upload(input(), json());
		await expect.poll(() => element().validationMessage).toBe('');
	});

	it('puts files set from code in the input, without calling onchange', async () => {
		const screen = await render(FileFieldHarness);
		await screen.rerender({ files: [json('restored.json')] });
		await expect.poll(() => element().files?.[0]?.name).toBe('restored.json');
		expect(shown()).toBe('Choose a file restored.json');
		await page.getByRole('button', { name: 'Send' }).click();
		await expect.element(testId('submitted')).toHaveTextContent('restored.json');
		expect(testId('changes').element().textContent).toBe('');
		await screen.rerender({ files: [] });
		await expect.poll(() => element().files?.length).toBe(0);
	});

	it('clears the input when code empties the files, without a DataTransfer', async () => {
		// An app's unit tests may run in a DOM without one, and clear the field from code.
		const screen = await render(FileFieldHarness);
		await userEvent.upload(input(), json());
		await expect.element(testId('files')).toHaveTextContent('backup.json');
		vi.stubGlobal('DataTransfer', undefined);
		try {
			await screen.rerender({ files: [] });
			await expect.poll(() => element().files?.length).toBe(0);
			expect(shown()).toBe('Choose a file No file chosen');
		} finally {
			vi.unstubAllGlobals();
		}
	});

	it('marks the box while a file is dragged over it, and grows into a drop zone', async () => {
		await render(FileFieldHarness, { drop: true });
		expect(shown()).toBe('Choose a file or drop it here');
		const box = root().querySelector('.sv-field__box')!.getBoundingClientRect();
		expect(box.height).toBeGreaterThan(80);
		element().dispatchEvent(new DragEvent('dragenter', { bubbles: true }));
		await expect.poll(() => root().classList.contains('sv-file-field--over')).toBe(true);
		element().dispatchEvent(new DragEvent('dragleave', { bubbles: true }));
		await expect.poll(() => root().classList.contains('sv-file-field--over')).toBe(false);
	});

	it('read-only, shows the files with no clear button', async () => {
		await render(FileFieldHarness, { readonly: true, files: [json()] });
		await expect.poll(shown).toBe('Choose a file backup.json');
		await expect
			.element(page.getByRole('button', { name: 'Clear the file' }))
			.not.toBeInTheDocument();
		// The press that would open the chooser does nothing.
		const press = new MouseEvent('click', { bubbles: true, cancelable: true });
		element().dispatchEvent(press);
		expect(press.defaultPrevented).toBe(true);
	});
});
