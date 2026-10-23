<script lang="ts">
	// A sample screen rendered in each theme: app chrome, a balance with a
	// chart, a form, an activity list and a toast. Styled only through --sv-* tokens.
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

	let period = $state<Period>('1W');
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
	const index = $derived(periods.indexOf(period));
</script>

<div class="smp">
	<header class="smp-bar">
		<span class="smp-brand"><span class="smp-logo" aria-hidden="true"></span>Northwind</span>
		<nav class="smp-tabs" aria-label="Sample sections">
			<a href="#{uid}-balance" aria-current="page">Overview</a>
			<a href="#{uid}-send">Payments</a>
			<a href="#{uid}-wallet">Cards</a>
		</nav>
		<span class="smp-avatar" aria-hidden="true">AM</span>
	</header>

	<section class="smp-card smp-balance" aria-labelledby="{uid}-balance">
		<div class="smp-row">
			<h3 class="smp-label" id="{uid}-balance">Total balance</h3>
			<div class="smp-seg" role="radiogroup" aria-label="Period" style:--i={index}>
				<span class="smp-seg__thumb" aria-hidden="true"></span>
				{#each periods as p (p)}
					<label>
						<input type="radio" name="{uid}-period" value={p} bind:group={period} />
						<span>{p}</span>
					</label>
				{/each}
			</div>
		</div>
		<p class="smp-figure">$248,190<span>.35</span></p>
		<p class="smp-delta">
			<span class="smp-chip smp-chip--up">▲ 1.84%</span>
			<span class="smp-muted">+$4,481.20 this {period === '1D' ? 'day' : 'period'}</span>
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
				<dt class="smp-label">Available</dt>
				<dd>48,000.00</dd>
			</div>
			<div>
				<dt class="smp-label">Pending</dt>
				<dd>1,254.00</dd>
			</div>
			<div>
				<dt class="smp-label">Invested</dt>
				<dd>198,936.35</dd>
			</div>
		</dl>
	</section>

	<section class="smp-card smp-form" aria-labelledby="{uid}-send">
		<h3 class="smp-title" id="{uid}-send">Send money</h3>
		<label class="smp-field">
			<span class="smp-label">Recipient</span>
			<input class="smp-input" value="Alex Morgan" autocomplete="off" />
		</label>
		<label class="smp-field">
			<span class="smp-label">Amount</span>
			<span class="smp-input smp-input--amount">
				<input value="1,250.00" inputmode="decimal" autocomplete="off" />
				<span>USD</span>
			</span>
			<span class="smp-hint">No fee · Arrives {instant ? 'in seconds' : 'within a day'}</span>
		</label>
		<div class="smp-row smp-row--wrap">
			<label class="smp-check">
				<input type="checkbox" bind:checked={save} />
				<span class="smp-check__box" aria-hidden="true"></span>
				Save recipient
			</label>
			<label class="smp-switch">
				<input type="checkbox" role="switch" bind:checked={instant} />
				<span class="smp-switch__track" aria-hidden="true"><span></span></span>
				Instant transfer
			</label>
		</div>
		<div class="smp-actions">
			<button type="button" class="smp-btn smp-btn--ghost">Cancel</button>
			<button type="button" class="smp-btn smp-btn--primary" onclick={() => (toast = true)}>
				Send $1,250.00
			</button>
		</div>
	</section>

	<section class="smp-card smp-wallet" aria-labelledby="{uid}-wallet">
		<h3 class="smp-title" id="{uid}-wallet">Wallet</h3>
		<div class="smp-cardart" aria-label="Northwind Reserve card ending 4821" role="img">
			<span class="smp-cardart__brand">Northwind <em>Reserve</em></span>
			<span class="smp-cardart__chip" aria-hidden="true"></span>
			<span class="smp-cardart__number">•••• •••• •••• 4821</span>
			<span class="smp-cardart__meta"><span>Alex Morgan</span><span>09 / 29</span></span>
		</div>
		<div class="smp-limit">
			<div class="smp-row">
				<span class="smp-label">Monthly limit</span>
				<span class="smp-amount">3,420 / 10,000</span>
			</div>
			<div
				class="smp-progress"
				role="progressbar"
				aria-label="Monthly limit used"
				aria-valuenow={34}
				aria-valuemin={0}
				aria-valuemax={100}
			>
				<span style:--value="34%"></span>
			</div>
		</div>
		<div class="smp-actions smp-actions--start">
			<button type="button" class="smp-btn smp-btn--ghost">Freeze card</button>
			<button type="button" class="smp-btn smp-btn--text">Card details</button>
		</div>
	</section>

	<section class="smp-card smp-activity" aria-labelledby="{uid}-activity">
		<h3 class="smp-title" id="{uid}-activity">Recent activity</h3>
		<ul>
			<li>
				<span class="smp-item">Apple Store<small>Today, 09:32</small></span>
				<span class="smp-chip smp-chip--success">Completed</span>
				<span class="smp-amount smp-down">−129.00</span>
			</li>
			<li>
				<span class="smp-item">Salary · Acme Inc.<small>Yesterday</small></span>
				<span class="smp-chip smp-chip--info">Received</span>
				<span class="smp-amount smp-up">+8,400.00</span>
			</li>
			<li>
				<span class="smp-item">Brokerage deposit<small>Oct 21</small></span>
				<span class="smp-chip smp-chip--warning">Pending</span>
				<span class="smp-amount">−2,000.00</span>
			</li>
		</ul>
		<p class="smp-total">
			<span>Net this week</span><span class="smp-amount smp-up">+6,271.00</span>
		</p>
	</section>

	{#if toast}
		<div class="smp-toast" role="status">
			<span>Transfer of $1,250.00 scheduled</span>
			<button type="button" class="smp-btn smp-btn--text" onclick={() => (toast = false)}
				>Undo</button
			>
		</div>
	{/if}
</div>
