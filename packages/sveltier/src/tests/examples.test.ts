import { join } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// Editors and coding agents read the declarations in node_modules before any docs, so every
// public component's props type and every public function shows how it is used: an @example
// in its TSDoc. Read from the entry point, the way a consumer meets them.
const ENTRY = join(import.meta.dirname, '..', 'lib', 'index.ts');

interface Export {
	name: string;
	kind: 'function' | 'props';
	tags: string[];
}

function publicExports(): Export[] {
	const program = ts.createProgram([ENTRY], {
		target: ts.ScriptTarget.ES2022,
		module: ts.ModuleKind.ESNext,
		moduleResolution: ts.ModuleResolutionKind.Bundler,
		strict: true,
		skipLibCheck: true,
		noEmit: true
	});
	const checker = program.getTypeChecker();
	const source = program.getSourceFile(ENTRY)!;
	const module = checker.getSymbolAtLocation(source)!;
	return checker.getExportsOfModule(module).flatMap((exported): Export[] => {
		const symbol =
			exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
		const name = exported.getName();
		const tags = symbol.getJsDocTags(checker).map((tag) => tag.name);
		if (symbol.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)) {
			return name.endsWith('Props') ? [{ name, kind: 'props', tags }] : [];
		}
		const declaration = symbol.valueDeclaration;
		if (!declaration || !/\.ts$/.test(declaration.getSourceFile().fileName)) return [];
		const callable =
			symbol.flags & ts.SymbolFlags.Function ||
			checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures().length > 0;
		return callable ? [{ name, kind: 'function', tags }] : [];
	});
}

describe('examples in the declarations', () => {
	const exports = publicExports();

	it('are looked for in the props types and the functions of the entry point', () => {
		expect(exports.filter((entry) => entry.kind === 'props').length).toBeGreaterThan(40);
		expect(exports.filter((entry) => entry.kind === 'function').length).toBeGreaterThan(20);
	});

	it('exist for every public props type and function', () => {
		const missing = exports
			.filter((entry) => !entry.tags.includes('example'))
			.map((entry) => `${entry.kind} ${entry.name}`);
		expect(missing).toEqual([]);
	});
});
