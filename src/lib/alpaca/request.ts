import { env } from "$env/dynamic/private";
import {
  createFail,
  createSuccess,
  type Result,
  rTryAsync,
} from "@joyautomation/dark-matter";
import type { AlpacaOptionChain } from "./options.ts";

export type AlpacaBar = {
  c: number; // close
  h: number; // high
  l: number; // low
  n: number; // number of trades
  o: number; // open
  t: string; // timestamp
  v: number;
  vw: number;
};

export type AlpacaAsset = {
  attributes: string[];
  class: string;
  easy_to_borrow: boolean;
  exchange: string;
  fractionable: boolean;
  id: string;
  maintenance_margin_requirement: number;
  margin_requirement_long: string;
  margin_requirement_short: string;
  marginable: boolean;
  name: string;
  shortable: boolean;
  status: string;
  symbol: string;
  tradable: boolean;
};

export type AlpacaQuote = {
  quote: {
    ap: number; // ask price
    as: number; // ask size
    ax: string; // ask exchange
    bp: number; // bid price
    bs: number; // bid size
    bx: string; // bid exchange
    c: string[]; // conditions
    t: string; // timestamp
    z: string; // timezone
  };
  symbol: string; // ticker
};

export const isAlpacaQuote = (value: unknown): value is AlpacaQuote => {
  return (
    typeof value === "object" &&
    value !== null &&
    "quote" in value &&
    "symbol" in value &&
    typeof value.quote === "object" &&
    value.quote !== null &&
    typeof value.symbol === "string"
  );
};

export type AlpacaTrade = {
  symbol: string; // ticker
  trade: {
    c: string[]; // conditions
    i: number; // id
    p: number; // price
    s: number; // size
    t: string; // timestamp
    x: string; // exchange
    z: string; // timezone
  };
};

export const isAlpacaTrade = (value: unknown): value is AlpacaTrade => {
  return (
    typeof value === "object" &&
    value !== null &&
    "symbol" in value &&
    "trade" in value &&
    typeof value.symbol === "string" &&
    typeof value.trade === "object" &&
    value.trade !== null
  );
};

export type AlpacaTradeHistory = {
  symbol: string;
  trades: AlpacaTrade[];
};

export type AlpacaBarHistory = {
  symbol: string;
  bars: AlpacaBar[];
};

export const isAlpacaTradeHistory = (
  value: unknown,
): value is AlpacaTradeHistory => {
  return (
    typeof value === "object" &&
    value !== null &&
    "symbol" in value &&
    "trades" in value &&
    typeof value.symbol === "string" &&
    typeof value.trades === "object" &&
    value.trades !== null
  );
};

export const isAlpacaBarHistory = (
  value: unknown,
): value is AlpacaBarHistory => {
  return (
    typeof value === "object" &&
    value !== null &&
    "symbol" in value &&
    "bars" in value &&
    typeof value.symbol === "string" &&
    typeof value.bars === "object" &&
    value.bars !== null
  );
};

export type AlpacaQuoteHistory = {
  symbol: string;
  quotes: AlpacaQuote[];
};

export const isAlpacaQuoteHistory = (
  value: unknown,
): value is AlpacaQuoteHistory => {
  return (
    typeof value === "object" &&
    value !== null &&
    "symbol" in value &&
    "quotes" in value &&
    typeof value.symbol === "string" &&
    typeof value.quotes === "object" &&
    value.quotes !== null
  );
};

export type AlpacaAccount = {
  account_blocked: boolean;
  account_number: string;
  accrued_fees: string;
  admin_configurations: {
    allow_instant_ach: boolean;
    max_margin_multiplier: string;
  };
  balance_asof: string;
  bod_dtbp: string;
  buying_power: string;
  cash: string;
  created_at: string;
  crypto_status: string;
  crypto_tier: number;
  currency: string;
  daytrade_count: number;
  daytrading_buying_power: string;
  effective_buying_power: string;
  equity: string;
  id: string;
  initial_margin: string;
  intraday_adjustments: string;
  last_equity: string;
  last_maintenance_margin: string;
  long_market_value: string;
  maintenance_margin: string;
  multiplier: string;
  non_marginable_buying_power: string;
  pattern_day_trader: boolean;
  pending_reg_taf_fees: string;
  portfolio_value: string;
  position_market_value: string;
  regt_buying_power: string;
  short_market_value: string;
  shorting_enabled: boolean;
  sma: string;
  status: string;
  trade_suspended_by_user: boolean;
  trading_blocked: boolean;
  transfers_blocked: boolean;
  user_configurations: null;
};

export type AlpacaPortfolioHistory = {};

export type AlpacaPosition = {
  asset_class: string;
  asset_id: string;
  asset_marginable: boolean;
  avg_entry_price: string;
  change_today: string;
  cost_basis: string;
  current_price: string;
  exchange: string;
  lastday_price: string;
  market_value: string;
  qty: string;
  qty_available: string;
  side: string;
  symbol: string;
  unrealized_intraday_pl: string;
  unrealized_intraday_plpc: string;
  unrealized_pl: string;
  unrealized_plpc: string;
};
export type AlpacaPositions = AlpacaPosition[];

export type AlpacaFillActivity = {
  id: string;
  activity_type: "FILL";
  transaction_time: string;
  type: string;
  price: string;
  qty: string;
  side: string;
  symbol: string;
  leaves_qty: string;
  order_id: string;
  cum_qty: string;
  order_status: string;
};

export type AlpacaCsdActivity = {
  id: string;
  activity_type: "CSD";
  date: string;
  created_at: string;
  net_amount: string;
  description: string;
  status: string;
};

export type AlpacaFeeActivity = {
  id: string;
  activity_type: "FEE";
  activity_sub_type: string;
  date: string;
  created_at: string;
  net_amount: string;
  description: string;
  status: string;
  execution_id?: string;
};

export type AlpacaOpAsnActivity = {
  id: string;
  activity_type: "OPASN";
  date: string;
  created_at: string;
  net_amount: string;
  description: string;
  symbol: string;
  cusip: string;
  qty: string;
  status: string;
  group_id: string;
};

export type AlpacaOpTrdActivity = {
  id: string;
  activity_type: "OPTRD";
  date: string;
  created_at: string;
  net_amount: string;
  description: string;
  symbol: string;
  cusip: string;
  qty: string;
  price: string;
  status: string;
  group_id: string;
};

export type AlpacaActivity =
  | AlpacaFillActivity
  | AlpacaCsdActivity
  | AlpacaFeeActivity
  | AlpacaOpAsnActivity
  | AlpacaOpTrdActivity;
export type AlpacaActivities = AlpacaActivity[];

export const alpacaSendRequest = <T>(
  endpoint: string,
  subdomain: string = "api",
  version: string = "v2",
): Promise<Result<T>> => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "APCA-API-KEY-ID": env.APCA_KEY,
      "APCA-API-SECRET-KEY": env.APCA_SECRET,
    },
  };
  return rTryAsync(() =>
    fetch(`https://${subdomain}.alpaca.markets/${version}/${endpoint}`, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
  );
};

export const alpacaGetAccount = (): Promise<Result<AlpacaAccount>> => {
  return alpacaSendRequest("account");
};

export const alpacaGetPortfolioHistory = (): Promise<
  Result<AlpacaPortfolioHistory>
> => {
  return alpacaSendRequest(
    "account/portfolio/history?intraday_reporting=market_hours&pnl_reset=per_day",
  );
};

export const alpacaGetPositions = (): Promise<Result<AlpacaPositions>> => {
  return alpacaSendRequest("positions");
};

export const alpacaGetActivities = (): Promise<Result<AlpacaActivities>> => {
  return alpacaSendRequest("account/activities?direction=desc&page_size=100");
};

export const alpacaGetAsset = (
  symbol: string,
): Promise<Result<AlpacaAsset>> => {
  return alpacaSendRequest(`assets/${symbol}`);
};

export const alpacaGetLatestQuote = (
  symbol: string,
): Promise<Result<AlpacaQuote>> => {
  return alpacaSendRequest(`stocks/${symbol}/quotes/latest`, "data");
};

/**
 * Formats a JavaScript Date into the Alpaca query format expected in tests,
 * e.g., "2024-01-03T00%3A00%3A00Z" (UTC, no milliseconds, ':' URL-encoded).
 */
export const formatAlpacaDate = (date: Date): string => {
  // Example ISO: 2024-01-03T00:00:00.000Z -> remove milliseconds, then encode ':'
  const iso = date.toISOString().replace(/\.\d{3}Z$/, "Z");
  return iso.replace(/:/g, "%3A");
};

export const alpacaGetQuoteHistory = (
  symbol: string,
  start: Date,
  end: Date,
): Promise<Result<AlpacaQuoteHistory>> => {
  return alpacaSendRequest(
    `stocks/${symbol}/quotes?start=${formatAlpacaDate(start)}&end=${
      formatAlpacaDate(end)
    }&limit=1000`,
    "data",
  );
};

export const alpacaGetLatestTrade = (
  symbol: string,
): Promise<Result<AlpacaTrade>> => {
  return alpacaSendRequest(`stocks/${symbol}/trades/latest`, "data");
};

export const alpacaGetTradeHistory = (
  symbol: string,
  start: Date,
  end: Date,
): Promise<Result<AlpacaTradeHistory>> => {
  return alpacaSendRequest(
    `stocks/${symbol}/trades?start=${formatAlpacaDate(start)}&end=${
      formatAlpacaDate(end)
    }&limit=10000`,
    "data",
  );
};

export const alpacaGetBarsHistory = (
  symbol: string,
  start: Date,
  end: Date,
  timeframe: string = "1Min",
): Promise<Result<AlpacaBarHistory>> => {
  return alpacaSendRequest(
    `stocks/${symbol}/bars?start=${formatAlpacaDate(start)}&end=${
      formatAlpacaDate(end)
    }&limit=1000&timeframe=${timeframe}`,
    "data",
  );
};

/**
 * Returns the UTC start and end Date for the most recent trading session in
 * America/New_York time (09:30–16:00). If today is a weekday, it returns
 * today's session regardless of current time (e.g., after-hours still returns
 * today's 09:30–16:00). On weekends, it rolls back to Friday.
 *
 * Note: US market holidays are not handled.
 */
export const getLastTradingDayRange = (): { start: Date; end: Date } => {
  const now = new Date();

  // Helper: New York now (local clock in NY)
  const nyNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );

  // Helper: compute the NY offset (ms) for a specific NY calendar date
  const getNyOffsetMs = (y: number, m0: number, d: number): number => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const atUtcMidnight = new Date(Date.UTC(y, m0, d, 0, 0, 0));
    const parts = fmt.formatToParts(atUtcMidnight);
    const get = (type: string) =>
      parts.find((p) => p.type === type)?.value ?? "0";
    const nyY = parseInt(get("year"));
    const nyM = parseInt(get("month"));
    const nyD = parseInt(get("day"));
    const nyH = parseInt(get("hour"));
    const nyMin = parseInt(get("minute"));
    const utcDateMs = Date.UTC(y, m0, d);
    const nyDateMs = Date.UTC(nyY, nyM - 1, nyD);
    const dayDelta = Math.round((nyDateMs - utcDateMs) / (24 * 60 * 60 * 1000));
    const offsetMinutes = nyH * 60 + nyMin + dayDelta * 24 * 60; // negative for UTC-5/UTC-4
    return offsetMinutes * 60 * 1000;
  };

  // Helper: convert an NY local Y-M-D H:M to a UTC Date
  const nyLocalToUtc = (
    y: number,
    m0: number,
    d: number,
    hh: number,
    mm: number,
  ): Date => {
    const offsetMs = getNyOffsetMs(y, m0, d);
    return new Date(Date.UTC(y, m0, d, hh, mm, 0) - offsetMs);
  };

  // Helper: determine previous trading day (ignoring market holidays)
  const previousTradingDay = (
    y: number,
    m0: number,
    d: number,
  ): { y: number; m0: number; d: number } => {
    const candidate = new Date(Date.UTC(y, m0, d, 12, 0, 0)); // noon UTC to avoid DST edge
    // Step back one day until Mon–Fri
    do {
      candidate.setUTCDate(candidate.getUTCDate() - 1);
    } while ([0, 6].includes(candidate.getUTCDay()));
    return {
      y: candidate.getUTCFullYear(),
      m0: candidate.getUTCMonth(),
      d: candidate.getUTCDate(),
    };
  };

  // NY clock components
  const nyWeekday = nyNow.getDay(); // 0=Sun..6=Sat in NY
  const nyY = nyNow.getFullYear();
  const nyM0 = nyNow.getMonth();
  const nyD = nyNow.getDate();
  const nyMinutes = nyNow.getHours() * 60 + nyNow.getMinutes();

  const OPEN_MIN = 9 * 60 + 30; // 09:30
  const CLOSE_MIN = 16 * 60; // 16:00

  const isWeekday = nyWeekday >= 1 && nyWeekday <= 5; // Mon–Fri
  const isInSession = isWeekday && nyMinutes >= OPEN_MIN &&
    nyMinutes < CLOSE_MIN;

  if (isInSession) {
    const start = nyLocalToUtc(nyY, nyM0, nyD, 9, 30);
    const fifteenMinutesMs = 15 * 60 * 1000;
    const endCandidate = new Date(now.getTime() - fifteenMinutesMs);
    const end = endCandidate < start ? start : endCandidate;
    return { start, end };
  }

  // Outside session -> last trading day range
  let ly = nyY, lm0 = nyM0, ld = nyD;
  // If after close, last trading day is today; before open or weekend -> step back appropriately
  if (!isWeekday || nyMinutes < OPEN_MIN) {
    ({ y: ly, m0: lm0, d: ld } = previousTradingDay(nyY, nyM0, nyD));
  }
  const start = nyLocalToUtc(ly, lm0, ld, 9, 30);
  const end = nyLocalToUtc(ly, lm0, ld, 16, 0);
  return { start, end };
};

export const alpacaGetOptionChain = (
  symbol: string,
): Promise<Result<AlpacaOptionChain>> => {
  return alpacaSendRequest(
    `options/snapshots/${symbol}?feed=indicative&limit=100`,
    "data",
    "v1beta1",
  );
};
