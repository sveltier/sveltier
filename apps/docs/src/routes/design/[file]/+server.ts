import { error } from '@sveltejs/kit';
import { DESIGN_PACKS, designMarkdown } from '#lib/docs/design-md.js';
import type { EntryGenerator, RequestHandler } from './$types';

// The DESIGN.md of each theme pack, design/monolith.md. The docs build also copies them into
// the npm package, where `npx sveltier init` reads them.
export const prerender = true;

export const entries: EntryGenerator = () => DESIGN_PACKS.map((id) => ({ file: `${id}.md` }));

export const GET: RequestHandler = ({ params }) => {
	const id = DESIGN_PACKS.find((pack) => params.file === `${pack}.md`);
	if (!id) error(404, 'Not found');
	return new Response(designMarkdown(id), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
};
