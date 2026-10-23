<script lang="ts">
	import { useLocale } from '../../lib/core/locale/locale.js';

	let { value }: { value: number } = $props();

	const locale = useLocale();
</script>

<p data-testid="locale">{locale.formatCurrency(value)}|{locale.t('close')}</p>
