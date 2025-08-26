// strategies.js
export const STRATEGIES = [
  {
    id: "ma_crossover",
    name: "Moving Average Crossover",
    fields: [
      { name: "short_window", label: "Short Window", type: "number", default: 10 },
      { name: "long_window", label: "Long Window", type: "number", default: 50 },
    ],
  },
  {
    id: "rsi",
    name: "RSI Strategy",
    fields: [
      { name: "period", label: "RSI Period", type: "number", default: 14 },
      { name: "overbought", label: "Overbought Level", type: "number", default: 70 },
      { name: "oversold", label: "Oversold Level", type: "number", default: 30 },
    ],
  },
  {
    id: "bollinger",
    name: "Bollinger Bands",
    fields: [
      { name: "period", label: "Period", type: "number", default: 20 },
      { name: "stdDev", label: "Standard Deviation", type: "number", default: 2 },
    ],
  },
];

export const BASE_FIELDS = [
  { name: "symbol", label: "Symbol", type: "text", default: "SPY" },
  { name: "startDate", label: "Start Date", type: "date", default: "2020-08-11" },
  { name: "endDate", label: "End Date", type: "date", default: "2025-07-31" },
  { name: "initialCapital", label: "Initial Capital", type: "number", default: 100000 },
  { name: "file", label: "Upload CSV (optional)", type: "file" },
];
