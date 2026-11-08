// Fails when a docs code sample is a Svelte component written as a string. Samples are files in
// src/lib/examples, shown with ?raw, so svelte-check compiles every one; a string is never checked.
// SvelteKit route files stay strings: they import ./$types, which resolves only in a route.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// A folder to scan instead can be given, for testing the check itself.
const folder = process.argv[2] ?? join(import.meta.dirname, '../src/lib/snippets');

/** The text of every template literal in `source`, raw (escapes as written). */
function literals(source) {
	const found = [];
	let quote = null;
	for (let i = 0; i < source.length; i++) {
		const c = source[i];
		if (quote) {
			if (c === '\\') i++;
			else if (c === quote) quote = null;
			continue;
		}
		if (c === '/' && source[i + 1] === '/') {
			i = source.indexOf('\n', i);
			if (i < 0) break;
		} else if (c === "'" || c === '"') {
			quote = c;
		} else if (c === '`') {
			let end = i + 1;
			while (source[end] !== '`') end += source[end] === '\\' ? 2 : 1;
			found.push(source.slice(i + 1, end));
			i = end;
		}
	}
	return found;
}

const problems = [];
for (const file of readdirSync(folder).filter((name) => name.endsWith('.ts'))) {
	for (const text of literals(readFileSync(join(folder, file), 'utf8'))) {
		// Built from the pack's name, so not a file of its own.
		if (text.includes('${')) continue;
		const header = /^\s*<!--(.*?)-->\s*/.exec(text);
		const body = header ? text.slice(header[0].length) : text.trimStart();
		if (!body.startsWith('<script')) continue;
		if (header?.[1]?.includes('src/routes/')) continue;
		problems.push(`${file}: ${text.trimStart().split('\n')[0]}`);
	}
}

if (problems.length > 0) {
	console.error(
		`A Svelte code sample is a string, so svelte-check never compiles it. Move each into a file in ` +
			`src/lib/examples/<group>/ and re-export it with ?raw, as the others are:\n` +
			problems.map((problem) => `  ${problem}`).join('\n')
	);
	process.exit(1);
}
console.log('Docs code samples: every Svelte sample is a checked file.');
