import type { Fundamentals, FundamentalsGroupGrades } from '../../../lib/fundamentals.ts';
import type { Result } from '@joyautomation/dark-matter';

export const fundamentalData = $state<{
	fundamentals: Promise<{
		fundamentals: Result<Fundamentals>;
		fundamentalsGroups: Result<FundamentalsGroupGrades>;
	}> | null;
}>({
	fundamentals: null
});
