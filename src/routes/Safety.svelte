<script lang="ts">
	import type { Position } from './types';
	import { formatDollarValue } from './utils';

	const { position }: { position: Position } = $props();

	const totalSharesBought = $derived(
		position.history.filter((a) => a.side === 'buy').reduce((acc, a) => acc + a.qty, 0)
	);

	const costBasisOfSharesBought = $derived(
		position.history.filter((a) => a.side === 'buy').reduce((acc, a) => acc + a.price * a.qty, 0)
	);

	const avgCostPerShare = $derived(
		totalSharesBought > 0 ? costBasisOfSharesBought / totalSharesBought : 0
	);

	const totalSharesSold = $derived(
		position.history.filter((a) => a.side === 'sell').reduce((acc, a) => acc + a.qty, 0)
	);

	const costBasisOfSharesSold = $derived(avgCostPerShare * totalSharesSold);

	const proceedsFromSales = $derived(
		position.history.filter((a) => a.side === 'sell').reduce((acc, a) => acc + a.price * a.qty, 0)
	);

	const realizedGains = $derived(proceedsFromSales - costBasisOfSharesSold);
	const unrealizedGains = $derived(position.marketValue - position.costBasis);
	const totalEarnings = $derived(realizedGains + unrealizedGains);
</script>

<p style:color={totalEarnings > 0 ? 'green' : 'red'}>
	Total Earnings: {formatDollarValue(totalEarnings)}
</p>
<p>Realized Gains: {formatDollarValue(realizedGains)}</p>
<p>Unrealized Gains: {formatDollarValue(unrealizedGains)}</p>
<p>Current Market Value: {formatDollarValue(position.marketValue)}</p>
