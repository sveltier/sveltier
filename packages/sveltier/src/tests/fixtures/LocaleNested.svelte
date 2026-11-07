<script lang="ts">
	// A Vietnamese app with a part of the page that writes its figures as exchanges do.
	import Amount from '../../lib/components/Amount/Amount.svelte';
	import Delta from '../../lib/components/Delta/Delta.svelte';
	import LocaleProvider from '../../lib/core/locale/LocaleProvider.svelte';
	import LocaleProbe from './LocaleProbe.svelte';
</script>

<LocaleProvider locale="vi-VN" currency="VND" messages={{ close: 'Đóng' }}>
	<div data-testid="outer">
		<LocaleProbe value={1250} />
		<Amount value={76088} decimals={1} />
		<Delta value={0.006} format={{ style: 'percent', minimumFractionDigits: 2 }} />
	</div>
	<LocaleProvider locale="en-US">
		<div data-testid="inner">
			<LocaleProbe value={1250} />
			<Amount value={76088} decimals={1} />
			<Delta value={0.006} format={{ style: 'percent', minimumFractionDigits: 2 }} />
		</div>
	</LocaleProvider>
</LocaleProvider>
