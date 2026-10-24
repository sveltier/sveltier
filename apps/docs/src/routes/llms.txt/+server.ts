import { pageHref } from '#lib/docs/href.js';
import { llmsIndex } from '#lib/docs/llms.js';

export const prerender = true;

export function GET() {
	return new Response(llmsIndex(pageHref), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
