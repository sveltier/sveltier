<script lang="ts">
	// Boxes that grow with their content beside one-line controls, in the theme the test picks.
	import Alert from '../../lib/components/Alert/Alert.svelte';
	import Button from '../../lib/components/Button/Button.svelte';
	import Skeleton from '../../lib/components/Skeleton/Skeleton.svelte';
	import Textarea from '../../lib/components/Textarea/Textarea.svelte';
	import TextField from '../../lib/components/TextField/TextField.svelte';
	import type { Rounded } from '../../lib/core/props/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { milano } from '../../lib/themes/milano.js';
	import { monolith } from '../../lib/themes/monolith.js';

	let { theme, rounded = true }: { theme: 'milano-light' | 'monolith-light'; rounded?: Rounded } =
		$props();
</script>

<ThemeProvider themes={{ ...monolith, ...milano }} {theme} storageKey={false}>
	<Textarea label="Note" {rounded} />
	<Alert data-testid="alert" {rounded}>The transfer could not be sent.</Alert>
	<Skeleton data-testid="skeleton" type="rect" />
	<TextField label="Name" />
	<Button>Save</Button>
</ThemeProvider>
