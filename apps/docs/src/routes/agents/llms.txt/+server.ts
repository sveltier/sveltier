import { llmsIndex, packageLink } from '#lib/docs/llms.js';

// The index shipped in the npm package: its links open the package's own Markdown pages.
export const prerender = true;

export function GET() {
	return new Response(llmsIndex(packageLink), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
