<script lang="ts">
	import type { FundamentalsGroupGrades } from '$lib/fundamentals';
	import { isSuccess } from '@joyautomation/dark-matter';
	import FundamentalGroup from './FundamentalGroup.svelte';
	import { fundamentalData } from './fundamentalData.svelte';
</script>

{#if fundamentalData.fundamentals}
	{#await fundamentalData.fundamentals then fundamentals}
		{#if isSuccess(fundamentals.fundamentalsGroups)}
			<div class="flex flex-column space-y-5">
				{#each Object.entries(fundamentals.fundamentalsGroups.output).filter(([key]) => key !== 'aggregate') as [key, value]}
					<div>
						<FundamentalGroup {key} {value} />
					</div>
				{/each}
			</div>
		{:else}
			{JSON.stringify(fundamentals.fundamentalsGroups.error)}
		{/if}
	{/await}
{/if}
