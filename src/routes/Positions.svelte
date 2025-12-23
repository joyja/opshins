<script lang="ts">
	import type { AlpacaActivities, AlpacaPosition, AlpacaPositions } from '$lib/alpaca/request';
	import Long from './Long.svelte';
	import Pmcc from './Pmcc.svelte';
	import Safety from './Safety.svelte';
	import type { Activity, OptionPosition, Position } from './types';
	import Wheel from './Wheel.svelte';

	const { positions, activities }: { positions: AlpacaPositions; activities: AlpacaActivities } =
		$props();

	const userContext = {
		CSCO: {
			strategy: 'PMCC'
		},
		NVDA: {
			strategy: 'Long'
		},
		GOOGL: {
			strategy: 'Long'
		},
		DOCN: {
			strategy: 'Wheel'
		},
		INTC: {
			strategy: 'Wheel'
		},
		SGOV: {
			strategy: 'Safety'
		}
	};

	type UserContextKey = keyof typeof userContext;

	const getUnderlyingSymbol = (symbol: string): string => {
		const match = symbol.match(/^([A-Za-z]+)/);
		return match ? match[1] : symbol;
	};

	const getStrikeFromOptionSymbol = (symbol: string): number => {
		const match = symbol.match(/(\d{8})$/);
		return match ? parseInt(match[1]) / 1000 : 0;
	};
	const equityHistories = $derived(
		activities.reduce(
			(acc, activity) => {
				if (activity.activity_type !== 'FILL' && activity.activity_type !== 'OPASN') {
					return acc;
				}
				const symbol = getUnderlyingSymbol(activity.symbol);
				if (!acc[symbol]) {
					acc[symbol] = [];
				}

				acc[symbol].push({
					symbol: activity.symbol,
					date:
						activity.activity_type === 'FILL'
							? new Date(activity.transaction_time)
							: new Date(activity.date),
					price:
						activity.activity_type === 'FILL'
							? parseFloat(activity.price)
							: getStrikeFromOptionSymbol(activity.symbol),
					qty: parseFloat(activity.qty),
					side: activity.activity_type === 'FILL' ? activity.side : 'assigned'
				});
				return acc;
			},
			{} as Record<string, Activity[]>
		)
	);
	const equities = $derived(
		positions.reduce(
			(acc, position) => {
				if (position.asset_class.includes('equity') && !acc[position.symbol]) {
					const { symbol } = position;
					acc[symbol] = {
						symbol: symbol,
						strategy: userContext[symbol as UserContextKey]?.strategy || 'unknown',
						qty: parseInt(position.qty),
						costBasis: parseFloat(position.cost_basis),
						marketValue: parseFloat(position.market_value),
						history: equityHistories[symbol] || [],
						currentOptions: {}
					};
				} else if (position.asset_class.includes('option')) {
					const { symbol } = position;
					const underlyingSymbol = getUnderlyingSymbol(symbol);
					if (!acc[underlyingSymbol]) {
						acc[underlyingSymbol] = {
							symbol: underlyingSymbol,
							qty: 0,
							costBasis: 0,
							marketValue: 0,
							strategy: userContext[underlyingSymbol as UserContextKey]?.strategy || 'unknown',
							history: equityHistories[underlyingSymbol] || [],
							currentOptions: {}
						};
					} else {
						acc[underlyingSymbol].currentOptions[symbol] = {
							symbol,
							qty: position.qty,
							marketValue: parseFloat(position.market_value)
						};
					}
				}
				return acc;
			},
			{} as Record<string, Position>
		)
	);
	const formatDollarValue = (value: number): string => {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
	};
</script>

<section>
	{#each Object.entries(equities) as [symbol, position]}
		<article>
			<h2>{symbol}</h2>
			<p>Shares: {position.qty}</p>
			{#if position.strategy === 'Wheel'}
				<h3>Wheel</h3>
				<Wheel {position} />
			{:else if position.strategy === 'PMCC'}
				<h3>PMCC</h3>
				<Pmcc {position} />
			{:else if position.strategy === 'Long'}
				<h3>Long</h3>
				<Long {position} />
			{:else if position.strategy === 'Safety'}
				<h3>Safety</h3>
				<Safety {position} />
			{:else}
				<h3>Unknown Strategy</h3>
			{/if}
		</article>
	{/each}
</section>

<style lang="scss">
	section {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
	}
	article {
		border: solid 1px #ccc;
		padding: 1rem;
		margin: 1rem;
	}
</style>
