from abc import ABC, abstractmethod
import logging
import polars as pl

# Configure logging
logging.basicConfig(level=logging.INFO)

class Strategy(ABC):
    def __init__(self, name):
        self.name = name
        self.logger = logging.getLogger(f"Strategy.{name}")

    @abstractmethod
    def generate_signals(self, data: pl.DataFrame) -> pl.DataFrame:
        """Generate trading signals for the given data.
        
        Args:
            data: DataFrame with OHLCV data
            
        Returns:
            DataFrame with signals column added
        """
        pass