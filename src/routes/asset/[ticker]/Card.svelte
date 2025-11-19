<script lang="ts">
	let { backgroundColor, children } = $props();
	$effect(() => console.log(backgroundColor));
</script>

<div class="card" style="--card-background-color: {backgroundColor || 'var(--transparent)'}">
	{@render children()}
</div>

<style lang="scss">
	.card {
		background-color: var(--card-background-color);
		border-radius: var(--border-radius);
		box-shadow: var(--shadow-md);
		border: solid 1px var(--theme-neutral-500);
		border-radius: var(--rounded-xl);
	}
</style>
