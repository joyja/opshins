import type { Fundamentals } from '../../fundamentals/types.d.ts';

export type Direction = 'higherIsBetter' | 'lowerIsBetter';

export type FactorGradeConfig = {
	direction: Direction;
	a: number; // A/B cutoff
	b: number; // B/C cutoff
	c: number; // C/D cutoff
	d: number; // D/F cutoff
};

// Matches your Fundamentals shape
export type FundamentalsGradeConfig = Record<keyof Omit<Fundamentals, 'sector'>, FactorGradeConfig>;

export type SectorName =
	| 'utilities'
	| 'consumerStaples'
	| 'consumerDiscretionary'
	| 'healthCare'
	| 'financials'
	| 'energy'
	| 'industrials'
	| 'technology'
	| 'materials'
	| 'communicationServices'
	| 'realEstate';

export const isSectorName = (value: string): value is SectorName => {
	return (
		value in
		[
			'utilities',
			'consumerStaples',
			'consumerDiscretionary',
			'healthCare',
			'financials',
			'energy',
			'industrials',
			'technology',
			'materials',
			'communicationServices',
			'realEstate'
		]
	);
};

export type FundamentalsSectorOverrides = Record<SectorName, Partial<FundamentalsGradeConfig>>;
