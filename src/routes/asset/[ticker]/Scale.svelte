<script lang="ts">
	import type { FundamentalFactor } from '$lib/fundamentals';

	let { key, factor }: { key: string; factor: FundamentalFactor } = $props();
</script>

<div class="scale">
	<div class="a">A {factor.config.a}</div>
	<div class="b">B {factor.config.b}</div>
	<div class="c">C {factor.config.c}</div>
	<div class="d">D {factor.config.d}</div>
	<div class="f">F 0</div>
</div>

<style lang="scss">
	.scale {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		border: 1px solid #ccc;
		padding: var(--spacing-unit);
		margin: var(--spacing-unit);
		& > div {
			font-size: var(--text-xs);
			line-height: var(--text-xs-lh);
			font-weight: var(--text-medium);
			margin: 0;
		}
	}
</style>
