import { error } from '@sveltejs/kit';
import { GALLERY_PAGES, parseGalleryPage } from '#lib/gallery/pages.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => GALLERY_PAGES;

export const load: PageLoad = ({ params }) => {
	const gallery = parseGalleryPage(params);
	if (!gallery) error(404, 'Not found');
	return gallery;
};
