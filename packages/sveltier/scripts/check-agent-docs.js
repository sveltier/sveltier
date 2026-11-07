// Fails unless the tarball holds the docs for coding agents of this very version: the docs
// build writes them (apps/docs, `pnpm build`), and a release must never ship them stale or
// without them. Run after building the docs; CI and the release workflow both do.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const REQUIRED = [
	'llms.txt',
	'llms-full.txt',
	'components.json',
	'docs/components/button.md',
	'docs/forms/text-field.md',
	'agents/sveltier.md',
	'skills/sveltier/SKILL.md',
	'bin/sveltier.js',
	'bin/init.js'
];

const fail = (message) => {
	console.error(`[check-agent-docs] ${message}`);
	process.exit(1);
};

const manifest = join(root, 'components.json');
if (!existsSync(manifest)) fail('components.json is missing. Build the docs first: pnpm build.');

const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const built = JSON.parse(readFileSync(manifest, 'utf8')).version;
if (built !== version) {
	fail(`The agent docs describe ${built}, the package is ${version}. Build the docs again.`);
}

const [packed] = JSON.parse(
	execSync('npm pack --dry-run --json --ignore-scripts', { cwd: root, encoding: 'utf8' })
);
const files = new Set(packed.files.map((file) => file.path));
const missing = REQUIRED.filter((file) => !files.has(file));
if (missing.length) fail(`The tarball lacks ${missing.join(', ')}.`);

console.log(
	`[check-agent-docs] ${packed.name}@${version} ships its agent docs (${files.size} files).`
);
