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

export const formUsage = `<script>
  import { Button, Form, TextField } from 'sveltier';

  let email = $state('');
  let password = $state('');
  let sending = $state(false);

  // Called only when every field is valid.
  async function signUp(event) {
    event.preventDefault();
    sending = true;
    await createAccount({ email, password });
    sending = false;
  }
</script>

<Form onsubmit={signUp}>
  <TextField label="Email" type="email" name="email" required bind:value={email} />
  <TextField label="Password" type="password" name="password" minlength={8} required bind:value={password} />
  <Button type="submit" loading={sending}>Create account</Button>
</Form>`;

export const formSvelteKit = `<script>
  import { enhance } from '$app/forms';
  import { fromAction } from 'svelte/attachments';
  import { Button, Form, TextField } from 'sveltier';

  // What the form action returned, such as { errors: { email: 'This email is taken' } }.
  let { form } = $props();
</script>

<!-- Without JavaScript the form posts to the action as HTML does; with it, enhance sends it,
     and only once every field is valid. -->
<Form method="POST" action="?/signup" {@attach fromAction(enhance)}>
  <TextField label="Email" type="email" name="email" required error={form?.errors?.email} />
  <TextField label="Password" type="password" name="password" minlength={8} required />
  <Button type="submit">Create account</Button>
</Form>`;

export const formMethods = `<script>
  import { Button, Form } from 'sveltier';
  let form;
</script>

<Form bind:this={form}>…</Form>

<Button onclick={() => form.validate()}>Check</Button>  <!-- shows every message, returns true when valid -->
<Button onclick={() => form.reset()}>Start over</Button>  <!-- every field back to its starting value, messages hidden -->
<Button onclick={() => form.resetValidation()}>Hide messages</Button>`;

export const textareaUsage = `<script>
  import { Textarea } from 'sveltier';
  let note = $state('');
</script>

<!-- Grows with its text from 2 to 8 lines, then scrolls. -->
<Textarea
  label="Note to the payee"
  name="note"
  hint="They see it on their statement"
  maxlength={280}
  rows={2}
  autoGrow
  maxRows={8}
  bind:value={note}
/>`;

export const numberFieldUsage = `<script>
  import { NumberField } from 'sveltier';
  let quantity = $state(1);
  let amount = $state(null);
</script>

<NumberField label="Quantity" name="quantity" min={1} max={99} step={1} bind:value={quantity} />

<!-- Digits only in format: the currency goes in prepend, so the text stays editable. -->
<NumberField
  label="Amount"
  name="amount"
  min={0}
  format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
  required
  bind:value={amount}
>
  {#snippet prepend()}USD{/snippet}
</NumberField>`;
