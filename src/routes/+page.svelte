<script lang="ts">
	import { isFail, isSuccess } from '@joyautomation/dark-matter';
	import { loadDiffConfig } from 'vitest/internal/browser';
	import Positions from './Positions.svelte';

	const { data } = $props();
	const { positions } = data;
</script>

{#await Promise.all([data.positions, data.activities])}
	Loading...
{:then [positions, activities]}
	{#if isSuccess(positions) && isSuccess(activities)}
		<Positions positions={positions.output} activities={activities.output} />
	{:else}
		{#if isFail(positions)}
			<div class="error">{positions.error}</div>
		{/if}
		{#if isFail(activities)}
			<div class="error">{activities.error}</div>
		{/if}
	{/if}
{/await}

<style>
	.error {
		color: red;
	}
</style>
