<script lang="ts">
	// Every component in its main states, in one theme scope and one density. Nothing here
	// depends on the time, the date or chance, so screenshots of it are stable.
	import {
		Accordion,
		Alert,
		Amount,
		AmountInput,
		Avatar,
		Badge,
		Breadcrumbs,
		Button,
		ButtonGroup,
		Card,
		Checkbox,
		Chip,
		DefaultsProvider,
		Delta,
		Guilloche,
		Icon,
		INTENT_COLORS,
		LedgerRow,
		List,
		ListItem,
		NativeSelect,
		NumberField,
		Odometer,
		OtpInput,
		Pagination,
		PriceInput,
		ProgressCircular,
		ProgressLinear,
		RadioGroup,
		Receipt,
		SecureMask,
		SegmentedControl,
		Select,
		Skeleton,
		Slider,
		Stepper,
		Switch,
		Table,
		Tabs,
		Textarea,
		TextField,
		SIZES,
		VARIANTS,
		type TableColumn
	} from '@sveltier/ui';
	import { resolve } from '$app/paths';
	import { galleryStyle } from './gallery.js';
	import type { GalleryPage } from './pages.js';

	let { mode, accent, density }: GalleryPage = $props();

	const PLUS = 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z';
	const money = { style: 'currency' } as const;
	const market: string = 'btc';

	interface Position {
		symbol: string;
		quantity: number;
		price: number;
		change: number;
	}
	const positions: Position[] = [
		{ symbol: 'AAPL', quantity: 120, price: 227.48, change: 1.24 },
		{ symbol: 'MSFT', quantity: 40, price: 415.1, change: -0.62 },
		{ symbol: 'NVDA', quantity: 300, price: 138.07, change: 3.05 }
	];
	const columns: TableColumn<Position>[] = [
		{ key: 'symbol', label: 'Symbol', rowHeader: true },
		{ key: 'quantity', label: 'Quantity' },
		{ key: 'price', label: 'Price' },
		{ id: 'change', label: 'Change', cell: change }
	];
</script>

{#snippet change(position: Position)}
	<Delta value={position.change / 100} format={{ style: 'percent', minimumFractionDigits: 2 }} />
{/snippet}

<div class="gallery" style={galleryStyle(mode, accent)} data-testid="gallery">
	<DefaultsProvider defaults={{ global: { density } }}>
		<header class="gallery__head">
			<h1>Sveltier gallery</h1>
			<p>Monolith {mode}, {accent} accent, {density} density.</p>
		</header>

		<section class="gallery__section" aria-labelledby="g-actions">
			<h2 id="g-actions">Actions</h2>
			<div class="gallery__row">
				{#each VARIANTS as variant (variant)}
					<Button {variant}>{variant}</Button>
				{/each}
			</div>
			<div class="gallery__row">
				{#each [...INTENT_COLORS, 'neutral' as const] as color (color)}
					<Button {color} variant="tonal">{color}</Button>
				{/each}
			</div>
			<div class="gallery__row">
				{#each SIZES as size (size)}
					<Button {size}>Size {size}</Button>
				{/each}
				<Button disabled>Disabled</Button>
				<Button loading>Loading</Button>
				<Button icon aria-label="Add"><Icon path={PLUS} /></Button>
			</div>
			<div class="gallery__row">
				<ButtonGroup aria-label="Export">
					<Button variant="outlined">CSV</Button>
					<Button variant="outlined">PDF</Button>
				</ButtonGroup>
				<SegmentedControl
					aria-label="Range"
					options={[
						{ value: '1W', label: '1W' },
						{ value: '1M', label: '1M' },
						{ value: '1Y', label: '1Y' }
					]}
					value="1M"
				/>
			</div>
		</section>

		<section class="gallery__section" aria-labelledby="g-display">
			<h2 id="g-display">Display</h2>
			<div class="gallery__row">
				{#each INTENT_COLORS as color (color)}
					<Chip {color}>{color}</Chip>
				{/each}
				<Chip selected>Selected</Chip>
				<Chip closable>Closable</Chip>
				<Chip disabled>Disabled</Chip>
			</div>
			<div class="gallery__row">
				{#each SIZES as size (size)}
					<Avatar {size}>AM</Avatar>
				{/each}
				<Badge content={3} label="unread messages">
					<Avatar color="primary">SV</Avatar>
				</Badge>
				<Badge dot label="online">
					<Avatar>JD</Avatar>
				</Badge>
			</div>
			<div class="gallery__grid">
				<Alert type="info" title="Market closes at 16:00">Orders after the close wait.</Alert>
				<Alert type="success" title="Transfer sent">It arrives today.</Alert>
				<Alert type="warning" title="Low balance">Below your alert of $500.</Alert>
				<Alert type="error" title="Payment declined" closable>The issuer said no.</Alert>
			</div>
			<div class="gallery__grid">
				<div class="gallery__stack">
					<ProgressLinear value={62} label="Uploading statement" />
					<Skeleton lines={2} />
				</div>
				<div class="gallery__row">
					<ProgressCircular value={62} label="Uploading" />
					<ProgressCircular value={25} size="lg" label="Verifying" />
				</div>
			</div>
		</section>

		<section class="gallery__section" aria-labelledby="g-forms">
			<h2 id="g-forms">Forms</h2>
			<div class="gallery__grid">
				<TextField label="Email" type="email" placeholder="you@example.com" />
				<TextField label="Name" value="Alex Morgan" hint="As on your ID" />
				<TextField label="IBAN" value="DE89" error="An IBAN has 15 to 34 characters." />
				<TextField label="Reference" value="Locked" disabled />
				<NumberField label="Amount" value={1250} />
				<NativeSelect
					label="Country"
					options={[
						{ value: 'gb', label: 'United Kingdom' },
						{ value: 'jp', label: 'Japan' }
					]}
					value="jp"
				/>
				<Select
					label="Market"
					options={[
						{ value: 'btc', label: 'BTC/USDT' },
						{ value: 'eth', label: 'ETH/USDT' }
					]}
					value={market}
				/>
				<Textarea label="Note" value="Rent for November" />
				<PriceInput label="Limit price" tick={0.01} value={61.25} />
				<AmountInput label="Quantity" step={100} min={100} max={2350} value={1100} />
				<OtpInput label="Verification code" value="4821" />
				<Slider label="Risk level" value={40} />
			</div>
			<div class="gallery__grid">
				<div class="gallery__stack">
					<Checkbox label="Checked" checked />
					<Checkbox label="Unchecked" />
					<Checkbox label="Indeterminate" indeterminate />
					<Checkbox label="Disabled" disabled />
				</div>
				<div class="gallery__stack">
					<Switch label="On" checked />
					<Switch label="Off" />
					<Switch label="Disabled" disabled checked />
				</div>
				<RadioGroup
					label="Pay out"
					options={[
						{ value: 1, label: 'Every day' },
						{ value: 7, label: 'Every Monday', hint: 'Fewer, larger transfers' },
						{ value: 30, label: 'Monthly', disabled: true }
					]}
					value={7}
				/>
			</div>
		</section>

		<section class="gallery__section" aria-labelledby="g-navigation">
			<h2 id="g-navigation">Navigation</h2>
			<Breadcrumbs
				items={[
					{ label: 'Accounts', href: resolve('/') },
					{ label: 'Savings', href: resolve('components/breadcrumbs') },
					{ label: 'Statement' }
				]}
			/>
			<Tabs
				aria-label="Account"
				items={[
					{ value: 'overview', label: 'Overview' },
					{ value: 'activity', label: 'Activity' },
					{ value: 'documents', label: 'Documents' }
				]}
				value="overview"
			>
				{#snippet panel(item)}
					<p>The {item.label.toLowerCase()} of your savings account.</p>
				{/snippet}
			</Tabs>
			<Stepper
				aria-label="Transfer"
				items={[
					{ value: 'details', label: 'Details', description: 'Amount and account' },
					{ value: 'review', label: 'Review' },
					{ value: 'confirm', label: 'Confirm' }
				]}
				value="review"
			/>
			<Pagination count={12} page={3} />
		</section>

		<section class="gallery__section" aria-labelledby="g-data">
			<h2 id="g-data">Data</h2>
			<Table aria-label="Positions" items={positions} {columns} />
			<div class="gallery__grid">
				<Card title="Savings" subtitle="Instant access">
					<p>Interest is paid monthly.</p>
					{#snippet actions()}
						<Button variant="tonal">Add money</Button>
						<Button variant="text">Statement</Button>
					{/snippet}
				</Card>
				<List>
					<ListItem title="Current account" subtitle="•••• 4821" />
					<ListItem title="Savings" subtitle="Instant access" active />
					<ListItem title="Closed account" disabled />
				</List>
			</div>
			<Accordion
				items={[
					{ value: 'fees', title: 'What does a transfer cost?' },
					{ value: 'timing', title: 'How long does it take?' }
				]}
				value="fees"
			>
				{#snippet panel(item)}
					<p>Answers about {item.value}.</p>
				{/snippet}
			</Accordion>
		</section>

		<section class="gallery__section" aria-labelledby="g-finance">
			<h2 id="g-finance">Finance</h2>
			<div class="gallery__row gallery__figures">
				<Amount value={1284503.5} format={money} />
				<Delta value={4183.2} decimals={2} />
				<Delta value={-0.0124} format={{ style: 'percent', minimumFractionDigits: 2 }} arrow />
				<Odometer value={48210.55} decimals={2} />
				<SecureMask label="IBAN" value="DE89370400440532013000" toggle />
			</div>
			<div class="gallery__grid">
				<Receipt title="Transfer sent" subtitle="Ref. TX-0042" level={3}>
					<LedgerRow label="Amount" value={1000} format={money} />
					<LedgerRow label="Fee" value={2.5} format={money} />
					<LedgerRow label="Total" value={1002.5} format={money} total />
				</Receipt>
				<div class="gallery__guilloche">
					<Guilloche class="gallery__art" />
					<span>Premium account</span>
					<Amount value={250000} format={money} />
				</div>
			</div>
		</section>
	</DefaultsProvider>
</div>

<style>
	.gallery {
		display: grid;
		gap: var(--sv-space-34);
		box-sizing: border-box;
		max-inline-size: 64rem;
		margin-inline: auto;
		padding: var(--sv-space-34);
		color: var(--sv-color-text);
		font-family: var(--sv-font-ui);
		background-color: var(--sv-color-background);
	}

	.gallery h1,
	.gallery h2 {
		margin: 0;
		font-family: var(--sv-font-display);
		font-weight: var(--sv-weight-display);
		letter-spacing: var(--sv-tracking-display);
	}

	.gallery h1 {
		font-size: var(--sv-text-headline);
	}

	.gallery h2 {
		font-size: var(--sv-text-title);
	}

	.gallery__head p {
		margin: var(--sv-space-5) 0 0;
		color: var(--sv-color-text-muted);
	}

	.gallery__section {
		display: grid;
		gap: var(--sv-space-21);
	}

	.gallery__row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sv-space-13);
		align-items: center;
	}

	.gallery__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
		gap: var(--sv-space-21);
		align-items: start;
	}

	.gallery__stack {
		display: grid;
		gap: var(--sv-space-8);
	}

	.gallery__figures {
		gap: var(--sv-space-34);
		font-size: var(--sv-text-lg);
	}

	.gallery__guilloche {
		position: relative;
		isolation: isolate;
		display: grid;
		align-content: end;
		gap: var(--sv-space-5);
		min-block-size: 10rem;
		padding: var(--sv-space-21);
		overflow: hidden;
		border: var(--sv-hairline) solid var(--sv-color-border);
		border-radius: min(var(--sv-radius-lg), var(--sv-radius-xl));
		background-color: var(--sv-color-surface-raised);
	}

	.gallery__guilloche :global(.gallery__art) {
		position: absolute;
		inset: 0;
		z-index: -1;
	}
</style>
