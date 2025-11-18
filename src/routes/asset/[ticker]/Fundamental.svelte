<script lang="ts">
	import type { FundamentalFactor } from '$lib/fundamentals';
	import type { Fundamentals } from '$lib/fundamentals/types';
	import Scale from './Scale.svelte';
	let {
		key,
		factor
	}: {
		key: string;
		factor: FundamentalFactor;
	} = $props();
</script>

<article>
	<h2>{key}</h2>
	<p class="grade">{factor.grade}</p>
	<p>value: {factor.value?.toFixed(2)}</p>
	<p>group: {factor.group}</p>
	<p>weight: {factor.weight}</p>
	<Scale {key} {factor} />
</article>

<style lang="scss">
	article {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		border: 1px solid #ccc;
		padding: var(--spacing-unit);
		margin: var(--spacing-unit);
		& > h2 {
			font-size: var(--text-xs);
			line-height: var(--text-xs-lh);
			font-weight: var(--text-medium);
		}
		& > p {
			font-size: var(--text-xs);
			line-height: var(--text-xs-lh);
			font-weight: var(--text-medium);
			margin: 0;
		}
	}
	.grade {
		text-transform: uppercase;
		font-size: var(--text-6xl);
		line-height: var(--text-6xl-lh);
		font-weight: var(--text-bold);
	}
</style>
