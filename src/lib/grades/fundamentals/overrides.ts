import type { FundamentalsSectorOverrides } from './types.d.ts';

export const fundamentalsSectorOverrides: FundamentalsSectorOverrides = {
	utilities: {
		debtToEquity: {
			direction: 'lowerIsBetter',
			a: 1.0,
			b: 2.0,
			c: 3.0,
			d: 4.0
		},
		debtToAssets: {
			direction: 'lowerIsBetter',
			a: 0.4,
			b: 0.55,
			c: 0.7,
			d: 0.85
		},
		interestCoverage: {
			direction: 'higherIsBetter',
			a: 4,
			b: 3,
			c: 2,
			d: 1.2
		},
		operatingMargin: {
			direction: 'higherIsBetter',
			a: 0.18,
			b: 0.12,
			c: 0.07,
			d: 0.03
		}
	},
	consumerStaples: {
		grossMargin: {
			direction: 'higherIsBetter',
			a: 0.35,
			b: 0.25,
			c: 0.15,
			d: 0.08
		},
		operatingMargin: {
			direction: 'higherIsBetter',
			a: 0.15,
			b: 0.1,
			c: 0.06,
			d: 0.03
		},
		revenueGrowthYoY: {
			direction: 'higherIsBetter',
			a: 0.1,
			b: 0.05,
			c: 0.02,
			d: 0.0
		}
	},
	consumerDiscretionary: {
		operatingMargin: {
			direction: 'higherIsBetter',
			a: 0.18,
			b: 0.1,
			c: 0.05,
			d: 0.02
		},
		revenueGrowthYoY: {
			direction: 'higherIsBetter',
			a: 0.25,
			b: 0.12,
			c: 0.05,
			d: 0.0
		}
	},
	healthCare: {
		grossMargin: {
			direction: 'higherIsBetter',
			a: 0.6,
			b: 0.45,
			c: 0.3,
			d: 0.15
		},
		operatingMargin: {
			direction: 'higherIsBetter',
			a: 0.25,
			b: 0.15,
			c: 0.08,
			d: 0.03
		},
		revenueGrowthYoY: {
			direction: 'higherIsBetter',
			a: 0.15,
			b: 0.08,
			c: 0.04,
			d: 0.0
		}
	},
	financials: {
		bookToMarket: {
			direction: 'higherIsBetter',
			// Banks/insurers tend to run higher B/M than average
			a: 1.2,
			b: 0.8,
			c: 0.5,
			d: 0.25
		},
		debtToEquity: {
			direction: 'lowerIsBetter',
			a: 2.0,
			b: 4.0,
			c: 6.0,
			d: 8.0
		},
		interestCoverage: {
			direction: 'higherIsBetter',
			a: 3,
			b: 2,
			c: 1.5,
			d: 1.0
		}
	},
	energy: {
		operatingMargin: {
			direction: 'higherIsBetter',
			a: 0.18,
			b: 0.1,
			c: 0.05,
			d: 0.02
		},
		netMargin: {
			direction: 'higherIsBetter',
			a: 0.12,
			b: 0.07,
			c: 0.04,
			d: 0.01
		},
		debtToEquity: {
			direction: 'lowerIsBetter',
			a: 0.8,
			b: 1.5,
			c: 2.5,
			d: 3.5
		}
	},
	industrials: {
		operatingMargin: {
			direction: 'higherIsBetter',
			a: 0.15,
			b: 0.1,
			c: 0.06,
			d: 0.03
		},
		interestCoverage: {
			direction: 'higherIsBetter',
			a: 5,
			b: 3,
			c: 2,
			d: 1.3
		}
	},
	technology: {
		bookToMarket: {
			direction: 'higherIsBetter',
			// Tech normally has low B/M; don't punish as harshly
			a: 0.5,
			b: 0.35,
			c: 0.2,
			d: 0.1
		},
		grossMargin: {
			direction: 'higherIsBetter',
			a: 0.55,
			b: 0.4,
			c: 0.25,
			d: 0.12
		},
		operatingMargin: {
			direction: 'higherIsBetter',
			a: 0.25,
			b: 0.15,
			c: 0.08,
			d: 0.04
		},
		revenueGrowthYoY: {
			direction: 'higherIsBetter',
			a: 0.25,
			b: 0.15,
			c: 0.07,
			d: 0.0
		}
	},
	materials: {
		grossMargin: {
			direction: 'higherIsBetter',
			a: 0.35,
			b: 0.25,
			c: 0.15,
			d: 0.08
		},
		operatingMargin: {
			direction: 'higherIsBetter',
			a: 0.18,
			b: 0.12,
			c: 0.06,
			d: 0.03
		},
		bookToMarket: {
			direction: 'higherIsBetter',
			a: 1.0,
			b: 0.7,
			c: 0.45,
			d: 0.25
		}
	},
	communicationServices: {
		operatingMargin: {
			direction: 'higherIsBetter',
			a: 0.2,
			b: 0.12,
			c: 0.06,
			d: 0.03
		},
		bookToMarket: {
			direction: 'higherIsBetter',
			a: 0.9,
			b: 0.6,
			c: 0.35,
			d: 0.18
		}
	},
	realEstate: {
		bookToMarket: {
			direction: 'higherIsBetter',
			// REITs/real estate have very asset-heavy balance sheets
			a: 1.4,
			b: 1.0,
			c: 0.7,
			d: 0.4
		},
		debtToEquity: {
			direction: 'lowerIsBetter',
			a: 1.0,
			b: 2.0,
			c: 3.0,
			d: 4.5
		},
		debtToAssets: {
			direction: 'lowerIsBetter',
			a: 0.45,
			b: 0.6,
			c: 0.75,
			d: 0.9
		}
	}
};
