// The component gallery's theme: Monolith in light or dark, with the pack's own primary or a
// light amber one. People and agents open the gallery to see the library at a glance, and the
// visual tests compare it against reference screenshots.
import { defineTheme, monolithDark, monolithLight, type ThemeDefinition } from '@sveltier/ui';
import { themeStyle } from '../builder/builder.js';
import type { GalleryAccent, GalleryMode } from './pages.js';

const AMBER = 'oklch(0.78 0.11 75)';

export function galleryTheme(mode: GalleryMode, accent: GalleryAccent): ThemeDefinition {
	const base = mode === 'dark' ? monolithDark : monolithLight;
	return accent === 'amber' ? defineTheme({ colors: { primary: AMBER } }, base) : base;
}

/** The theme as custom properties for the gallery's scope. */
export const galleryStyle = (mode: GalleryMode, accent: GalleryAccent): string =>
	themeStyle(galleryTheme(mode, accent));
