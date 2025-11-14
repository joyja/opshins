import type { AlpacaBar } from './request.ts';

export type AlpacaOptionChain = {
	next_page_token: string;
	snapshots: {
		[key: string]: {
			dailyBar: AlpacaBar;
			latestQuote: {
				ap: number;
				as: number;
				ax: string;
				bp: number;
				bs: number;
				bx: string;
				c: string;
				t: string;
			};
			latestTrade: {
				c: string;
				p: number;
				s: number;
				t: string;
				x: string;
			};
			minuteBar: AlpacaBar;
			prevDailyBar: AlpacaBar;
		};
	};
};

export const isAlpacaOptionChain = (value: unknown): value is AlpacaOptionChain => {
	return (
		typeof value === 'object' &&
		value !== null &&
		'snapshots' in value &&
		typeof value.snapshots === 'object' &&
		value.snapshots !== null
	);
};
