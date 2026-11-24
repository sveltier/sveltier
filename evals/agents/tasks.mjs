// The UI tasks the agent is given. Each prompt names the labels and texts the check looks for,
// so the check reads the page by role and name, as a person would, whatever code the agent wrote.
import { expect } from '@playwright/test';

/** @typedef {{ id: string, route: string, prompt: string, check: (page: import('@playwright/test').Page) => Promise<void> }} Task */

/** @type {Task[]} */
export const TASKS = [
	{
		id: 'theme-toggle',
		route: '/',
		prompt:
			'Make the home page (`/`) show a heading "Dashboard" and a button "Toggle theme" that switches the whole app between light and dark.',
		async check(page) {
			await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
			// What the page looks like: the colours of the root and the body, and the colour scheme.
			// A theme may paint either element, so a change in any of them counts.
			const background = () =>
				page.evaluate(() =>
					[document.documentElement, document.body]
						.map((element) => {
							const style = getComputedStyle(element);
							return `${style.backgroundColor} ${style.color} ${style.colorScheme}`;
						})
						.join(' | ')
				);
			const before = await background();
			await page.getByRole('button', { name: 'Toggle theme' }).click();
			await expect.poll(background).not.toBe(before);
		}
	},
	{
		id: 'signup-form',
		route: '/signup',
		prompt:
			'Add a page at `/signup` with a sign-up form: an "Email" field (required, must be an email address), a "Password" field (required, at least 8 characters) and a "Create account" button. Submitting with invalid fields shows an error message on each invalid field. Submitting valid fields shows a toast notification "Account created".',
		async check(page) {
			await page.getByRole('button', { name: 'Create account' }).click();
			await expect(page.getByLabel('Email', { exact: false }).first()).toHaveAttribute(
				'aria-invalid',
				'true'
			);
			await page.getByLabel('Email', { exact: false }).first().fill('ada@example.com');
			await page.getByLabel('Password', { exact: false }).first().fill('correct horse');
			await page.getByRole('button', { name: 'Create account' }).click();
			await expect(page.getByText('Account created').first()).toBeVisible();
		}
	},
	{
		id: 'sortable-table',
		route: '/invoices',
		prompt:
			'Add a page at `/invoices` with a table of these invoices: INV-1 Northwind 4280, INV-2 Blue Harbor 1150, INV-3 Atlas 9600, INV-4 Lumen 2375.5, INV-5 Copperleaf 640. Columns: Invoice, Client, Amount. Amounts are in US dollars, formatted as currency (for example $4,280.00). Clicking the "Amount" column header sorts the rows by amount.',
		async check(page) {
			const table = page.getByRole('table');
			await expect(table).toBeVisible();
			const rows = table.locator('tbody tr');
			await expect(rows).toHaveCount(5);
			await expect(table).toContainText('$4,280.00');
			const first = () => rows.first().innerText();
			const before = await first();
			await table.getByRole('columnheader', { name: /Amount/ }).click();
			const sorted = await first();
			const after =
				sorted === before
					? (await table.getByRole('columnheader', { name: /Amount/ }).click(), await first())
					: sorted;
			expect(after).toMatch(/\$640\.00|\$9,600\.00/);
		}
	},
	{
		id: 'confirm-dialog',
		route: '/files',
		prompt:
			'Add a page at `/files` listing three files: report.pdf, photo.png and notes.txt. Each file has a "Delete" button. Pressing it opens a confirmation dialog titled "Delete file?" with "Cancel" and "Delete" buttons; "Delete" removes that file from the list, "Cancel" keeps it.',
		async check(page) {
			await expect(page.getByText('report.pdf').first()).toBeVisible();
			await page.getByRole('button', { name: 'Delete' }).first().click();
			const dialog = page.getByRole('dialog', { name: 'Delete file?' });
			await expect(dialog).toBeVisible();
			await dialog.getByRole('button', { name: 'Cancel' }).click();
			await expect(dialog).toBeHidden();
			await expect(page.getByText('report.pdf').first()).toBeVisible();
			await page.getByRole('button', { name: 'Delete' }).first().click();
			await page
				.getByRole('dialog', { name: 'Delete file?' })
				.getByRole('button', { name: 'Delete' })
				.click();
			await expect(page.getByText('report.pdf')).toHaveCount(0);
			await expect(page.getByText('photo.png').first()).toBeVisible();
		}
	},
	{
		id: 'app-shell',
		route: '/',
		prompt:
			'Give the app a frame: a top bar titled "Acme" and a navigation drawer with links to Home (`/`), Reports (`/reports`) and Settings (`/settings`). Each of the three pages shows a heading with its name. The link to the current page is marked as the current page.',
		async check(page) {
			await page.getByRole('link', { name: 'Reports' }).first().click();
			await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Reports' }).first()).toHaveAttribute(
				'aria-current',
				'page'
			);
			await expect(page.getByText('Acme').first()).toBeVisible();
		}
	},
	{
		id: 'country-combobox',
		route: '/profile',
		prompt:
			'Add a page at `/profile` with a "Country" field where the user types to search a list of countries (Vietnam, Japan, France, Brazil, Kenya) and picks one. Below the field, show "Selected: " followed by the chosen country.',
		async check(page) {
			const field = page.getByRole('combobox', { name: 'Country' });
			await field.click();
			await field.pressSequentially('Jap');
			await page.getByRole('option', { name: 'Japan' }).click();
			await expect(page.getByText('Selected: Japan').first()).toBeVisible();
		}
	},
	{
		id: 'tabs',
		route: '/account',
		prompt:
			'Add a page at `/account` with three tabs, Overview, Billing and Security. Each tab\'s panel says "Overview panel", "Billing panel" or "Security panel".',
		async check(page) {
			await page.getByRole('tab', { name: 'Billing' }).click();
			await expect(page.getByRole('tabpanel')).toContainText('Billing panel');
			await page.getByRole('tab', { name: 'Billing' }).press('ArrowRight');
			await expect(page.getByRole('tab', { name: 'Security' })).toBeFocused();
		}
	},
	{
		id: 'date-field',
		route: '/booking',
		prompt:
			'Add a page at `/booking` with a "Check-in" date field that only accepts dates in December 2026. Below it, show "Check-in: " followed by the chosen date as YYYY-MM-DD.',
		async check(page) {
			const field = page
				.getByRole('textbox', { name: 'Check-in' })
				.or(page.getByLabel('Check-in'))
				.first();
			await field.fill('2026-12-15');
			await field.press('Tab');
			await expect(page.getByText('Check-in: 2026-12-15').first()).toBeVisible();
		}
	},
	{
		id: 'row-menu',
		route: '/projects',
		prompt:
			'Add a page at `/projects` listing three projects: Apollo, Gemini and Mercury. Each project has an "Actions" menu button with the items Rename, Duplicate and Delete. Duplicate adds a copy named "<name> (copy)"; Delete removes the project. Rename can do nothing for now.',
		async check(page) {
			await page
				.getByRole('button', { name: /Actions/ })
				.first()
				.click();
			await expect(page.getByRole('menuitem', { name: 'Duplicate' })).toBeVisible();
			await page.getByRole('menuitem', { name: 'Duplicate' }).click();
			await expect(page.getByText('Apollo (copy)').first()).toBeVisible();
		}
	},
	{
		id: 'wallet-undo',
		route: '/wallet',
		prompt:
			'Add a page at `/wallet` that shows a balance of $1,250.00 (US dollars, formatted as currency) and a "Send $50" button. Sending lowers the balance by 50 and shows a toast "Sent $50.00" with an "Undo" button that puts the money back.',
		async check(page) {
			await expect(page.getByText('$1,250.00').first()).toBeVisible();
			await page.getByRole('button', { name: 'Send $50' }).click();
			await expect(page.getByText('$1,200.00').first()).toBeVisible();
			await expect(page.getByText('Sent $50.00').first()).toBeVisible();
			await page.getByRole('button', { name: 'Undo' }).click();
			await expect(page.getByText('$1,250.00').first()).toBeVisible();
		}
	}
];

export function promptFor(task) {
	return `This is a SvelteKit app with the UI library @sveltier/ui installed.

${task.prompt}

Build the UI with @sveltier/ui components. When you are done, run \`npm run check\` and fix what it reports.`;
}
