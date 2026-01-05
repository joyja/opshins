import type { AlpacaOptionQuote } from "../lib/alpaca/request.ts";

export type OptionPosition = {
  symbol: string;
  qty: string;
  marketValue: number;
  optionQuote?: AlpacaOptionQuote;
};

export type Position = {
  symbol: string;
  strategy: string;
  price: number;
  qty: number;
  marketValue: number;
  costBasis: number;
  currentOptions: Record<string, OptionPosition>;
  history: Activity[];
};

export type Activity = {
  symbol: string;
  date: Date;
  price: number;
  side: string;
  qty: number;
};
