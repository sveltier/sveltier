// Code samples for the form pages, shown on the pages and in llms-full.txt.

export const textFieldUsage = `<script>
  import { TextField } from '@sveltier/ui';
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
  import { TextField } from '@sveltier/ui';

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
  import { Button, Icon, TextField } from '@sveltier/ui';
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
  import { Field } from '@sveltier/ui';
  let start = $state('');
</script>

<Field label="Start date" hint="The first payment goes out on this day" required>
  {#snippet children(attributes)}
    <input type="date" name="start" {...attributes} bind:value={start} />
  {/snippet}
</Field>`;

export const formUsage = `<script>
  import { Button, Form, TextField } from '@sveltier/ui';

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
</Form>`;

export const formMethods = `<script>
  import { Button, Form } from '@sveltier/ui';
  let form;
</script>

<Form bind:this={form}>…</Form>

<Button onclick={() => form.validate()}>Check</Button>  <!-- shows every message, returns true when valid -->
<Button onclick={() => form.reset()}>Start over</Button>  <!-- every field back to its starting value, messages hidden -->
<Button onclick={() => form.resetValidation()}>Hide messages</Button>`;

export const textareaUsage = `<script>
  import { Textarea } from '@sveltier/ui';
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
  import { NumberField } from '@sveltier/ui';
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

export const selectUsage = `<script lang="ts">
  import { Select } from '@sveltier/ui';

  let market = $state<string | null>(null);
</script>

<!-- Items with a group show under its name; a disabled one is skipped by the keys. -->
<Select
  label="Market"
  name="market"
  placeholder="Choose a market"
  required
  items={[
    { value: 'btc-usdt', label: 'BTC/USDT', group: 'Binance' },
    { value: 'eth-usdt', label: 'ETH/USDT', group: 'Binance' },
    { value: 'btc-usd', label: 'BTC/USD', group: 'Coinbase' },
    { value: 'eth-usd', label: 'ETH/USD', group: 'Coinbase', disabled: true }
  ]}
  bind:value={market}
/>`;

export const selectCustom = `<script lang="ts">
  import { Select, type SelectItem } from '@sveltier/ui';

  type Market = SelectItem & { venue: string };
  let { markets }: { markets: Market[] } = $props();
  let market = $state<string | null>(null);
</script>

<!-- The option and the chosen value drawn your own way: the symbol, then its venue. -->
<Select label="Market" items={markets} bind:value={market}>
  {#snippet option(item)}
    <strong>{item.label}</strong> <small>{item.venue}</small>
  {/snippet}
  {#snippet selection(item)}
    {item.label} · {item.venue}
  {/snippet}
</Select>`;

export const comboboxUsage = `<script lang="ts">
  import { Combobox } from '@sveltier/ui';

  let city = $state<string | null>(null);
</script>

<!-- Type "sao" for São Paulo or "da nang" for Đà Nẵng: case and diacritics do not matter. -->
<Combobox
  label="City"
  name="city"
  placeholder="Search cities"
  items={[
    { value: 'sao', label: 'São Paulo', description: 'Brazil', group: 'Americas' },
    { value: 'mtl', label: 'Montréal', description: 'Canada', group: 'Americas' },
    { value: 'zrh', label: 'Zürich', description: 'Switzerland', group: 'Europe' },
    { value: 'dad', label: 'Đà Nẵng', description: 'Vietnam', group: 'Asia' }
  ]}
  bind:value={city}
/>`;

export const comboboxRemote = `<script lang="ts">
  import { Combobox, type SelectItem } from '@sveltier/ui';

  let symbol = $state<string | null>(null);
  let query = $state('');
  let found = $state<SelectItem[]>([]);
  let loading = $state(false);

  // Searching elsewhere: the server filters, the field shows what it found.
  $effect(() => {
    const term = query.trim();
    if (!term) return;
    loading = true;
    const controller = new AbortController();
    fetch(\`/api/symbols?q=\${encodeURIComponent(term)}\`, { signal: controller.signal })
      .then((response) => response.json())
      .then((items: SelectItem[]) => (found = items))
      .catch(() => {})
      .finally(() => (loading = false));
    return () => controller.abort();
  });
</script>

<Combobox label="Symbol" items={found} filter={false} {loading} bind:query bind:value={symbol} />`;

export const nativeSelectUsage = `<script>
  import { NativeSelect } from '@sveltier/ui';
  let country = $state(null);
</script>

<NativeSelect
  label="Country"
  name="country"
  placeholder="Choose a country"
  required
  options={[
    { value: 'gb', label: 'United Kingdom' },
    { value: 'jp', label: 'Japan' },
    { value: 'vn', label: 'Vietnam' }
  ]}
  bind:value={country}
/>`;

export const checkboxUsage = `<script>
  import { Checkbox } from '@sveltier/ui';
  let receipt = $state(true);
  let accepted = $state(false);
</script>

<Checkbox
  label="Email me a receipt"
  name="receipt"
  hint="Sent after every transfer"
  bind:checked={receipt}
/>

<!-- A label with a link in it is a snippet. -->
<Checkbox name="licence" required bind:checked={accepted}>
  {#snippet label()}
    I accept the <a href="/licence">licence terms</a>
  {/snippet}
</Checkbox>`;

export const checkboxSelectAll = `<script>
  import { Checkbox } from '@sveltier/ui';

  const DOCUMENTS = ['Statements', 'Tax forms', 'Trade confirmations'];
  let chosen = $state(['Statements']);
  const all = $derived(chosen.length === DOCUMENTS.length);
</script>

<!-- Checked when every document is, a dash when only some are. -->
<Checkbox
  label="All documents"
  bind:checked={() => all, (on) => (chosen = on ? [...DOCUMENTS] : [])}
  indeterminate={chosen.length > 0 && !all}
/>
{#each DOCUMENTS as document (document)}
  <Checkbox
    label={document}
    bind:checked={
      () => chosen.includes(document),
      (on) => (chosen = on ? [...chosen, document] : chosen.filter((d) => d !== document))
    }
  />
{/each}`;

export const radioGroupUsage = `<script>
  import { RadioGroup } from '@sveltier/ui';
  let days = $state(null);
</script>

<RadioGroup
  label="Pay out"
  name="payout"
  required
  options={[
    { value: 1, label: 'Every day' },
    { value: 7, label: 'Every Monday', hint: 'Fewer, larger transfers' },
    { value: 30, label: 'On the first of the month', disabled: true }
  ]}
  bind:value={days}
/>`;

export const sliderUsage = `<script>
  import { Slider } from '@sveltier/ui';
  let risk = $state(50);
  let share = $state(40);
</script>

<!-- On a labelled tick, the slider reads out the tick's label. -->
<Slider
  label="Risk"
  name="risk"
  step={50}
  ticks={[
    { value: 0, label: 'Careful' },
    { value: 50, label: 'Balanced' },
    { value: 100, label: 'Bold' }
  ]}
  bind:value={risk}
/>

<Slider
  label="Share in stocks"
  name="share"
  step={10}
  ticks
  format={(value) => \`\${value}%\`}
  rules={[(value) => value <= 80 || 'Keep it at 80% or under']}
  bind:value={share}
/>`;

export const switchUsage = `<script>
  import { Switch } from '@sveltier/ui';
  let notifications = $state(true);
</script>

<Switch
  label="Payment notifications"
  hint="Money in and out, as it happens"
  bind:checked={notifications}
/>`;
