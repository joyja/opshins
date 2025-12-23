export const formatDollarValue = (value: number): string => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
    .format(value);
};
