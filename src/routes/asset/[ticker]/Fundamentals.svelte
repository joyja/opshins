<script lang="ts">
	import type { Fundamentals, FundamentalsKeys } from '$lib/fundamentals';
	import Fundamental from './Fundamental.svelte';
	let { fundamentals }: { fundamentals: Fundamentals } = $props();
	let processed: [FundamentalsKeys, Fundamentals[FundamentalsKeys]][] = $derived(
		Object.entries(fundamentals).filter(([key]) => key !== 'sector') as [
			keyof Fundamentals,
			Fundamentals[keyof Fundamentals]
		][] as [FundamentalsKeys, Fundamentals[FundamentalsKeys]][]
	);
</script>

<div class="grid">
	{#each processed as [key, value]}
		<Fundamental {key} factor={value} />
	{/each}
</div>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--spacing-unit);
	}
</style>
