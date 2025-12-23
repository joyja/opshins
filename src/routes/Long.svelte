<script lang="ts">
	import { formatDollarValue } from './utils';
	import type { Position } from './types';
	const { position }: { position: Position } = $props();
</script>

<p style:color={position.marketValue - position.costBasis > 0 ? 'green' : 'red'}>
	Total Gain/Loss: {formatDollarValue(position.marketValue - position.costBasis)}
</p>
<p>Cost Basis: {formatDollarValue(position.costBasis)}</p>
<p>Market Value: {formatDollarValue(position.marketValue)}</p>
<ul>
	{#each Object.entries(position.currentOptions) as [optionSymbol, optionPosition]}
		<li>{optionSymbol} {optionPosition.qty}</li>
	{/each}
</ul>
<h3>History</h3>
<ul>
	{#each position.history as activity}
		<li>
			{activity.symbol}
			{activity.side}
			{activity.qty} @ {formatDollarValue(activity.price)}
			{activity.date.toDateString()}
		</li>
	{/each}
</ul>
