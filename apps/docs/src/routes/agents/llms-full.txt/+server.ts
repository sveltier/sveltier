import { llmsFull, siteLink } from '#lib/docs/llms.js';

// The full reference shipped in the npm package, with absolute links to the site.
export const prerender = true;

export function GET() {
	return new Response(llmsFull(siteLink), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
