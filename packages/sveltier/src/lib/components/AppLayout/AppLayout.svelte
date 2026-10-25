<script lang="ts">
	// The frame of an app: AppBar, NavigationDrawer and Main on a CSS grid. See AppLayoutProps.
	import { useLocale } from '../../core/locale/locale.js';
	import './app-layout.css';
	import { Layout, setLayout } from './context.svelte.js';
	import type { AppLayoutProps } from './types.js';

	let { children, class: className, ref = $bindable(null), ...rest }: AppLayoutProps = $props();

	const uid = $props.id();
	const layout = setLayout(new Layout(`${uid}-main`));
	const locale = useLocale();
</script>

<div bind:this={ref} {...rest} class={['sv-app-layout', className]}>
	<a class="sv-app-layout__skip" href="#{layout.mainId}">{locale.t('skipToContent')}</a>
	{@render children?.()}
</div>
