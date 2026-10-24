import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import Slider from './Slider.svelte';

// Runs in Node: the markup the server sends before any script runs.
describe('Slider on the server', () => {
	it('renders a labelled range input with its bounds, step and value', () => {
		const { body } = render(Slider, {
			props: { label: 'Risk', id: 'risk', name: 'risk', min: 0, max: 200, step: 10, value: 60 }
		});
		expect(body).toContain('<label class="sv-slider__label" for="risk">Risk</label>');
		expect(body).toMatch(/<input[^>]*type="range"/);
		expect(body).toMatch(/<input[^>]*min="0"[^>]*max="200"[^>]*step="10"/);
		expect(body).toMatch(/<input[^>]*value="60"/);
		expect(body).toContain('--sv-slider-fraction: 0.3');
	});

	it('shows the value beside the label before any script runs', () => {
		const { body } = render(Slider, {
			props: { label: 'Allocation', value: 25, format: (value: number) => `${value}%` }
		});
		expect(body).toContain('<span class="sv-slider__value" aria-hidden="true">25%</span>');
		expect(body).toMatch(/<input[^>]*aria-valuetext="25%"/);
	});
});
