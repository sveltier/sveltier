// Copies the docs for coding agents from the prerendered site into the npm package, so the
// tarball holds the reference of its own version: llms.txt (linking the package's Markdown
// pages), llms-full.txt, components.json and docs/<group>/<page>.md. Runs after `vite build`.
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const source = join(import.meta.dirname, '..', 'build', 'agents');
const target = join(import.meta.dirname, '..', '..', '..', 'packages', 'sveltier');
const FILES = ['llms.txt', 'llms-full.txt', 'components.json'];

if (!existsSync(source)) {
	console.error(`[agent-docs] ${source} is missing. Run vite build first.`);
	process.exit(1);
}

for (const name of [...FILES, 'docs']) rmSync(join(target, name), { recursive: true, force: true });
for (const name of FILES.slice(0, 2)) cpSync(join(source, name), join(target, name));
cpSync(join(source, 'docs'), join(target, 'docs'), { recursive: true });

// The manifest names the version it describes, read from the package it ships in.
const { version } = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8'));
const { package: name, ...manifest } = JSON.parse(
	readFileSync(join(source, 'components.json'), 'utf8')
);
writeFileSync(
	join(target, 'components.json'),
	`${JSON.stringify({ package: name, version, ...manifest }, null, '\t')}\n`
);

console.log(`[agent-docs] Copied the agent docs of ${name}@${version} into ${target}.`);
