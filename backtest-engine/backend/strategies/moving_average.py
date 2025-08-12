import polars as pl
from .base import Strategy

class MovingAverageCrossover(Strategy):
    def __init__(self, short_window=50, long_window=200):
        super().__init__("Moving Average Crossover")
        self.short_window = short_window
        self.long_window = long_window

    def generate_signals(self, data: pl.DataFrame) -> pl.DataFrame:
        self.logger.info("Generating MA Crossover signals")
        df = data.with_columns([
            pl.col("close").rolling_mean(window_size=self.short_window).alias("short_ma"),
            pl.col("close").rolling_mean(window_size=self.long_window).alias("long_ma")
        ])
        # Fill nulls in moving averages
        df = df.with_columns([
            pl.col("short_ma").fill_null(0),
            pl.col("long_ma").fill_null(0)
        ])
        signals = (
            (pl.col("short_ma") > pl.col("long_ma")).cast(pl.Int8) * 1 +
            (pl.col("short_ma") < pl.col("long_ma")).cast(pl.Int8) * -1
        ).fill_null(0)  # Fill any remaining nulls in signals
        return df.with_columns([signals.alias("signals")])