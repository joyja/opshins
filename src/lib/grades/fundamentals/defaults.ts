import type { FundamentalsGradeConfig } from './types.d.ts';

export const fundamentalsGradeConfigDefault: FundamentalsGradeConfig = {
	// Earnings Yield (1/PE)
	earningsYield: {
		direction: 'higherIsBetter',
		a: 0.1, // ≥10% → A
		b: 0.07, // ≥7%  → B
		c: 0.05, // ≥5%  → C
		d: 0.03 // ≥3%  → D else F
	},
	// Book-to-Market (rough global defaults)
	// A: ≥1.2, B: 0.8–1.2, C: 0.5–0.8, D: 0.3–0.5, F: <0.3
	bookToMarket: {
		direction: 'higherIsBetter',
		a: 1.2,
		b: 0.8,
		c: 0.5,
		d: 0.3
	},
	// Sales-to-Price (Revenue Yield)
	// A: ≥50%, B: 30–50%, C: 15–30%, D: 7–15%, F: <7%
	salesToPrice: {
		direction: 'higherIsBetter',
		a: 0.5,
		b: 0.3,
		c: 0.15,
		d: 0.07
	},
	// FCF Yield
	// A: ≥8%, B: 5–8%, C: 3–5%, D: 1–3%, F: <1%
	fcfYield: {
		direction: 'higherIsBetter',
		a: 0.08,
		b: 0.05,
		c: 0.03,
		d: 0.01
	},
	// EBITDA/EV
	// A: ≥12%, B: 8–12%, C: 5–8%, D: 2–5%, F: <2%
	evToEbitda: {
		direction: 'higherIsBetter',
		a: 0.12,
		b: 0.08,
		c: 0.05,
		d: 0.02
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
		direction: 'lowerIsBetter',
		// ~<2B, 2–10B, 10–50B, 50–200B, >200B
		a: 21.4, // A
		b: 23.0, // B
		c: 24.6, // C
		d: 26.0 // D else F
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
