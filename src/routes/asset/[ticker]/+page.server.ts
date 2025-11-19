import { createFail, createSuccess, isSuccess, type Result } from '@joyautomation/dark-matter';
import {
	alpacaGetAsset,
	alpacaGetBarsHistory,
	alpacaGetLatestTrade,
	getLastTradingDayRange
} from '../../../lib/alpaca/request.ts';
import {
	calculateFundamentals,
	calculateFundamentalsGroups
} from '../../../lib/alphaVantage/composite.ts';
import {
	avGetCashFlow,
	avGetOverview,
	avGetBalanceSheet,
	avGetIncomeStatement
} from '../../../lib/alphaVantage/request.ts';
import type { Fundamentals, FundamentalsGroupGrades } from '../../../lib/fundamentals.ts';

export const load = ({ params }: { params: { ticker: string } }) => {
	const { start, end } = getLastTradingDayRange();
	const fundamentals: Promise<{
		fundamentals: Result<Fundamentals>;
		fundamentalsGroups: Result<FundamentalsGroupGrades>;
	}> = Promise.all([
		avGetOverview(params.ticker),
		avGetCashFlow(params.ticker),
		avGetBalanceSheet(params.ticker),
		avGetIncomeStatement(params.ticker)
	])
		.then(([overview, cashFlow, balanceSheet, incomeStatement]) => {
			if (
				isSuccess(overview) &&
				isSuccess(cashFlow) &&
				isSuccess(balanceSheet) &&
				isSuccess(incomeStatement)
			) {
				return createSuccess(
					calculateFundamentals(
						overview.output,
						cashFlow.output,
						balanceSheet.output,
						incomeStatement.output
					)
				);
			} else {
				return createFail('Failed to calculate fundamentals');
			}
		})
		.then((fundamentals) => {
			return {
				fundamentals,
				fundamentalsGroups: isSuccess(fundamentals)
					? createSuccess(calculateFundamentalsGroups(fundamentals.output))
					: createFail('Failed to calculate fundamentals groups')
			};
		});

	return {
		ticker: params.ticker,
		// overview: avGetOverview(params.ticker),
		// cashFlow: avGetCashFlow(params.ticker),
		// balanceSheet: avGetBalanceSheet(params.ticker),
		// incomeStatement: avGetIncomeStatement(params.ticker),
		fundamentals,
		asset: alpacaGetAsset(params.ticker),
		trade: alpacaGetLatestTrade(params.ticker),
		start,
		end,
		tradeHistory: alpacaGetBarsHistory(params.ticker, start, end)
	};
};
