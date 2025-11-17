<script lang="ts">
	import LineChart from '$lib/components/LineChart.svelte';
	import { isSuccess } from '@joyautomation/dark-matter';

	let { data } = $props();
	$effect(() => {
		console.log(data);
	});
</script>

{#await data.asset then asset}
	{#if isSuccess(asset)}
		<h1>{asset.output.symbol}</h1>
		<p>{asset.output.name}</p>
	{:else}
		{JSON.stringify(asset.error)}
	{/if}
{/await}

{#await data.fundamentals then fundamentals}
	{#if isSuccess(fundamentals)}
		<pre>{JSON.stringify(fundamentals.output, null, 2)}</pre>
	{:else}
		{JSON.stringify(fundamentals.error)}
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
