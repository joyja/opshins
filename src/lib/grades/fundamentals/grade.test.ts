import { describe, it, expect } from 'vitest';
import { getGradeConfig, gradeFundamentals } from './grade.ts';
import { fundamentalsSectorOverrides } from './overrides.ts';

describe('applyOverrides', () => {
	it('should apply overrides', () => {
		const result = getGradeConfig('utilities');
		expect(result.leverage.debtToEquity).toBeDefined();
		if (result.leverage.debtToEquity) {
			expect(result.leverage.debtToEquity.a).toBe(
				fundamentalsSectorOverrides.utilities.leverage?.debtToEquity?.a
			);
			expect(result.leverage.debtToEquity.b).toBe(
				fundamentalsSectorOverrides.utilities.leverage?.debtToEquity?.b
			);
			expect(result.leverage.debtToEquity.c).toBe(
				fundamentalsSectorOverrides.utilities.leverage?.debtToEquity?.c
			);
			expect(result.leverage.debtToEquity.d).toBe(
				fundamentalsSectorOverrides.utilities.leverage?.debtToEquity?.d
			);
		}
	});
	it('should grade fundamentals', () => {
		const result = gradeFundamentals({
			sector: 'utilities',
			value: {
				earningsYield: 0.1,
				bookToMarket: 1.2,
				salesToPrice: 0.5,
				fcfYield: 0.08,
				evToEbitda: 0.12
			},
			profitability: {
				returnOnEquity: 0.2,
				returnOnAssets: 0.08,
				grossMargin: 0.5,
				operatingMargin: 0.18,
				netMargin: 0.15,
				fcfMargin: 0.15,
				accrualsRatio: -0.1
			},
			leverage: {
				debtToEquity: 1,
				debtToAssets: 0.4,
				interestCoverage: 4,
				currentRatio: 2,
				quickRatio: 1.5
			},
			growth: {
				revenueGrowthYoY: 0.2,
				earningsGrowthYoY: 0.25
			},
			size: {
				log: 21.4,
				maTrend: 1.1
			}
		});
		console.log(result);
	});
});
