import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

// TypeScript names a plain union alias in its errors: `variant="flat"` on a TextField used to
// say only "not assignable to type 'FieldVariant'". A union read from a const list,
// `(typeof LIST)[number]`, prints its members, so the error itself tells a developer or a
// coding agent which values exist. Literal types are therefore never written as plain unions.
const LIB = join(import.meta.dirname, '..', 'lib');
const PLAIN_UNION =
	/\btype (\w+)(?:<[^>]*>)? =(?:\s*\|?\s*(?:'[^']*'|"[^"]*"|boolean|true|false))+\s*;/g;

function sources(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return sources(path);
		return /\.(ts|svelte)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name) ? [path] : [];
	});
}

describe('literal types', () => {
	it('recognises a plain union, on one line or several', () => {
		const samples = [
			"export type A = 'x' | 'y';",
			"type B =\n\t| 'x'\n\t| 'y';",
			"export type C = boolean | 'none' | 'sm';"
		];
		for (const sample of samples) expect(sample.match(PLAIN_UNION)).not.toBeNull();
		expect('export type D = (typeof LIST)[number];'.match(PLAIN_UNION)).toBeNull();
	});

	it('are read from const lists, so type errors list the valid values', () => {
		const plain = sources(LIB).flatMap((file) =>
			[...readFileSync(file, 'utf8').matchAll(PLAIN_UNION)].map(
				(match) => `${relative(LIB, file)}: ${match[1]}`
			)
		);
		expect(plain).toEqual([]);
	});
});
