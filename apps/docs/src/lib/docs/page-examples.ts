// The code samples of each docs page, read from the page itself, so the docs for agents carry
// every sample the site shows, under the heading of its section, and never fall behind it.
const PAGES = import.meta.glob<string>('/src/routes/**/+page.svelte', {
	query: '?raw',
	import: 'default',
	eager: true
});
const MODULES = import.meta.glob<Record<string, unknown>>('../snippets/*.ts', { eager: true });

/** Every code sample, by the name the pages import it under. */
const SNIPPETS = new Map(
	Object.values(MODULES).flatMap((module) =>
		Object.entries(module).filter(
			(entry): entry is [string, string] => typeof entry[1] === 'string'
		)
	)
);

export interface PageExample {
	/** The heading of the section the sample is in. */
	section: string;
	/** The sample's caption on the page, usually a file name. */
	title?: string;
	lang: string;
	code: string;
}

const text = (html: string) =>
	html
		.replace(/<[^>]+>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
const attribute = (tag: string, name: string) => new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1];

/** The samples of the page at a docs path, in page order, with the section each is in. */
export function pageExamples(path: string): PageExample[] {
	const source = Object.entries(PAGES).find(([file]) =>
		file.endsWith(`)/${path}/+page.svelte`)
	)?.[1];
	if (!source) return [];
	const examples: PageExample[] = [];
	let section = '';
	for (const match of source.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>|<Code\b([^>]*?)\/>/g)) {
		if (match[1] !== undefined) {
			section = text(match[1]);
			continue;
		}
		const tag = match[2]!;
		const name = /\bcode=\{(\w+)\}/.exec(tag)?.[1];
		const code = name && SNIPPETS.get(name);
		if (!code) continue;
		examples.push({
			section,
			title: attribute(tag, 'title'),
			lang: attribute(tag, 'lang') ?? 'svelte',
			code: code.trimEnd()
		});
	}
	return examples;
}
