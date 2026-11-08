import { defineTheme } from '@sveltier/ui';
import { monolithLight } from '@sveltier/ui/themes/monolith';

// Extends Monolith light; everything you leave out comes from it.
export const brand = defineTheme(
	{
		colors: {
			primary: 'oklch(0.52 0.16 255)', // on-primary is computed for you
			brand: 'oklch(0.62 0.17 35)' // custom colour: --sv-color-brand, --sv-on-brand
		},
		variables: {
			'radius-md': '13px',
			'font-display': "'Fraunces Variable', Georgia, serif"
		}
	},
	monolithLight
);
