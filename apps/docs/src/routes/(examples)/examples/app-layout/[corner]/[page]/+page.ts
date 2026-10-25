import { error } from '@sveltejs/kit';
import { CORNERS, PAGES } from '#lib/docs/app-layout/example.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	CORNERS.flatMap((corner) => PAGES.map((item) => ({ corner, page: item.id })));

export const load: PageLoad = ({ params }) => {
	const current = PAGES.find((item) => item.id === params.page);
	if (!current) error(404, 'Not found');
	return { title: current.title };
};
