<script>
	import { Breadcrumbs } from '@sveltier/ui';
</script>

<!-- The pages above this one as links, this page last. -->
<Breadcrumbs
	items={[
		{ label: 'Accounts', href: '/accounts' },
		{ label: 'Savings', href: '/accounts/savings' },
		{ label: 'Statement for October' }
	]}
/>
