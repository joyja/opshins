<script lang="ts">
	let { children } = $props();
</script>

<div class="grid">
	{@render children()}
</div>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--spacing-unit);
	}
</style>
