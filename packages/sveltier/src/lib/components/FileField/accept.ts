const kindsOf = (accept: string) =>
	accept
		.split(',')
		.map((kind) => kind.trim())
		.filter(Boolean);

/**
 * The kinds `accept` names, as a person reads them: its extensions, or its media types when it
 * names none. `application/json,.json` is `['.json']`.
 */
export const shownKinds = (accept: string): string[] => {
	const kinds = kindsOf(accept);
	const extensions = kinds.filter((kind) => kind.startsWith('.'));
	return extensions.length > 0 ? extensions : kinds;
};

/**
 * Whether a file is of a kind `accept` names, as the file chooser reads it: a comma-separated
 * list of extensions (`.json`), media types (`application/json`) and wildcards (`image/*`).
 * An empty list accepts every file.
 *
 * @example
 * accepts(new File([], 'backup.json'), '.json,application/json'); // true
 */
export function accepts(file: File, accept: string): boolean {
	const kinds = kindsOf(accept).map((kind) => kind.toLowerCase());
	if (kinds.length === 0) return true;
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();
	return kinds.some((kind) => {
		if (kind.startsWith('.')) return name.endsWith(kind);
		if (kind.endsWith('/*')) return type.startsWith(kind.slice(0, -1));
		return type === kind;
	});
}
