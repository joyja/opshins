import {
	alpacaGetAsset,
	alpacaGetBarsHistory,
	alpacaGetLatestTrade,
	getLastTradingDayRange
} from '../../../lib/alpaca/request.ts';

export const load = ({ params }: { params: { ticker: string } }) => {
	const { start, end } = getLastTradingDayRange();
	return {
		ticker: params.ticker,
		asset: alpacaGetAsset(params.ticker),
		trade: alpacaGetLatestTrade(params.ticker),
		start,
		end,
		tradeHistory: alpacaGetBarsHistory(params.ticker, start, end)
	};
};
