from fastapi import FastAPI, HTTPException, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import uuid
import json
import numpy as np
from io import StringIO
import quantstats as qs

# Import your modular backend code
from strategies.strategy_factor import StrategyFactory
from data_sources.stock_db import load_from_stock_db
from data_sources.custom_upload import load_from_upload
from execution.engine import simple_market_fill

# Initialize FastAPI app
app = FastAPI(title="Backtesting Engine")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Pydantic models for request/response validation
class BacktestRequest(BaseModel):
    symbol: Optional[str] = None
    start_date: Optional[str] = None  # ISO format, e.g., "2023-01-01"
    end_date: Optional[str] = None    # ISO format, e.g., "2025-01-01"
    strategy: Dict[str, Any]          # e.g., {"type": "ma_crossover", "short_window": 50, "long_window": 200}
    initial_capital: float

# TODO add QuantStats library for metrics
class BacktestResponse(BaseModel):
    backtest_id: str
    metrics: Dict
    equity_curve: List[Dict]
    trades: List[Dict]

@app.get("/")
async def read_root():
    return {"message": "Hello World"}


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