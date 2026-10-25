import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import AccordionHarness from '../../../tests/fixtures/AccordionHarness.svelte';

// Runs in Node: the markup the server sends before any script runs, which already works.
describe('Accordion on the server', () => {
	it('renders the open section open, the sections under one name', () => {
		const { body } = render(AccordionHarness, { props: { initial: 'limits' } });
		const sections = body.match(/<details[^>]*>/g) ?? [];
		expect(sections).toHaveLength(3);
		expect(sections.filter((tag) => /\sopen(=|\s|>)/.test(tag))).toHaveLength(1);
		expect(sections[1]).toMatch(/\sopen/);
		const names = sections.map((tag) => /name="([^"]+)"/.exec(tag)?.[1]);
		expect(new Set(names).size).toBe(1);
		expect(names[0]).toBeTruthy();
		expect(body).toContain('aria-disabled="true"');
	});

	it('leaves the sections unnamed with multiple', () => {
		const { body } = render(AccordionHarness, { props: { multiple: true } });
		expect(body).not.toMatch(/<details[^>]*name=/);
	});
});
