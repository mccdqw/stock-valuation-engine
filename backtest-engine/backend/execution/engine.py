import polars as pl

def simple_market_fill(df: pl.DataFrame, initial_capital=10000, return_trades=False):
    df = df.with_columns([
        (pl.col("close").pct_change().fill_null(0)).alias("returns"),
        (pl.col("signals").shift(1).fill_null(0)).alias("shifted_signals"),
    ])

    # print("first df smf", df["shifted_signals"])

    df = df.with_columns([
        (pl.col("shifted_signals") * pl.col("returns")).alias("strategy_returns"),
        ((pl.col("shifted_signals") * pl.col("returns") + 1).cum_prod() * initial_capital).alias("equity_curve"),
    ])

    # Now you can convert timestamps and do your rest of the code
    if "date" in df.columns:
        timestamps = df["date"].to_list()
    else:
        timestamps = list(range(df.height))

    equity_dict = dict(zip(timestamps, df["equity_curve"].to_list()))
    returns_dict = dict(zip(timestamps, df["strategy_returns"].to_list()))

    trades = []
    if return_trades:
        signal_list = df["signals"].to_list()
        close_list = df["close"].to_list()
        prev_signal = 0
        for idx, signal in enumerate(signal_list):
            if signal != prev_signal:
                if signal == 1:
                    trades.append({
                        "timestamp": str(timestamps[idx]),
                        "action": "buy",
                        "price": float(close_list[idx])
                    })
                elif signal == -1:
                    trades.append({
                        "timestamp": str(timestamps[idx]),
                        "action": "sell",
                        "price": float(close_list[idx])
                    })
            prev_signal = signal

    if return_trades:
        return equity_dict, returns_dict, trades
    else:
        return equity_dict, returns_dict

