import {
	fundamentalGroups,
	fundamentalsFunctions,
	fundamentalsGroupKeys,
	fundamentalsKeys,
	fundamentalWeights,
	getScoreFromLetter,
	getGradeFromScore,
	type Fundamentals,
	type FundamentalsGroupGrades,
	type FundamentalGroup
} from '../fundamentals';
import { getGradeConfig } from '../grades/fundamentals/grade.ts';
import {
	isSectorName,
	type FactorGradeConfig,
	type SectorName
} from '../grades/fundamentals/types.d.ts';
import type {
	AlphaVantageBalanceSheet,
	AlphaVantageBalanceSheetReport,
	AlphaVantageCashFlow,
	AlphaVantageCashFlowReport,
	AlphaVantageIncomeStatement,
	AlphaVantageIncomeStatementReport,
	AlphaVantageOverview
} from './request.ts';

export const numberOrNull = (value: string): number | null => {
	if (value == null) return null;
	const number = parseFloat(value);
	return Number.isFinite(number) ? number : null;
};

export const calcEarningsYield = (overview: AlphaVantageOverview): number | null => {
	const pe = numberOrNull(overview.PERatio ?? overview.TrailingPE ?? overview.ForwardPE);
	if (!pe || pe <= 0) return null;
	return 1 / pe;
};

export const calcBookToMarket = (
	overview: AlphaVantageOverview,
	balance: AlphaVantageBalanceSheetReport
): number | null => {
	const pb = numberOrNull(overview.PriceToBookRatio);
	if (pb && pb > 0) return 1 / pb;

	const equity = numberOrNull(balance.totalShareholderEquity);
	const mktCap = numberOrNull(overview.MarketCapitalization);
	if (!equity || !mktCap || mktCap <= 0) return null;
	return equity / mktCap;
};

export const calcSalesToPrice = (overview: AlphaVantageOverview): number | null => {
	const ps = numberOrNull(overview.PriceToSalesRatioTTM);
	if (ps && ps > 0) return 1 / ps;

	const rev = numberOrNull(overview.RevenueTTM);
	const mktCap = numberOrNull(overview.MarketCapitalization);
	if (!rev || !mktCap || mktCap <= 0) return null;
	return rev / mktCap;
};

export const calcFreeCashFlowTTM = (cash: AlphaVantageCashFlowReport): number | null => {
	const op = numberOrNull(cash.operatingCashflow);
	const capex = numberOrNull(cash.capitalExpenditures);
	if (op == null || capex == null) return null;
	return op - capex; // note: capex is usually negative in AV data
};

export const calcFreeCashFlowYield = (
	overview: AlphaVantageOverview,
	cash: AlphaVantageCashFlowReport
): number | null => {
	const fcf = calcFreeCashFlowTTM(cash);
	const mktCap = numberOrNull(overview.MarketCapitalization);
	if (fcf == null || !mktCap || mktCap <= 0) return null;
	return fcf / mktCap;
};

export const calcEBITDAYieldFromEV = (overview: AlphaVantageOverview): number | null => {
	const evToEbitda = numberOrNull(overview.EVToEBITDA);
	if (!evToEbitda || evToEbitda <= 0) return null;
	return 1 / evToEbitda;
};

export const calcGrossMargin = (income: AlphaVantageIncomeStatementReport): number | null => {
	const gross = numberOrNull(income.grossProfit);
	const rev = numberOrNull(income.totalRevenue);
	if (!gross || !rev || rev <= 0) return null;
	return gross / rev;
};

export const calcNetMargin = (income: AlphaVantageIncomeStatementReport): number | null => {
	const ni = numberOrNull(income.netIncome);
	const rev = numberOrNull(income.totalRevenue);
	if (!ni || !rev || rev <= 0) return null;
	return ni / rev;
};

export const calcFreeCashFlowMargin = (
	cash: AlphaVantageCashFlowReport,
	overview: AlphaVantageOverview
): number | null => {
	const fcf = calcFreeCashFlowTTM(cash);
	const rev = numberOrNull(overview.RevenueTTM);
	if (fcf == null || !rev || rev <= 0) return null;
	return fcf / rev;
};

export const calcAccrualsRatio = (
	cash: AlphaVantageCashFlowReport,
	income: AlphaVantageIncomeStatementReport,
	balance: AlphaVantageBalanceSheetReport
): number | null => {
	const ni = numberOrNull(income.netIncome ?? cash.netIncome);
	const opCF = numberOrNull(cash.operatingCashflow);
	const assets = numberOrNull(balance.totalAssets);
	if (ni == null || opCF == null || !assets || assets <= 0) return null;
	const accruals = ni - opCF;
	return accruals / assets;
};

export const calcTotalDebt = (balance: AlphaVantageBalanceSheetReport): number | null => {
	const total = numberOrNull(balance.shortLongTermDebtTotal);
	if (total != null) return total;

	const currentDebt = numberOrNull(balance.currentDebt ?? balance.shortTermDebt);
	const longTermDebt = numberOrNull(balance.longTermDebt ?? balance.longTermDebtNoncurrent);
	if (currentDebt == null && longTermDebt == null) return null;
	return (currentDebt || 0) + (longTermDebt || 0);
};

export const calcDebtToEquity = (balance: AlphaVantageBalanceSheetReport): number | null => {
	const debt = calcTotalDebt(balance);
	const equity = numberOrNull(balance.totalShareholderEquity);
	if (debt == null || !equity || equity <= 0) return null;
	return debt / equity;
};

export const calcDebtToAssets = (balance: AlphaVantageBalanceSheetReport): number | null => {
	const debt = calcTotalDebt(balance);
	const assets = numberOrNull(balance.totalAssets);
	if (debt == null || !assets || assets <= 0) return null;
	return debt / assets;
};

export const calcInterestCoverage = (income: AlphaVantageIncomeStatementReport): number | null => {
	const ebit = numberOrNull(income.ebit ?? income.operatingIncome);
	const interestExp = numberOrNull(income.interestExpense ?? income.interestAndDebtExpense);
	if (!ebit || !interestExp || interestExp === 0) return null;
	return ebit / Math.abs(interestExp);
};

export const calcCurrentRatio = (balance: AlphaVantageBalanceSheetReport): number | null => {
	const ca = numberOrNull(balance.totalCurrentAssets);
	const cl = numberOrNull(balance.totalCurrentLiabilities);
	if (!ca || !cl || cl <= 0) return null;
	return ca / cl;
};

export const calcQuickRatio = (balance: AlphaVantageBalanceSheetReport): number | null => {
	const cash = numberOrNull(
		balance.cashAndShortTermInvestments ?? balance.cashAndCashEquivalentsAtCarryingValue
	);
	const receivables = numberOrNull(balance.currentNetReceivables);
	const cl = numberOrNull(balance.totalCurrentLiabilities);
	if (!cl || cl <= 0) return null;
	return ((cash || 0) + (receivables || 0)) / cl;
};

export const calcLogMarketCap = (overview: AlphaVantageOverview): number | null => {
	const mktCap = numberOrNull(overview.MarketCapitalization);
	if (!mktCap || mktCap <= 0) return null;
	return Math.log(mktCap);
};

export const calcMovingAverageTrend = (overview: AlphaVantageOverview): number | null => {
	const ma50 = numberOrNull(overview['50DayMovingAverage']);
	const ma200 = numberOrNull(overview['200DayMovingAverage']);
	if (!ma50 || !ma200 || ma200 <= 0) return null;
	return ma50 / ma200;
};

export const processSectorName = (sector: string): SectorName => {
	if (isSectorName(sector)) return sector;
	if (sector === 'CONSUMER DEFENSIVE') return 'consumerStaples';
	if (sector === 'CONSUMER CYCLICAL') return 'consumerDiscretionary';
	if (sector === 'HEALTHCARE') return 'healthCare';
	if (sector === 'FINANCIAL SERVICES') return 'financials';
	if (sector === 'ENERGY') return 'energy';
	if (sector === 'INDUSTRIALS') return 'industrials';
	if (sector === 'TECHNOLOGY') return 'technology';
	if (sector === 'BASIC MATERIALS') return 'materials';
	if (sector === 'COMMUNICATION SERVICES') return 'communicationServices';
	if (sector === 'REAL ESTATE') return 'realEstate';
	if (sector === 'UTILITIES') return 'utilities';
	throw new Error(`Unknown sector: ${sector}`);
};

export const gradeValue = (
	value: number | null,
	config: FactorGradeConfig
): 'a' | 'b' | 'c' | 'd' | 'f' | null => {
	if (!value) return null;
	if (value >= config.a) return 'a';
	if (value >= config.b) return 'b';
	if (value >= config.c) return 'c';
	if (value >= config.d) return 'd';
	return 'f';
};

export const calculateFundamentals = (
	overview: AlphaVantageOverview,
	cashFlow: AlphaVantageCashFlow,
	balanceSheet: AlphaVantageBalanceSheet,
	incomeStatement: AlphaVantageIncomeStatement
): Fundamentals => {
	const sector = processSectorName(overview.Sector);
	const config = getGradeConfig(sector);
	return {
		sector,
		...(Object.fromEntries(
			fundamentalsKeys.map((key) => {
				const value = fundamentalsFunctions[key]({
					overview,
					cashFlow: cashFlow.annualReports[0],
					balanceSheet: balanceSheet.annualReports[0],
					incomeStatement: incomeStatement.annualReports[0]
				});
				return [
					key,
					{
						value,
						grade: gradeValue(value, config[key]),
						group: fundamentalGroups[key],
						weight: fundamentalWeights[key],
						config: config[key]
					}
				];
			})
		) as Omit<Fundamentals, 'sector'>)
	};
};

export const calculateFundamentalsGroups = (
	fundamentals: Fundamentals
): FundamentalsGroupGrades => {
	return Object.fromEntries(
		fundamentalsGroupKeys.map((key: FundamentalGroup) => {
			const groupFactors = Object.values(fundamentals)
				.filter((factor) => {
					if (typeof factor !== 'object') return false;
					return factor.group === key;
				})
				.reduce((acc, factor) => {
					if (typeof factor !== 'object' || !factor.grade) return acc;
					const score = getScoreFromLetter(factor.grade);
					return acc + factor.weight * score;
				}, 0);
			return [key, getGradeFromScore(groupFactors)];
		})
	) as FundamentalsGroupGrades;
};
