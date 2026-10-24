import { beforeEach } from 'vitest';

// Every browser test file runs in an iframe of its own, and a new frame does not hold the
// browser's focus. Firefox ignores focus() called in a frame without it, so a component that
// focuses something on mount, or a test that calls element.focus() before any keyboard
// input, would see focus land nowhere. Taking focus first matches a real page, which the user
// is already using.
beforeEach(() => {
	window.focus();
});
