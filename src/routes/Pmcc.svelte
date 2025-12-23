<script lang="ts">
	import type { Activity, Position } from './types';
	import { formatDollarValue } from './utils';

	const { position }: { position: Position } = $props();

	const getExpiryFromSymbol = (symbol: string): number => {
		const match = symbol.match(/^[A-Za-z]+(\d{6})/);
		return match ? parseInt(match[1]) : 0;
	};

	const leapExpiry = $derived(
		Math.max(...position.history.map((a) => getExpiryFromSymbol(a.symbol)))
	);

	const history = $derived(
		position.history.filter((activity) => getExpiryFromSymbol(activity.symbol) !== leapExpiry)
	);

	const leapHistory = $derived(
		position.history.find((activity) => getExpiryFromSymbol(activity.symbol) === leapExpiry)
	);

	const leap = $derived(position.currentOptions[leapHistory?.symbol || '']);

	type WheelLeg = {
		symbol: string;
		type: 'put' | 'call';
		open?: {
			date: Date;
			premium: number;
		};
		close?: {
			date: Date;
			premium: number;
		};
	};

	const legs = $derived(
		history.reduce(
			(acc, activity) => {
				if (!acc[activity.symbol]) {
					const optionType = activity.symbol.slice(10, 11);

					acc[activity.symbol] = {
						symbol: activity.symbol,
						type: optionType === 'C' ? 'call' : 'put'
					};
				}
				const side = activity.side;
				if (side === 'sell') {
					acc[activity.symbol].open = {
						date: activity.date,
						premium: activity.price
					};
				}
				if (activity.side === 'buy') {
					acc[activity.symbol].close = {
						date: activity.date,
						premium: activity.price
					};
				}
				if (activity.side === 'assigned') {
					acc[activity.symbol].close = {
						date: activity.date,
						premium: 0
					};
				}
				return acc;
			},
			{} as Record<string, WheelLeg>
		)
	);
	const calcPnLValue = (leg: WheelLeg): number => {
		if (!leg.open) {
			return 0;
		}
		if (!leg.close) {
			return leg.open.premium * 100;
		}
		return (leg.open.premium - leg.close.premium) * 100;
	};

	const calcPnL = (leg: WheelLeg): string => {
		if (!leg.open) {
			return 'Error';
		}
		return formatDollarValue(calcPnLValue(leg));
	};

	const calcTotalPremiumEarnings = (legs: Record<string, WheelLeg>) => {
		return Object.values(legs).reduce((acc, leg) => acc + calcPnLValue(leg), 0);
	};

	const assignments = $derived(
		history
			.filter((activity) => activity.side === 'assigned')
			.sort((a, b) => a.date.getTime() - b.date.getTime())
			.reduce(
				(acc, activity) => {
					if (activity.qty > 0) {
						acc.push({ boughtAt: activity.price, soldAt: null });
					} else if (acc.length > 0) {
						acc[acc.length - 1].soldAt = activity.price;
					}
					return acc;
				},
				[] as { boughtAt: number | null; soldAt: number | null }[]
			)
	);
</script>

<p>
	Total Gain/Loss: {formatDollarValue(
		leap.marketValue - (leapHistory?.price || 0) * 100 + calcTotalPremiumEarnings(legs)
	)}
</p>
<h4>Leap</h4>
<p>
	{leapHistory?.symbol} Purchased @ {formatDollarValue(leapHistory?.price || 0)}
</p>
<p>MarketValue: {formatDollarValue(leap.marketValue)}</p>

<h4>Premium Earnings</h4>
<ul>
	{#each Object.values(legs) as leg}
		<li>
			{leg.symbol}
			{leg.type}
			{calcPnL(leg)}
		</li>
	{/each}
</ul>

Total Premium Earnings: {formatDollarValue(calcTotalPremiumEarnings(legs))}
