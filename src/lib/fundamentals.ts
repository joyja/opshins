import type {
	AlphaVantageBalanceSheetReport,
	AlphaVantageCashFlowReport,
	AlphaVantageIncomeStatementReport,
	AlphaVantageOverview
} from './alphaVantage/request.ts';

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

export type Grade = 'a' | 'b' | 'c' | 'd' | 'f';

export const fundamentalsGroupKeys = [
	'value',
	'profitability',
	'leverage',
	'growth',
	'size'
] as const;

export type FundamentalGroup = (typeof fundamentalsGroupKeys)[number];

export type FundamentalsGroupGrades = Record<FundamentalGroup, Grade>;

export type FundamentalFactor = {
	value: number | null;
	weight: number;
	grade: Grade | null;
	group: FundamentalGroup;
	config: FactorGradeConfig;
};

export const fundamentalsKeys = [
	'earningsYield',
	'bookToMarket',
	'salesToPrice',
	'fcfYield',
	'evToEbitda',
	'returnOnEquity',
	'returnOnAssets',
	'grossMargin',
	'operatingMargin',
	'netMargin',
	'fcfMargin',
	'accrualsRatio',
	'debtToEquity',
	'debtToAssets',
	'interestCoverage',
	'currentRatio',
	'quickRatio',
	'revenueGrowthYoY',
	'earningsGrowthYoY',
	'log',
	'maTrend'
] as const;

export type FundamentalsKeys = (typeof fundamentalsKeys)[number];

export type Fundamentals = {
	sector: SectorName;
} & {
	[key in FundamentalsKeys]: FundamentalFactor;
};

export const fundamentalGroups: Record<FundamentalsKeys, FundamentalGroup> = {
	earningsYield: 'value',
	bookToMarket: 'value',
	salesToPrice: 'value',
	fcfYield: 'value',
	evToEbitda: 'value',
	returnOnEquity: 'profitability',
	returnOnAssets: 'profitability',
	grossMargin: 'profitability',
	operatingMargin: 'profitability',
	netMargin: 'profitability',
	fcfMargin: 'profitability',
	accrualsRatio: 'profitability',
	debtToEquity: 'leverage',
	debtToAssets: 'leverage',
	interestCoverage: 'leverage',
	currentRatio: 'leverage',
	quickRatio: 'leverage',
	revenueGrowthYoY: 'growth',
	earningsGrowthYoY: 'growth',
	log: 'size',
	maTrend: 'size'
};

export const fundamentalWeights: Record<FundamentalsKeys, number> = {
	// value
	earningsYield: 0.5,
	fcfYield: 0.5,
	bookToMarket: 0.0,
	salesToPrice: 0.0,
	evToEbitda: 0.0,

	// profitability
	fcfMargin: 0.33,
	operatingMargin: 0.27,
	netMargin: 0.15,
	accrualsRatio: 0.15,
	returnOnAssets: 0.05,
	returnOnEquity: 0.0,
	grossMargin: 0.05,

	// leverage
	interestCoverage: 0.4,
	debtToEquity: 0.25,
	debtToAssets: 0.1,
	currentRatio: 0.15,
	quickRatio: 0.1,

	// growth
	earningsGrowthYoY: 0.7,
	revenueGrowthYoY: 0.3,

	// size
	log: 0.6,
	maTrend: 0.4
};

export const numberOrNull = (value: string): number | null => {
	if (value == null) return null;
	const number = parseFloat(value);
	return Number.isFinite(number) ? number : null;
};

const calcFreeCashFlowTTM = (cashFlow: AlphaVantageCashFlowReport): number | null => {
	const op = numberOrNull(cashFlow.operatingCashflow);
	const capex = numberOrNull(cashFlow.capitalExpenditures);
	if (op == null || capex == null) return null;
	return op - capex; // note: capex is usually negative in AV data
};

const calcTotalDebt = (balanceSheet: AlphaVantageBalanceSheetReport): number | null => {
	const total = numberOrNull(balanceSheet.shortLongTermDebtTotal);
	if (total != null) return total;

	const currentDebt = numberOrNull(balanceSheet.currentDebt ?? balanceSheet.shortTermDebt);
	const longTermDebt = numberOrNull(
		balanceSheet.longTermDebt ?? balanceSheet.longTermDebtNoncurrent
	);
	if (currentDebt == null && longTermDebt == null) return null;
	return (currentDebt || 0) + (longTermDebt || 0);
};

export const fundamentalsFunctions: Record<
	FundamentalsKeys,
	({
		overview,
		cashFlow,
		balanceSheet,
		incomeStatement
	}: {
		overview: AlphaVantageOverview;
		cashFlow: AlphaVantageCashFlowReport;
		balanceSheet: AlphaVantageBalanceSheetReport;
		incomeStatement: AlphaVantageIncomeStatementReport;
	}) => number | null
> = {
	earningsYield: ({ overview }) => {
		const pe = numberOrNull(overview.PERatio ?? overview.TrailingPE ?? overview.ForwardPE);
		if (!pe || pe <= 0) return null;
		return 1 / pe;
	},
	bookToMarket: ({ overview, balanceSheet }): number | null => {
		const pb = numberOrNull(overview.PriceToBookRatio);
		if (pb && pb > 0) return 1 / pb;

		const equity = numberOrNull(balanceSheet.totalShareholderEquity);
		const mktCap = numberOrNull(overview.MarketCapitalization);
		if (!equity || !mktCap || mktCap <= 0) return null;
		return equity / mktCap;
	},
	salesToPrice: ({ overview }): number | null => {
		const ps = numberOrNull(overview.PriceToSalesRatioTTM);
		if (ps && ps > 0) return 1 / ps;

		const rev = numberOrNull(overview.RevenueTTM);
		const mktCap = numberOrNull(overview.MarketCapitalization);
		if (!rev || !mktCap || mktCap <= 0) return null;
		return rev / mktCap;
	},
	fcfYield: ({ overview, cashFlow }) => {
		const fcf = calcFreeCashFlowTTM(cashFlow);
		const mktCap = numberOrNull(overview.MarketCapitalization);
		if (fcf == null || !mktCap || mktCap <= 0) return null;
		return fcf / mktCap; // note: capex is usually negative in AV data
	},
	evToEbitda: ({ overview }) => {
		const evToEbitda = numberOrNull(overview.EVToEBITDA);
		if (!evToEbitda || evToEbitda <= 0) return null;
		return 1 / evToEbitda;
	},
	returnOnEquity: ({ overview }) => numberOrNull(overview.ReturnOnEquityTTM),
	returnOnAssets: ({ overview }) => numberOrNull(overview.ReturnOnAssetsTTM),
	grossMargin: ({ incomeStatement }) => {
		const gross = numberOrNull(incomeStatement.grossProfit);
		const rev = numberOrNull(incomeStatement.totalRevenue);
		if (!gross || !rev || rev <= 0) return null;
		return gross / rev;
	},
	operatingMargin: ({ overview }) => numberOrNull(overview.OperatingMarginTTM),
	netMargin: ({ incomeStatement }) => {
		const ni = numberOrNull(incomeStatement.netIncome);
		const rev = numberOrNull(incomeStatement.totalRevenue);
		if (!ni || !rev || rev <= 0) return null;
		return ni / rev;
	},
	fcfMargin: ({ overview, cashFlow }) => {
		const fcf = calcFreeCashFlowTTM(cashFlow);
		const rev = numberOrNull(overview.RevenueTTM);
		if (fcf == null || !rev || rev <= 0) return null;
		return fcf / rev;
	},
	accrualsRatio: ({ cashFlow, balanceSheet, incomeStatement }) => {
		const ni = numberOrNull(incomeStatement.netIncome ?? cashFlow.netIncome);
		const opCF = numberOrNull(cashFlow.operatingCashflow);
		const assets = numberOrNull(balanceSheet.totalAssets);
		if (ni == null || opCF == null || !assets || assets <= 0) return null;
		const accruals = ni - opCF;
		return accruals / assets;
	},
	debtToEquity: ({ balanceSheet }) => {
		const debt = calcTotalDebt(balanceSheet);
		const equity = numberOrNull(balanceSheet.totalShareholderEquity);
		if (debt == null || !equity || equity <= 0) return null;
		return debt / equity;
	},
	debtToAssets: ({ balanceSheet }) => {
		const debt = calcTotalDebt(balanceSheet);
		const assets = numberOrNull(balanceSheet.totalAssets);
		if (debt == null || !assets || assets <= 0) return null;
		return debt / assets;
	},
	interestCoverage: ({ incomeStatement }) => {
		const ebit = numberOrNull(incomeStatement.ebit ?? incomeStatement.operatingIncome);
		const interestExp = numberOrNull(
			incomeStatement.interestExpense ?? incomeStatement.interestAndDebtExpense
		);
		if (!ebit || !interestExp || interestExp === 0) return null;
		return ebit / Math.abs(interestExp);
	},
	currentRatio: ({ balanceSheet }) => {
		const ca = numberOrNull(balanceSheet.totalCurrentAssets);
		const cl = numberOrNull(balanceSheet.totalCurrentLiabilities);
		if (!ca || !cl || cl <= 0) return null;
		return ca / cl;
	},
	quickRatio: ({ balanceSheet }) => {
		const cash = numberOrNull(
			balanceSheet.cashAndShortTermInvestments ?? balanceSheet.cashAndCashEquivalentsAtCarryingValue
		);
		const receivables = numberOrNull(balanceSheet.currentNetReceivables);
		const cl = numberOrNull(balanceSheet.totalCurrentLiabilities);
		if (!cl || cl <= 0) return null;
		return ((cash || 0) + (receivables || 0)) / cl;
	},
	revenueGrowthYoY: ({ overview }) => numberOrNull(overview.QuarterlyRevenueGrowthYOY),
	earningsGrowthYoY: ({ overview }) => numberOrNull(overview.QuarterlyEarningsGrowthYOY),
	log: ({ overview }) => {
		const mktCap = numberOrNull(overview.MarketCapitalization);
		if (!mktCap || mktCap <= 0) return null;
		return Math.log(mktCap);
	},
	maTrend: ({ overview }) => {
		const ma50 = numberOrNull(overview['50DayMovingAverage']);
		const ma200 = numberOrNull(overview['200DayMovingAverage']);
		if (!ma50 || !ma200 || ma200 <= 0) return null;
		return ma50 / ma200;
	}
};

export const fundamentalGroupWeights: Record<FundamentalGroup, number> = {
	value: 0.15,
	profitability: 0.4,
	leverage: 0.25,
	growth: 0.05,
	size: 0.15
};

export const letterToScore: Record<Exclude<Grade, null>, number> = {
	a: 4,
	b: 3,
	c: 2,
	d: 1,
	f: 0
};

export const getScoreFromLetter = (grade: Grade) => letterToScore[grade];

export const getGradeFromScore = (score: number): Grade => {
	if (score >= 4) return 'a';
	if (score >= 3) return 'b';
	if (score >= 2) return 'c';
	if (score >= 1) return 'd';
	return 'f';
};
