/** The modifiers a shortcut can name. `Mod` is ⌘ on Apple platforms and Ctrl elsewhere. */
export const SHORTCUT_MODIFIERS = ['Mod', 'Ctrl', 'Alt', 'Shift', 'Meta'] as const;

/** Whether the platform is Apple's, where `Mod` is the ⌘ key. */
export function isApple(): boolean {
	return typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

/**
 * Whether a key press is `shortcut`: modifiers and a key joined with `+`, such as `'Mod+K'` or
 * `'Ctrl+Shift+P'`. The modifiers must be exactly those named; the key ignores case, and a
 * letter or a digit also matches by its place on the keyboard (Alt changes the character on
 * Apple keyboards).
 */
export function matchesShortcut(event: KeyboardEvent, shortcut: string, apple: boolean): boolean {
	const parts = shortcut.split('+').map((part) => part.trim());
	const key = parts.pop()?.toLowerCase();
	if (!key) return false;
	const named = new Set(parts.map((part) => part.toLowerCase()));
	const mod = named.has('mod');
	const wanted = {
		ctrl: named.has('ctrl') || (mod && !apple),
		meta: named.has('meta') || (mod && apple),
		alt: named.has('alt'),
		shift: named.has('shift')
	};
	if (
		event.ctrlKey !== wanted.ctrl ||
		event.metaKey !== wanted.meta ||
		event.altKey !== wanted.alt ||
		event.shiftKey !== wanted.shift
	) {
		return false;
	}
	if (event.key.toLowerCase() === key) return true;
	return (
		/^[a-z0-9]$/.test(key) &&
		event.code === (/\d/.test(key) ? `Digit${key}` : `Key${key.toUpperCase()}`)
	);
}
