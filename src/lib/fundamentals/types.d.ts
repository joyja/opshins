export type Grade = 'a' | 'b' | 'c' | 'd' | 'f' | null;

export type FundamentalValueFactor = {
	group: 'value';
	value: number | null;
	grade: Grade;
};
export type FundamentalProfitabilityFactor = {
	group: 'profitability';
	value: number | null;
	grade: Grade;
};
export type FundamentalLeverageFactor = {
	group: 'leverage';
	value: number | null;
	grade: Grade;
};
export type FundamentalGrowthFactor = {
	group: 'growth';
	value: number | null;
	grade: Grade;
};
export type FundamentalSizeFactor = {
	group: 'size';
	value: number | null;
	grade: Grade;
};

export type Fundamentals = {
	sector: SectorName;
	earningsYield: FundamentalValueFactor;
	bookToMarket: FundamentalValueFactor;
	salesToPrice: FundamentalValueFactor;
	fcfYield: FundamentalValueFactor;
	evToEbitda: FundamentalValueFactor;
	returnOnEquity: FundamentalProfitabilityFactor;
	returnOnAssets: FundamentalProfitabilityFactor;
	grossMargin: FundamentalProfitabilityFactor;
	operatingMargin: FundamentalProfitabilityFactor;
	netMargin: FundamentalProfitabilityFactor;
	fcfMargin: FundamentalProfitabilityFactor;
	accrualsRatio: FundamentalProfitabilityFactor;
	debtToEquity: FundamentalLeverageFactor;
	debtToAssets: FundamentalLeverageFactor;
	interestCoverage: FundamentalLeverageFactor;
	currentRatio: FundamentalLeverageFactor;
	quickRatio: FundamentalLeverageFactor;
	revenueGrowthYoY: FundamentalGrowthFactor;
	earningsGrowthYoY: FundamentalGrowthFactor;
	log: FundamentalSizeFactor;
	maTrend: FundamentalSizeFactor;
};
