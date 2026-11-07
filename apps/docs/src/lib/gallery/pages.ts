// The gallery's pages: one for each mode, accent and density, at a stable address. Plain data
// with no imports, so the visual tests can read it outside the app.

export const GALLERY_MODES = ['light', 'dark'] as const;
/** The pack's own primary, and a light amber that turns `on-primary` to dark ink. */
export const GALLERY_ACCENTS = ['brand', 'amber'] as const;
export const GALLERY_DENSITIES = ['compact', 'default', 'comfortable'] as const;

export type GalleryMode = (typeof GALLERY_MODES)[number];
export type GalleryAccent = (typeof GALLERY_ACCENTS)[number];
export type GalleryDensity = (typeof GALLERY_DENSITIES)[number];

export interface GalleryPage {
	mode: GalleryMode;
	accent: GalleryAccent;
	density: GalleryDensity;
}

export const GALLERY_PAGES: GalleryPage[] = GALLERY_MODES.flatMap((mode) =>
	GALLERY_ACCENTS.flatMap((accent) =>
		GALLERY_DENSITIES.map((density) => ({ mode, accent, density }))
	)
);

/** The path of one gallery page, without a leading slash. */
export const galleryPath = ({ mode, accent, density }: GalleryPage): string =>
	`examples/gallery/${mode}/${accent}/${density}`;

/** Reads route parameters into a gallery page, or undefined when one is not a known value. */
export function parseGalleryPage(params: Record<string, string>): GalleryPage | undefined {
	const mode = GALLERY_MODES.find((value) => value === params.mode);
	const accent = GALLERY_ACCENTS.find((value) => value === params.accent);
	const density = GALLERY_DENSITIES.find((value) => value === params.density);
	return mode && accent && density ? { mode, accent, density } : undefined;
}
