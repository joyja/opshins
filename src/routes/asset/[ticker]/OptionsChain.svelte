<script lang="ts">
	import type { AlpacaOptionChain } from '$lib/alpaca/options';
	import type { AlpacaBar } from '$lib/alpaca/request';
	// Snapshot type helper extracted from AlpacaOptionChain
	type OptionSnapshot = AlpacaOptionChain['snapshots'][string];

	// OptionsChain maps expirationDate -> strike -> { call: OptionSnapshot[]; put: OptionSnapshot[] }
	export type OptionsChain = Record<
		string,
		Record<
			string,
			{
				call: OptionSnapshot;
				put: OptionSnapshot;
			}
		>
	>;
	let { chain }: { chain: AlpacaOptionChain } = $props();
	const keys = Object.keys(chain.snapshots);
	const expirationDates = Array.from(new Set(keys.map((key) => key.slice(4, 10))));
	const optionsChain = Object.fromEntries(
		expirationDates.map((expirationDate) => {
			const keysForExpiration = keys.filter((key) => key.slice(4, 10) === expirationDate);
			const strikes = Array.from(new Set(keysForExpiration.map((key) => key.slice(12, 20))));
			const strikesData = Object.fromEntries(
				strikes
					.map((strike) => {
						return [
							strike,
							{
								call: keysForExpiration
									.filter((key) => key.slice(12, 20) === strike && key.slice(10, 11) === 'C')
									.map((key) => chain.snapshots[key])[0],
								put: keysForExpiration
									.filter((key) => key.slice(12, 20) === strike && key.slice(10, 11) === 'P')
									.map((key) => chain.snapshots[key])[0]
							}
						];
					})
					.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
			);
			return [expirationDate, strikesData];
		})
	) as OptionsChain;
</script>

<!-- <pre>{JSON.stringify(optionsChain, null, 2)}</pre> -->
{#each expirationDates as expirationDate}
	<table>
		<thead>
			<tr>
				<th>Bid</th>
				<th>Ask</th>
				<th>Volume</th>
				<th>Strike</th>
				<th>Bid</th>
				<th>Ask</th>
				<th>Volume</th>
			</tr>
		</thead>
		<tbody>
			{#each Object.entries(optionsChain[expirationDate]) as [strike, strikeData]}
				<tr>
					<td>{strikeData.call.latestQuote.bp}</td>
					<td>{strikeData.call.latestQuote.ap}</td>
					<td>{strikeData.call.latestQuote.as + strikeData.call.latestQuote.bs}</td>
					<td>{(parseInt(strike) / 1000).toFixed(2)}</td>
					<td>{strikeData.put?.latestQuote?.bp || '-'}</td>
					<td>{strikeData.put?.latestQuote?.ap || '-'}</td>
					<td
						>{strikeData.put?.latestQuote
							? strikeData.put?.latestQuote?.as + strikeData.put?.latestQuote?.bs
							: '-'}</td
					>
				</tr>
			{/each}
		</tbody>
	</table>
{/each}

<style lang="scss">
	table {
		border-collapse: collapse;
		width: 100%;
		margin-bottom: 1rem;

		th,
		td {
			border: 1px solid #ddd;
			padding: 0.5rem;
			text-align: left;
		}
	}
</style>
