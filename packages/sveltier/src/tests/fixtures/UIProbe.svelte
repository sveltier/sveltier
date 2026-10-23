<script lang="ts">
	// Reads every context UIProvider sets: theme, defaults, display and locale.
	import { useDefaults } from '../../lib/core/defaults/context.js';
	import { useDisplay } from '../../lib/core/display/display.js';
	import { useLocale } from '../../lib/core/locale/locale.js';
	import type { Size } from '../../lib/core/props/types.js';
	import { useTheme } from '../../lib/core/theme/context.js';

	const theme = useTheme();
	const resolve = useDefaults<{ size: Size }>('Probe', { size: 'md' });
	const p = $derived(resolve({}));
	const display = useDisplay();
	const locale = useLocale();
</script>

<p data-testid="ui">
	{theme.name}|{p.size}|{display.name}|{locale.formatCurrency(5)}|{locale.t('close')}
</p>
