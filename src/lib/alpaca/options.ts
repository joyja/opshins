import type { AlpacaBar } from './request.ts';

export type AlpacaOptionChain = {
	next_page_token: string;
	snapshots: {
		[key: string]: {
			greeks: {
				delta: number;
				gamma: number;
				theta: number;
				vega: number;
				rho: number;
			};
			impliedVolatility: number;
			dailyBar: AlpacaBar;
			latestQuote: {
				ap: number; //ask price
				as: number; //ask size
				ax: string; //ask exchange
				bp: number; //bid price
				bs: number; //bid size
				bx: string; //bid exchange
				c: string; //condition
				t: string; //timestamp
			};
			latestTrade: {
				c: string; //condition
				p: number; //price
				s: number; //size
				t: string; //timestamp
				x: string; //exchange
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
