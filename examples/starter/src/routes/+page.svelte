<script lang="ts">
	import {
		Amount,
		Button,
		Card,
		Chip,
		Col,
		DatePicker,
		Dialog,
		Form,
		NumberField,
		Row,
		Select,
		Table,
		TextField,
		useToast,
		type TableColumn
	} from '@sveltier/ui';
	import { invoices as sample, STATUSES, type Invoice, type Status } from '../lib/invoices';

	const toast = useToast();

	let invoices = $state(sample);
	let open = $state(false);
	let next = 1043;

	// The new invoice's fields. A value nobody has typed yet is null.
	let client = $state('');
	let due = $state<string | null>(null);
	let amount = $state<number | null>(null);
	let status = $state<Status>('Draft');

	const outstanding = $derived(
		invoices.filter((i) => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0)
	);
	const overdue = $derived(invoices.filter((i) => i.status === 'Overdue').length);

	const STATUS_COLOR = {
		Draft: 'neutral',
		Sent: 'info',
		Paid: 'success',
		Overdue: 'error'
	} as const;

	const columns: TableColumn<Invoice>[] = [
		{ key: 'id', label: 'Invoice', rowHeader: true },
		{ key: 'client', label: 'Client', sort: true, stack: 'secondary' },
		{ key: 'due', label: 'Due', sort: true },
		{ key: 'amount', label: 'Amount', sort: true, cell: money, stack: 'primary' },
		{ key: 'status', label: 'Status', cell: badge }
	];

	function add(event: SubmitEvent) {
		// Form calls onsubmit only once every field is valid.
		event.preventDefault();
		const invoice: Invoice = {
			id: `INV-${next++}`,
			client,
			due: due ?? '',
			amount: amount ?? 0,
			status
		};
		invoices = [invoice, ...invoices];
		open = false;
		client = '';
		due = null;
		amount = null;
		status = 'Draft';
		toast.show(`${invoice.id} added`, {
			action: {
				label: 'Undo',
				onclick: () => (invoices = invoices.filter((i) => i.id !== invoice.id))
			}
		});
	}
</script>

{#snippet money(invoice: Invoice)}
	<Amount value={invoice.amount} format={{ style: 'currency', currency: 'USD' }} />
{/snippet}

{#snippet badge(invoice: Invoice)}
	<Chip size="sm" variant="tonal" color={STATUS_COLOR[invoice.status]}>{invoice.status}</Chip>
{/snippet}

<svelte:head><title>Invoices · Starter</title></svelte:head>

<div class="page">
	<header>
		<h1>Invoices</h1>
		<Dialog title="New invoice" bind:open>
			{#snippet trigger(attributes)}
				<Button {...attributes} variant="tonal">New invoice</Button>
			{/snippet}
			<Form id="new-invoice" onsubmit={add}>
				<TextField label="Client" name="client" required bind:value={client} />
				<DatePicker label="Due" name="due" required bind:value={due} />
				<NumberField
					label="Amount"
					name="amount"
					min={0}
					format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
					required
					bind:value={amount}
				>
					{#snippet prepend()}USD{/snippet}
				</NumberField>
				<Select
					label="Status"
					name="status"
					options={STATUSES.map((s) => ({ value: s, label: s }))}
					bind:value={status}
				/>
			</Form>
			{#snippet actions({ close })}
				<Button variant="text" onclick={close}>Cancel</Button>
				<Button type="submit" form="new-invoice">Add invoice</Button>
			{/snippet}
		</Dialog>
	</header>

	<Row>
		<Col cols={12} sm={6}>
			<Card title="Outstanding" level={2}>
				<p class="figure">
					<Amount value={outstanding} format={{ style: 'currency', currency: 'USD' }} />
				</p>
			</Card>
		</Col>
		<Col cols={12} sm={6}>
			<Card title="Overdue" level={2}>
				<p class="figure"><Amount value={overdue} /> {overdue === 1 ? 'invoice' : 'invoices'}</p>
			</Card>
		</Col>
	</Row>

	<!-- Below 600px of its box, each row shows as a block: the id and amount, the client under them. -->
	<Table aria-label="Invoices" {columns} items={invoices} itemKey="id" stack="sm" />
</div>

<style>
	.page {
		display: grid;
		gap: var(--sv-space-21);
		padding: var(--sv-space-21);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sv-space-13);
	}
	h1 {
		margin: 0;
	}
	.figure {
		margin: 0;
		font-size: var(--sv-text-xl);
	}
</style>
