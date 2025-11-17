import { fundamentalsGradeConfigDefault } from './defaults.ts';
import { fundamentalsSectorOverrides } from './overrides.ts';
import type { FundamentalsGradeConfig } from './types.d.ts';
import type { SectorName } from './types.d.ts';

export const getGradeConfig = (sector: SectorName): FundamentalsGradeConfig => {
	const overrides = fundamentalsSectorOverrides[sector];
	return Object.fromEntries(
		Object.entries(fundamentalsGradeConfigDefault).map(([key, value]) => {
			if (overrides[key as keyof FundamentalsGradeConfig]) {
				return [
					key,
					{
						...value,
						...overrides[key as keyof FundamentalsGradeConfig]
					}
				];
			}
			return [key, value];
		})
	) as FundamentalsGradeConfig;
};
