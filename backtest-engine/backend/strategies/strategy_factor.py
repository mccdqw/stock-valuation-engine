from typing import Dict, Any
import logging
from .base import Strategy
from .moving_average import MovingAverageCrossover
from .rsi import RSI

logger = logging.getLogger(__name__)

class StrategyFactory:
    @staticmethod
    def create_strategy(config: Dict[str, Any]) -> Strategy:
        strategy_type = config.get("type")
        logger.info(f"Creating strategy: {strategy_type}")
        
        if strategy_type == "ma_crossover":
            return MovingAverageCrossover(
                short_window=config.get("short_window", 50),
                long_window=config.get("long_window", 200)
            )
        elif strategy_type == "rsi":
            return RSI(
                period=config.get("period", 14),
                overbought=config.get("overbought", 80),
                oversold=config.get("oversold", 20)
            )
        else:
            raise ValueError(f"Unknown strategy type: {strategy_type}")