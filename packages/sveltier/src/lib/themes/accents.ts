/** An accent preset: the hue that tints every neutral, plus the accent for each base. */
export interface Accent {
	/** Hue (degrees) shared by all neutrals, so greys lean warm or cool with the accent. */
	hue: number;
	dark: { primary: string; 'on-primary': string };
	light: { primary: string; 'on-primary': string };
}

/** Warm gold. The default accent. */
export const champagne: Accent = {
	hue: 78,
	dark: { primary: 'oklch(0.80 0.090 84)', 'on-primary': 'oklch(0.20 0.020 80)' },
	light: { primary: 'oklch(0.51 0.090 72)', 'on-primary': 'oklch(0.985 0.005 80)' }
};

/** Patinated copper green. */
export const verdigris: Accent = {
	hue: 190,
	dark: { primary: 'oklch(0.78 0.085 188)', 'on-primary': 'oklch(0.19 0.020 190)' },
	light: { primary: 'oklch(0.47 0.075 188)', 'on-primary': 'oklch(0.985 0.005 190)' }
};
