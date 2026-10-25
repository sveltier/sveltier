// API tables from the library's types. Reads the declaration files that svelte-package writes
// to packages/sveltier/dist and offers every exported interface and type alias as a list of
// rows (name, type, default, description): `import rows from 'virtual:sveltier-api/ButtonProps'`.
// One module per type, so a page bundles only the tables it shows. Descriptions and defaults
// come from the JSDoc in the source, which is the single source of truth.
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import type { Plugin } from 'vite';

export interface ApiRow {
	name: string;
	type: string;
	default?: string;
	description: string;
}

const PREFIX = 'virtual:sveltier-api/';
const entry = fileURLToPath(new URL('../../../packages/sveltier/dist/index.d.ts', import.meta.url));
const FORMAT =
	ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
const external = (fileName: string) => /[\\/]node_modules[\\/]/.test(fileName);

// Attributes inherited from svelte/elements are not part of a component's own API.
const isOwn = (symbol: ts.Symbol) =>
	symbol.declarations?.some((declaration) => !external(declaration.getSourceFile().fileName)) ??
	false;

// A union of literals, in the order it was declared: `'flat' | 'tonal' | …`. Covers aliases
// written as a union of literals and aliases written as `(typeof LIST)[number]`.
function literals(checker: ts.TypeChecker, alias: ts.Symbol | undefined): string | undefined {
	const node = alias?.declarations?.find(ts.isTypeAliasDeclaration)?.type;
	if (!node) return;
	if (ts.isUnionTypeNode(node)) {
		const simple = node.types.every(
			(member) => ts.isLiteralTypeNode(member) || member.kind === ts.SyntaxKind.BooleanKeyword
		);
		return simple ? node.types.map((member) => member.getText()).join(' | ') : undefined;
	}
	if (ts.isIndexedAccessTypeNode(node)) {
		const list = checker.getTypeFromTypeNode(node.objectType);
		if (!checker.isTupleType(list)) return;
		const members = checker
			.getTypeArguments(list as ts.TypeReference)
			.map((element) => checker.typeToString(element).replace(/^"(.*)"$/, "'$1'"));
		// A list that holds both booleans reads as `boolean`, as it would in a written union.
		if (members.includes('true') && members.includes('false')) {
			members.splice(members.indexOf('true'), 1, 'boolean');
			members.splice(members.indexOf('false'), 1);
		}
		return members.join(' | ');
	}
}

function mentionsTypeParameter(checker: ts.TypeChecker, node: ts.Node): boolean {
	if (
		ts.isTypeReferenceNode(node) &&
		checker.getTypeFromTypeNode(node).flags & ts.TypeFlags.TypeParameter
	) {
		return true;
	}
	return (
		ts.forEachChild(node, (child) => mentionsTypeParameter(checker, child) || undefined) ?? false
	);
}

// The type as declared (`Snippet`, `Color`, `ClassValue | null`), with literal unions spelled
// out; the resolved type where the declaration uses a type parameter (`ref`).
function typeText(checker: ts.TypeChecker, property: ts.Symbol, at: ts.Node): string {
	const declaration = property.declarations?.[0];
	const node = declaration && ts.isPropertySignature(declaration) ? declaration.type : undefined;
	if (node && !mentionsTypeParameter(checker, node)) {
		const referenced = ts.isTypeReferenceNode(node)
			? checker.getSymbolAtLocation(node.typeName)
			: undefined;
		const alias =
			referenced && referenced.flags & ts.SymbolFlags.Alias
				? checker.getAliasedSymbol(referenced)
				: referenced;
		return literals(checker, alias) ?? node.getText();
	}
	const type = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(property, at));
	const text = checker.typeToString(type, at, FORMAT);
	// getNonNullableType also drops null, which is part of what `ref` can hold.
	return node && /\bnull\b/.test(node.getText()) ? `${text} | null` : text;
}

function rows(checker: ts.TypeChecker, symbol: ts.Symbol, at: ts.Node): ApiRow[] {
	const type = checker.getDeclaredTypeOfSymbol(symbol);
	return checker
		.getPropertiesOfType(type)
		.filter(isOwn)
		.map((property) => {
			const fallback = property
				.getJsDocTags(checker)
				.find((tag) => tag.name === 'default')
				?.text?.map((part) => part.text)
				.join('');
			return {
				name: property.getName(),
				type: typeText(checker, property, at),
				...(fallback ? { default: fallback } : {}),
				description: ts.displayPartsToString(property.getDocumentationComment(checker)).trim()
			};
		});
}

interface Extracted {
	/** Every exported interface and type alias of the package, by name. */
	tables: Record<string, ApiRow[]>;
	/** The JSDoc of each of them. */
	descriptions: Record<string, string>;
	/** The declaration files they were read from. */
	files: string[];
}

function extract(file = entry): Extracted {
	const program = ts.createProgram([file], {
		target: ts.ScriptTarget.ES2022,
		module: ts.ModuleKind.ESNext,
		moduleResolution: ts.ModuleResolutionKind.Bundler,
		strict: true,
		skipLibCheck: true,
		noEmit: true
	});
	const checker = program.getTypeChecker();
	const source = program.getSourceFile(file);
	const module = source && checker.getSymbolAtLocation(source);
	if (!source || !module) {
		throw new Error(
			`[sveltier-api] No declarations at ${file}. Build the package first: pnpm --filter @sveltier/ui build`
		);
	}
	const tables: Record<string, ApiRow[]> = {};
	const descriptions: Record<string, string> = {};
	for (const exported of checker.getExportsOfModule(module)) {
		const symbol =
			exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
		if (!(symbol.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias))) continue;
		const table = rows(checker, symbol, source);
		if (table.length === 0) continue;
		tables[exported.getName()] = table;
		descriptions[exported.getName()] = ts
			.displayPartsToString(symbol.getDocumentationComment(checker))
			.trim();
	}
	const files = program
		.getSourceFiles()
		.map((sourceFile) => sourceFile.fileName)
		.filter((name) => !external(name));
	return { tables, descriptions, files };
}

/** Every exported interface and type alias of the package, by name. */
export function extractApi(file = entry): Record<string, ApiRow[]> {
	return extract(file).tables;
}

const ALL = 'virtual:sveltier-api';

export function sveltierApi(): Plugin {
	// Building the type program takes a moment, so it is built once and again only when the
	// package's declarations change (the dev script rebuilds them in watch mode).
	let api: Extracted | undefined;
	return {
		name: 'sveltier-api',
		resolveId: (id) => (id === ALL || id.startsWith(PREFIX) ? `\0${id}` : undefined),
		load(id) {
			if (!id.startsWith(`\0${ALL}`)) return;
			const name = id.slice(`\0${PREFIX}`.length);
			// The dev script's watcher starts with a full rebuild of the package, and types read in
			// the middle of it lack some exports: a missing name reads the declarations again.
			if (!api || (id !== `\0${ALL}` && !api.tables[name])) api = extract();
			for (const file of api.files) this.addWatchFile(file);
			// Every table at once, for the machine-readable docs built on the server.
			if (id === `\0${ALL}`) {
				return [
					`export const tables = ${JSON.stringify(api.tables)};`,
					`export const descriptions = ${JSON.stringify(api.descriptions)};`
				].join('\n');
			}
			const table = api.tables[name];
			if (!table) throw new Error(`[sveltier-api] The package exports no type named ${name}.`);
			return `export default ${JSON.stringify(table)};`;
		},
		watchChange(id) {
			if (api?.files.includes(id)) api = undefined;
		}
	};
}
