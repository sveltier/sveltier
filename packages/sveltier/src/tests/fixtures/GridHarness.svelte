<script lang="ts">
	// A container with a row of columns in a themed scope, the first column holding a row of its
	// own. The test picks the props of the container, the row, each column and the inner column.
	import Col from '../../lib/components/Grid/Col.svelte';
	import Container from '../../lib/components/Grid/Container.svelte';
	import Row from '../../lib/components/Grid/Row.svelte';
	import type { ColProps, ContainerProps, RowProps } from '../../lib/components/Grid/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		container = {},
		row = {},
		cols = [{}, {}, {}],
		inner = {}
	}: {
		container?: Partial<ContainerProps>;
		row?: Partial<RowProps>;
		cols?: Partial<ColProps>[];
		inner?: Partial<ColProps>;
	} = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Container data-testid="container" {...container}>
		<Row data-testid="row" {...row}>
			{#each cols as col, index (index)}
				<Col data-testid="col-{index}" {...col}>
					{#if index === 0}
						<Row data-testid="inner-row">
							<Col data-testid="inner-col" {...inner}>Inner</Col>
						</Row>
					{:else}
						Column {index}
					{/if}
				</Col>
			{/each}
		</Row>
	</Container>
</ThemeProvider>
