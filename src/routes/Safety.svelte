<script lang="ts">
	import type { Position } from './types';
	import { formatDollarValue } from './utils';

	const { position }: { position: Position } = $props();

	const totalBought = $derived(
		position.history.filter((a) => a.side === 'buy').reduce((acc, a) => acc + a.price * a.qty, 0)
	);

	const totalSold = $derived(
		position.history.filter((a) => a.side === 'sell').reduce((acc, a) => acc + a.price * a.qty, 0)
	);

	const netCashFlow = $derived(totalSold - totalBought);
	const totalGainLoss = $derived(netCashFlow + position.marketValue);
</script>

<p>Total Gain/Loss: {formatDollarValue(totalGainLoss)}</p>
<p>Total Bought: {formatDollarValue(totalBought)}</p>
<p>Total Sold: {formatDollarValue(totalSold)}</p>
<p>Net Cash Flow: {formatDollarValue(netCashFlow)}</p>
<p>Current Market Value: {formatDollarValue(position.marketValue)}</p>
