import { describe, expect, it } from 'vitest';
import { combination } from './keymap.js';

const event = (init: Partial<KeyboardEvent>) =>
	({ ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, ...init }) as KeyboardEvent;

describe('combination', () => {
	it('names modifiers in a fixed order', () => {
		expect(combination(event({ key: 's', ctrlKey: true, metaKey: true, altKey: true }))).toBe(
			'Ctrl+Alt+Meta+s'
		);
		expect(combination(event({ key: 'Tab', shiftKey: true }))).toBe('Shift+Tab');
	});

	it('leaves Shift to the character it produced', () => {
		expect(combination(event({ key: '?', shiftKey: true }))).toBe('?');
	});

	it('names horizontal arrows by direction when one is given', () => {
		expect(combination(event({ key: 'ArrowRight' }))).toBe('ArrowRight');
		expect(combination(event({ key: 'ArrowRight' }), false)).toBe('ArrowForward');
		expect(combination(event({ key: 'ArrowRight' }), true)).toBe('ArrowBackward');
		expect(combination(event({ key: 'ArrowLeft' }), true)).toBe('ArrowForward');
		expect(combination(event({ key: 'ArrowUp' }), true)).toBe('ArrowUp');
	});
});
