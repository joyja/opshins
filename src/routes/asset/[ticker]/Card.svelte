<script lang="ts">
	let { children } = $props();
</script>

<div class="card">
	{@render children()}
</div>

<style lang="scss">
	.card {
		padding: var(--spacing-unit);
		border-radius: var(--border-radius);
		background-color: var(--color-background);
		box-shadow: var(--shadow-md);
		border: solid 1px var(--theme-neutral-500);
	}
</style>
