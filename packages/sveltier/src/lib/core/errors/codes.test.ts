import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ERROR_CODES } from './codes.js';
import { ERRORS_URL, sveltierError } from './errors.js';

const LIB = join(import.meta.dirname, '..', '..');

/** The library's source files, without tests and without the registry itself. */
function sources(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return sources(path);
		const source = /\.(ts|svelte)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name);
		return source && entry.name !== 'codes.ts' ? [path] : [];
	});
}

const used = new Set(
	sources(LIB).flatMap((file) =>
		[...readFileSync(file, 'utf8').matchAll(/'(SV\d{4})'/g)].map((match) => match[1]!)
	)
);

describe('error codes', () => {
	it('documents every code the library throws', () => {
		const documented = Object.keys(ERROR_CODES);
		expect([...used].filter((code) => !documented.includes(code))).toEqual([]);
	});

	it('throws every code it documents', () => {
		expect(Object.keys(ERROR_CODES).filter((code) => !used.has(code))).toEqual([]);
	});

	it('explains each code in full sentences', () => {
		for (const [code, entry] of Object.entries(ERROR_CODES)) {
			expect(code).toMatch(/^SV[1-5]\d{3}$/);
			expect(entry.title).not.toMatch(/\.$/);
			expect(entry.cause).toMatch(/\.$/);
			expect(entry.fix).toMatch(/\.$/);
		}
	});

	it('formats a thrown message with the code first and the link last', () => {
		const error = sveltierError('SV3001', 'Portal: no element matches "#nowhere".');
		expect(error.message).toBe(
			`[sveltier SV3001] Portal: no element matches "#nowhere". ${ERRORS_URL}#SV3001`
		);
	});
});
