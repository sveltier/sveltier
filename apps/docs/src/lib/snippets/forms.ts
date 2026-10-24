// Code samples for the form pages, shown on the pages and in llms-full.txt.

export const textFieldUsage = `<script>
  import { TextField } from 'sveltier';
  let email = $state('');
</script>

<TextField
  label="Email"
  type="email"
  name="email"
  autocomplete="email"
  hint="Receipts go to this address"
  required
  bind:value={email}
/>`;

export const textFieldValidation = `<script>
  import { TextField } from 'sveltier';

  // The result of a SvelteKit form action, with the server's own errors.
  let { form } = $props();
  let username = $state('');

  const rules = [
    (value) => /^[a-z0-9_]+$/.test(value) || 'Use lowercase letters, digits and _',
    (value) => !value.startsWith('_') || 'Start with a letter or a digit'
  ];
</script>

<TextField
  label="Username"
  name="username"
  required
  minlength={3}
  maxlength={20}
  {rules}
  error={form?.errors?.username}
  bind:value={username}
/>`;

export const textFieldAffixes = `<script>
  import { Button, Icon, TextField } from 'sveltier';
  let visible = $state(false);
</script>

<TextField label="Search" type="search" variant="elevated">
  {#snippet prepend()}<Icon path={SEARCH} />{/snippet}
</TextField>

<TextField label="Password" type={visible ? 'text' : 'password'} autocomplete="current-password">
  {#snippet append()}
    <Button variant="text" size="sm" onclick={() => (visible = !visible)}>
      {visible ? 'Hide' : 'Show'}
    </Button>
  {/snippet}
</TextField>`;

export const fieldUsage = `<script>
  import { Field } from 'sveltier';
  let start = $state('');
</script>

<Field label="Start date" hint="The first payment goes out on this day" required>
  {#snippet children(attributes)}
    <input type="date" name="start" {...attributes} bind:value={start} />
  {/snippet}
</Field>`;
