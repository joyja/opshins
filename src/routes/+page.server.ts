import {
  type AlpacaAsset,
  alpacaGetAccount,
  alpacaGetActivities,
  alpacaGetAsset,
  alpacaGetLatestQuote,
  alpacaGetLatestTrade,
  alpacaGetOptionQuote,
  alpacaGetPortfolioHistory,
  alpacaGetPositions,
  type AlpacaOptionQuote,
  type AlpacaQuote,
  type AlpacaTrade,
} from "$lib/alpaca/request.ts";
import {
  createFail,
  createSuccess,
  isFail,
  isSuccess,
  type Result,
  type ResultSuccess,
} from "@joyautomation/dark-matter";

const getUnderlyingSymbol = (symbol: string): string => {
  const match = symbol.match(/^([A-Za-z]+)/);
  return match ? match[1] : symbol;
};

const allSuccess = <T>(
  results: Record<string, Result<T>>,
): results is Record<string, ResultSuccess<T>> => {
  return Object.values(results).every(isSuccess);
};

export const load = () => {
  return {
    account: alpacaGetAccount(),
    // portfolioHistory: alpacaGetPortfolioHistory(),
    positions: alpacaGetPositions().then(async (value) => {
      if (isSuccess(value)) {
        const optionQuotes = await alpacaGetOptionQuote(
          value.output.filter((position) =>
            position.asset_class.includes("option")
          ).map((position) => position.symbol),
        );
        const underlyingAssetesEntries = await Promise.all(
          value.output.filter((position) =>
            position.asset_class.includes("option")
          ).map((position) => getUnderlyingSymbol(position.symbol)).map((
            symbol,
          ) =>
            alpacaGetLatestTrade(symbol).then((quote) =>
              isSuccess(quote)
                ? [symbol, createSuccess(quote.output)]
                : [symbol, createFail("Failed to fetch underlying asset quote")]
            )
          ),
        );
        const underlyingAssets: Record<string, Result<AlpacaTrade>> = Object
          .fromEntries(
            underlyingAssetesEntries,
          );
        if (
          isSuccess(optionQuotes) &&
          allSuccess(underlyingAssets)
        ) {
          return createSuccess(
            value.output.map((position) => {
              return {
                ...position,
                optionQuote: optionQuotes.output.quotes[position.symbol],
                underlyingAssetPrice:
                  underlyingAssets[getUnderlyingSymbol(position.symbol)]
                    ?.output.trade.p,
              };
            }),
          );
        } else {
          return isFail(optionQuotes)
            ? optionQuotes
            : Object.values(underlyingAssets).find(isFail) ??
              createFail("Failed to fetch underlying asset quotes");
        }
      } else {
        return value;
      }
    }),
    activities: alpacaGetActivities(),
  };
};
