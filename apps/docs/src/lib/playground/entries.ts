// The components the Playground offers, with what each needs to show something real. Their
// controls come from the API rows; overlays and inputs built from lists are left to their pages.
import {
	Alert,
	Amount,
	Avatar,
	Button,
	Card,
	Checkbox,
	Chip,
	Delta,
	Guilloche,
	Odometer,
	Pagination,
	ProgressCircular,
	ProgressLinear,
	SecureMask,
	Skeleton,
	Slider,
	Switch,
	TextField
} from '@sveltier/ui';
import type { Component } from 'svelte';
import ALERT from 'virtual:sveltier-api/AlertProps';
import AMOUNT from 'virtual:sveltier-api/AmountProps';
import AVATAR from 'virtual:sveltier-api/AvatarProps';
import BUTTON from 'virtual:sveltier-api/ButtonProps';
import CARD from 'virtual:sveltier-api/CardProps';
import CHECKBOX from 'virtual:sveltier-api/CheckboxProps';
import CHIP from 'virtual:sveltier-api/ChipProps';
import DELTA from 'virtual:sveltier-api/DeltaProps';
import GUILLOCHE from 'virtual:sveltier-api/GuillocheProps';
import ODOMETER from 'virtual:sveltier-api/OdometerProps';
import PAGINATION from 'virtual:sveltier-api/PaginationProps';
import PROGRESS_CIRCULAR from 'virtual:sveltier-api/ProgressCircularProps';
import PROGRESS_LINEAR from 'virtual:sveltier-api/ProgressLinearProps';
import SECURE_MASK from 'virtual:sveltier-api/SecureMaskProps';
import SKELETON from 'virtual:sveltier-api/SkeletonProps';
import SLIDER from 'virtual:sveltier-api/SliderProps';
import SWITCH from 'virtual:sveltier-api/SwitchProps';
import TEXT_FIELD from 'virtual:sveltier-api/TextFieldProps';
import type { ApiRow } from '../docs/api.js';
import { controlFor, type Control, type Value } from './controls.js';

/** Any component, with its props erased: the Playground passes them from controls. */
type AnyComponent = Component<Record<string, unknown>>;

export interface PlaygroundEntry {
	/** The component's name, as imported and as written in the URL. */
	name: string;
	group: 'Components' | 'Forms' | 'Finance';
	component: AnyComponent;
	/** Docs page of the component. */
	path: string;
	controls: Control[];
	/** Starting values, so the preview shows something real. */
	initial: Record<string, Value>;
	/** Text inside the component, for those that take children. */
	content?: string;
	/** A class for the preview only, never in the code, for components that fill their box. */
	frame?: string;
}

// Props that make no sense to toggle here: wiring, validation, and attributes of the element.
const SKIP = new Set([
	'class',
	'ref',
	'style',
	'name',
	'as',
	'error',
	'rules',
	'validateOn',
	'closeLabel'
]);

function entry(
	name: string,
	group: PlaygroundEntry['group'],
	component: unknown,
	rows: ApiRow[],
	path: string,
	extra: Partial<Pick<PlaygroundEntry, 'initial' | 'content' | 'frame'>> & { skip?: string[] } = {}
): PlaygroundEntry {
	const skip = new Set([...SKIP, ...(extra.skip ?? [])]);
	const controls = rows
		.filter((row) => !skip.has(row.name))
		.map(controlFor)
		.filter((control): control is Control => control !== undefined);
	return {
		name,
		group,
		component: component as AnyComponent,
		path,
		controls,
		initial: extra.initial ?? {},
		content: extra.content,
		frame: extra.frame
	};
}

export const ENTRIES: PlaygroundEntry[] = [
	entry('Button', 'Components', Button, BUTTON, 'components/button', {
		content: 'Continue',
		skip: ['icon']
	}),
	entry('Chip', 'Components', Chip, CHIP, 'components/chip', { content: 'Equities' }),
	entry('Alert', 'Components', Alert, ALERT, 'components/alert', {
		initial: { title: 'Payment declined' },
		content: 'The card ending 4471 was declined by the issuer.'
	}),
	entry('Avatar', 'Components', Avatar, AVATAR, 'components/avatar', {
		content: 'AM',
		skip: ['src', 'alt']
	}),
	entry('Card', 'Components', Card, CARD, 'components/card', {
		initial: { title: 'Savings', subtitle: 'Instant access' },
		content: 'Interest is paid on the first day of each month.'
	}),
	entry('Pagination', 'Components', Pagination, PAGINATION, 'components/pagination', {
		initial: { count: 12, page: 3 }
	}),
	entry('ProgressLinear', 'Components', ProgressLinear, PROGRESS_LINEAR, 'components/progress', {
		initial: { value: 62, label: 'Uploading statement' },
		frame: 'pg-frame-wide'
	}),
	entry(
		'ProgressCircular',
		'Components',
		ProgressCircular,
		PROGRESS_CIRCULAR,
		'components/progress',
		{ initial: { value: 62, label: 'Uploading statement' } }
	),
	entry('Skeleton', 'Components', Skeleton, SKELETON, 'components/skeleton', {
		initial: { lines: 3 },
		frame: 'pg-frame-wide'
	}),
	entry('TextField', 'Forms', TextField, TEXT_FIELD, 'forms/text-field', {
		initial: { label: 'Email', type: 'email' },
		frame: 'pg-frame-wide'
	}),
	entry('Switch', 'Forms', Switch, SWITCH, 'forms/switch', {
		initial: { label: 'Price alerts' },
		skip: ['value']
	}),
	entry('Checkbox', 'Forms', Checkbox, CHECKBOX, 'forms/checkbox', {
		initial: { label: 'I have read the key information document' },
		skip: ['value']
	}),
	entry('Slider', 'Forms', Slider, SLIDER, 'forms/slider', {
		initial: { label: 'Risk level', value: 40 },
		frame: 'pg-frame-wide'
	}),
	entry('Amount', 'Finance', Amount, AMOUNT, 'finance/amount', {
		initial: { value: 1284503.5, decimals: 2 },
		frame: 'pg-frame-figure'
	}),
	entry('Delta', 'Finance', Delta, DELTA, 'finance/delta', {
		initial: { value: 4183.2, decimals: 2 },
		frame: 'pg-frame-figure'
	}),
	entry('Odometer', 'Finance', Odometer, ODOMETER, 'finance/odometer', {
		initial: { value: 48210.55, decimals: 2 },
		frame: 'pg-frame-figure'
	}),
	entry('SecureMask', 'Finance', SecureMask, SECURE_MASK, 'finance/secure-mask', {
		initial: { label: 'IBAN', value: 'DE89370400440532013000', toggle: true },
		frame: 'pg-frame-figure'
	}),
	entry('Guilloche', 'Finance', Guilloche, GUILLOCHE, 'finance/guilloche', {
		frame: 'pg-frame-fill'
	})
];

/** The entry with this name, or the first one. */
export const findEntry = (name: string | undefined): PlaygroundEntry =>
	ENTRIES.find((item) => item.name === name) ?? (ENTRIES[0] as PlaygroundEntry);
