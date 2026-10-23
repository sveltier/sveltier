import { describe, expect, it, vi } from 'vitest';
import { spring } from './motion.js';

// The user prefers reduced motion for this whole file.
vi.mock('svelte/motion', async (importOriginal) => ({
	...(await importOriginal<typeof import('svelte/motion')>()),
	prefersReducedMotion: { current: true }
}));

describe('spring under reduced motion', () => {
	it('lands on its target at once', () => {
		const value = spring(0, 'gentle');
		value.target = 100;
		expect(value.current).toBe(100);
	});

	it('still animates when asked for explicitly', () => {
		const value = spring(0, 'gentle');
		value.set(100, { instant: false });
		expect(value.current).toBe(0);
	});
});
