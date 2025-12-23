import {
  alpacaGetAccount,
  alpacaGetActivities,
  alpacaGetPortfolioHistory,
  alpacaGetPositions,
} from "$lib/alpaca/request.ts";

export const load = () => {
  return {
    account: alpacaGetAccount(),
    // portfolioHistory: alpacaGetPortfolioHistory(),
    positions: alpacaGetPositions(),
    activities: alpacaGetActivities(),
  };
};
