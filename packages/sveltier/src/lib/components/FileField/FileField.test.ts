import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import { accepts } from './accept.js';
import FileField from './FileField.svelte';

// Runs in Node: the markup the server sends before any script runs, and the accept rule.
describe('FileField on the server', () => {
	it('renders the labelled file input over a box that says what to do', () => {
		const { body } = render(FileField, {
			props: { label: 'Backup', id: 'backup', name: 'backup', accept: '.json', required: true }
		});
		expect(body).toContain('<label class="sv-field__label" for="backup" id="backup-label">Backup');
		expect(body).toMatch(/<input[^>]*name="backup"[^>]*id="backup"/);
		expect(body).toMatch(/<input[^>]*type="file"[^>]*accept="\.json"/);
		expect(body).toMatch(/<input[^>]*required/);
		expect(body).toContain('Choose a file');
		expect(body).toContain('No file chosen');
		expect(body).not.toContain('aria-invalid');
	});

	it('renders a drop zone that says files can be dropped', () => {
		const { body } = render(FileField, {
			props: { label: 'Statements', multiple: true, drop: true }
		});
		expect(body).toContain('sv-file-field--drop');
		expect(body).toContain('Choose files');
		expect(body).toContain('or drop them here');
		expect(body).toMatch(/<input[^>]*multiple/);
	});
});

describe('accepts', () => {
	const file = (name: string, type: string) => new File([], name, { type });

	it('reads extensions, media types and wildcards, as the chooser does', () => {
		expect(accepts(file('backup.JSON', 'application/json'), '.json')).toBe(true);
		expect(accepts(file('backup.txt', 'application/json'), 'application/json')).toBe(true);
		expect(accepts(file('photo.png', 'image/png'), 'image/*')).toBe(true);
		expect(accepts(file('notes.txt', 'text/plain'), '.json, application/json')).toBe(false);
		expect(accepts(file('anything.bin', ''), ' ')).toBe(true);
	});
});
