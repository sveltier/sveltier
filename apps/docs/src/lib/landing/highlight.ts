/**
 * A small highlighter for the replay's Svelte source: enough to colour tags, attributes, strings,
 * keywords and comments. Returns tokens per line, so the replay can stream line by line.
 */
export type TokenKind = 'tag' | 'attr' | 'string' | 'keyword' | 'comment' | 'punct' | 'text';

export interface Token {
	kind: TokenKind;
	text: string;
}

const RULES: Array<[TokenKind, RegExp]> = [
	['comment', /^(?:<!--.*?-->|\/\/.*)/],
	['string', /^(?:'[^']*'|"[^"]*"|`[^`]*`)/],
	[
		'keyword',
		/^(?:\{[#/:@](?:each|if|else|snippet|render|const)?|\b(?:import|from|const|let|type|as|export)\b)/
	],
	['tag', /^<\/?[A-Za-z][\w.]*/],
	['attr', /^[A-Za-z_][\w:-]*(?==)/],
	['text', /^[A-Za-z_$][\w$]*/],
	['punct', /^[{}()[\]<>/=;,.]/]
];

function tokenizeLine(line: string): Token[] {
	const tokens: Token[] = [];
	let rest = line;
	while (rest.length > 0) {
		let matched = false;
		for (const [kind, pattern] of RULES) {
			const match = pattern.exec(rest);
			if (match && match[0].length > 0) {
				push(tokens, kind, match[0]);
				rest = rest.slice(match[0].length);
				matched = true;
				break;
			}
		}
		if (!matched) {
			push(tokens, 'text', rest[0]!);
			rest = rest.slice(1);
		}
	}
	return tokens;
}

function push(tokens: Token[], kind: TokenKind, text: string) {
	const last = tokens.at(-1);
	if (last && last.kind === kind && kind === 'text') last.text += text;
	else tokens.push({ kind, text });
}

/** Tokens for each line; tabs become two spaces so lines stay narrow. */
export function highlight(source: string): Token[][] {
	return source.replace(/\t/g, '  ').replace(/\s+$/, '').split('\n').map(tokenizeLine);
}
