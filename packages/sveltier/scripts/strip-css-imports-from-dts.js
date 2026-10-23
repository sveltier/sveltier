// svelte-package copies `import './button.css'` from component scripts into the generated
// declaration files. Type declarations should not reference stylesheets: consumers on
// TypeScript 6 (`noUncheckedSideEffectImports` on by default) without `skipLibCheck` would
// get errors, and attw reports them as unresolved.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '..', 'dist');
const CSS_IMPORT = /^import\s+['"][^'"]+\.css['"];?\r?\n/gm;

for (const entry of fs.readdirSync(dist, { recursive: true, withFileTypes: true })) {
	if (!entry.isFile() || !entry.name.endsWith('.d.ts')) continue;
	const file = path.join(entry.parentPath, entry.name);
	const source = fs.readFileSync(file, 'utf8');
	const stripped = source.replace(CSS_IMPORT, '');
	if (stripped !== source) fs.writeFileSync(file, stripped);
}
