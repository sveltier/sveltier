import { FLAT } from '#lib/docs/nav.js';
import type { RequestHandler } from './$types';

export const prerender = true;

/** Every page people land on: the home page and each page of the navigation. */
export const GET: RequestHandler = ({ url }) => {
	const paths = ['', ...new Set(FLAT.map((item) => item.path))];
	const entries = paths.map((path) => `  <url><loc>${url.origin}/${path}</loc></url>`);
	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries,
		'</urlset>',
		''
	].join('\n');
	return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
