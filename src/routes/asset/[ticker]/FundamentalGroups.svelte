<script lang="ts">
	import type { FundamentalsGroupGrades } from '$lib/fundamentals';
	import FundamentalGroup from './FundamentalGroup.svelte';
	import Grid from './Grid.svelte';
	let { fundamentalsGroups }: { fundamentalsGroups: FundamentalsGroupGrades } = $props();
</script>

<Grid>
	{#each Object.entries(fundamentalsGroups) as [key, value]}
		<FundamentalGroup {key} {value} />
	{/each}
</Grid>
