<script lang="ts">
	export let data: {
		next_page_token?: string;
		snapshots: Record<string, any>;
	};

	type OptionSide = 'CALL' | 'PUT';

	type OptionRow = {
		symbol: string;
		ticker: string;
		expiration: string;
		side: OptionSide;
		strike: number;
		last: number | null;
		bid: number | null;
		ask: number | null;
		volume: number | null;
		iv: number | null;
		delta: number | null;
		gamma: number | null;
		theta: number | null;
		vega: number | null;
	};

	function parseSymbol(symbol: string) {
		// Example: SOFI251121P00029500
		// Ticker: SOFI
		// Expiration: 251121 (YYMMDD)
		// Side: P / C
		// Strike: 00029500 -> 29.5 (Alpaca-style OCC format: /1000)
		const match = symbol.match(/^([A-Z]+)(\d{6})([CP])(\d{8})$/);
		if (!match) {
			return {
				ticker: symbol,
				expiration: '',
				side: 'CALL' as OptionSide,
				strike: NaN
			};
		}

		const [, ticker, exp, cp, strikeRaw] = match;
		const side: OptionSide = cp === 'C' ? 'CALL' : 'PUT';

		// OCC price encoding: 8 digits, last 3 are decimals
		const strike = Number(strikeRaw) / 1000;

		const yy = exp.slice(0, 2);
		const mm = exp.slice(2, 4);
		const dd = exp.slice(4, 6);
		const expiration = `20${yy}-${mm}-${dd}`;

		return { ticker, expiration, side, strike };
	}

	function toNumberOrNull(x: unknown): number | null {
		return typeof x === 'number' ? x : null;
	}

	const allRows: OptionRow[] = Object.entries(data.snapshots ?? {})
		.map(([symbol, snapshot]) => {
			const { ticker, expiration, side, strike } = parseSymbol(symbol);

			const last = toNumberOrNull(snapshot.latestTrade?.p);
			const bid = toNumberOrNull(snapshot.latestQuote?.bp);
			const ask = toNumberOrNull(snapshot.latestQuote?.ap);
			const volume = toNumberOrNull(snapshot.dailyBar?.v);

			const iv = toNumberOrNull(snapshot.impliedVolatility);
			const greeks = snapshot.greeks ?? {};
			const delta = toNumberOrNull(greeks.delta);
			const gamma = toNumberOrNull(greeks.gamma);
			const theta = toNumberOrNull(greeks.theta);
			const vega = toNumberOrNull(greeks.vega);

			return {
				symbol,
				ticker,
				expiration,
				side,
				strike,
				last,
				bid,
				ask,
				volume,
				iv,
				delta,
				gamma,
				theta,
				vega
			};
		})
		.filter((row) => !Number.isNaN(row.strike));

	const calls = allRows.filter((r) => r.side === 'CALL').sort((a, b) => a.strike - b.strike);

	const puts = allRows.filter((r) => r.side === 'PUT').sort((a, b) => a.strike - b.strike);

	const underlying = calls[0]?.ticker ?? puts[0]?.ticker ?? '';
	const expiration = calls[0]?.expiration ?? puts[0]?.expiration ?? '';
</script>

<div class="chain-container">
	<div class="chain-header">
		<div>
			<h2>{underlying} Options Chain</h2>
			{#if expiration}
				<div style="font-size: 0.8rem; color: #64748b;">
					Expiration: {expiration}
				</div>
			{/if}
		</div>
		<div style="font-size: 0.75rem; color: #94a3b8;">
			{Object.keys(data.snapshots ?? {}).length} contracts
		</div>
	</div>

	<div class="tables">
		<div class="panel">
			<div class="panel-header">Calls</div>
			<div style="max-height: 420px; overflow: auto;">
				<table>
					<thead>
						<tr>
							<th>Strike</th>
							<th>Last</th>
							<th>Bid</th>
							<th>Ask</th>
							<th>Vol</th>
							<th>IV</th>
							<th>Δ</th>
							<th>Γ</th>
							<th>Θ</th>
							<th>Vega</th>
						</tr>
					</thead>
					<tbody>
						{#each calls as row}
							<tr>
								<td class="strike-col">
									{row.strike.toFixed(2)}
									<div class="symbol">{row.symbol}</div>
								</td>
								<td>{row.last ?? '-'}</td>
								<td>{row.bid ?? '-'}</td>
								<td>{row.ask ?? '-'}</td>
								<td>{row.volume ?? '-'}</td>
								<td class="iv-col">
									{#if row.iv != null}
										{(row.iv * 100).toFixed(1)}%
									{:else}
										-
									{/if}
								</td>
								<td class="greek-col">{row.delta?.toFixed(2) ?? '-'}</td>
								<td class="greek-col">{row.gamma?.toFixed(2) ?? '-'}</td>
								<td class="greek-col">{row.theta?.toFixed(2) ?? '-'}</td>
								<td class="greek-col">{row.vega?.toFixed(2) ?? '-'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<div class="panel">
			<div class="panel-header">Puts</div>
			<div style="max-height: 420px; overflow: auto;">
				<table>
					<thead>
						<tr>
							<th>Strike</th>
							<th>Last</th>
							<th>Bid</th>
							<th>Ask</th>
							<th>Vol</th>
							<th>IV</th>
							<th>Δ</th>
							<th>Γ</th>
							<th>Θ</th>
							<th>Vega</th>
						</tr>
					</thead>
					<tbody>
						{#each puts as row}
							<tr>
								<td class="strike-col">
									{row.strike.toFixed(2)}
									<div class="symbol">{row.symbol}</div>
								</td>
								<td>{row.last ?? '-'}</td>
								<td>{row.bid ?? '-'}</td>
								<td>{row.ask ?? '-'}</td>
								<td>{row.volume ?? '-'}</td>
								<td class="iv-col">
									{#if row.iv != null}
										{(row.iv * 100).toFixed(1)}%
									{:else}
										-
									{/if}
								</td>
								<td class="greek-col">{row.delta?.toFixed(2) ?? '-'}</td>
								<td class="greek-col">{row.gamma?.toFixed(2) ?? '-'}</td>
								<td class="greek-col">{row.theta?.toFixed(2) ?? '-'}</td>
								<td class="greek-col">{row.vega?.toFixed(2) ?? '-'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<style>
	.chain-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.chain-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tables {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 0.75rem;
	}

	.panel {
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--panel-bg, #ffffff);
	}

	.panel-header {
		padding: 0.5rem 0.75rem;
		font-weight: 600;
		font-size: 0.9rem;
		background: var(--panel-header-bg, #f8fafc);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8rem;
	}

	thead {
		background: #f8fafc;
	}

	th,
	td {
		padding: 0.25rem 0.5rem;
		text-align: right;
		white-space: nowrap;
	}

	th:first-child,
	td:first-child {
		text-align: left;
	}

	tbody tr:nth-child(even) {
		background: #f9fafb;
	}

	.strike-col {
		font-weight: 600;
	}

	.greek-col {
		color: #64748b;
	}

	.iv-col {
		font-weight: 500;
	}

	.symbol {
		font-size: 0.7rem;
		color: #6b7280;
	}
</style>
