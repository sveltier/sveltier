/**
 * Whether a file is of a kind `accept` names, as the file chooser reads it: a comma-separated
 * list of extensions (`.json`), media types (`application/json`) and wildcards (`image/*`).
 * An empty list accepts every file.
 *
 * @example
 * accepts(new File([], 'backup.json'), '.json,application/json'); // true
 */
export function accepts(file: File, accept: string): boolean {
	const kinds = accept
		.split(',')
		.map((kind) => kind.trim().toLowerCase())
		.filter(Boolean);
	if (kinds.length === 0) return true;
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();
	return kinds.some((kind) => {
		if (kind.startsWith('.')) return name.endsWith(kind);
		if (kind.endsWith('/*')) return type.startsWith(kind.slice(0, -1));
		return type === kind;
	});
}
