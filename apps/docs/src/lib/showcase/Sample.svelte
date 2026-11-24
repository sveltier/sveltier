<script lang="ts">
	// A sample screen rendered in each theme, built from the library's own components: app
	// chrome, a balance with a chart, a form, a card and its limit, an activity list and a status.
	import {
		Alert,
		Amount,
		AmountInput,
		Avatar,
		Button,
		Card,
		Checkbox,
		Chip,
		Delta,
		List,
		ListItem,
		ProgressLinear,
		SegmentedControl,
		Switch,
		TextField
	} from '@sveltier/ui';
	import './sample.css';

	const uid = $props.id();
	const periods = ['1D', '1W', '1M', '1Y'] as const;
	type Period = (typeof periods)[number];

	const SERIES: Record<Period, number[]> = {
		'1D': [52, 50, 53, 51, 55, 54, 57, 56, 58, 61, 60, 63],
		'1W': [40, 44, 42, 47, 45, 51, 49, 55, 53, 58, 62, 61],
		'1M': [30, 34, 31, 38, 36, 35, 42, 47, 44, 52, 57, 63],
		'1Y': [12, 18, 15, 24, 29, 26, 35, 41, 39, 50, 58, 66]
	};
	const USD = { style: 'currency', currency: 'USD' } as const;
	const SECTIONS = [
		{ id: 'balance', label: 'Overview' },
		{ id: 'send', label: 'Payments' },
		{ id: 'wallet', label: 'Cards' }
	];
	const ACTIVITY = [
		{
			id: 'apple',
			title: 'Apple Store',
			when: 'Today, 09:32',
			status: 'Completed',
			color: 'success',
			amount: -129
		},
		{
			id: 'salary',
			title: 'Salary · Acme Inc.',
			when: 'Yesterday',
			status: 'Received',
			color: 'info',
			amount: 8400
		},
		{
			id: 'brokerage',
			title: 'Brokerage deposit',
			when: 'Oct 21',
			status: 'Pending',
			color: 'warning',
			amount: -2000
		}
	] as const;

	let period = $state<Period>('1W');
	let recipient = $state('Alex Morgan');
	let amount = $state<number | null>(1250);
	let instant = $state(true);
	let save = $state(false);
	let toast = $state(true);

	const points = $derived.by(() => {
		const data = SERIES[period];
		const max = Math.max(...data);
		const min = Math.min(...data);
		return data.map((v, i) => [(i / (data.length - 1)) * 300, 70 - ((v - min) / (max - min)) * 60]);
	});
	const line = $derived(points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(''));
</script>

<div class="smp">
	<header class="smp-bar">
		<span class="smp-brand"><span class="smp-logo" aria-hidden="true"></span>Northwind</span>
		<nav class="smp-tabs" aria-label="Sample sections">
			{#each SECTIONS as section, i (section.id)}
				<Button
					href="#{uid}-{section.id}"
					variant={i === 0 ? 'tonal' : 'text'}
					color="neutral"
					size="sm"
					aria-current={i === 0 ? 'page' : undefined}>{section.label}</Button
				>
			{/each}
		</nav>
		<Avatar size="sm" class="smp-avatar">AM</Avatar>
	</header>

	<Card id="{uid}-balance" class="smp-balance" title="Total balance" level={3}>
		{#snippet append()}
			<SegmentedControl
				aria-label="Period"
				size="sm"
				options={periods.map((value) => ({ value, label: value }))}
				bind:value={period}
			/>
		{/snippet}
		<Amount value={248190.35} format={USD} dimFraction font="inherit" class="smp-figure" />
		<p class="smp-delta">
			<Chip color="up">
				<Delta value={0.0184} arrow format={{ style: 'percent', minimumFractionDigits: 2 }} />
			</Chip>
			<span class="smp-muted">
				<Delta value={4481.2} format={USD} />
				this {period === '1D' ? 'day' : 'period'}
			</span>
		</p>
		<svg class="smp-spark" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">
			<defs>
				<linearGradient id="{uid}-fill" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" style:stop-color="var(--sv-color-primary)" stop-opacity="0.22" />
					<stop offset="1" style:stop-color="var(--sv-color-primary)" stop-opacity="0" />
				</linearGradient>
			</defs>
			<path d="{line}L300 80L0 80Z" fill="url(#{uid}-fill)" />
			<path d={line} class="smp-spark__line" />
		</svg>
		<dl class="smp-stats">
			<div>
				<dt>Available</dt>
				<dd><Amount value={48000} decimals={2} /></dd>
			</div>
			<div>
				<dt>Pending</dt>
				<dd><Amount value={1254} decimals={2} /></dd>
			</div>
			<div>
				<dt>Invested</dt>
				<dd><Amount value={198936.35} decimals={2} /></dd>
			</div>
		</dl>
	</Card>

	<Card id="{uid}-send" class="smp-form" title="Send money" level={3}>
		<div class="smp-fields">
			<TextField label="Recipient" autocomplete="off" bind:value={recipient} />
			<AmountInput
				label="Amount"
				controls={false}
				format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
				hint="No fee · Arrives {instant ? 'in seconds' : 'within a day'}"
				bind:value={amount}
			>
				{#snippet append()}USD{/snippet}
			</AmountInput>
			<div class="smp-row">
				<Checkbox label="Save recipient" bind:checked={save} />
				<Switch label="Instant transfer" bind:checked={instant} />
			</div>
		</div>
		{#snippet actions()}
			<Button variant="text" color="neutral">Cancel</Button>
			<Button onclick={() => (toast = true)}>Send $1,250.00</Button>
		{/snippet}
	</Card>

	<Card id="{uid}-wallet" class="smp-wallet" title="Wallet" level={3}>
		<div class="smp-cardart" aria-label="Northwind Reserve card ending 4821" role="img">
			<span class="smp-cardart__brand">Northwind <em>Reserve</em></span>
			<span class="smp-cardart__chip" aria-hidden="true"></span>
			<span class="smp-cardart__number">•••• •••• •••• 4821</span>
			<span class="smp-cardart__meta"><span>Alex Morgan</span><span>09 / 29</span></span>
		</div>
		<div class="smp-limit">
			<div class="smp-row smp-row--between">
				<span class="smp-muted">Monthly limit</span>
				<span><Amount value={3420} /> / <Amount value={10000} /></span>
			</div>
			<ProgressLinear value={34} label="Monthly limit used" />
		</div>
		{#snippet actions()}
			<Button variant="outlined" color="neutral">Freeze card</Button>
			<Button variant="text">Card details</Button>
		{/snippet}
	</Card>

	<Card class="smp-activity" title="Recent activity" level={3}>
		<List density="compact" class="smp-list">
			{#each ACTIVITY as item (item.id)}
				<ListItem title={item.title} subtitle={item.when}>
					{#snippet append()}
						<span class="smp-entry">
							<Chip color={item.color} class="smp-status">{item.status}</Chip>
							{#if item.status === 'Pending'}
								<Amount value={item.amount} decimals={2} class="smp-sum" />
							{:else}
								<Delta value={item.amount} decimals={2} class="smp-sum" />
							{/if}
						</span>
					{/snippet}
				</ListItem>
			{/each}
		</List>
		<p class="smp-total">
			<span>Net this week</span><Delta value={6271} decimals={2} />
		</p>
	</Card>

	{#if toast}
		<Alert type="success" variant="elevated" density="compact" class="smp-toast">
			Transfer of $1,250.00 scheduled
			<Button variant="text" size="sm" flush class="smp-undo" onclick={() => (toast = false)}
				>Undo</Button
			>
		</Alert>
	{/if}
</div>
