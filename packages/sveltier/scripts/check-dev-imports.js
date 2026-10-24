// The development checks are imported as `#dev`, which package.json maps by condition: the
// checks under "development", stand-ins that do nothing otherwise. svelte-package rewrites
// `#` imports that have a `default` target into relative paths, which would pin one of the two
// for good, so the mapping has none. This fails the build if the import was rewritten anyway.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '..', 'dist');
const REWRITTEN = /from\s+['"][^'"]*\/dev\/(?:on|off)\.js['"]/;
const KEPT = /from\s+['"]#dev['"]/;

let kept = 0;
const rewritten = [];
for (const entry of fs.readdirSync(dist, { recursive: true, withFileTypes: true })) {
	if (!entry.isFile() || !/\.(js|svelte)$/.test(entry.name)) continue;
	const file = path.join(entry.parentPath, entry.name);
	if (file.startsWith(path.join(dist, 'dev'))) continue;
	const source = fs.readFileSync(file, 'utf8');
	if (REWRITTEN.test(source)) rewritten.push(path.relative(dist, file));
	if (KEPT.test(source)) kept++;
}

for (const name of ['on.js', 'off.js']) {
	if (!fs.existsSync(path.join(dist, 'dev', name))) rewritten.push(`dev/${name} is missing`);
}
if (rewritten.length > 0 || kept === 0) {
	console.error(
		`#dev imports were rewritten or are missing in dist:\n  ${rewritten.join('\n  ') || 'no file imports #dev'}`
	);
	process.exit(1);
}
console.log(`#dev kept in ${kept} files`);
