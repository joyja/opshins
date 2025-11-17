import { rTryAsync, type Result } from '@joyautomation/dark-matter';
import { env } from '$env/dynamic/private';
import type { SectorName } from '../grades/fundamentals/types.d.ts';

export type AlphaVantageOverview = {
	'200DayMovingAverage': string;
	'50DayMovingAverage': string;
	'52WeekHigh': string;
	'52WeekLow': string;
	Address: string;
	AnalystRatingBuy: string;
	AnalystRatingHold: string;
	AnalystRatingSell: string;
	AnalystRatingStrongBuy: string;
	AnalystRatingStrongSell: string;
	AnalystTargetPrice: string;
	AssetType: string;
	Beta: string;
	BookValue: string;
	CIK: string;
	Country: string;
	Currency: string;
	Description: string;
	DilutedEPSTTM: string;
	DividendDate: string;
	DividendPerShare: string;
	DividendYield: string;
	EBITDA: string;
	EPS: string;
	EVToEBITDA: string;
	EVToRevenue: string;
	ExDividendDate: string;
	Exchange: string;
	FiscalYearEnd: string;
	ForwardPE: string;
	GrossProfitTTM: string;
	Industry: string;
	LatestQuarter: string;
	MarketCapitalization: string;
	Name: string;
	OfficialSite: string;
	OperatingMarginTTM: string;
	PEGRatio: string;
	PERatio: string;
	PercentInsiders: string;
	PercentInstitutions: string;
	PriceToBookRatio: string;
	PriceToSalesRatioTTM: string;
	ProfitMargin: string;
	QuarterlyEarningsGrowthYOY: string;
	QuarterlyRevenueGrowthYOY: string;
	ReturnOnAssetsTTM: string;
	ReturnOnEquityTTM: string;
	RevenuePerShareTTM: string;
	RevenueTTM: string;
	Sector: SectorName;
	SharesFloat: string;
	SharesOutstanding: string;
	Symbol: string;
	TrailingPE: string;
};

export type AlphaVantageCashFlowReport = {
	fiscalDateEnding: string;
	reportedCurrency: string;
	operatingCashflow: string;
	paymentsForOperatingActivities: string;
	proceedsFromOperatingActivities: string;
	changeInOperatingLiabilities: string;
	changeInOperatingAssets: string;
	depreciationDepletionAndAmortization: string;
	capitalExpenditures: string;
	changeInReceivables: string;
	changeInInventory: string;
	profitLoss: string;
	cashflowFromInvestment: string;
	cashflowFromFinancing: string;
	proceedsFromRepaymentsOfShortTermDebt: string;
	paymentsForRepurchaseOfCommonStock: string;
	paymentsForRepurchaseOfEquity: string;
	paymentsForRepurchaseOfPreferredStock: string;
	dividendPayout: string;
	dividendPayoutCommonStock: string;
	dividendPayoutPreferredStock: string;
	proceedsFromIssuanceOfCommonStock: string;
	proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet: string;
	proceedsFromIssuanceOfPreferredStock: string;
	proceedsFromRepurchaseOfEquity: string;
	proceedsFromSaleOfTreasuryStock: string;
	changeInCashAndCashEquivalents: string;
	changeInExchangeRate: string;
	netIncome: string;
};

export type AlphaVantageCashFlow = {
	symbol: string;
	annualReports: AlphaVantageCashFlowReport[];
};

export type AlphaVantageBalanceSheetReport = {
	fiscalDateEnding: string;
	reportedCurrency: string;
	totalAssets: string;
	totalCurrentAssets: string;
	cashAndCashEquivalentsAtCarryingValue: string;
	cashAndShortTermInvestments: string;
	inventory: string;
	currentNetReceivables: string;
	totalNonCurrentAssets: string;
	propertyPlantEquipment: string;
	accumulatedDepreciationAmortizationPPE: string;
	intangibleAssets: string;
	intangibleAssetsExcludingGoodwill: string;
	goodwill: string;
	investments: string;
	longTermInvestments: string;
	shortTermInvestments: string;
	otherCurrentAssets: string;
	otherNonCurrentAssets: string;
	totalLiabilities: string;
	totalCurrentLiabilities: string;
	currentAccountsPayable: string;
	deferredRevenue: string;
	currentDebt: string;
	shortTermDebt: string;
	totalNonCurrentLiabilities: string;
	capitalLeaseObligations: string;
	longTermDebt: string;
	currentLongTermDebt: string;
	longTermDebtNoncurrent: string;
	shortLongTermDebtTotal: string;
	otherCurrentLiabilities: string;
	otherNonCurrentLiabilities: string;
	totalShareholderEquity: string;
	treasuryStock: string;
	retainedEarnings: string;
	commonStock: string;
	commonStockSharesOutstanding: string;
};

export type AlphaVantageBalanceSheet = {
	symbol: string;
	annualReports: AlphaVantageBalanceSheetReport[];
};

export type AlphaVantageIncomeStatementReport = {
	fiscalDateEnding: string;
	reportedCurrency: string;
	grossProfit: string;
	totalRevenue: string;
	costOfRevenue: string;
	costofGoodsAndServicesSold: string;
	operatingIncome: string;
	sellingGeneralAndAdministrative: string;
	researchAndDevelopment: string;
	operatingExpenses: string;
	investmentIncomeNet: string;
	netInterestIncome: string;
	interestIncome: string;
	interestExpense: string;
	nonInterestIncome: string;
	otherNonOperatingIncome: string;
	depreciation: string;
	depreciationAndAmortization: string;
	incomeBeforeTax: string;
	incomeTaxExpense: string;
	interestAndDebtExpense: string;
	netIncomeFromContinuingOperations: string;
	comprehensiveIncomeNetOfTax: string;
	ebit: string;
	ebitda: string;
	netIncome: string;
};

export type AlphaVantageIncomeStatement = {
	symbol: string;
	annualReports: AlphaVantageIncomeStatementReport[];
};

export const avSendRequest = <T>(endpoint: string): Promise<Result<T>> => {
	const options = {
		method: 'GET'
	};
	return rTryAsync(() =>
		fetch(`https://www.alphavantage.co/${endpoint}&apikey=${env.AV_KEY}`, options).then((res) => {
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			return res.json();
		})
	);
};

export const avGetOverview = (symbol: string): Promise<Result<AlphaVantageOverview>> => {
	return avSendRequest(`query?function=OVERVIEW&symbol=${symbol}`);
};

export const avGetCashFlow = (symbol: string): Promise<Result<AlphaVantageCashFlow>> => {
	return avSendRequest(`query?function=CASH_FLOW&symbol=${symbol}`);
};

export const avGetBalanceSheet = (symbol: string): Promise<Result<AlphaVantageBalanceSheet>> => {
	return avSendRequest(`query?function=BALANCE_SHEET&symbol=${symbol}`);
};

export const avGetIncomeStatement = (
	symbol: string
): Promise<Result<AlphaVantageIncomeStatement>> => {
	return avSendRequest(`query?function=INCOME_STATEMENT&symbol=${symbol}`);
};
