#!/usr/bin/env node
// The `sveltier` command of @sveltier/ui. Installed with the package, so `npx sveltier init`
// runs the version the app uses, offline.
import { init } from './init.js';

const HELP = `Usage: npx sveltier init   (in the app's folder)

Points this app's coding agents at the docs of the installed @sveltier/ui:
  - writes a Sveltier section into the app's AGENTS.md (replaced in place on later runs),
  - adds an import of it to CLAUDE.md, the app's and the repository root's, where there is one,
  - installs the skill in .claude/skills/sveltier where there is a .claude folder.
In a workspace, run it in the app's folder (pnpm --filter <app> exec sveltier init): it finds
the repository root above it and writes each path from where it is read.`;

const [command] = process.argv.slice(2);

if (command === 'init') {
	for (const line of init(process.cwd())) console.log(line);
	console.log('Agents will now read the llms.txt and the docs inside the installed @sveltier/ui.');
} else {
	console.log(HELP);
	process.exit(command === undefined || command === '--help' || command === '-h' ? 0 : 1);
}
