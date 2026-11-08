<script lang="ts">
	import { SecureMask } from '@sveltier/ui';
</script>

<!-- "•••• 3000", with a button that shows the whole IBAN for 30 seconds. -->
<SecureMask label="IBAN" value="DE89370400440532013000" toggle hideAfter={30000} />
