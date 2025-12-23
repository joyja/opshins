<script lang="ts">
	import type { Activity, Position } from './types';
	import { formatDollarValue } from './utils';

	const { position }: { position: Position } = $props();

	const history = $derived(position.history);

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

	const legs = history.reduce(
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

	const realizedGains = $derived(
		assignments.reduce((acc, assignment) => {
			if (!assignment.boughtAt || !assignment.soldAt) {
				return acc;
			}
			return acc + (assignment.soldAt - assignment.boughtAt) * 100;
		}, 0)
	);
</script>

{#if position.qty > 0}
	<p
		style:color={position.marketValue -
			((assignments[0].boughtAt || 0) * 100 - calcTotalPremiumEarnings(legs)) >
		0
			? 'green'
			: 'red'}
	>
		Total Gain/Loss: {formatDollarValue(
			position.marketValue - ((assignments[0].boughtAt || 0) * 100 - calcTotalPremiumEarnings(legs))
		)}
	</p>
{:else}
	<p style:color={calcTotalPremiumEarnings(legs) + realizedGains > 0 ? 'green' : 'red'}>
		Total Gain/Loss: {formatDollarValue(calcTotalPremiumEarnings(legs) + realizedGains)}
	</p>
{/if}
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
<h4>Assignments</h4>
<ul>
	{#each assignments as assignment}
		<li>
			Bought At: {formatDollarValue((assignment.boughtAt || 0) * 100)}
			{#if assignment.soldAt}
				Sold At: {formatDollarValue((assignment.soldAt || 0) * 100)}
			{:else}
				Holding At: {formatDollarValue(position.marketValue)}
			{/if}
		</li>
	{/each}
</ul>

{#if position.qty > 0}
	Overall Cost Basis: {formatDollarValue(
		(assignments[0].boughtAt || 0) * 100 - calcTotalPremiumEarnings(legs)
	)}
{:else}
	Not Currently Holding
{/if}
