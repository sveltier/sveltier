import type { ThemeVariable } from 'sveltier';

/** What each theme contract variable controls, for the docs. */
export const CONTRACT_DOCS: Record<ThemeVariable, string> = {
	'font-display': 'Family for headings and large figures.',
	'font-ui': 'Family for interface text: labels, buttons, body copy.',
	'font-data': 'Family for tabular data and code.',
	'weight-display': 'Weight of display text.',
	'tracking-display': 'Letter spacing of display text.',
	'label-size': 'Size of small labels and table headers.',
	'label-transform': 'Casing of small labels (none or uppercase).',
	'label-tracking': 'Letter spacing of small labels.',
	'button-transform': 'Casing of button text.',
	'button-tracking': 'Letter spacing of button text.',
	'radius-sm': 'Small radius: small parts such as skeleton lines and stepper buttons.',
	'radius-md':
		'Control radius: buttons, one-line fields, segmented controls, navigation rows. It may be a pill, so a box that grows with its content (a textarea, an alert) takes the smaller of radius-md and radius-lg.',
	'radius-lg': 'Surface radius: cards, and the most a box that grows with its content takes.',
	'radius-xl': 'Radius of large surfaces: dialogs, sheets.',
	'radius-full': 'Radius of round things: avatars, chips, badges, progress bars.',
	'surface-alpha': 'Opacity of surfaces; below 100% gives frosted panels.',
	'surface-blur': 'Backdrop blur behind translucent surfaces.',
	backdrop: 'Decorative image behind the page or a scope (gradients), or none.',
	ornament: 'Colour of decorative hairlines on surfaces, or transparent.',
	bevel: 'Colour of the 1px highlight on the top edge of raised surfaces.',
	shadow: 'Elevation shadow of raised surfaces.',
	ease: 'Easing curve for every transition.',
	'duration-fast': 'Duration of small state changes (hover, press).',
	'duration-normal': 'Duration of most transitions.',
	'duration-slow': 'Duration of larger movements (thumbs, panels).'
};
