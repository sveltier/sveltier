// The examples the agent replay builds. Each preview is the component itself and the code shown is its
// source, so the two cannot disagree.
import type { Component } from 'svelte';
import Deploy from './Deploy.svelte';
import deploySource from './Deploy.svelte?raw';
import Invite from './Invite.svelte';
import inviteSource from './Invite.svelte?raw';
import Portfolio from './Portfolio.svelte';
import portfolioSource from './Portfolio.svelte?raw';

export type ExampleId = 'portfolio' | 'invite' | 'deploy';

export interface Example {
	id: ExampleId;
	/** Label in the example switcher. */
	label: string;
	/** File the agent writes. */
	file: string;
	/** What the person asks for. */
	prompt: string;
	/** Components the agent chooses, for the step list. */
	picks: string;
	component: Component;
	source: string;
}

export const EXAMPLES: readonly Example[] = [
	{
		id: 'portfolio',
		label: 'Portfolio',
		file: 'Portfolio.svelte',
		prompt:
			'Build a portfolio card: the total value, today’s change, a period switcher and the three holdings. Make it feel premium.',
		picks: 'Card, Chip, SegmentedControl, List, Avatar',
		component: Portfolio,
		source: portfolioSource
	},
	{
		id: 'invite',
		label: 'Team invite',
		file: 'Invite.svelte',
		prompt:
			'Make a card to invite teammates: who is on the team with their roles, a note that invites expire, and a send button.',
		picks: 'Card, List, Avatar, Chip, Alert, Button',
		component: Invite,
		source: inviteSource
	},
	{
		id: 'deploy',
		label: 'Deploy',
		file: 'Deploy.svelte',
		prompt:
			'Show the production deployment: live status, rollout progress, the checks that passed, and buttons to promote or roll back.',
		picks: 'Card, Tabs, ProgressLinear, List, Icon, Alert',
		component: Deploy,
		source: deploySource
	}
];
