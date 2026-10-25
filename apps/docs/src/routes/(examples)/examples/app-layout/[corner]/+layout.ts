import { error } from '@sveltejs/kit';
import { CORNERS } from '#lib/docs/app-layout/example.js';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params }) => {
	const corner = CORNERS.find((name) => name === params.corner);
	if (!corner) error(404, 'Not found');
	return { corner };
};
