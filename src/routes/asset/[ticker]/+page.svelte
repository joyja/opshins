<script lang="ts">
	import LineChart from '$lib/components/LineChart.svelte';
	import { isSuccess } from '@joyautomation/dark-matter';
	import FundamentalGroups from './FundamentalGroups.svelte';
	import { fundamentalData } from './fundamentalData.svelte.js';
	import Card from './Card.svelte';
	import type { Grade } from '$lib/fundamentals.js';
	import OptionsChain from './OptionsChain.svelte';

	let { data } = $props();

	fundamentalData.fundamentals = data.fundamentals;
	const getGradeColor = (grade: Grade) => {
		switch (grade) {
			case 'a':
				return 'var(--grade-a)';
			case 'b':
				return 'var(--grade-b)';
			case 'c':
				return 'var(--grade-c)';
			case 'd':
				return 'var(--grade-d)';
			case 'f':
				return 'var(--grade-f)';
		}
	};
</script>

{#await data.asset then asset}
	{#if isSuccess(asset)}
		<div class="flex mb-10">
			{#if fundamentalData.fundamentals}
				{#await fundamentalData.fundamentals then fundamentals}
					{#if isSuccess(fundamentals.fundamentalsGroups)}
						<Card backgroundColor={getGradeColor(fundamentals.fundamentalsGroups.output.aggregate)}>
							<div class="header">
								<p class="grade">{fundamentals.fundamentalsGroups.output.aggregate}</p>
								<h1>{asset.output.symbol}</h1>
								<p>{asset.output.name}</p>
							</div>
						</Card>
					{/if}
				{/await}
			{/if}
		</div>
	{:else}
		{JSON.stringify(asset.error)}
	{/if}
{/await}

{#await data.fundamentals then fundamentals}
	{#if isSuccess(fundamentals.fundamentalsGroups)}
		<FundamentalGroups />
	{:else}
		{JSON.stringify(fundamentals.fundamentalsGroups.error)}
	{/if}
{/await}

{#await data.trade then trade}
	{#if isSuccess(trade)}
		<p>{trade.output.trade.p}</p>
	{:else}
		{JSON.stringify(trade.error)}
	{/if}
{/await}
<p>{data.start}</p>
<p>{data.end}</p>
{#await data.tradeHistory then tradeHistory}
	{#if isSuccess(tradeHistory)}
		<LineChart title="Close price" width={900} height={320} data={tradeHistory.output} />
	{:else}
		{JSON.stringify(tradeHistory.error)}
	{/if}
{/await}

{#await data.optionsChain then optionsChain}
	{#if isSuccess(optionsChain)}
		<OptionsChain data={optionsChain.output} />
	{:else}
		{JSON.stringify(optionsChain.error)}
	{/if}
{/await}

<style lang="scss">
	p {
		margin: 0;
	}
	.header {
		background-color: var(--grade-color);
		display: grid;
		grid-template-columns: 1fr 1fr; /* two columns */
		grid-template-rows: auto auto; /* two rows */
		align-items: center;
		border-radius: var(--rounded-xl);
	}

	/* First child: full height of first column */
	.header > :nth-child(1) {
		grid-column: 1; /* first column */
		grid-row: 1 / span 2; /* rows 1 and 2 */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: var(--text-6xl);
		line-height: var(--text-6xl-lh);
		text-transform: uppercase;
		border-right: solid 1px var(--theme-neutral-500);
		padding: calc(var(--spacing-unit) * 3);
	}

	/* Second child: top-right cell */
	.header > :nth-child(2) {
		grid-column: 2; /* second column */
		grid-row: 1; /* row 1 */
		text-align: center;
		padding: var(--spacing-unit);
	}

	/* Third child: bottom-right cell */
	.header > :nth-child(3) {
		grid-column: 2; /* second column */
		grid-row: 2; /* row 2 */
		text-align: center;
		padding: var(--spacing-unit);
	}
</style>
