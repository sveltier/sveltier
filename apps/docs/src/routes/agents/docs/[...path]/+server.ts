import { error } from '@sveltejs/kit';
import { MARKDOWN_PAGES, pageMarkdown } from '#lib/docs/llms.js';
import type { EntryGenerator, RequestHandler } from './$types';

// One Markdown page per docs page with an API: agents/docs/components/button.md.
export const prerender = true;

export const entries: EntryGenerator = () => MARKDOWN_PAGES.map((path) => ({ path: `${path}.md` }));

export const GET: RequestHandler = ({ params }) => {
	const path = params.path.replace(/\.md$/, '');
	if (!MARKDOWN_PAGES.includes(path)) error(404, 'Not found');
	return new Response(pageMarkdown(path), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
};
