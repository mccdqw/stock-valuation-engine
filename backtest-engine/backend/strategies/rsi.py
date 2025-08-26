from .base import Strategy
import polars as pl

class RSI(Strategy):
    def __init__(self, period=14, overbought=80, oversold=20):
        super().__init__("RSI")
        self.period = period
        self.overbought = overbought
        self.oversold = oversold

    def generate_signals(self, data: pl.DataFrame) -> pl.DataFrame:
        self.logger.info("RSI Strategy")

        if self.period <= 0:
            raise ValueError("Period must be positive")
        if self.oversold >= self.overbought:
            raise ValueError("Oversold threshold must be less than overbought threshold")
        
        df = data.with_columns([
            pl.col("close").diff().alias("delta"),
        ]).with_columns([
            # gains and losses
            pl.when(pl.col("delta") > 0).then(pl.col("delta")).otherwise(0).alias("gain"),
            pl.when(pl.col("delta") < 0).then(-pl.col("delta")).otherwise(0).alias("loss"),
        ]).with_columns([
            # ewm means for gains and losses
            pl.col("gain").ewm_mean(span=self.period).alias("avg_gain"),
            pl.col("loss").ewm_mean(span=self.period).alias("avg_loss"),
        ]).with_columns([
            # relative strength (RS)
            (pl.col("avg_gain") / pl.col("avg_loss").clip(lower_bound=1e-10)).alias("rs"),
        ]).with_columns([
            # RSI
            (100 - (100 / (1 + pl.col("rs")))).alias("rsi")
        ])

        rsi = pl.col("rsi")
        rsi_prev = rsi.shift(1)

        signals = (
            ((rsi_prev >= self.oversold) & (rsi < self.oversold)).cast(pl.Int8) * 1 +  # Crossed below -> Long
            ((rsi_prev <= self.overbought) & (rsi > self.overbought)).cast(pl.Int8) * -1 # Crossed above -> Short
        ).fill_null(0)

        # Invalidate signals for initial periods using row_number
        df = df.with_columns([
            pl.col("rsi").cum_count().alias("row_idx"),  # Use cum_count to get row indices (0-based)
            signals.alias("signals")
        ]).with_columns([
            pl.when(pl.col("rsi").is_not_null() & (pl.col("row_idx") >= self.period))
            .then(pl.col("signals"))
            .otherwise(0)
            .alias("signals")
        ]).drop("row_idx")
        
        return df
    