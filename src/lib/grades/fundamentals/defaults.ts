import type { FundamentalsGradeConfig } from './types.d.ts';

export const fundamentalsGradeConfigDefault: FundamentalsGradeConfig = {
	// VALUE (wheel-optimized)
	// Goal: avoid overpaying, but don't artificially punish quality large caps

	// Earnings Yield (1/PE)
	// A: ≥6%   (PE ≤ ~16)
	// B: ≥4%   (PE ≤ ~25)
	// C: ≥2.5% (PE ≤ ~40)
	// D: ≥1.5% (PE ≤ ~65)
	// F: <1.5%
	earningsYield: {
		direction: 'higherIsBetter',
		a: 0.06,
		b: 0.04,
		c: 0.025,
		d: 0.015
	},

	// Book-to-Market
	// This metric is not helpful for wheel stocks; optional to leave at zero weight.
	// Keeping the structure but using very broad, non-punitive cutoffs.
	bookToMarket: {
		direction: 'higherIsBetter',
		a: 0.8, // A
		b: 0.5, // B
		c: 0.3, // C
		d: 0.1 // D else F
	},

	// Sales-to-Price (Revenue Yield)
	// A: ≥20%
	// B: ≥12%
	// C: ≥7%
	// D: ≥4%
	// F < 4%
	salesToPrice: {
		direction: 'higherIsBetter',
		a: 0.2,
		b: 0.12,
		c: 0.07,
		d: 0.04
	},

	// Free Cash Flow Yield
	// A: ≥5%
	// B: ≥3%
	// C: ≥2%
	// D: ≥1%
	// F < 1%
	fcfYield: {
		direction: 'higherIsBetter',
		a: 0.05,
		b: 0.03,
		c: 0.02,
		d: 0.01
	},

	// EV/EBITDA (inverted)
	// A: ≥10%
	// B: ≥7%
	// C: ≥5%
	// D: ≥3%
	// F < 3%
	evToEbitda: {
		direction: 'higherIsBetter',
		a: 0.1,
		b: 0.07,
		c: 0.05,
		d: 0.03
	},
	// ROE
	returnOnEquity: {
		direction: 'higherIsBetter',
		a: 0.2,
		b: 0.15,
		c: 0.1,
		d: 0.05
	},
	// ROA
	returnOnAssets: {
		direction: 'higherIsBetter',
		a: 0.08,
		b: 0.05,
		c: 0.03,
		d: 0.01
	},
	// Gross Margin
	grossMargin: {
		direction: 'higherIsBetter',
		a: 0.5,
		b: 0.35,
		c: 0.2,
		d: 0.1
	},
	// Operating Margin
	operatingMargin: {
		direction: 'higherIsBetter',
		a: 0.2,
		b: 0.12,
		c: 0.07,
		d: 0.03
	},
	// Net Margin
	netMargin: {
		direction: 'higherIsBetter',
		a: 0.15,
		b: 0.1,
		c: 0.05,
		d: 0.02
	},
	// FCF Margin
	fcfMargin: {
		direction: 'higherIsBetter',
		a: 0.15,
		b: 0.1,
		c: 0.05,
		d: 0.02
	},
	// Accruals (lower better)
	accrualsRatio: {
		direction: 'lowerIsBetter',
		a: -0.1,
		b: -0.03,
		c: 0.03,
		d: 0.07
	},
	// Global “default” leverage expectations (non-utility, non-REIT, non-bank)
	// Debt/Equity
	debtToEquity: {
		direction: 'lowerIsBetter',
		a: 0.5, // ≤0.5 A
		b: 1.0, // ≤1.0 B
		c: 1.5, // ≤1.5 C
		d: 2.5 // ≤2.5 D else F
	},
	// Debt/Assets
	debtToAssets: {
		direction: 'lowerIsBetter',
		a: 0.25, // ≤25% A
		b: 0.4, // ≤40% B
		c: 0.6, // ≤60% C
		d: 0.8 // ≤80% D else F
	},
	// Interest Coverage
	interestCoverage: {
		direction: 'higherIsBetter',
		a: 8, // ≥8x A
		b: 5, // ≥5x B
		c: 3, // ≥3x C
		d: 1.5 // ≥1.5x D else F
	},
	// Current Ratio
	currentRatio: {
		direction: 'higherIsBetter',
		a: 2.0,
		b: 1.5,
		c: 1.0,
		d: 0.8
	},
	// Quick Ratio
	quickRatio: {
		direction: 'higherIsBetter',
		a: 1.5,
		b: 1.0,
		c: 0.7,
		d: 0.5
	},
	// Revenue YoY
	revenueGrowthYoY: {
		direction: 'higherIsBetter',
		a: 0.2,
		b: 0.1,
		c: 0.05,
		d: 0.0
	},
	// Earnings YoY
	earningsGrowthYoY: {
		direction: 'higherIsBetter',
		a: 0.25,
		b: 0.1,
		c: 0.05,
		d: 0.0
	},
	// log(MarketCap) – smaller is better (value/size tilt)
	log: {
		direction: 'higherIsBetter', // ← FIXED
		a: 26.0, // ≥26 → Mega-cap → A
		b: 24.6, // ≥24.6 → Large-cap → B
		c: 23.0, // ≥23 → Mid-cap → C
		d: 21.4 // ≥21.4 → Small-cap → D
	},
	// MA trend 50d/200d
	maTrend: {
		direction: 'higherIsBetter',
		a: 1.1,
		b: 1.03,
		c: 0.97,
		d: 0.9
	}
};
