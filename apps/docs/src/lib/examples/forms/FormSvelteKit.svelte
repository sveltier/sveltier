<script>
	import { enhance } from '$app/forms';
	import { fromAction } from 'svelte/attachments';
	import { Button, Form, TextField } from '@sveltier/ui';

	// What the form action returned, such as { errors: { email: 'This email is taken' } }.
	let { form } = $props();
</script>

<!-- Without JavaScript the form posts to the action as HTML does; with it, enhance sends it,
     and only once every field is valid. -->
<Form method="POST" action="?/signup" {@attach fromAction(enhance)}>
	<TextField label="Email" type="email" name="email" required error={form?.errors?.email} />
	<TextField label="Password" type="password" name="password" minlength={8} required />
	<Button type="submit">Create account</Button>
</Form>
