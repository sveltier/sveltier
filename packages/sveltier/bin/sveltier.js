#!/usr/bin/env node
// The `sveltier` command of @sveltier/ui. Installed with the package, so `npx sveltier init`
// runs the version the app uses, offline.
import { init } from './init.js';

const HELP = `Usage: npx sveltier init

Points this app's coding agents at the docs of the installed @sveltier/ui:
  - writes a Sveltier section into AGENTS.md (replaced in place on later runs),
  - adds @AGENTS.md to CLAUDE.md when there is one,
  - installs the skill in .claude/skills/sveltier when there is a .claude folder.`;

const [command] = process.argv.slice(2);

if (command === 'init') {
	for (const line of init(process.cwd())) console.log(line);
	console.log('Agents will now read node_modules/@sveltier/ui/llms.txt and the docs next to it.');
} else {
	console.log(HELP);
	process.exit(command === undefined || command === '--help' || command === '-h' ? 0 : 1);
}
