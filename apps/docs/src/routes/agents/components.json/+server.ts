import { componentsManifest } from '#lib/docs/llms.js';

// Every component and primitive with its props, read from the package's types.
export const prerender = true;

export function GET() {
	return new Response(JSON.stringify(componentsManifest(), null, '\t'), {
		headers: { 'content-type': 'application/json; charset=utf-8' }
	});
}
