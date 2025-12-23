import {
  alpacaGetAccount,
  alpacaGetActivities,
  alpacaGetOptionQuote,
  alpacaGetPortfolioHistory,
  alpacaGetPositions,
} from "$lib/alpaca/request.ts";
import { createSuccess, isSuccess } from "@joyautomation/dark-matter";

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
        if (isSuccess(optionQuotes)) {
          return createSuccess(
            value.output.map((position) => {
              return {
                ...position,
                optionQuote: optionQuotes.output.quotes[position.symbol],
              };
            }),
          );
        } else {
          return optionQuotes;
        }
      } else {
        return value;
      }
    }),
    activities: alpacaGetActivities(),
  };
};
