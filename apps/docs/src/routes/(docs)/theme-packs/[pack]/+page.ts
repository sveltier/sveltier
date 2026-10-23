import { error } from '@sveltejs/kit';
import { PACKS } from '#lib/site.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => PACKS.map((pack) => ({ pack: pack.id }));

export const load: PageLoad = ({ params }) => {
	const pack = PACKS.find((p) => p.id === params.pack);
	if (!pack) error(404, `There is no theme pack called "${params.pack}".`);
	return { pack };
};
