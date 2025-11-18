<script lang="ts">
	import type { Grade } from '$lib/fundamentals';
	import Card from './Card.svelte';
	let { key, value }: { key: string; value: Grade } = $props();
</script>

<Card>
	<div class="content">
		<h2>{key}</h2>
		<p>{value}</p>
	</div>
</Card>

<style lang="scss">
	h2 {
		font-size: var(--text-xs);
		line-height: var(--text-xs-lh);
	}
	p {
		margin: 0;
		font-size: var(--text-4xl);
		line-height: var(--text-4xl-lh);
		text-transform: uppercase;
	}
	.content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-unit);
		align-items: center;
	}
</style>
