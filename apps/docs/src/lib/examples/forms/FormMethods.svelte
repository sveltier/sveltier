<script lang="ts">
	import { Button, Form } from '@sveltier/ui';
	let form: ReturnType<typeof Form>;
</script>

<Form bind:this={form}>…</Form>

<Button onclick={() => form.validate()}>Check</Button>
<!-- shows every message, returns true when valid -->
<Button onclick={() => form.reset()}>Start over</Button>
<!-- every field back to its starting value, messages hidden -->
<Button onclick={() => form.resetValidation()}>Hide messages</Button>
