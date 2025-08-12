from fastapi import FastAPI, HTTPException, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime
import uuid
import json
import numpy as np
from typing import Annotated
from io import StringIO

# Import your modular backend code
from strategies.strategy_factor import StrategyFactory
from data_sources.stock_db import load_from_stock_db
from data_sources.custom_upload import load_from_upload
from strategies.moving_average import MovingAverageCrossover
from execution.engine import simple_market_fill

# Initialize FastAPI app
app = FastAPI(title="Backtesting Engine")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Pydantic models for request/response validation
class BacktestRequest(BaseModel):
    symbol: Optional[str] = None
    start_date: Optional[str] = None  # ISO format, e.g., "2023-01-01"
    end_date: Optional[str] = None    # ISO format, e.g., "2025-01-01"
    strategy: Dict[str, Any]                 # e.g., {"type": "ma_crossover", "short_window": 50, "long_window": 200}
    initial_capital: float
    # custom_file: Annotated[UploadFile, File()] = None  # Path to custom upload file

class BacktestResponse(BaseModel):
    backtest_id: str
    metrics: Dict
    equity_curve: List[Dict]
    trades: List[Dict]

@app.get("/")
async def read_root():
    return {"message": "Hello World"}

# async def run_modular_backtest(symbol: str, start_date: str, end_date: str,
#                                initial_capital: float, strategy: str,
#                                short_window: int, long_window: int,
#                                custom_file: UploadFile = None,):
#     print(f"Symbol: {symbol}")
#     print(f"Start Date: {start_date}")
#     print(f"End Date: {end_date}")
#     print(f"Initial Capital: {initial_capital}")
#     print(f"Short Window: {short_window}")
#     print(f"Long Window: {long_window}")

#     try:
#         strategy_config = json.loads(strategy)  # Convert string → dict
#     except json.JSONDecodeError:
#         raise ValueError("Invalid JSON for strategy configuration")
    
#     print(strategy_config)
    
#     # Load data
#     if custom_file:
#         # Read the file content as bytes
#         contents = await custom_file.read()

#         # Decode bytes to string and create an in-memory text buffer
#         s_io = StringIO(contents.decode('utf-8'))
#         data = load_from_upload(s_io)
#         # print(data.head())
#     else:
#         if not symbol or not start_date or not end_date:
#             raise ValueError("Missing symbol or date range for stock DB data source.")
#         data = load_from_stock_db(symbol, start_date, end_date)

#     # Select strategy
#     strat = create_strategy(strategy, short_window, long_window)
#     print(type(strat))

#     # Generate signals and run execution engine
#     data_with_signals = strat.generate_signals(data)
#     print(data_with_signals)
#     equity, returns, trades = simple_market_fill(data_with_signals, initial_capital, return_trades=True)

#     # Build equity curve
#     equity_curve = [
#         {"timestamp": str(idx), "equity": eq}
#         for idx, eq in equity.items()
#     ]

#     # Calculate metrics
#     ret_arr = np.array(list(returns.values()))
#     sharpe_ratio = float(np.mean(ret_arr) / np.std(ret_arr) * np.sqrt(252)) if ret_arr.size > 1 and np.std(ret_arr) > 0 else 0.0
#     total_return = float(ret_arr[-1]) if ret_arr.size > 0 else 0.0
#     metrics = {"sharpe_ratio": sharpe_ratio, "total_return": total_return}

#     return metrics, equity_curve, trades


@app.post("/backtest", response_model=BacktestResponse)
async def run_backtest_endpoint(
    file: Optional[UploadFile] = File(None),
    params: str = Form(...)
):
    try:
        # Parse params JSON
        params_dict = json.loads(params)
        request = BacktestRequest(**params_dict)
        print(params_dict)
        print(request)
        
        # Load data
        if file:
            contents = await file.read()
            s_io = StringIO(contents.decode('utf-8'))
            data = load_from_upload(s_io)
        else:
            if not request.symbol or not request.start_date or not request.end_date:
                raise HTTPException(
                    status_code=400,
                    detail="Symbol and date range required when not using custom data"
                )
            data = load_from_stock_db(
                symbol=request.symbol,
                start_date=request.start_date,
                end_date=request.end_date
            )
        
        # Create and run strategy
        strategy = StrategyFactory.create_strategy(request.strategy)
        data_with_signals = strategy.generate_signals(data)
        print("signals data", data_with_signals["signals"])
        
        # Run backtest
        equity_dict, returns_dict, trades = simple_market_fill(
            data_with_signals,
            initial_capital=request.initial_capital,
            return_trades=True
        )

        print("equity dict", equity_dict)
        print("returns dict", returns_dict)
        print("trades", trades)
        
        # Calculate metrics
        ret_arr = np.array(list(returns_dict.values()))
        # print(ret_arr)
        metrics = {
            "sharpe_ratio": float(np.mean(ret_arr) / np.std(ret_arr) * np.sqrt(252)) if len(ret_arr) > 1 else 0.0,
            "total_return": float(ret_arr[-1]) if len(ret_arr) > 0 else 0.0
        }
        
        # Format equity curve
        equity_curve = [
            {"timestamp": str(ts), "equity": float(eq)} 
            for ts, eq in equity_dict.items()
        ]

        print(metrics)
        print(equity_curve)
        print(trades)
        
        return BacktestResponse(
            backtest_id=str(uuid.uuid4()),
            metrics=metrics,
            equity_curve=equity_curve,
            trades=trades
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

# You can add more endpoints for retrieving results, uploading files, etc.

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)