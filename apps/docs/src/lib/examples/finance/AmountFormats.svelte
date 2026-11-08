<script lang="ts">
	import { Amount } from '@sveltier/ui';
</script>

<Amount value={0.00012345} />
<!-- 0.00012345 -->
<Amount value={61.2} decimals={2} />
<!-- 61.20 -->
<Amount value={-639} />
<!-- −639, a true minus -->
<Amount value={18084} format={{ style: 'currency' }} />
<!-- $18,084.00 -->
<Amount value={1500} format={{ style: 'currency', currency: 'JPY' }} />
<!-- ¥1,500 -->
<Amount value={0.0125} format={{ style: 'percent' }} />
<!-- 1.25% -->
<Amount value={1.25} format={{ style: 'unit', unit: 'percent' }} />
<!-- 1.25%, already a percentage -->
<Amount value={1234567} format={{ notation: 'compact' }} />
<!-- 1.2M -->
<Amount value={null} />
<!-- — -->
