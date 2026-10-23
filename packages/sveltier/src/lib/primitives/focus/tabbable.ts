// Elements that can be focusable at all; isTabbable() then checks the current state.
const CANDIDATES = [
	'a[href]',
	'area[href]',
	'button',
	'input:not([type="hidden"])',
	'select',
	'textarea',
	'iframe',
	'object',
	'embed',
	'audio[controls]',
	'video[controls]',
	'summary',
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]'
].join(',');

export type FocusableElement = HTMLElement | SVGElement;

/**
 * The element's place in the Tab order. `tabIndex` reports -1 for editing hosts and media
 * controls without a `tabindex` attribute, although Tab reaches them.
 */
function tabIndexOf(element: FocusableElement): number {
	if (element.hasAttribute('tabindex')) return element.tabIndex;
	const reachable =
		element instanceof HTMLElement &&
		(element.isContentEditable || element.matches('audio[controls],video[controls]'));
	return reachable ? 0 : element.tabIndex;
}

/** Whether `element` can be reached with Tab right now. */
export function isTabbable(element: Element): element is FocusableElement {
	if (!(element instanceof HTMLElement || element instanceof SVGElement)) return false;
	if (tabIndexOf(element) < 0 || element.matches(':disabled') || element.closest('[inert]')) {
		return false;
	}
	// The content of a closed <details> is not rendered, except its own summary.
	const details = element.closest('details:not([open])');
	if (details && !(element.localName === 'summary' && element.parentElement === details)) {
		return false;
	}
	return element.checkVisibility({ checkVisibilityCSS: true, visibilityProperty: true });
}

/**
 * The elements inside `container` that Tab reaches, in the order Tab reaches them: positive
 * `tabindex` first, then document order. Like browsers, a radio group contributes one stop,
 * its checked radio or else its first.
 */
export function tabbable(container: ParentNode): FocusableElement[] {
	const found: FocusableElement[] = [];
	const radios = new Map<string, HTMLInputElement>();
	for (const element of container.querySelectorAll(CANDIDATES)) {
		if (!isTabbable(element)) continue;
		if (element instanceof HTMLInputElement && element.type === 'radio' && element.name) {
			const group = `${element.form?.id ?? ''}|${element.name}`;
			const chosen = radios.get(group);
			if (!chosen) {
				radios.set(group, element);
				found.push(element);
			} else if (element.checked && !chosen.checked) {
				radios.set(group, element);
				found[found.indexOf(chosen)] = element;
			}
			continue;
		}
		found.push(element);
	}
	// Stable sort: positive tabindex in ascending order, then everything else as it was.
	const rank = (element: FocusableElement) => {
		const index = tabIndexOf(element);
		return index > 0 ? index : Infinity;
	};
	return found.sort((a, b) => rank(a) - rank(b));
}
