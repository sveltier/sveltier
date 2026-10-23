<script lang="ts">
	import LabelledField from './LabelledField.svelte';

	let { customId }: { customId?: string } = $props();
</script>

<LabelledField label="Amount" hint="In your account currency" />
<LabelledField label="Reference" />
<LabelledField id={customId} label="Recipient" />
