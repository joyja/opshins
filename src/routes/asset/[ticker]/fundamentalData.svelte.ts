import type {
	Fundamentals,
	FundamentalsGroupGrades,
	fundamentalGroupWeights
} from '../../../lib/fundamentals.ts';
import type { Result } from '@joyautomation/dark-matter';

export const fundamentalData = $state<{
	fundamentals: Promise<{
		fundamentals: Result<Fundamentals>;
		fundamentalsGroups: Result<FundamentalsGroupGrades>;
	}> | null;
	fundamentalGroupWeights: typeof fundamentalGroupWeights | null;
}>({
	fundamentals: null,
	fundamentalGroupWeights: null
});
