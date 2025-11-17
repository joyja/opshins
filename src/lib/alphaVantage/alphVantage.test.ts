import { describe, expect, it } from 'vitest';
import { avGetOverview } from './request.ts';
import { failOrTest } from '../testing.ts';

describe('Alpaca', () => {
	it('should be able to get overview for F', async () => {
		const response = await avGetOverview('F');

		failOrTest(response, (value) => {
			expect(value).toMatchSnapshot();
		});
	});
});
