import { describe, expect, it } from "vitest";
import {
  alpacaGetAccount,
  alpacaGetAsset,
  alpacaGetBarsHistory,
  alpacaGetLatestQuote,
  alpacaGetLatestTrade,
  alpacaGetOptionChain,
  alpacaGetPositions,
  alpacaGetQuoteHistory,
  alpacaGetTradeHistory,
  isAlpacaBarHistory,
  isAlpacaQuote,
  isAlpacaQuoteHistory,
  isAlpacaTrade,
  isAlpacaTradeHistory,
} from "./request.ts";
import { isFail, type Result } from "@joyautomation/dark-matter";
import { isAlpacaOptionChain } from "./options.ts";
import { failOrTest } from "../testing.ts";
// Alpaca() requires the API key and sectret to be set, even for crypto

describe("Alpaca", () => {
  it("should be able to get the account", async () => {
    const response = await alpacaGetAccount();

    failOrTest(response, (value) => {
      expect(value).toMatchSnapshot();
    });
  });
  it("should get positions", async () => {
    const response = await alpacaGetPositions();

    failOrTest(response, (value) => {
      expect(value).toMatchSnapshot();
    });
  });
  it("should be able to get F asset info", async () => {
    const response = await alpacaGetAsset("F");

    failOrTest(response, (value) => {
      expect(value).toMatchSnapshot();
    });
  });
  it("should be able to get F latest quote", async () => {
    const response = await alpacaGetLatestQuote("F");

    failOrTest(response, (value) => {
      expect(isAlpacaQuote(value)).toBe(true);
    });
  });
  it("should be able to get F latest trade", async () => {
    const response = await alpacaGetLatestTrade("F");

    failOrTest(response, (value) => {
      expect(isAlpacaTrade(value)).toBe(true);
    });
  });
  it("should be able to get F quote history", async () => {
    const response = await alpacaGetQuoteHistory(
      "F",
      new Date("2024-01-03T00:00:00Z"),
      new Date("2024-01-04T01:02:00Z"),
    );

    failOrTest(response, (value) => {
      expect(isAlpacaQuoteHistory(value)).toBe(true);
    });
  });
  it("should be able to get F trade history", async () => {
    const response = await alpacaGetTradeHistory(
      "F",
      new Date("2024-01-03T00:00:00Z"),
      new Date("2024-01-04T01:02:00Z"),
    );

    failOrTest(response, (value) => {
      expect(isAlpacaTradeHistory(value)).toBe(true);
    });
  });
  it("should be able to get F bars history", async () => {
    const response = await alpacaGetBarsHistory(
      "F",
      new Date("2024-01-03T00:00:00Z"),
      new Date("2024-01-04T01:02:00Z"),
    );

    failOrTest(response, (value) => {
      expect(isAlpacaBarHistory(value)).toBe(true);
    });
  });
  it("should be able to get F option chain", async () => {
    const response = await alpacaGetOptionChain("F");

    failOrTest(response, (value) => {
      expect(isAlpacaOptionChain(value)).toBe(true);
    });
  });
});
