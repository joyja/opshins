<script lang="ts">
	import { isSuccess } from '@joyautomation/dark-matter';

	let { data } = $props();
</script>

{#await data.asset then asset}
	{#if isSuccess(asset)}
		<h1>{asset.output.symbol}</h1>
		<p>{asset.output.name}</p>
	{:else}
		{JSON.stringify(asset.error)}
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
		<p>{tradeHistory.output.bars.length}</p>
		<pre>{JSON.stringify(tradeHistory.output, null, 2)}</pre>
	{:else}
		{JSON.stringify(tradeHistory.error)}
	{/if}
{/await}
