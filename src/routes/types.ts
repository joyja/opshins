export type OptionPosition = {
  symbol: string;
  qty: string;
  marketValue: number;
};

export type Position = {
  symbol: string;
  strategy: string;
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
